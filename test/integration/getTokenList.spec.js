var request = require('supertest'),
    app = require('../../app'),
    assert = require('assert'),
    Token = require('../../dataschema'),
    Q = require('q');

describe('[INTEGRATION] Get token list', function(){
  before(function(done){
    this.doRequest = function() {
      return request(app).get('/v1/tokens.json');
    };

    this.clearDb = function(callback) {
      Token.remove({}, callback);
    };

    this.createToken = function(attributes) {
      var token = new Token(attributes);
      var deferred = Q.defer();

      token.save(function(err, res){
        if(err) {
          deferred.reject(err);
        } else {
          deferred.resolve(res);
        };
      });

      return deferred.promise;
    };

    this.sessionId = 42;

    this.clearDb(done);
  });

  afterEach(function(done){
    this.clearDb(done);
  });

  describe('when the user is authenticathed correctly', function(){
    describe('when there are tokens for the given user', function(){
      it('returns a 200', function(done){
        this.doRequest().expect(200).end(done);
      });

      it.skip('returs the tokens', function(done){
        var expectedBody = [];

        var promise1 = this.createToken({
          token: 'aaa',
          content: 'aaaaa',
          expired_at: new Date(),
          created_at: new Date(),
          userSession: 'aaa',
          type: 'aaa'
        });

        var promise2 = this.createToken({
          token: 'bbb',
          content: 'bbbbb',
          expired_at: new Date(),
          created_at: new Date(),
          userSession: 'aaa',
          type: 'bbb'
        });

        promise1.then(promise2).then(function(){
          this.doRequest().end(function(error, res){
            if(error) {
              done(error);
            } else {
              assert.deepEqual(res.body, expectedBody);
              done();
            }
          });
        }.bind(this)).catch(function(err){
          done(err);
        });
      });
    });

    describe('when there are no tokens for the given user', function(){
      it('returns a 200', function(done){
        this.doRequest().expect(200).end(done)
      });

      it('returns and empty list', function(done){
        this.doRequest().end(function(err, res){
          if(err) {
            done(err);
          } else {
            assert.deepEqual(res.body, []);
            done();
          };
        });
      });
    });
  });

  describe.skip('when the user is not authenticathed correctly', function(){
    it('returns a 401', function(done){
      request(app).get('/v1/tokens.json').expect(401).end(done)
    });
  });
});