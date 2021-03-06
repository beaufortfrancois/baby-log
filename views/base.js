import { head } from "./partials/head.js";
import { body } from "./partials/body.js";
import html from "./lib/florawg.js";
import { aggregate } from "./helpers/aggregate.js";
import { correctISOTime, getDate, getTime } from "./helpers/timezone.js";
import { assets } from "../assets.js";

if ("navigator" in globalThis === false) {
  globalThis.navigator = {
    language: "en-GB",
  };
}

const sanitize = (input = "") => {
  return input.replace("<", "&lt;").replace(">", "&gt;");
};

export class BaseView {
  async getAll(data, extras) {
    return html`${head(data, body(data, html`${aggregate(data, extras)}`))}`;
  }

  async get(data, extras) {
    const lang = navigator.language;
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };

    return html`${head(
      data,
      body(
        data,
        html`${extras.notFound
            ? html`<input
                type="hidden"
                name="data-loaded"
                value="${!!extras.notFound === false}"
              />`
            : ""}
          <div>
            Start time:
            ${extras.notFound == false
              ? data.startTime.toLocaleString(lang, options)
              : ""}
          </div>
          <div>
            End time:
            ${!!data.endTime ? data.endTime.toLocaleString(lang, options) : ""}
          </div>`
      )
    )}`;
  }

  async create(data, extras) {
    return html`${head(
      data,
      body(
        data,
        html`<div class="form">
          <form method="POST" action="/${data.type}s">
            <input type="hidden" name="return-url" value="${extras.referrer}" />
            <div>
              <label for="startDate"
                >Start time:
                <input
                  type="date"
                  name="startDate"
                  pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
                  placeholder="YYYY-MM-DD"
                  value="${getDate(correctISOTime(new Date()))}"
                />
                <input
                  type="time"
                  name="startTime"
                  pattern="[0-9]{2}:[0-9]{2}"
                  placeholder="HH:MM"
                  value="${getTime(correctISOTime(new Date()))}"
                />
              </label>
            </div>
            ${!!extras.fieldsTemplates ? extras.fieldsTemplates : undefined}
            <div class="notes">
              <label for="notes">Notes:</label>
              <textarea name="notes"></textarea>
            </div>
            <div class="controls">
              <input type="submit" value="Save" />
            </div>
          </form>
        </div>`
      )
    )}`;
  }

  async edit(data, extras) {
    return html`${head(
      data,
      body(
        data,
        html`${extras.notFound
            ? html`<input
                type="hidden"
                name="data-loaded"
                value="${!!extras.notFound === false}"
              />`
            : ""}
          <div class="form">
            <form
              method="POST"
              id="deleteForm"
              action="/${data.type}s/${data.id}/delete"
            >
              <input
                type="hidden"
                name="return-url"
                value="${extras.referrer}"
              />
            </form>
            <form
              method="POST"
              id="editForm"
              action="/${data.type}s/${data.id}/edit"
            >
              <input
                type="hidden"
                name="return-url"
                value="${extras.referrer}"
              />
            </form>
            <div>
              <div>
                <label for="startDate"
                  >Start time:
                  <input
                    type="date"
                    name="startDate"
                    form="editForm"
                    value="${getDate(
                      correctISOTime(
                        extras.notFound == false ? data.startTime : undefined
                      )
                    )}"
                  />
                  <input
                    type="time"
                    name="startTime"
                    form="editForm"
                    value="${getTime(
                      correctISOTime(
                        extras.notFound == false ? data.startTime : undefined
                      )
                    )}"
                  />
                </label>
              </div>
              ${!!extras.fieldsTemplates ? extras.fieldsTemplates : undefined}
              <div class="notes">
                <label for="notes">Notes:</label>
                <textarea name="notes"></textarea>
              </div>
              <div class="controls">
                <button form="deleteForm" class="delete">
                  <img src="${assets["/images/icons/ui/delete_24px.svg"]}" />
                </button>
                <input type="submit" form="editForm" value="Save" />
              </div>
            </div>
          </div> `
      )
    )}`;
  }
}
