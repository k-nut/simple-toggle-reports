import fetch from "node-fetch";
import * as querystring from "querystring";
import * as base64 from "base-64";
import { Response } from "./types";

const { TOGGL_USER_AGENT, TOGGL_API_KEY, TOGGL_WORSKPACE_ID } = process.env;
if (TOGGL_USER_AGENT == undefined) {
  throw new Error("You need to define the TOGGL_USER_AGENT env variable");
}
if (TOGGL_API_KEY == undefined) {
  throw new Error("You need to define the TOGGL_API_KEY env variable");
}
if (TOGGL_WORSKPACE_ID == undefined) {
  throw new Error("You need to define the TOGGL_WORSKPACE_ID env variable");
}

const options = {
  user_agent: TOGGL_USER_AGENT,
  workspace_id: TOGGL_WORSKPACE_ID,
  since: "2020-03-02",
  until: "2020-03-08"
  // client_ids: ["0", "43499858"]
};

const qs = querystring.stringify(options);
const BASE_URL = "https://toggl.com/reports/api/v2/details";

const url = `${BASE_URL}?${qs}`;
const token = base64.encode(`${TOGGL_API_KEY}:api_token`);
const headers = {
  Authorization: `Basic ${token}`
};

function parseData(data: Response) {
  if (data.total_count > data.per_page) {
    throw new Error("Does not support pagination yet");
  }
  const collected = data.data.reduce((map: any, entry) => {
    const { start, client, project, dur, description } = entry;
    const date = start.slice(0, 10);
    if (!map[date]) {
      map[date] = {};
    }
    if (!map[date][client]) {
      map[date][client] = {};
    }
    if (!map[date][client][project]) {
      map[date][client][project] = {
        total: 0,
        titles: []
      };
    }
    map[date][client][project].total =
      (map[date][client][project].total || 0) +
      Math.round((dur / (60 * 60 * 1000)) * 100) / 100;
    map[date][client][project].titles.push(description);
    return map;
  }, {});
  console.log(JSON.stringify(collected, null, 2));
}

fetch(url, { headers })
  .then(response => response.json())
  .then(parseData);
