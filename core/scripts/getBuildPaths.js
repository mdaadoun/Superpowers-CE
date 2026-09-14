"use strict";

const path = require("path");
const fs = require("fs");

const shouldIgnoreFolder = (folderName) => folderName.indexOf(".") !== -1 || folderName === "node_modules" || folderName === "public";
const builtInFolderAuthors = [ "default", "common", "extra" ];

module.exports = (rootPath) => {
  var buildPaths = [
    rootPath,
    `${rootPath}/SupCore`, `${rootPath}/SupClient`,
    `${rootPath}/server`, `${rootPath}/client`
  ];

  // Systems and plugins
  const systemsPath = `${rootPath}/systems`;

  let systemFolders = [];
  try { systemFolders = fs.readdirSync(systemsPath); }
  catch (err) { /* Ignore */ }

  systemFolders.forEach((systemName) => {
    if (shouldIgnoreFolder(systemName)) return;

    const systemPath = `${systemsPath}/${systemName}`;
    buildPaths.push(systemPath);

    fs.readdirSync(systemPath).forEach((systemFolder) => {
      if (shouldIgnoreFolder(systemFolder) || systemFolder === "plugins") return;
      buildPaths.push(`${systemPath}/${systemFolder}`);
    });

    const systemPluginsPath = `${systemPath}/plugins`;
    if (!fs.existsSync(systemPluginsPath)) return;

    fs.readdirSync(systemPluginsPath).forEach((pluginAuthor) => {
      if (shouldIgnoreFolder(pluginAuthor)) return;

      const pluginAuthorPath = `${systemPluginsPath}/${pluginAuthor}`;
      fs.readdirSync(pluginAuthorPath).forEach((pluginName) => {
        if (shouldIgnoreFolder(pluginName)) return;

        const pluginPath = `${pluginAuthorPath}/${pluginName}`;
        buildPaths.push(pluginPath);
      });
    });
  });

  return buildPaths;
};
