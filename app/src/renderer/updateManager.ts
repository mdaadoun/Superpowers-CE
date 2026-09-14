import * as electron from "electron";
import * as fs from "fs";

export let appVersion = electron.remote.app.getVersion();
if (appVersion === "0.0.0-dev") {
  appVersion = `v${JSON.parse(fs.readFileSync(`${__dirname}/../../package.json`, { encoding: "utf8" })).version}-dev`;
} else appVersion = `v${appVersion}`;

export function checkForUpdates(callback: (err: Error) => void) {
  // Superpowers CE is bundled and self-contained; automatic update checks from legacy Sparklin Labs repos are disabled.
  callback(null);
}
