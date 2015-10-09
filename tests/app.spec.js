"use strict";
var chai = require('chai'),
	assert = chai.assert,
	should = require('should'),
	request = require('supertest'),
    sinon = require('sinon'),
	app = require('../app'),
    Action = require('../action');


describe('Tokenz tests', function() {
    describe('API tests', function() {
        describe('When creating tokens POST', function() {

            beforeEach(function(){
            })
            it('will call the action class', function(done) {
                var spy = sinon.spy(app.action, 'create_new_token');

                var req = request(app)
                    .post("/v1/tokens")
                    .end(function(err, res) {
                        spy.called.should.equal(true);
                        spy.restore();
                        done();
                    });
            });

            it('Returns 201', function(done) {
                request(app)
                    .post("/v1/tokens")
                    .end(function(err, res) {
                        res.statusCode.should.equal(201);
                        done();
                    });

            });
            it('Returns the value returned by the action layer', function(done) {

                var real_create_new_token = app.action.create_new_token;
                app.action.create_new_token = function(stuff) {
                    return {token:'nonsense'};
                };

                request(app)
                    .post("/v1/tokens")
                    .end(function(err, res) {
                        res.statusCode.should.equal(201);
                        res.body.should.have.property("token",'nonsense');
                        app.action.create_new_token = real_create_new_token;
                        done();
                    });

            });


        })

        xdescribe('When deleting tokens', function() {
            it('', function(done) {
            });
            it('', function(done) {
            });
        })

        xdescribe('When reading tokens', function() {
            it('', function(done) {
            });
            it('', function(done) {
            });
        })

        xdescribe('When accessing the api endpoints', function() {
            it('', function(done) {
            });
            it('', function(done) {
            });
        })
    })






    describe('Action tests', function() {
        describe('Create new token', function() {
            it('generates a database entry', function() {
                var action = new Action(app);
                var storethis = {
                    "content": "cosa importante",
                    "maxAge": 0,
                    "type": "bicycle"
                };

                var ret = action.create_new_token(storethis);

                ret.should.have.property('stuff', storethis);
                ret.should.have.property('token', 'gibberish');

            });
            xit('', function(done) {
            });
        })
    })
})