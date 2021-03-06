var test = require('tap-only');
var parser = require('../../lib/parser');
var fixtures = __dirname + '/../fixtures';
var yaml = require('js-yaml');

test('parser fills out defaults', function (t) {
  var res = parser.import();
  var expect = {
    version: 'v1.0.0',
    ignore: {},
    patch: {},
  };

  t.deepEqual(res, expect, 'parser fills defaults');
  t.end();
});

test('parser fills out defaults for invalid inputs', function (t) {
  var res = parser.import('test');
  var expect = {
    version: 'v1.0.0',
    ignore: {},
    patch: {},
  };

  t.deepEqual(res, expect, 'parser fills defaults for invalid inputs');
  t.end();
});

test('parser does not modify default parsed format', function (t) {
  var expect = {
    version: 'v1.0.0',
    patch: {
      'glue > hapi > joi > moment': [{
        'patched': '2016-02-26T16:19:06.050Z',
      }],
    },
    ignore: {},
  };

  var res = parser.import(yaml.safeDump(expect));

  t.deepEqual(res, expect, 'parser does nothing extra (v1 vs v1)');
  t.end();
});

test('test unsupported version', function (t) {
  t.throws(function () {
    parser.import(yaml.safeDump({
      version: 'v20.0.1'
    }));
  }, /unsupported version/, 'unsupported version throws');
  t.end();
});

test('demunge', function (t) {
  var source = require(fixtures + '/parsed.json');
  var res = parser.demunge(source);
  var ids = Object.keys(source.patch);
  t.ok(Array.isArray(res.ignore), 'array');
  t.ok(Array.isArray(res.patch), 'array');
  t.equal(res.patch.length, 2, 'two patched items');
  t.deepEqual(res.patch.map(function (o) {
    return o.id;
  }), ids, 'ids found in the right place');
  t.end();
});
