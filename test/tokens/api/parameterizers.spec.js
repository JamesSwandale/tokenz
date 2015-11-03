var assert = require('assert');
var sinon = require('sinon');
var parameterizers = require('../../../tokens/api/parameterizers');

describe('Tokens Api Parameterizers', function(){
  describe('Create', function(){
    beforeEach(function(){
      this.getRequest = function() {
        return {
          body: this.body
        };
      };

      this.body = {};

      this.res = { sendStatus: sinon.spy() };
      this.next = sinon.spy();

      this.performCall = function() {
        this.subject = parameterizers.create;
        this.req = this.getRequest();

        this.subject(this.req, this.res, this.next);
      };
    });

    describe('when valid params', function(){
      beforeEach(function(){
        this.body = {
          "content": "some_content",
          "type": "some_type"
        };
      });

      describe('when no max age', function(){
        beforeEach(function(){
          this.body = {
            "content": "some_content",
            "type": "some_type"
          };

          this.performCall();
        });

        it('adds a maxAge value of 0', function(){
          var expectedBody = {
            "content": "some_content",
            "type": "some_type",
            "maxAge": 0
          };

          assert.deepEqual(this.req.body, expectedBody);
        });
      });

      describe('when max age', function(){
        beforeEach(function(){
          this.body = {
            "content": "some_content",
            "type": "some_type",
            "maxAge": 42
          };

          this.performCall();
        });

        it('does not override maxAge', function(){
          var expectedBody = {
            "content": "some_content",
            "type": "some_type",
            "maxAge": 42
          };

          assert.deepEqual(this.req.body, expectedBody);
        });
      });

      describe('when keys not comming as strings', function(){
        beforeEach(function(){
          this.body = {
            "content": 1,
            "type": 2,
            "maxAge": 42
          };

          this.performCall();
        });

        it('stringifies them', function(){
          var expectedBody = {
            "content": "1",
            "type": "2",
            "maxAge": 42
          };

          assert.deepEqual(this.req.body, expectedBody);
        });
      });

      it('calls next', function(){
        this.performCall();

        assert(this.next.calledOnce, true);
      });
    });

    describe('when invalid params', function(){
      describe('when no content', function(){
        beforeEach(function(){
          this.body = {
            "type": "some_type"
          };

          this.performCall();
        });

        it('does not call next', function(){
          assert(this.next.called, false);
        });

        it('returns a 422', function(){
          assert(this.res.sendStatus.calledWith(422), true);
        });
      });

      describe('when no type', function(){
        beforeEach(function(){
          this.body = {
            "content": "some_content"
          };

          this.performCall();
        });

        it('does not call next', function(){
          assert(this.next.called, false);
        });

        it('returns a 422', function(){
          assert(this.res.sendStatus.calledWith(422), true);
        });
      });
    });
  });
});
