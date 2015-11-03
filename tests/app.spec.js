"use strict";
var chai = require('chai'),
    assert = chai.assert,
    should = require('should'),
    request = require('supertest'),
    sinon = require('sinon'),
    app = require('../app'),
    Action = require('../action'),
    DataSchema = require('../dataschema'),
    util = require('util');


describe('Tokenz tests', function() {
    after(function() {
       // var action = new Action(app);
       // var collName = action.getSchema().collection.name;
       // action.getSchema().base.connections[0].db.dropCollection(collName);
    });
    describe('API tests', function() {
        describe('When creating tokens POST', function() {
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
                        res.body.should.have.property("token");
                        app.action.create_new_token = real_create_new_token;
                        done();
                    });
            });
        })

        describe('When reading tokens', function() {
            it('Returns the value returned by the action layer', function(done) {
                var real_get_data = app.action.get_data;
                app.action.get_data = function(token, callback) {
                    if(token === 'test-token') {
                       callback({stored:'nonsense'});
                    }
                };

                request(app)
                    .get("/v1/tokens/test-token")
                    .end(function(err, res) {
                        res.statusCode.should.equal(200);
                        res.body.should.have.property("stored","nonsense");
                        app.action.get_data = real_get_data;
                        done();
                    });
            });
            //it('', function(done) {
            //});
        })
        describe('When deleting tokens', function() {
            it('Data will be removed', function(done) {
                var real_delete_data = app.action.delete_data;
                app.action.delete_data = function(token, callback) {
                    if(token === 'test-token') {
                       callback("Data removed!");
                    }
                };
                request(app)
                    .get("/v1/tokens/delete/test-token")
                    .end(function(err, res) {
                        res.statusCode.should.equal(404);
                        app.action.delete_data = real_delete_data;
                        done();
                    });
            });
        })

/*
                describe.skip('When accessing the api endpoints', function() {
                    it('', function(done) {
                    });
                    it('', function(done) {
                    });
                })
                */
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
                ret.should.have.property('token');
            });
        })

        describe('Get data', function(){
            var action,storethis,ret;
            before(function() {
                action = new Action(app);
                storethis = {
                    "content": "cosa importante",
                    "maxAge": 0,
                    "type": "bicycle"
                };
                ret = action.create_new_token(storethis);
            });

            it('queries the database correctly', function(done){
                var mongoSpy = sinon.spy(action.getSchema() ,'findOne' );

                action.get_data(ret.token, function() {
                    mongoSpy.called.should.equal(true);
                    mongoSpy.calledWith({token:ret.token}).should.equal(true);

                    mongoSpy.restore();

                    done();
                });

            })

            it('calls back with the first token found', function(done){
                action.get_data(ret.token, function(foundtoken) {
                    foundtoken.should.deepEqual(storethis);
                    done();
                });
            })
        })

        describe('Delete data', function(){
            var action, storethis, ret;
            before(function(done){
                action = new Action(app);
                storethis = {
                    "content": "first name - last name",
                    "maxAge": 0,
                    "type": "name"
                };
                ret = action.create_new_token(storethis)
                console.log("ret token ="+ret.token)
                done()
            })
            it('deletes the entry associated with the token and returns the content', function(done){
                var thing = action.delete_data(ret.token, function(res){
                    res.should.deepEqual(storethis)
                    done()
                })
            })
        })
    })

    describe('Integration tests', function(){
        it('Doing all the stuff works', function(done){

            var storethis = {
                "content": "cosa importante",
                "maxAge": 0,
                "type": "bicycle"
            };

            var tokenz

            request(app).post("/v1/tokens").send(storethis).end(function(err, res){
                tokenz = res.body.token

                request(app).get("/v1/tokens/"+tokenz).end(function(err, res){
                    console.log(res.body)
                    res.body.should.deepEqual(storethis);

                    request(app).delete("/v1/tokens/delete/"+tokenz).end(function(err, res){

                        request(app).get("/v1/tokens/"+tokenz).end(function(err, res){
                            var expectedErrorRes = {}
                            res.body.should.deepEqual(expectedErrorRes);
                            done();
                        })
                    })
                })
            })
        })
    })
})