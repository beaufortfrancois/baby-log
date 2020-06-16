"use strict";class e{constructor(e){this.name="MethodNotFound"}}class t{constructor(e,t){this.view=e,this.Model=t}getView(e,t){const{pathname:n}=new URL(e),{method:r}=t,a=this.constructor.route,i=n.match(a+"/(.+)/");if("GET"===r){const r=n.match(a+"/(.+)/");return n.match(a+"/new")?this.create(e):n.match(a+"/(.+)/edit$")?this.edit(e,r[1],t):n.match(a+"/(.+)/")?this.get(e,r[1],t):this.getAll(e,t)}if("POST"===r){if(n.match(a+"/(.+)/edit$"))return this.put(e,i[1],t);if(n.match(a+"/(.+)/delete$")){const r=n.match(a+"/(.+)/");return this.del(e,r[1],t)}if(n.match(a+"/*$"))return this.post(e,t)}else{if("PUT"===r)return this.put(e,i[1],t);if("DELETE"===r){const r=n.match(a+"/(.+)/");return this.del(e,r[1],t)}}}redirect(e){return Response.redirect(e,"302")}create(t){throw new e("create")}edit(t){throw new e("")}get(t){throw new e("get")}getAll(t){throw new e("getAll")}post(t){throw new e("post")}del(t){throw new e("delete")}}class n extends t{render(e){}}const r=[],a=new n;class i extends Error{constructor(e){super(e)}}const o=async e=>{const t=await e.arrayBuffer(),n=new TextDecoder("utf-8");return new URLSearchParams("?"+n.decode(t))};class s extends t{static get route(){return"/feeds"}async create(e,t){return this.view.create(new this.Model)}async post(e,t){const n=await o(t),r=n.get("startDate"),a=n.get("startTime"),i=n.get("endDate"),d=n.get("endTime"),l=new Date(`${r}T${a}`),c=i&&d?new Date(`${i}T${d}`):void 0;return new this.Model({startTime:l,endTime:c}).put(),this.redirect(s.route)}async edit(e,t){let n=await this.Model.get(parseInt(t,10));const r={notFound:!1};return 0==!!n&&(n=new this.Model,r.notFound=!0),this.view.edit(n,r)}async put(e,t,n){const r=await this.Model.get(parseInt(t,10));if(0==!!r)return this.redirect(s.route);const a=await o(n),i=a.get("startDate"),d=a.get("startTime"),l=a.get("endDate"),c=a.get("endTime");return r.startTime=new Date(`${i}T${d}`),r.endTime=l&&c?new Date(`${l}T${c}`):void 0,r.put(),this.redirect(s.route)}async get(e,t){const n=await this.Model.get(parseInt(t,10)),r={notFound:!1};return 0==!!n&&(n=new this.Model,r.notFound=!0),this.view.get(n,r)}async getAll(e){const t=await this.Model.getAll("type,startTime",{filter:["BETWEEN",["feed",new Date(0)],["feed",new Date(99999999999999)]],order:this.Model.DESCENDING})||[];return this.view.getAll(t)}async del(e,t,n){const r=await this.Model.get(parseInt(t,10)),{referrer:a}=n;if(0==!!r)throw new i(`Feed ${t} not found`);return await r.delete(),this.redirect(a||this.constructor.route)}}class d extends t{static get route(){return"^/$"}async getAll(e){const t=await this.Model.getAll("startTime,type",{filter:["BETWEEN",[new Date(0),"a"],[new Date(9999999999999),"z"]],order:this.Model.DESCENDING})||[];return this.view.getAll(t)}}class l extends t{static get route(){return"/sleeps"}async create(e,t){return this.view.create(new this.Model)}async post(e,t){const n=await o(t),r=n.get("startDate"),a=n.get("startTime"),i=n.get("endDate"),s=n.get("endTime"),d=new Date(`${r}T${a}`),c=i&&s?new Date(`${i}T${s}`):void 0;return new this.Model({startTime:d,endTime:c}).put(),this.redirect(l.route)}async edit(e,t){let n=await this.Model.get(parseInt(t,10));const r={notFound:!1};return 0==!!n&&(n=new this.Model,r.notFound=!0),this.view.edit(n,r)}async put(e,t,n){const r=await this.Model.get(parseInt(t,10));if(0==!!r)throw new i(`Sleep ${t} not found`);const a=await o(n),s=a.get("startDate"),d=a.get("startTime"),c=a.get("endDate"),u=a.get("endTime");return r.startTime=new Date(`${s}T${d}`),r.endTime=c&&u?new Date(`${c}T${u}`):void 0,r.put(),this.redirect(l.route)}async get(e,t){const n=await this.Model.get(parseInt(t,10)),r={notFound:!1};return 0==!!n&&(n=new this.Model,r.notFound=!0),this.view.get(n,r)}async getAll(e){const t=await this.Model.getAll("type,startTime",{filter:["BETWEEN",["sleep",new Date(0)],["sleep",new Date(99999999999999)]],order:this.Model.DESCENDING})||[];return this.view.getAll(t)}async del(e,t,n){const r=await this.Model.get(parseInt(t,10)),{referrer:a}=n;if(0==!!r)throw new i(`Sleep ${t} not found`);return await r.delete(),this.redirect(a||this.constructor.route)}}class c extends t{static get route(){return"/wees"}async create(e,t){return this.view.create(new this.Model)}async post(e,t){const n=await o(t),r=`${n.get("startDate")}T${n.get("startTime")}`;return new this.Model({startTime:r}).put(),this.redirect(c.route)}async edit(e,t){let n=await this.Model.get(parseInt(t,10));const r={notFound:!1};return 0==!!n&&(n=new this.Model,r.notFound=!0),this.view.edit(n,r)}async put(e,t,n){const r=await this.Model.get(parseInt(t,10));if(0==!!r)throw new i(`Wee ${t} not found`);const a=await o(n),s=a.get("startDate"),d=a.get("startTime");return r.startTime=new Date(`${s}T${d}`),r.put(),this.redirect(c.route)}async get(e,t){const n=await this.Model.get(parseInt(t,10)),r={notFound:!1};return 0==!!n&&(n=new this.Model,r.notFound=!0),this.view.get(n,r)}async getAll(e){const t=await this.Model.getAll("type,startTime",{filter:["BETWEEN",["wee",new Date(0)],["wee",new Date(99999999999999)]],order:this.Model.DESCENDING})||[];return this.view.getAll(t)}async del(e,t,n){const r=await this.Model.get(parseInt(t,10)),{referrer:a}=n;if(0==!!r)throw new i(`Wee ${t} not found`);return await r.delete(),this.redirect(a||this.constructor.route)}}class u extends t{static get route(){return"/poops"}async create(e,t){return this.view.create(new this.Model)}async post(e,t){const n=await o(t),r=`${n.get("startDate")}T${n.get("startTime")}`;return new this.Model({startTime:r}).put(),this.redirect(u.route)}async edit(e,t){let n=await this.Model.get(parseInt(t,10));const r={notFound:!1};return 0==!!n&&(n=new this.Model,r.notFound=!0),this.view.edit(n,r)}async put(e,t,n){const r=await this.Model.get(parseInt(t,10));if(0==!!r)throw new i(`Poop ${t} not found`);const a=await o(n),s=a.get("startDate"),d=a.get("startTime");return r.startTime=new Date(`${s}T${d}`),r.put(),this.redirect(u.route)}async get(e,t){const n=await this.Model.get(parseInt(t,10)),r={notFound:!1};return 0==!!n&&(n=new this.Model,r.notFound=!0),this.view.get(n,r)}async getAll(e){const t=await this.Model.getAll("type,startTime",{filter:["BETWEEN",["poop",new Date(0)],["poop",new Date(99999999999999)]],order:this.Model.DESCENDING})||[];return this.view.getAll(t)}async del(e,t,n){const r=await this.Model.get(parseInt(t,10)),{referrer:a}=n;if(0==!!r)throw new i(`Poop ${t} not found`);return await r.delete(),this.redirect(a||this.constructor.route)}}const m=new TextEncoder,h=async(e,t)=>{const n=e.getReader();return n.read().then((function e(r){if(!r.done)return r.value&&t.enqueue(r.value),n.read().then(e)}))},p=async(e,t)=>{if(e instanceof globalThis.ReadableStream)await h(e,t);else if(e instanceof Promise){let n;n=await e,n instanceof globalThis.ReadableStream?await h(n,t):await p(n,t)}else if(Array.isArray(e))for(let n of e)await p(n,t);else e&&t.enqueue(m.encode(e))};var g=async(e,...t)=>("ReadableStream"in globalThis==!1&&(globalThis={...globalThis,...await Promise.resolve().then((function(){return require("./streams-caa41609.js")}))}),new globalThis.ReadableStream({start(n){!async function(){let r=0;for(;r<t.length;){let a=e[r];n.enqueue(m.encode(a)),await p(t[r],n),r++}n.enqueue(m.encode(e[r])),n.close()}()}}));const v=(e,t)=>g`<!doctype html><html><head><title>Baby Logger</title><script src="/client.js" type="module" defer="defer"></script><link rel="stylesheet" href="/styles/main.css"><link rel="manifest" href="/manifest.json"><link rel="shortcut icon" href="/images/icons/log/res/mipmap-hdpi/log.png"><meta name="viewport" content="width=device-width"></head>${t}</html>`,f=(e,t)=>g`<header><img src="/images/icons/log/res/mipmap-xhdpi/log.png"><nav><a href="/">All</a> <a href="/feeds">Feeds</a> <a href="/sleeps">Sleeps</a> <a href="/poops">Poops</a> <a href="/wees">Wees</a></nav></header><main><header><h2>${e.header}</h2></header><section>${t}</section></main><footer><span>Add</span><a href="/feeds/new" title="Add a feed">🍼</a><a href="/sleeps/new" title="Add a Sleep">💤</a><a href="/poops/new" title="Add a Poop">💩</a><a href="/wees/new" title="Add a Wee">⛲️</a></footer>`;"navigator"in globalThis==!1&&(globalThis.navigator={language:"en-GB"});const w=e=>{const t=Math.floor(e/36e5);e-=1e3*t*60*60;const n=Math.floor(e/6e4);return`${t} ${1==t?"Hour":"Hours"} ${n} ${1==n?"Minute":"Minutes"}`},y=e=>{const t=[],n=navigator.language,r={weekday:"long",year:"numeric",month:"long",day:"numeric"};let a,i={},o={},s=!0;for(let d of e)d.startTime.toLocaleDateString(n,r)!=a&&(0==s&&(t.push(g`<div>${Object.entries(i).map(([e,t])=>`${t} ${e}${t>1?"s":""}`).join(", ")}</div>`),t.push(g`<div>${Object.entries(o).map(([e,t])=>`${w(t)} ${e}ing`).join(", ")}</div>`),i={}),s=!1,a=d.startTime.toLocaleDateString(n,r),t.push(g`<h3>${a}</h3>`)),d.type in i==0&&(i[d.type]=0),i[d.type]++,d.isDuration&&d.hasFinished&&(d.type in o==0&&(o[d.type]=0),o[d.type]+=d.duration),t.push(g`<div class="row">
      <img src="/images/icons/${d.type}/res/mipmap-xxhdpi/${d.type}.png" alt="${d.type}"><span>
        ${d.startTime.toLocaleTimeString(navigator.language,{hour:"numeric",minute:"numeric"})} 
        ${d.isDuration?`- ${w(d.duration)} ${!1===d.hasFinished?`(Still ${d.type}ing)`:""} `:""}
        </span>
        <a href="/${d.type}s/${d.id}/edit"><img src="/images/icons/ui/edit_18dp.png"></a><button class="delete row" form="deleteForm${d.id}"><img src="/images/icons/ui/delete_18dp.png"></button>
        <form id="deleteForm${d.id}" class="deleteForm" method="POST" action="/${d.type}s/${d.id}/delete"></form>
    </div>`);return t.push(g`<div>${Object.entries(i).map(([e,t])=>`${t} ${e}${t>1?"s":""}`).join(", ")}</div>`),t.push(g`<div>${Object.entries(o).map(([e,t])=>`${w(t)} ${e}ing`).join(", ")}</div>`),t},$=e=>{if(0==!!e)return;const t=6e4*(new Date).getTimezoneOffset();return new Date(e-t).toISOString().replace(/:(\d+).(\d+)Z$/,"")},T=e=>{if(0!=!!e)return e instanceof Date==!1&&(e=new Date(e)),`${e.getFullYear()}-${(e.getMonth()+1).toString().padStart(2,0)}-${e.getDate().toString().padStart(2,0)}`},D=e=>{if(0!=!!e)return e instanceof Date==!1&&(e=new Date(e)),`${e.getHours().toString().padStart(2,0)}:${e.getMinutes().toString().padStart(2,0)}`};"navigator"in globalThis==!1&&(globalThis.navigator={language:"en-GB"});const b={name:"babylog",version:6,stores:{Log:{properties:{autoIncrement:!0,keyPath:"id"},indexes:{"type,startTime":{unique:!0},"startTime,type":{unique:!0}}}}};function F(){return void 0!==globalThis.ConfigManagerInstance_||(globalThis.ConfigManagerInstance_=new S),Promise.resolve(globalThis.ConfigManagerInstance_)}class S{constructor(){this.config=b}set config(e){this.config_=e}get config(){return this.config_}getStore(e){return this.config_.stores[e]}}function M(){return void 0!==globalThis.DatabaseInstance_||(globalThis.DatabaseInstance_=new A),Promise.resolve(globalThis.DatabaseInstance_)}function P(){return"indexedDB"in globalThis}class A{constructor(){F().then(e=>{var t=e.config;this.db_=null,this.name_=t.name,this.version_=t.version,this.stores_=t.stores})}getStore(e){if(!this.stores_[e])throw'There is no store with name "'+e+'"';return this.stores_[e]}async open(){return this.db_?Promise.resolve(this.db_):new Promise((e,t)=>{var n=indexedDB.open(this.name_,this.version_);n.onupgradeneeded=e=>{this.db_=e.target.result;for(var t,n=e.target.transaction,r=Object.keys(this.stores_),a=0;a<r.length;a++){var i;if(t=r[a],this.db_.objectStoreNames.contains(t)){if(this.stores_[t].deleteOnUpgrade){this.db_.deleteObjectStore(t);continue}i=n.objectStore(t)}else i=this.db_.createObjectStore(t,this.stores_[t].properties);if(void 0!==this.stores_[t].indexes){for(var o,s=this.stores_[t].indexes,d=Object.keys(s),l=i.indexNames,c=0;c<d.length;c++)o=d[c],!1===l.contains(o)&&i.createIndex(o,o.split(","),s[o]);for(c=0;c<i.indexNames.length;c++)o=i.indexNames[c],d.indexOf(o)<0&&i.deleteIndex(o)}}},n.onsuccess=t=>{this.db_=t.target.result,e(this.db_)},n.onerror=e=>{t(e)}})}close(){return new Promise((e,t)=>{this.db_||t("No database connection"),this.db_.close(),e(this.db_)})}nuke(){return new Promise((e,t)=>{console.log("Nuking... "+this.name_),this.close();var n=indexedDB.deleteDatabase(this.name_);n.onsuccess=t=>{console.log("Nuked..."),e(t)},n.onerror=e=>{t(e)}})}put(e,t,n){return this.open().then(r=>new Promise((a,i)=>{var o=r.transaction(e,"readwrite"),s=o.objectStore(e).put(t,n);o.oncomplete=e=>{a(s.result)},o.onabort=o.onerror=e=>{i(e)}}))}get(e,t){return this.open().then(n=>new Promise((r,a)=>{var i,o=n.transaction(e,"readonly"),s=o.objectStore(e);o.oncomplete=e=>{r(i.result)},o.onabort=o.onerror=e=>{a(e)},i=s.get(t)}))}getAll(e,t,{filter:n,order:r,cmpFunc:a}){return this.open().then(i=>new Promise((o,s)=>{var d,l=i.transaction(e,"readonly").objectStore(e),c=(([e,...t])=>{const[n,r]=t;switch(e){case"BETWEEN":return IDBKeyRange.bound(n,r,!1,!1);case"=":return IDBKeyRange.only(n);case"<":return IDBKeyRange.upperBound(n);case"<=":return IDBKeyRange.upperBound(n,!0);case">":return IDBKeyRange.lowerBound(n);case">=":return IDBKeyRange.lowerBound(n,!0);default:return}})(n);"string"!=typeof r&&(r="next"),d="string"==typeof t?l.index(t).openCursor(c,r):l.openCursor();var u=[];d.onsuccess=e=>{var t=e.target.result;t?((void 0===a||a(t.value))&&u.push({key:t.key,value:t.value}),t.continue()):o(u)},d.onerror=e=>{s(e)}}))}delete(e,t){return this.open().then(n=>new Promise((r,a)=>{var i=n.transaction(e,"readwrite"),o=i.objectStore(e);i.oncomplete=e=>{r(e)},i.onabort=i.onerror=e=>{a(e)},o.delete(t)}))}deleteAll(e){return this.open().then(t=>new Promise((n,r)=>{var a=t.transaction(e,"readwrite").objectStore(e).clear();a.onsuccess=e=>{n(e)},a.onerror=e=>{r(e)}}))}}class E{constructor(e){this.key=e}static get ASCENDING(){return"next"}static get DESCENDING(){return"prev"}static get UPDATED(){return"Model-updated"}static get storeName(){return"Model"}static nuke(){return M().then(e=>e.close()).then(e=>e.nuke())}static get(e){return!1===P()?Promise.resolve():(this instanceof E&&Promise.reject("Can't call get on Model directly. Inherit first."),M().then(t=>t.get(this.storeName,e)).then(t=>F().then(n=>{var r=n.getStore(this.storeName);if(t){var a=e;return r.properties.keyPath&&(a=void 0),new this(t,a)}})))}static getAll(e,{filter:t,order:n,cmpFunc:r}){return!1===P()?Promise.resolve():(this instanceof E&&Promise.reject("Can't call getAll on Model directly. Inherit first."),M().then(a=>a.getAll(this.storeName,e,{filter:t,order:n,cmpFunc:r})).then(e=>F().then(t=>{var n=t.getStore(this.storeName),r=[];for(let t of e){var a=t.key;n.properties.keyPath&&(a=void 0),r.push(new this(t.value,a))}return r})))}put(){return this.constructor.put(this)}static put(e){return this instanceof E&&Promise.reject("Can't call put on Model directly. Inherit first."),M().then(t=>t.put(this.storeName,e,e.key)).then(t=>F().then(n=>(n.getStore(this.storeName).properties.keyPath||(e.key=t),e)))}static deleteAll(){return this instanceof E&&Promise.reject("Can't call deleteAll on Model directly. Inherit first."),M().then(e=>e.deleteAll(this.storeName)).catch(e=>{if("NotFoundError"!==e.name)throw e})}delete(){return this.constructor.delete(this)}static delete(e){return this instanceof E&&Promise.reject("Can't call delete on Model directly. Inherit first."),F().then(t=>{if(e instanceof this){var n=t.getStore(this.storeName).properties.keyPath;e=n?e[n]:e.key}return M().then(t=>t.delete(this.storeName,e))})}}class _ extends E{get hasFinished(){return!!this.endTime}get duration(){let e=this.endTime;return!1==!!e&&(e=new Date),e-this.startTime}constructor({id:e,endTime:t,startTime:n,type:r,isDuration:a=!1},i){super(i),e&&(this.id=e),t&&(this.endTime=new Date(t)),n&&(this.startTime=new Date(n)),this.isDuration=a,this.type=r}static get storeName(){return"Log"}}class I extends t{static get route(){return""}constructor(e){super()}async get(e,t,n){return caches.match(n).then(t=>t||fetch(e))}async getAll(e,t){return this.get(e,void 0,t)}}var N=["/client.js","/manifest.json","/sw-manifest.json","/images/icons/ui/add_18dp.png","/images/icons/ui/delete_18dp.png","/images/icons/ui/edit_18dp.png","/styles/main.css","/streams-6a7ac95a.js","/streams-abe0310a.js","/streams-caa41609.js"];const x=new class{get routes(){return r}registerRoute(e,t){r.push({route:e,controller:t})}resolve(e){const{pathname:t}=e;for(let{route:e,controller:n}of r)if(t.match(e))return n;return a}};x.registerRoute(d.route,new d(new class{async getAll(e){return e.type="All",e.header="All",g`${v(0,f(e,g`${y(e)}`))}`}},_)),x.registerRoute(s.route,new s(new class{async getAll(e){return e.type="Feed",e.header="Feeds",g`${v(0,f(e,g`${y(e)}`))}`}async get(e,t){e.header="Feed";const n=navigator.language,r={weekday:"long",year:"numeric",month:"long",day:"numeric",hour:"numeric",minute:"numeric"};return g`${v(0,f(e,g`${t.notFound?`<input type="hidden" name="data-loaded" value="${!1==!!t.notFound}">`:""}<div>Start time: ${0==t.notFound?e.startTime.toLocaleString(n,r):""}</div><div>End time: ${e.endTime?e.endTime.toLocaleString(n,r):""}</div><a href="/${e.type}s/${e.id}/edit"><img src="/images/icons/ui/edit_18dp.png"></a><div class="row"><form method="POST" id="deleteForm" action="/${e.type}s/${e.id}/delete"></form><button form="deleteForm" class="delete"><img src="/images/icons/ui/delete_18dp.png"></button></div>`))}`}async create(e){return e.header="Add a Feed",g`${v(0,f(e,g`<div class="form"><form method="POST" action="/${e.type}s"><div><label for="startDate">Start time: <input type="date" name="startDate" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" placeholder="YYYY-MM-DD" value="${T($(new Date))}"> <input type="time" name="startTime" pattern="[0-9]{2}:[0-9]{2}" placeholder="HH:MM" value="${D($(new Date))}"></label></div><div><label for="endDate">End time: <input type="date" name="endDate" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" placeholder="YYYY-MM-DD"> <input type="time" name="endTime" pattern="[0-9]{2}:[0-9]{2}" placeholder="HH:MM"></label></div><div class="controls"><input type="submit" value="Save"></div></form></div>`))}`}async edit(e,t){return e.header="Update a Feed",g`${v(0,f(e,g`<div class="form">${t.notFound?`<input type="hidden" name="data-loaded" value="${!1==!!t.notFound}">`:""}<form method="POST" id="deleteForm" action="/${e.type}s/${e.id}/delete"></form><form method="POST" id="editForm" action="/${e.type}s/${e.id}/edit"></form><div><div><label for="startDate">Start time: <input type="date" name="startDate" form="editForm" value="${T($(0==t.notFound?e.startTime:void 0))}"> <input type="time" name="startTime" form="editForm" value="${D($(0==t.notFound?e.startTime:void 0))}"></label></div><div><label for="endDate">End time: <input type="date" name="endDate" form="editForm" value="${T($(0==t.notFound?e.endTime||new Date:void 0))}"> <input type="time" name="endTime" form="editForm" value="${D($(0==t.notFound?e.endTime||new Date:void 0))}"></label><div><div class="controls"><button form="deleteForm" class="delete"><img src="/images/icons/ui/delete_18dp.png"></button> <input type="submit" form="editForm" value="Save"></div></div></div></div></div>`))}`}},class extends _{constructor(e={},t){super({...e,isDuration:!0},t),this.type="feed"}})),x.registerRoute(l.route,new l(new class{async getAll(e,t){return e.type="Sleeps",e.header="Sleeps",g`${v(0,f(e,g`${y(e)}`))}`}async get(e,t){e.header="Sleep";const n=navigator.language,r={weekday:"long",year:"numeric",month:"long",day:"numeric",hour:"numeric",minute:"numeric"};return g`${v(0,f(e,g`${t.notFound?`<input type="hidden" name="data-loaded" value="${!1==!!t.notFound}">`:""}<div>Start time: ${e.startTime.toLocaleString(n,r)}</div><div>End time: ${e.endTime?e.endTime.toLocaleString(n,r):""}</div>`))}`}async create(e){return e.header="Add a Sleep",g`${v(0,f(e,g`<div class="form"><form method="POST" action="/${e.type}s"><div><label for="startDate">Start time: <input type="date" name="startDate" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" placeholder="YYYY-MM-DD" value="${T($(new Date))}"> <input type="time" name="startTime" pattern="[0-9]{2}:[0-9]{2}" placeholder="HH:MM" value="${D($(new Date))}"></label></div><div><label for="endDate">End time: <input type="date" name="endDate" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" placeholder="YYYY-MM-DD"> <input type="time" name="endTime" pattern="[0-9]{2}:[0-9]{2}" placeholder="HH:MM"></label></div><div class="controls"><input type="submit" value="Save"></div></form></div>`))}`}async edit(e,t){return e.header="Update a Sleep",g`${v(0,f(e,g`${t.notFound?`<input type="hidden" name="data-loaded" value="${!1==!!t.notFound}">`:""}<div class="form"><form method="POST" id="deleteForm" action="/${e.type}s/${e.id}/delete"></form><form method="POST" id="editForm" action="/${e.type}s/${e.id}/edit"></form><div><div><label for="startDate">Start time: <input type="date" name="startDate" form="editForm" value="${T($(0==t.notFound?e.startTime:void 0))}"> <input type="time" name="startTime" form="editForm" value="${D($(0==t.notFound?e.startTime:void 0))}"></label></div><div><label for="endDate">End time: <input type="date" name="endDate" form="editForm" value="${T($(0==t.notFound?e.endTime||new Date:void 0))}"> <input type="time" name="endTime" form="editForm" value="${D($(0==t.notFound?e.endTime||new Date:void 0))}"></label><div><div class="controls"><button form="deleteForm" class="delete"><img src="/images/icons/ui/delete_18dp.png"></button> <input type="submit" form="editForm" value="Save"></div></div></div></div></div>`))}`}},class extends _{constructor(e={},t){super({...e,isDuration:!0},t),this.type="sleep"}})),x.registerRoute(u.route,new u(new class{async getAll(e){return e.type="Poop",e.header="Poops",g`${v(0,f(e,g`${y(e)}`))}`}async get(e,t){e.header="Poop";const n=navigator.language,r={weekday:"long",year:"numeric",month:"long",day:"numeric",hour:"numeric",minute:"numeric"};return g`${v(0,f(e,g`${t.notFound?`<input type="hidden" name="data-loaded" value="${!1==!!t.notFound}">`:""}<div>Start time: ${0==t.notFound?e.startTime.toLocaleString(n,r):""}</div><div>End time: ${e.endTime?e.endTime.toLocaleString(n,r):""}</div>`))}`}async create(e){return e.header="Add a Poop",g`${v(0,f(e,g`<div class="form"><form method="POST" action="/${e.type}s"><div><label for="startDate">Start time: <input type="date" name="startDate" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" placeholder="YYYY-MM-DD" value="${T($(new Date))}"> <input type="time" name="startTime" pattern="[0-9]{2}:[0-9]{2}" placeholder="HH:MM" value="${D($(new Date))}"></label></div><div class="controls"><input type="submit" value="Save"></div></form></div>`))}`}async edit(e,t){return e.header="Update a Poop",g`${v(0,f(e,g`${t.notFound?`<input type="hidden" name="data-loaded" value="${!1==!!t.notFound}">`:""}<div class="form"><form method="POST" id="deleteForm" action="/${e.type}s/${e.id}/delete"></form><form method="POST" id="editForm" action="/${e.type}s/${e.id}/edit"></form><div><div><label for="startDate">Start time: <input type="date" name="startDate" form="editForm" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" placeholder="YYYY-MM-DD" value="${T($(0==t.notFound?e.startTime:void 0))}"> <input type="time" name="startTime" form="editForm" value="${D($(0==t.notFound?e.startTime:void 0))}"></label></div><div class="controls"><button form="deleteForm" class="delete"><img src="/images/icons/ui/delete_18dp.png"></button> <input type="submit" form="editForm" value="Save"></div></div></div>`))}`}},class extends _{constructor(e={},t){super(e,t),this.type="poop"}})),x.registerRoute(c.route,new c(new class{async getAll(e){return e.type="Wee",e.header="Wees",g`${v(0,f(e,g`${y(e)}`))}`}async get(e,t){e.header="Wee";const n=navigator.language,r={weekday:"long",year:"numeric",month:"long",day:"numeric",hour:"numeric",minute:"numeric"};return g`${v(0,f(e,g`${t.notFound?`<input type="hidden" name="data-loaded" value="${!1==!!t.notFound}">`:""}<div>Start time: ${0==t.notFound?e.startTime.toLocaleString(n,r):""}</div><div>End time: ${e.endTime?e.endTime.toLocaleString(n,r):""}</div>`))}`}async create(e){return e.header="Add a Wee",g`${v(0,f(e,g`<div class="form"><form method="POST" action="/${e.type}s"><div><label for="startDate">Start time: <input type="date" name="startDate" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" placeholder="YYYY-MM-DD" value="${T($(new Date))}"> <input type="time" name="startTime" pattern="[0-9]{2}:[0-9]{2}" placeholder="HH:MM" value="${D($(new Date))}"></label></div><div class="controls"><input type="submit" value="Save"></div></form></div>`))}`}async edit(e,t){return e.header="Update a Wee",g`${v(0,f(e,g`${t.notFound?`<input type="hidden" name="data-loaded" value="${!1==!!t.notFound}">`:""}<div class="form"><form method="POST" id="deleteForm" action="/${e.type}s/${e.id}/delete"></form><form method="POST" id="editForm" action="/${e.type}s/${e.id}/edit"></form><div><div><label for="startDate">Start time: <input type="date" name="startDate" form="editForm" value="${T($(0==t.notFound?e.startTime:void 0))}"> <input type="time" name="startTime" form="editForm" value="${D($(0==t.notFound?e.startTime:void 0))}"></label></div><div class="controls"><button form="deleteForm" class="delete"><img src="/images/icons/ui/delete_18dp.png"></button> <input type="submit" form="editForm" value="Save"></div></div></div>`))}`}},class extends _{constructor(e={},t){super(e,t),this.type="wee"}})),x.registerRoute(I.route,new I),self.onfetch=e=>{const{request:t}=e,r=new URL(t.url),a=x.resolve(r);if(a instanceof n)return;const i=a.getView(r,t);return i?e.respondWith(i.then(e=>{if(e instanceof Response)return e;return new Response(e||"Not Found",{status:e?200:404,headers:{"Content-Type":"text/html; charset=utf-8"}})}).catch(e=>new Response(e.toString(),{status:404,headers:{"Content-Type":"text/html"}}))):void 0},self.oninstall=async e=>{e.waitUntil(caches.open("v1").then(async e=>e.addAll(N))),self.skipWaiting()},self.onactivate=e=>{e.waitUntil(clients.claim())};
//# sourceMappingURL=sw.js.map
