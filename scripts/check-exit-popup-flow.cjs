const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../helpers.js'), 'utf8');
const start = source.lastIndexOf('(function (window, document) {', source.indexOf('  cp.exitPopupFlow ='));
const end = source.indexOf('})(window, document);', start) + '})(window, document);'.length;

function setup() {
  const listeners = [];
  const cookies = [];
  const links = [];
  const opened = [];
  const closed = [];
  const hooks = ['#exit', '#exit-auth', '#custom'];
  const state = { age: 15000, pageId: '123', cookie: '', canOpen: true, popups: hooks.slice() };
  const window = {
    performance: { now: () => state.age },
    tPopupObj: { hookList: hooks.slice(), openPopUpList: [] }
  };
  const document = {
    body: { appendChild: link => links.push(link) },
    addEventListener: (type, fn) => listeners.push({ type, fn }),
    getElementById: () => state.pageId && { getAttribute: () => state.pageId },
    querySelectorAll: () => state.popups.map(hook => ({
      getAttribute: () => hook,
      querySelector: () => ({ click() {
        closed.push(hook);
        window.tPopupObj.openPopUpList = window.tPopupObj.openPopUpList.filter(x => x !== hook);
      } })
    })),
    createElement: () => ({
      click() {
        opened.push(this.href);
        if (state.canOpen) window.tPopupObj.openPopUpList.push(this.href);
      },
      remove() { links.splice(links.indexOf(this), 1); }
    }),
    get cookie() { return state.cookie; },
    set cookie(value) { cookies.push(value); state.cookie = value.split(';')[0]; }
  };
  const context = { window, document, Date };
  vm.runInNewContext(source.slice(start, end), context);
  return {
    window, document, state, listeners, cookies, links, opened, closed,
    init: (...args) => window.cp_tpl.exitPopupFlow(...args),
    leave: (event = {}) => listeners.forEach(x => x.fn({ relatedTarget: null, clientY: 0, ...event }))
  };
}

// Loading the module does not activate the guest scenario before auth responds.
{
  const s = setup();
  s.leave();
  assert.equal(s.listeners.length, 0);
  s.init(null);
  s.init(null);
  assert.equal(s.listeners.length, 1);
  s.state.age = 14999;
  s.leave();
  s.state.age = 15000;
  s.leave({ relatedTarget: {} });
  s.leave({ clientY: 11 });
  s.window.isMobile = true;
  s.leave();
  assert.deepEqual(s.opened, []);
  s.window.isMobile = false;
  s.leave();
  assert.deepEqual(s.opened, ['#exit']);
  assert.match(s.cookies[0], /^123=t724cookie; expires=.+ GMT; path=\/$/);
  assert.equal(s.links.length, 0);
  s.init({ id: 1 });
  assert.deepEqual(s.closed, ['#exit']);
  s.leave();
  assert.deepEqual(s.opened, ['#exit']);
}

// Missing DOM/registry/readiness and blocked opening must not consume a show.
for (const condition of ['popup', 'registry', 'hook', 'already-open', 'body', 'click']) {
  const s = setup();
  s.init({ id: 1 });
  const registry = s.window.tPopupObj;
  const body = s.document.body;
  if (condition === 'popup') s.state.popups = [];
  if (condition === 'registry') s.window.tPopupObj = null;
  if (condition === 'hook') registry.hookList = [];
  if (condition === 'already-open') registry.openPopUpList = ['#exit-auth'];
  if (condition === 'body') s.document.body = null;
  if (condition === 'click') s.state.canOpen = false;
  s.leave();
  assert.deepEqual(s.cookies, []);
  assert.equal(s.links.length, 0);
  s.state.popups = ['#exit-auth'];
  s.window.tPopupObj = registry;
  registry.hookList = ['#exit-auth'];
  registry.openPopUpList = [];
  s.document.body = body;
  s.state.canOpen = true;
  s.leave();
  assert.equal(s.cookies.length, 1, condition);
}

for (const cookie of ['123=seen', 'other=1; 123=seen', '123=0']) {
  const s = setup();
  s.state.cookie = cookie;
  s.init(null);
  s.leave();
  assert.deepEqual(s.opened, []);
}
for (const cookie of ['123=', '1234=seen', 'other=123=seen']) {
  const s = setup();
  s.state.cookie = cookie;
  s.init(null);
  s.leave();
  assert.equal(s.opened.length, 1);
}

// Cookie-free mode works without a page ID, but remains once per page load.
{
  const s = setup();
  s.state.pageId = null;
  s.init(null);
  s.leave();
  assert.deepEqual(s.opened, []);
  s.init(null, { repeatDays: 0, activationDelaySeconds: 0 });
  s.state.age = 0;
  s.leave();
  s.window.tPopupObj.openPopUpList = [];
  s.leave();
  assert.equal(s.opened.length, 1);
  assert.deepEqual(s.cookies, []);
}

// Invalid updates preserve the previous scenario and its complete settings.
for (const options of [
  { repeatDays: -1 }, { activationDelaySeconds: NaN },
  { repeatDays: Infinity }, { repeatDays: 1e300 },
  { activationDelaySeconds: 1e308 },
  { hooks: { guest: null } }, { hooks: { auth: 'https://example.com' } }
]) {
  const s = setup();
  s.init(null, { repeatDays: 0, activationDelaySeconds: 0 });
  assert.throws(() => s.init({ id: 1 }, options), /Exit popup:/);
  s.state.age = 0;
  s.state.pageId = null;
  s.leave();
  assert.deepEqual(s.opened, ['#exit']);
  assert.deepEqual(s.cookies, []);
}

{
  const s = setup();
  const options = { hooks: { guest: '#custom', auth: '#custom' } };
  s.init(null, options);
  s.leave();
  s.init({ id: 1 }, options);
  assert.deepEqual(s.closed, []);
  assert.deepEqual(s.opened, ['#custom']);
}

// Browsers without performance.now use elapsed time since module evaluation.
{
  const s = setup();
  delete s.window.performance;
  s.init(null, { activationDelaySeconds: 0 });
  s.leave();
  assert.deepEqual(s.opened, ['#exit']);
}

console.log('Exit popup flow checks passed.');
