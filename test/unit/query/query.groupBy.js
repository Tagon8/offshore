var Offshore = require('../../../lib/offshore'),
    assert = require('assert');

describe('Collection groupBy', function () {

  describe('.groupBy()', function () {
    var query;

    before(function (done) {

      var offshore = new Offshore();
      var Model = Offshore.Collection.extend({
        identity: 'user',
        connection: 'foo',
        attributes: {
          age: 'integer',
          percent: 'float'
        }
      });

      offshore.loadCollection(Model);

      // Fixture Adapter Def
      var adapterDef = {
        find: function (con, col, criteria, cb) {
          return cb(null, [criteria]);
        }
      };

      var connections = {
        'foo': {
          adapter: 'foobar'
        }
      };

      offshore.initialize({ adapters: { foobar: adapterDef }, connections: connections }, function(err, colls) {
        if (err) return done(err);
        query = colls.collections.user;
        done();
      });
    });

    it('should return criteria with group sets', function (done) {
      query.find()
      .groupBy('age', 'percent')
      .exec(function (err, obj) {
        if(err) return done(err);

        assert(obj[0].groupBy[0] === 'age');
        assert(obj[0].groupBy[1] === 'percent');
        done();
      });
    });

    it('should accept an array', function (done) {
      query.find()
      .groupBy(['age', 'percent'])
      .exec(function (err, obj) {
        if(err) return done(err);

        assert(obj[0].groupBy[0] === 'age');
        assert(obj[0].groupBy[1] === 'percent');
        done();
      });
    });

  });
});
