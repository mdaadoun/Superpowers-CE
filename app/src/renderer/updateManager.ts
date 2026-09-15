import * as fs from "fs";

export let appVersion = `v${JSON.parse(fs.readFileSync(`${__dirname}/../../package.json`, { encoding: "utf8" })).version}`;

export function checkForUpdates(callback: (err: Error) => void) {
  // Superpowers CE is bundled and self-contained; automatic update checks from legacy Sparklin Labs repos are disabled.
  callback(null);
}
