'use strict';
const fs = require('node:fs');
const path = require('node:path');
function readReleaseConfig(root, env = process.env) {
  const project = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  if (!/^[a-z0-9][a-z0-9._-]*$/.test(project.name)) throw new Error('Invalid package name');
  if (!/^\d+\.\d+\.\d+(?:-[a-zA-Z0-9.-]+)?(?:\+[a-zA-Z0-9.-]+)?$/.test(project.version)) throw new Error('Invalid package version');
  return {
    name: project.name,
    version: project.version,
    uploadDescription: env.WECHAT_UPLOAD_DESC || (project.wechat && project.wechat.uploadDescription) || project.description || project.name
  };
}
module.exports = { readReleaseConfig };
