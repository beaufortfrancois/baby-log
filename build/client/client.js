class MethodNotFound {
  constructor(message) {
    //super(message);
    this.name = "MethodNotFound";
  }
}

class Controller {

  getView(url, request) {
    const { pathname } = new URL(url);
    const { method } = request;
    const route = this.constructor.route;
    const idMatch = pathname.match(`${route}/(.+)/`);

    // The instance of the controller must implement these functions;
    if (method === 'GET') {
      const idMatch = pathname.match(`${route}/(.+)/`);
      if (pathname.match(`${route}/new`)) {
        return this.create(url);
      } else if (pathname.match(`${route}/(.+)/edit$`)) {
        return this.edit(url, idMatch[1], request);
      } else if (pathname.match(`${route}/(.+)/`)) {
        return this.get(url, idMatch[1], request);
      }
      return this.getAll(url);
    }
    else if (method === 'POST') {
      if (pathname.match(`${route}/*$`)) {
        return this.post(url, request);
      } else if (pathname.match(`${route}/(.+)/edit$`)) {
        return this.put(url, idMatch[1], request);
      } else if (pathname.match(`${route}/(.+)/delete$`)) {
        const idMatch = pathname.match(`${route}/(.+)/`);
        return this.del(url, idMatch[1], request);
      }
    }
    else if (method === 'PUT') {
      return this.put(url, idMatch[1], request);
    }
    else if (method === 'DELETE') {
      const idMatch = pathname.match(`${route}/(.+)/`);
      return this.del(url, idMatch[1], request);
    }
  }

  redirect(url) {
    return Response.redirect(url, "302");
  }

  create(url) {
    throw new MethodNotFound('create');
  }

  edit(url) {
    throw new MethodNotFound('');
  }

  get(url) {
    throw new MethodNotFound('get');
  }

  getAll(url) {
    throw new MethodNotFound('getAll');
  }

  post(url) {
    throw new MethodNotFound('post');
  }

  del(url) {
    throw new MethodNotFound('delete');
  }
}

class NotFoundController extends Controller {
  render(url) {
    
  }
}

class App {
  get routes() {
    return routes;
  }

  registerRoute(route, controller) {
    routes.push({route, controller});
  }

  resolve(url) {
    const { pathname } = url;
    for(let {route, controller} of routes) {
      if (pathname.match(route)) {
        return controller;
      }
    }

    return routeNotFound;
  }
}

const routes = [];
const routeNotFound = new NotFoundController;

const pipeInto = async (from, controller) => {
  const reader = from.getReader();
  
  return reader.read().then(function process(result) {
    if (result.done) {
      return;
    }
    if (!!result.value) {
      controller.enqueue(result.value);
    }
    return reader.read().then(process);
  });
};

const enqueueItem = async (val, controller) => {
  if (val instanceof globalThis.ReadableStream) {
    await pipeInto(val, controller);
  } 
  else if (val instanceof Promise) {
    let newVal;
    newVal = await val;

    if (newVal instanceof globalThis.ReadableStream) {
      await pipeInto(newVal, controller);
    } else {
      await enqueueItem(newVal, controller);
    }
  }
  else {
    if (Array.isArray(val)) {
      for (let item of val) {
        await enqueueItem(item, controller);
      }
    }
    else if (!!val) {
      controller.enqueue(new TextEncoder().encode(val));
    }
  }
};

var template = async (strings, ...values) => {
  if ("ReadableStream" in globalThis === false) {
    // For node not supporting streams properly..... This should tree-shake away
    globalThis = {...globalThis, ...await import('./streams-abe0310a.js')};
  }
  return new globalThis.ReadableStream({
    start(controller) {
      async function push() {
        let i = 0;
        while (i < values.length) {
          let html = strings[i];
          controller.enqueue(new TextEncoder().encode(html));
          await enqueueItem(values[i], controller);

          i++;
        }
        controller.enqueue(new TextEncoder().encode(strings[i]));
        controller.close();
      }

      push();
    }
  });
};

var head = (data, body) => {
  return template`<!DOCTYPE html>
<html>
  <head>
    <title>Baby Logger</title>
    <script src="/client.js" type="module" defer></script>
    <link rel="stylesheet" href="/styles/main.css">
    <link rel="manifest" href="/manifest.json">
    <meta name="viewport" content="width=device-width">
  </head>
  ${body}
</html>`;
};

var body = (data, items) => {
  return template`
  <header>
    <h1>Baby Log</h1>
    <div><a href="/">All</a>, <a href="/feeds">Feeds</a>, <a href="/sleeps">Sleeps</a>, <a href="/poops">Poops</a>,  <a href="/wees">Wees</a></div>
    </header>
  <main>
    <header>
      <h2>${data.header}</h2>
    </header>
    <section>
    ${items}
    </section>
  </main>
  <footer>
    <span>Add</span><a href="/feeds/new">Feed</a><a href="/sleeps/new">Sleep</a><a href="/poops/new">Poop</a><a href="/wees/new">Wee</a>
  </footer>
  `;
};

if ('navigator' in globalThis === false) globalThis.navigator = {
  language: 'en-GB'
};

const calculateDuration = (ms) => {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  ms -= hours * 1000 * 60 * 60;
  const minutes =  Math.floor(ms / (1000 * 60));

  const hourStr = (hours == 1) ? 'Hour' : 'Hours';
  const minuteStr = (minutes == 1) ? 'Minute' : 'Minutes';
  return `${hours} ${hourStr} ${minutes} ${minuteStr}`;
};

var aggregate = (items) => {
  const templates = [];
  const lang = navigator.language;
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  let currentDay;

  for (let item of items) { 
    if (item.startTime.toLocaleDateString(lang, options) != currentDay) {
      currentDay = item.startTime.toLocaleDateString(lang, options);
      templates.push(template`<h3>${currentDay}</h3>`);
    }

    templates.push(template`<div class="row">
      <img src="/images/icons/${item.type}/res/mipmap-xxhdpi/${item.type}.png" alt="${item.type}"><span>
        ${item.startTime.toLocaleTimeString()} 
        ${(item.isDuration) ? 
            (`${calculateDuration(item.duration)} ${(item.hasFinished === false) ? `(Still ${item.type}ing)` : ``} `)
          : `` }
        </span>
        <a href="/${item.type}s/${item.id}/edit"><img src="/images/icons/ui/edit_18dp.png"></a><button class="delete" form="deleteForm${item.id}"><img src="/images/icons/ui/delete_18dp.png"></button>
        <form id="deleteForm${item.id}" class="deleteForm" method="POST" action="/${item.type}s/${item.id}/delete"></form>
    </div>`);
  }

  return templates;
};

class IndexView {
  async getAll(data) {

    data.type = "All";
    data.header = "All";

    return template`${head(data, 
      body(data, 
        template`${aggregate(data)}`)
    )}`;
  }
}

/**
 *
 * Copyright 2020 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const Config = {
  name: 'babylog',
  version: 1,
  stores: {
    'Log': {
      properties: {
        autoIncrement: true,
        keyPath: 'id'
      },
      indexes: {
        "type,startTime": { unique: true }
      }
    }
  }
};

/**
 *
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function ConfigManagerInstance () {

  if (typeof globalThis.ConfigManagerInstance_ !== 'undefined')
    return Promise.resolve(globalThis.ConfigManagerInstance_);

  globalThis.ConfigManagerInstance_ = new ConfigManager();

  return Promise.resolve(globalThis.ConfigManagerInstance_);
}

class ConfigManager {

  constructor () {
    this.config = Config;
  }

  set config (c) {
    this.config_ = c;
  }

  get config () {
    return this.config_;
  }

  getStore (storeName) {
    return this.config_.stores[storeName];
  }

}

/**
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

function DatabaseInstance() {

  if (typeof globalThis.DatabaseInstance_ !== 'undefined')
    return Promise.resolve(globalThis.DatabaseInstance_);

  globalThis.DatabaseInstance_ = new Database();

  return Promise.resolve(globalThis.DatabaseInstance_);
}

function hasSupport() {
  return ('indexedDB' in globalThis);
}

const parseFilter = ([operator, ...values]) => {
  // >= 10
  // BETWEEN 10,20
  const [lower, upper] = values;

  switch(operator) {
    case 'BETWEEN': return IDBKeyRange.bound(lower, upper);
    case '=':  return IDBKeyRange.only(lower);
    case '<':  return IDBKeyRange.upperBound(lower);
    case '<=': return IDBKeyRange.upperBound(lower, true);
    case '>':  return IDBKeyRange.lowerBound(lower);
    case '>=': return IDBKeyRange.lowerBound(lower, true);
    default: return; // Just return if we don't recognise the combination
  }};

class Database {

  constructor() {

    ConfigManagerInstance().then((configManager) => {

      var config = configManager.config;

      this.db_ = null;
      this.name_ = config.name;
      this.version_ = config.version;
      this.stores_ = config.stores;

    });
  }

  getStore(storeName) {

    if (!this.stores_[storeName])
      throw 'There is no store with name "' + storeName + '"';

    return this.stores_[storeName];
  }

  async open() {
    if (this.db_)
      return Promise.resolve(this.db_);

    return new Promise((resolve, reject) => {

      var dbOpen = indexedDB.open(this.name_, this.version_);

      dbOpen.onupgradeneeded = (e) => {

        this.db_ = e.target.result;

        var storeNames = Object.keys(this.stores_);
        var storeName;

        for (var s = 0; s < storeNames.length; s++) {

          storeName = storeNames[s];

          // If the store already exists
          if (this.db_.objectStoreNames.contains(storeName)) {

            // Check to see if the store should be deleted.
            // If so delete, and if not skip to the next store.
            if (this.stores_[storeName].deleteOnUpgrade)
              this.db_.deleteObjectStore(storeName);
            else
              continue;
          }

          var dbStore = this.db_.createObjectStore(
            storeName,
            this.stores_[storeName].properties
          );

          if (typeof this.stores_[storeName].indexes !== 'undefined') {
            var indexes = this.stores_[storeName].indexes;
            var indexNames = Object.keys(indexes);
            var index;

            for (var i = 0; i < indexNames.length; i++) {
              index = indexNames[i];
              dbStore.createIndex(index, index.split(','), indexes[index]);
            }
          }
        }
      };

      dbOpen.onsuccess = (e) => {
        this.db_ = e.target.result;
        resolve(this.db_);
      };

      dbOpen.onerror = (e) => {
        reject(e);
      };

    });
  }

  close() {

    return new Promise((resolve, reject) => {

      if (!this.db_)
        reject('No database connection');

      this.db_.close();
      resolve(this.db_);

    });
  }

  nuke() {
    return new Promise((resolve, reject) => {

      console.log("Nuking... " + this.name_);

      this.close();

      var dbTransaction = indexedDB.deleteDatabase(this.name_);
      dbTransaction.onsuccess = (e) => {
        console.log("Nuked...");
        resolve(e);
      };

      dbTransaction.onerror = (e) => {
        reject(e);
      };
    });
  }

  put(storeName, value, key) {

    return this.open().then((db) => {

      return new Promise((resolve, reject) => {

        var dbTransaction = db.transaction(storeName, 'readwrite');
        var dbStore = dbTransaction.objectStore(storeName);
        var dbRequest = dbStore.put(value, key);

        dbTransaction.oncomplete = (e) => {
          resolve(dbRequest.result);
        };

        dbTransaction.onabort =
          dbTransaction.onerror = (e) => {
            reject(e);
          };

      });

    });

  }

  get(storeName, value) {

    return this.open().then((db) => {

      return new Promise((resolve, reject) => {

        var dbTransaction = db.transaction(storeName, 'readonly');
        var dbStore = dbTransaction.objectStore(storeName);
        var dbStoreRequest;

        dbTransaction.oncomplete = (e) => {
          resolve(dbStoreRequest.result);
        };

        dbTransaction.onabort =
          dbTransaction.onerror = (e) => {
            reject(e);
          };

        dbStoreRequest = dbStore.get(value);

      });

    });
  }

  getAll(storeName, index, { filter, order }) {

    return this.open().then((db) => {

      return new Promise((resolve, reject) => {

        var dbTransaction = db.transaction(storeName, 'readonly');
        var dbStore = dbTransaction.objectStore(storeName);
        var dbCursor;
        var dbFilter = parseFilter(filter);

        if (typeof order !== 'string')
          order = 'next';

        if (typeof index === 'string')
          dbCursor = dbStore.index(index).openCursor(dbFilter, order);
        else
          dbCursor = dbStore.openCursor();

        var dbResults = [];

        dbCursor.onsuccess = (e) => {
          var cursor = e.target.result;

          if (cursor) {
            dbResults.push({
              key: cursor.key,
              value: cursor.value
            });
            cursor.continue();
          } else {
            resolve(dbResults);
          }
        };

        dbCursor.onerror = (e) => {
          reject(e);
        };

      });

    });
  }

  delete(storeName, key) {
    return this.open().then((db) => {

      return new Promise((resolve, reject) => {

        var dbTransaction = db.transaction(storeName, 'readwrite');
        var dbStore = dbTransaction.objectStore(storeName);

        dbTransaction.oncomplete = (e) => {
          resolve(e);
        };

        dbTransaction.onabort =
          dbTransaction.onerror = (e) => {
            reject(e);
          };

        dbStore.delete(key);

      });
    });
  }

  deleteAll(storeName) {

    return this.open().then((db) => {

      return new Promise((resolve, reject) => {

        var dbTransaction = db.transaction(storeName, 'readwrite');
        var dbStore = dbTransaction.objectStore(storeName);
        var dbRequest = dbStore.clear();

        dbRequest.onsuccess = (e) => {
          resolve(e);
        };

        dbRequest.onerror = (e) => {
          reject(e);
        };

      });

    });
  }

}

/**
 *
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

class Model {

  constructor(key) {
    this.key = key;
  }

  static get ASCENDING() {
    return 'next';
  }

  static get DESCENDING() {
    return 'prev';
  }

  static get UPDATED() {
    return 'Model-updated';
  }

  static get storeName() {
    return 'Model';
  }

  static nuke() {
    return DatabaseInstance()
      .then(db => db.close())
      .then(db => db.nuke());
  }

  static get(key) {

    if (hasSupport() === false) {
      return Promise.resolve();
    }

    if (this instanceof Model)
      Promise.reject("Can't call get on Model directly. Inherit first.");

    return DatabaseInstance()

      // Do the query.
      .then(db => db.get(this.storeName, key))

      // Wrap the result in the correct class.
      .then(result => {

        return ConfigManagerInstance().then(configManager => {

          var store = configManager.getStore(this.storeName);

          if (!result)
            return;

          var resultKey = key;

          // If the store uses a keypath then reset
          // the key back to undefined.
          if (store.properties.keyPath)
            resultKey = undefined;

          return new this(result, resultKey);

        });

      });

  }

  /**
   * Gets all the objects from the database.
   */
  static getAll(index, { filter, order }) {

    if (hasSupport() === false) {
      return Promise.resolve();
    }

    if (this instanceof Model)
      Promise.reject("Can't call getAll on Model directly. Inherit first.");

    return DatabaseInstance()

      // Do the query.
      .then(db => db.getAll(this.storeName, index, {filter, order}))

      // Wrap all the results in the correct class.
      .then(results => {

        return ConfigManagerInstance().then(configManager => {

          var store = configManager.getStore(this.storeName);
          var results_ = [];

          for (let result of results) {

            var key = result.key;

            // If the store uses a keypath then reset
            // the key back to undefined.
            if (store.properties.keyPath)
              key = undefined;

            results_.push(new this(result.value, key));
          }

          return results_;

        });

      });

  }

  put() {
    return this.constructor.put(this);
  }

  /**
   * Either inserts or update depending on whether the key / keyPath is set.
   * If the keyPath is set, and a property of the value matches (in-line key)
   * then the object is updated. If the keyPath is not set and the value's key
   * is null, then the object is inserted. If the keypath is not set and the
   * value's key is set then the object is updated.
   */
  static put(value) {

    if (this instanceof Model)
      Promise.reject("Can't call put on Model directly. Inherit first.");

    return DatabaseInstance()

      // Do the query.
      .then(db => db.put(this.storeName, value, value.key))

      .then(key => {

        return ConfigManagerInstance().then(configManager => {

          // Inserting may provide a key. If there is no keyPath set
          // the object needs to be updated with a key value so it can
          // be altered and saved again without creating a new record.
          var store = configManager.getStore(this.storeName);

          var keyPath =
            store.properties.keyPath;

          if (!keyPath)
            value.key = key;

          return value;

        })

      });

  }

  static deleteAll() {

    if (this instanceof Model)
      Promise.reject("Can't call deleteAll on Model directly. Inherit first.");

    return DatabaseInstance()

      .then(db => db.deleteAll(this.storeName))

      .catch(e => {
        // It may be that the store doesn't exist yet, so relax for that one.
        if (e.name !== 'NotFoundError')
          throw e;
      });

  }

  delete() {
    return this.constructor.delete(this);
  }

  static delete(value) {

    if (this instanceof Model)
      Promise.reject("Can't call delete on Model directly. Inherit first.");

    return ConfigManagerInstance().then(configManager => {

      // If passed the full object to delete then
      // grab its key for the delete
      if (value instanceof this) {

        var store = configManager.getStore(this.storeName);
        var keyPath = store.properties.keyPath;

        if (keyPath)
          value = value[keyPath];
        else
          value = value.key;
      }

      return DatabaseInstance()

        .then(db => db.delete(this.storeName, value));

    });
  }
}

class Log extends Model {

  get hasFinished() {
    return !!this.endTime;
  }
  
  get duration() {
    let end = this.endTime;
    if (!!end === false) {
      end = new Date;
    }
    return end - this.startTime;
  }

  constructor({id, endTime, startTime, type, isDuration = false}, key) {
    super(key);

    if(!!id) { 
      this.id = id;
    }

    if (endTime) {
      this.endTime = new Date(endTime);
    }
    
    this.startTime = new Date(startTime);
    this.isDuration = isDuration;
    this.type = type;
  }

  static get storeName() {
    return 'Log';
  }
}

class IndexController extends Controller {
  static get route() {
    return '^/$'
  }

  async getAll(url) {
    const view = new IndexView();
    const logs = await Log.getAll('type,startTime', {filter: ['BETWEEN', ['a', new Date(0)], ['z', new Date(9999999999999)]], order:Log.DESCENDING}) || [];
  
    return view.getAll(logs);
  }

  get(url) {
    const view = new IndexView();
    const output = view.render({title: "Ay....", newTitle: "Testing"});
    return output;
  }
}

class Feed extends Log {
  constructor(data = {}, key) {
    super({...data, ...{isDuration: true}}, key);
    this.type = 'feed';
  }
}

function correctISOTime(date) {
  const tzoffset = (new Date()).getTimezoneOffset() * 60000;
  return (new Date(date - tzoffset)).toISOString().slice(0, -1).replace(/Z$/, '');
}

if ('navigator' in globalThis === false) globalThis.navigator = {
  language: 'en-GB'
};
class FeedView {
  async getAll(data) {

    data.type = "Feed";
    data.header = "Feeds";

    return template`${head(data,
      body(data,
        template`${aggregate(data)}`
    ))}`;
  }

  async get(data) {

    data.header = "Feed";

    const lang = navigator.language;
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  
    return template`${head(data,
      body(data,
        template`<div>Start time: ${data.startTime.toLocaleString(lang, options)}</div>
        <div>End time: ${(!!data.endTime) ? data.endTime.toLocaleString(lang, options) : ''}</div>`)
    )}`;
  }

  async create(data) {

    data.header = "Add a Feed";

    return template`${head(data,
      body(data, `<div>
    <form method="POST" action="/feeds">
      <div><label for=startTime>Start time: <input type="datetime-local" name="startTime" value="${correctISOTime(new Date())}"></label></div>
      <div><label for=endTime>End time:<input type="datetime-local" name="endTime"></label></div>
      <input type="submit">
    </form></div>
    `))}`;
  }

  async post(data) {
    return this.get(data);
  }

  async edit(data) {
    data.header = "Update a Feed";

    return template`${head(data,
      body(data, `<div class="form">
    <form method="POST" id="deleteForm" action="/${data.type}s/${data.id}/delete"></form>
    <form method="POST" id="editForm" action="/${data.type}s/${data.id}/edit"></form>
    <div>
      <div><label for=startTime>Start time: <input type="datetime-local" name="startTime" form="editForm" value="${correctISOTime(data.startTime)}"></label></div>
      <div><label for=endTime>End time:<input type="datetime-local" name="endTime" form="editForm" value="${data.hasFinished ? correctISOTime(new Date()) : ''}"></label></div>
      <div class="controls">
        <button form="deleteForm"><img src="/images/icons/ui/delete_18dp.png"></button>
        <input type="submit" form="editForm" value="Save">
      </div>
    </div>
    </div>
    `))}`;
  }

  async put(data) {
    return this.get(data);
  }
}

class NotFoundException extends Error {
  constructor(message) {
    super(message);
  }
}

class FeedController extends Controller {
  static get route() {
    return '/feeds';
  }

  async create(url, request) {
    // Show the create an entry UI.
    const feedView = new FeedView();
    return feedView.create(new Feed);
  } 

  async post(url, request) {

    const formData = await request.formData();
    const startTime = formData.get('startTime');
    const endTime = formData.get('endTime');
    const feed = new Feed({ startTime, endTime });

    feed.put();

    // Get the View.
    const feedView = new FeedView(feed);

    return feedView.post(feed);
  }

  async edit(url, id) {
    // Get the Data.
    const feed = await Feed.get(parseInt(id, 10));

    if (!!feed == false) throw new NotFoundException(`Feed ${id} not found`);    // Get the View.
    const feedView = new FeedView();

    return feedView.edit(feed);
  }

  async put(url, id, request) {
    // Get the Data.
    const feed = await Feed.get(parseInt(id, 10));

    if (!!feed == false) throw new NotFoundException(`Feed ${id} not found`);
    
    const formData = await request.formData();
    const startTime = formData.get('startTime');
    const endTime = formData.get('endTime');
    
    feed.startTime = new Date(startTime);
    feed.endTime = new Date(endTime);

    feed.put();

    // Get the View.
    const feedView = new FeedView(feed);

    return feedView.put(feed);
  }

  async get(url, id) {
    // Get the Data.
    const feed = await Feed.get(parseInt(id, 10));

    if (!!feed == false) throw new NotFoundException(`Feed ${id} not found`);

    // Get the View.
    const feedView = new FeedView();

    return feedView.get(feed);
  }

  async getAll(url) {
    // Get the Data.....
    const feeds = await Feed.getAll('type,startTime', { filter: ['BETWEEN', ['feed', new Date(0)], ['feed', new Date(9999999999999)]], order: Feed.DESCENDING }) || [];

    // Get the View.
    const feedView = new FeedView();

    return feedView.getAll(feeds);
  }

  async del(url, id) {
    // Get the Data.
    const model = await Feed.get(parseInt(id, 10));

    if (!!model == false) throw new NotFoundException(`Feed ${id} not found`);

    await model.delete();
    return this.redirect(FeedController.route);
  }
}

const app = new App();

app.registerRoute(IndexController.route, new IndexController);
app.registerRoute(FeedController.route, new FeedController);

navigator.serviceWorker.register('/sw.js');
