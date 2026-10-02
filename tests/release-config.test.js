'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { readReleaseConfig } = require('../tools/release-config');
const root = path.resolve(__dirname, '..');
function fixture(t, project) {
  const parent = path.join(root, 'artifacts');
  fs.mkdirSync(parent, { recursive: true });
  const dir = fs.mkdtempSync(path.join(parent, 'release-test-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(project));
  return dir;
}
test('release settings read changed versions and configured upload descriptions', t => {
  const dir = fixture(t, { name: 'star-basket', version: '2.3.4', description: 'Project description', wechat: { uploadDescription: 'Release notes' } });
  assert.deepEqual(readReleaseConfig(dir, {}), { name: 'star-basket', version: '2.3.4', uploadDescription: 'Release notes' });
  assert.equal(readReleaseConfig(dir, { WECHAT_UPLOAD_DESC: 'Override notes' }).uploadDescription, 'Override notes');
});
test('release settings reject unsafe archive names and versions', t => {
  for (const project of [{ name: '../escape', version: '1.0.0' }, { name: 'game', version: '../escape' }]) {
    assert.throws(() => readReleaseConfig(fixture(t, project), {}), /Invalid package/);
  }
});
test('upload forwards package version and overridden description without invoking the real WeChat tool', t => {
  const dir = fixture(t, { name: 'star-basket', version: '2.3.4', wechat: { uploadDescription: 'Configured notes' } });
  const cliDir = path.join(dir, 'fake-cli');
  fs.mkdirSync(cliDir);
  fs.writeFileSync(path.join(cliDir, 'cli.bat'), '');
  let call, built = false;
  const env = { WECHAT_DEVTOOLS: cliDir, WECHAT_UPLOAD_DESC: 'Override notes' };
  const fakeProcess = { argv: ['node', 'tools/wechat.js', 'upload'], env, platform: 'win32' };
  const context = {
    __dirname: path.join(dir, 'tools'), process: fakeProcess, console,
    require(id) {
      if (id === './release-config') return { readReleaseConfig: taskRoot => readReleaseConfig(taskRoot, env) };
      if (id === './build') return { build() { built = true; } };
      if (id === 'node:child_process') return { spawnSync(...args) { call = args; return { status: 0, stdout: '', stderr: '' }; } };
      return require(id);
    }
  };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'tools/wechat.js'), 'utf8'), context);
  assert.equal(built, true);
  assert.match(call[1][3], /"--version" "2\.3\.4"/);
  assert.match(call[1][3], /"--desc" "Override notes"/);
  assert.equal(fakeProcess.exitCode, 0);
});
