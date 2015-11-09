"use strict";
var chai = require('chai'),
    assert = chai.assert,
    should = require('should'),
    request = require('supertest'),
    sinon = require('sinon'),
    app = require('../app'),
    Action = require('../action'),
    DataSchema = require('../dataschema'),
    util = require('util'),
    validator = require('validator');


describe('Tokenz tests', function() {
    after(function() {
       // var action = new Action(app);
       // var collName = action.getSchema().collection.name;
       // action.getSchema().base.connections[0].db.dropCollection(collName);
    });
    describe('API tests', function() {
        describe('When creating tokens POST', function() {
            it('will call the action class', function(done) {
                var spy = sinon.spy(app.action, 'createNewToken');

                var req = request(app)
                    .post("/v1/tokens.json")
                    .end(function(err, res) {
                        spy.called.should.equal(true);
                        spy.restore();
                        done();
                    });
            });
            it('Returns 201', function(done) {
                request(app)
                    .post("/v1/tokens.json")
                    .end(function(err, res) {
                        res.statusCode.should.equal(201);
                        done();
                    });
            });
            it('Returns the value returned by the action layer', function(done) {

                var real_createNewToken = app.action.createNewToken;
                app.action.createNewToken = function(stuff) {
                    return {token:'nonsense'};
                };

                request(app)
                    .post("/v1/tokens.json")
                    .end(function(err, res) {
                        res.statusCode.should.equal(201);
                        res.body.should.have.property("token");
                        app.action.createNewToken = real_createNewToken;
                        done();
                    });
            });
        })

        describe('When reading tokens', function() {
            it('Returns the value returned by the action layer', function(done) {
                var real_getData = app.action.getData;
                app.action.getData = function(token, callback) {
                    if(token === 'test-token') {
                       callback({stored:'nonsense'});
                    }
                };

                request(app)
                    .get("/v1/tokens.json/test-token")
                    .end(function(err, res) {
                        res.statusCode.should.equal(200);
                        res.body.should.have.property("stored","nonsense");
                        app.action.getData = real_getData;
                        done();
                    });
            });
            //it('', function(done) {
            //});
        })
        describe('When requesting all user entries', function(){
            it('Returns all data for that user', function(done){
                var real_getAllData = app.action.getAllData;
                app.action.getAllData = function(sessionid, callback) {
                    if(sessionid === 'test-session') {
                       callback([{stored:'nonsense'},{stored:'nonsense2'}]);
                    }
                };

                request(app)
                    .get("/v1/tokens.json?sessionId=test-session")
                    .end(function(err, res) {
                        res.statusCode.should.equal(200);
                        res.body.should.be.instanceof(Array)
                        res.body[0].should.have.property("stored","nonsense");
                        res.body[1].should.have.property("stored","nonsense2");
                        app.action.getAllData = real_getAllData;
                        done();
                    });
            });
        })
        describe('When deleting tokens', function() {
            it('Data will be removed', function(done) {
                var real_deleteData = app.action.deleteData;
                app.action.deleteData = function(token, callback) {
                    if(token === 'test-token') {
                       callback("Data removed!");
                    }
                };
                request(app)
                    .get("/v1/tokens.json/delete/test-token")
                    .end(function(err, res) {
                        res.statusCode.should.equal(404);
                        app.action.deleteData = real_deleteData;
                        done();
                    });
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
                var ret = action.createNewToken(storethis);
                ret.should.have.property('stuff', storethis);
                ret.should.have.property('token');
            });

            it('has a valid v4 format uuid', function() {
                var action = new Action(app);
                var storethis = {
                    "content": "cosa importante",
                    "maxAge": 0,
                    "type": "bicycle"
                };

                var ret = action.createNewToken(storethis);

                ret.should.have.property('token');

                ret.token.should.be.a.string
                validator.isUUID(ret.token, 4).should.be.equal(true);

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
                ret = action.createNewToken(storethis);
            });

            it('queries the database correctly', function(done){
                var mongoSpy = sinon.spy(action.getSchema() ,'findOne' );

                action.getData(ret.token, function() {
                    mongoSpy.called.should.equal(true);
                    mongoSpy.calledWith({token:ret.token}).should.equal(true);

                    mongoSpy.restore();

                    done();
                });

            })

            it('calls back with the first token found', function(done){
                action.getData(ret.token, function(foundtoken) {
                    foundtoken.content.should.deepEqual(storethis);
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
                ret = action.createNewToken(storethis)
                done()
            })
            it('deletes the entry associated with the token and returns the content', function(done){
                var thing = action.deleteData(ret.token, function(res){
                    res.content.should.deepEqual(storethis)
                    done()
                })
            })
        })
    })

    describe('Integration tests', function(){
        describe('When creating, then deleting a token', function(){
            it('the token is deleted correctly', function(done){

                var storethis = {
                    "content": "cosa importante",
                    "maxAge": 0,
                    "type": "bicycle"
                };

                var tokenz

                request(app).post("/v1/tokens.json").send(storethis).end(function(err, res){
                    tokenz = res.body.token

                    request(app).get("/v1/tokens.json/"+tokenz).end(function(err, res){
                        res.body.content.should.deepEqual(storethis);

                        request(app).delete("/v1/tokens.json/"+tokenz).end(function(err, res){

                            request(app).get("/v1/tokens.json/"+tokenz).end(function(err, res){
                                var expectedErrorRes = {}
                                res.body.should.deepEqual(expectedErrorRes);
                                done();
                            })
                        })
                    })
                })
            })
        })
        describe('When performing a get with a sessionId', function(){
            it('all associated user data is returned', function(done){
                var storethis = {
                    "content": "get all",
                    "maxAge": 0,
                    "type": "bicycle"
                };

                var tokenz

                request(app).post("/v1/tokens.json").send(storethis).end(function(err, res){
                    tokenz = res.body.token

                    request(app).get("/v1/tokens.json?sessionId=123456").end(function(err, res){
                        res.body.should.be.instanceof(Array)
                        done()
                    })
                })
            })
        })
    })
})