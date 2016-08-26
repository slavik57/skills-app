"use strict";
var httpError_1 = require("../errors/httpError");
var statusCode_1 = require("../../../../common/statusCode");
var testing_1 = require('@angular/core/testing');
var http_1 = require('@angular/http');
var core_1 = require('@angular/core');
var testing_2 = require('@angular/http/testing');
var http_2 = require('@angular/http');
var chai_1 = require('chai');
var skillService_1 = require('./skillService');
testing_1.describe('SkillService', function () {
    var skillService;
    var mockBackend;
    testing_1.beforeEachProviders(function () { return [
        http_1.HTTP_PROVIDERS,
        testing_2.MockBackend,
        core_1.provide(http_1.XHRBackend, { useExisting: testing_2.MockBackend }),
        skillService_1.SkillService
    ]; });
    testing_1.beforeEach(testing_1.inject([testing_2.MockBackend, skillService_1.SkillService], function (_mockBackend, _skillService) {
        skillService = _skillService;
        mockBackend = _mockBackend;
    }));
    testing_1.it('getSkillsDetails should use correct url', function () {
        skillService.getSkillsDetails();
        chai_1.expect(mockBackend.connectionsArray).to.be.length(1);
        chai_1.expect(mockBackend.connectionsArray[0].request.method).to.be.equal(http_1.RequestMethod.Get);
        chai_1.expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/skills/');
    });
    testing_1.it('deleteSkill should use correct url', function () {
        var skillId = 123;
        skillService.deleteSkill(skillId);
        chai_1.expect(mockBackend.connectionsArray).to.be.length(1);
        chai_1.expect(mockBackend.connectionsArray[0].request.method).to.be.equal(http_1.RequestMethod.Delete);
        chai_1.expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/skills/' + skillId);
    });
    testing_1.it('isSkillExists should use correct url', function () {
        var skillName = 'some skill name';
        skillService.isSkillExists(skillName);
        chai_1.expect(mockBackend.connectionsArray).to.be.length(1);
        chai_1.expect(mockBackend.connectionsArray[0].request.method).to.be.equal(http_1.RequestMethod.Get);
        chai_1.expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/skills/' + skillName + '/exists');
    });
    testing_1.describe('createSkill', function () {
        var skillName;
        testing_1.beforeEach(function () {
            skillName = 'some skill name';
            skillService.createSkill(skillName);
        });
        testing_1.it('should use correct url', function () {
            chai_1.expect(mockBackend.connectionsArray).to.be.length(1);
            chai_1.expect(mockBackend.connectionsArray[0].request.method).to.be.equal(http_1.RequestMethod.Post);
            chai_1.expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/skills/');
        });
        testing_1.it('should use correct body', function () {
            var expectedBody = JSON.stringify({
                name: skillName
            });
            chai_1.expect(mockBackend.connectionsArray[0].request.getBody()).to.be.equal(expectedBody);
        });
    });
    function shouldFailWithError(error, beforeEachFunc) {
        return function () {
            testing_1.beforeEach(beforeEachFunc);
            testing_1.it('getSkillsDetails should fail correctly', function () {
                skillService.getSkillsDetails().subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal(error); });
            });
            testing_1.it('deleteSkill should fail correctly', function () {
                skillService.deleteSkill(123).subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal(error); });
            });
            testing_1.it('isSkillExists should fail correctly', function () {
                skillService.isSkillExists('some skill name').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal(error); });
            });
            testing_1.it('createSkill should fail correctly', function () {
                skillService.createSkill('').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal(error); });
            });
        };
    }
    testing_1.describe('on UNAUTHORIZED error', shouldFailWithError('Unauthorized', function () {
        var error = new httpError_1.HttpError();
        error.status = statusCode_1.StatusCode.UNAUTHORIZED;
        mockBackend.connections.subscribe(function (connection) { return connection.mockError(error); });
    }));
    testing_1.describe('on INTERNAL_SERVER_ERROR error', shouldFailWithError('Oops. Something went wrong. Please try again', function () {
        var error = new httpError_1.HttpError();
        error.status = statusCode_1.StatusCode.INTERNAL_SERVER_ERROR;
        mockBackend.connections.subscribe(function (connection) { return connection.mockError(error); });
    }));
    testing_1.describe('on error with failing json method', shouldFailWithError('Oops. Something went wrong. Please try again', function () {
        var error = new httpError_1.HttpError();
        error.json = function () { throw 'fail to parse'; };
        error.status = statusCode_1.StatusCode.NOT_FOUND;
        mockBackend.connections.subscribe(function (connection) { return connection.mockError(error); });
    }));
    testing_1.describe('on error with failing json method', shouldFailWithError('Oops. Something went wrong. Please try again', function () {
        var responseOptions = new http_2.ResponseOptions({
            status: statusCode_1.StatusCode.UNAUTHORIZED
        });
        var response = new http_2.Response(responseOptions);
        mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
    }));
    testing_1.describe('on error with error description', function () {
        var reasonForError;
        testing_1.beforeEach(function () {
            reasonForError = 'some reason';
            var error = new httpError_1.HttpError();
            error.body = { error: reasonForError };
            mockBackend.connections.subscribe(function (connection) { return connection.mockError(error); });
        });
        testing_1.it('createSkill should fail correctly', function () {
            skillService.createSkill('').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal(reasonForError); });
        });
    });
    testing_1.describe('on success with OK', function () {
        var responseOptions;
        testing_1.beforeEach(function () {
            responseOptions = new http_2.ResponseOptions({
                status: statusCode_1.StatusCode.OK,
                headers: new http_1.Headers()
            });
        });
        testing_1.describe('getSkillsDetails', function () {
            testing_1.it('without the skills details result should fail correctly', function () {
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(new http_2.Response(responseOptions)); });
                skillService.getSkillsDetails().subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again'); });
            });
            testing_1.it('with partial skills details result should fail correctly', function () {
                var result = {
                    id: 1,
                    skillName: 'some skill name'
                };
                delete result.skillName;
                responseOptions = new http_2.ResponseOptions({
                    status: statusCode_1.StatusCode.OK,
                    headers: new http_1.Headers(),
                    body: [result]
                });
                var response = new http_2.Response(responseOptions);
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                skillService.getSkillsDetails().subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again'); });
            });
            testing_1.it('with the skills details result and empty skillName should fail correctly', function () {
                var result = {
                    id: 1,
                    skillName: '',
                };
                responseOptions = new http_2.ResponseOptions({
                    status: statusCode_1.StatusCode.OK,
                    headers: new http_1.Headers(),
                    body: [result]
                });
                var response = new http_2.Response(responseOptions);
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                skillService.getSkillsDetails().subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again'); });
            });
            testing_1.it('with the skills details result and null id should return fail correctly', function () {
                var result = {
                    id: null,
                    skillName: 'some skill name',
                };
                responseOptions = new http_2.ResponseOptions({
                    status: statusCode_1.StatusCode.OK,
                    headers: new http_1.Headers(),
                    body: [result]
                });
                var response = new http_2.Response(responseOptions);
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                skillService.getSkillsDetails().subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again'); });
            });
            testing_1.it('with the skills details result should return correct value', function () {
                var result = [
                    {
                        id: 1,
                        skillName: 'some skill name',
                    },
                    {
                        id: 2,
                        skillName: 'some other skill name',
                    }
                ];
                responseOptions = new http_2.ResponseOptions({
                    status: statusCode_1.StatusCode.OK,
                    headers: new http_1.Headers(),
                    body: result
                });
                var response = new http_2.Response(responseOptions);
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                skillService.getSkillsDetails().subscribe(function (_result) { return chai_1.expect(_result).to.be.deep.equal(result); }, function () { return chai_1.expect(true, 'should succeed').to.be.false; });
            });
        });
        testing_1.describe('deleteSkill', function () {
            testing_1.it('should succeed', function () {
                responseOptions = new http_2.ResponseOptions({
                    status: statusCode_1.StatusCode.OK,
                    headers: new http_1.Headers(),
                });
                var response = new http_2.Response(responseOptions);
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                var wasResolved = false;
                skillService.deleteSkill(1234).subscribe(function () { return wasResolved = true; }, function () { return chai_1.expect(true, 'should succeed').to.be.false; });
                chai_1.expect(wasResolved).to.be.true;
            });
        });
        testing_1.describe('isSkillExists', function () {
            testing_1.it('without the skill existance result should fail correctly', function () {
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(new http_2.Response(responseOptions)); });
                skillService.isSkillExists('').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again'); });
            });
            testing_1.it('with the skill existance result should return correct value', function () {
                var result = true;
                responseOptions = new http_2.ResponseOptions({
                    status: statusCode_1.StatusCode.OK,
                    headers: new http_1.Headers(),
                    body: { skillExists: result }
                });
                var response = new http_2.Response(responseOptions);
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                skillService.isSkillExists('').subscribe(function (_result) { return chai_1.expect(_result).to.be.equal(result); }, function () { return chai_1.expect(true, 'should succeed').to.be.false; });
            });
        });
        testing_1.describe('createSkill', function () {
            testing_1.describe('without skill details', function () {
                testing_1.beforeEach(function () {
                    mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(new http_2.Response(responseOptions)); });
                });
                testing_1.it('createSkill should fail correctly', function () {
                    skillService.createSkill('').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again'); });
                });
            });
            testing_1.describe('with skill details', function () {
                var skillDetails;
                testing_1.beforeEach(function () {
                    skillDetails = {
                        skillName: 'some skill name',
                        id: 1234
                    };
                    responseOptions.body = skillDetails;
                    var response = new http_2.Response(responseOptions);
                    mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                });
                testing_1.it('createSkill should return correct skill details', function () {
                    skillService.createSkill('').subscribe(function (_details) { return chai_1.expect(_details).to.deep.equal(skillDetails); }, function () { return chai_1.expect(true, 'should succeed').to.be.false; });
                });
            });
        });
    });
});
//# sourceMappingURL=skillService.test.js.map