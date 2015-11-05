var request = require('supertest'),
    app = require('../../app'),
    assert = require('assert')
    Token = require('../../dataschema');

describe('[INTEGRATION] Get token list', function(){
  before(function(done){
    this.doRequest = function() {
      return request(app).post('/v1/tokens.json');
    };

    this.clearDb = function(callback) {
      Token.remove({}, callback);
    };

    this.clearDb(done);
  });

  afterEach(function(done){
    this.clearDb(done);
  });

  describe('when the user is authenticathed correctly', function(){
    describe('when valid params', function(){
      it('creates a token and returns its location in a response header', function(done){
        this.doRequest().send(this.params).end(function(err, res){
          if(err) {
            done(err);
          } else {
            var tokenLocation = res.headers.location;
            var uuid = tokenLocation.split('/').pop();

            Token.find({uuid: uuid}, function(err, res){
              // Assert in res
              done();
            });
          };
        });
      });
    });

    describe.skip('when invalid params', function(){
      it('returns a 422', function(done){
        request(app).get('/v1/tokens.json').expect(422).end(done)
      });
    });
  });

  describe.skip('when the user is not authenticathed correctly', function(){
    it('returns a 401', function(done){
      request(app).get('/v1/tokens.json').expect(401).end(done)
    });
  });
});