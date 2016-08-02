"use strict";
var teamServiceMockFactory_1 = require("../../../testUtils/mockFactories/teamServiceMockFactory");
var testing_1 = require('@angular/core/testing');
var core_1 = require('@angular/core');
var chai_1 = require('chai');
var teamService_1 = require("../services/teamService");
var teamExistsValidator_1 = require("./teamExistsValidator");
var Subject_1 = require('rxjs/Subject');
var Observable_1 = require('rxjs/Observable');
var forms_1 = require('@angular/forms');
var sinon_1 = require('sinon');
testing_1.describe('TeamExistsValidatorFactory', function () {
    var teamServiceMock;
    var teamExistsValidatorFactory;
    testing_1.beforeEachProviders(function () {
        teamServiceMock = teamServiceMockFactory_1.TeamServiceMockFactory.createTeamServiceMock();
        return [
            core_1.provide(teamService_1.TeamService, { useValue: teamServiceMock }),
            teamExistsValidator_1.TeamExistsValidatorFactory
        ];
    });
    testing_1.beforeEach(testing_1.inject([teamExistsValidator_1.TeamExistsValidatorFactory], function (_teamExistsValidatorFactory) {
        teamExistsValidatorFactory = _teamExistsValidatorFactory;
    }));
    testing_1.describe('create', function () {
        testing_1.it('should create correct TeamExistsValidator', function () {
            var validator = teamExistsValidatorFactory.create();
            chai_1.expect(validator).to.be.instanceof(teamExistsValidator_1.TeamExistsValidator);
            chai_1.expect(validator['teamService']).to.be.equal(teamServiceMock);
            chai_1.expect(validator['allowedValues']).to.be.deep.equal([]);
        });
    });
    testing_1.describe('createWithAllowedTeams', function () {
        testing_1.it('should create correct TeamExistsValidator', function () {
            var teamNames = ['a', 'b', 'c'];
            var validator = teamExistsValidatorFactory.createWithAllowedTeams(teamNames);
            chai_1.expect(validator).to.be.instanceof(teamExistsValidator_1.TeamExistsValidator);
            chai_1.expect(validator['teamService']).to.be.equal(teamServiceMock);
            chai_1.expect(validator['allowedValues']).to.be.deep.equal(teamNames);
        });
    });
});
testing_1.describe('TeamExistsValidator', function () {
    var teamName;
    var isTeamExistsResult;
    var teamServiceMock;
    var control;
    var validator;
    var originalDebounce;
    var validTeamNames;
    var isTeamExistsSpy;
    testing_1.beforeEach(function () {
        originalDebounce = Observable_1.Observable.prototype.debounce;
        Observable_1.Observable.prototype.debounceTime = function () {
            return this;
        };
        isTeamExistsResult = new Subject_1.Subject();
        teamServiceMock = teamServiceMockFactory_1.TeamServiceMockFactory.createTeamServiceMock();
        teamServiceMock.isTeamExists = function () { return isTeamExistsResult; };
        control = new forms_1.FormControl();
        validTeamNames = ['valid team name1', 'valid team name2'];
        validator = new teamExistsValidator_1.TeamExistsValidator(validTeamNames, teamServiceMock);
        validator.bindControl(control);
        isTeamExistsSpy = sinon_1.spy(teamServiceMock, 'isTeamExists');
    });
    testing_1.afterEach(function () {
        Observable_1.Observable.prototype.debounce = originalDebounce;
    });
    testing_1.describe('isExists', function () {
        testing_1.it('isTeamExists returns true should return error', function () {
            var actualResult;
            validator.isExists(control).subscribe(function (_result) {
                actualResult = _result;
            });
            teamName = 'some name';
            control.updateValue(teamName);
            control.updateValueAndValidity();
            isTeamExistsResult.next(true);
            isTeamExistsResult.complete();
            chai_1.expect(actualResult).to.deep.equal({ 'teamNameTaken': true });
        });
        testing_1.it('isTeamExists returns false should be null', function () {
            var actualResult;
            validator.isExists(control).subscribe(function (_result) {
                actualResult = _result;
            });
            teamName = 'some name';
            control.updateValue(teamName);
            control.updateValueAndValidity();
            isTeamExistsResult.next(false);
            isTeamExistsResult.complete();
            chai_1.expect(actualResult).to.be.null;
        });
        testing_1.it('isTeamExists rejects should return teamNameTakenCheckFailed error', function () {
            var actualResult;
            validator.isExists(control).subscribe(function (_result) {
                actualResult = _result;
            });
            teamName = 'some name';
            control.updateValue(teamName);
            control.updateValueAndValidity();
            isTeamExistsResult.error('some error');
            chai_1.expect(actualResult).to.deep.equal({ 'teamNameTakenCheckFailed': true });
        });
        testing_1.it('value changes without subscriber should not fail', function () {
            teamName = 'some name';
            control.updateValue(teamName);
            control.updateValueAndValidity();
        });
        testing_1.it('null team name should be null', function () {
            var actualResult;
            validator.isExists(control).subscribe(function (_result) {
                actualResult = _result;
            });
            teamName = null;
            control.updateValue(teamName);
            control.updateValueAndValidity();
            isTeamExistsResult.error('some error');
            chai_1.expect(actualResult).to.be.null;
        });
        testing_1.it('undefined team name should be null', function () {
            var actualResult;
            validator.isExists(control).subscribe(function (_result) {
                actualResult = _result;
            });
            teamName = undefined;
            control.updateValue(teamName);
            control.updateValueAndValidity();
            isTeamExistsResult.error('some error');
            chai_1.expect(actualResult).to.be.null;
        });
        testing_1.it('empty team name should be null', function () {
            validator.isExists(control).subscribe(function (_result) {
                chai_1.expect(_result).to.be.null;
            });
            teamName = '';
            control.updateValue(teamName);
            control.updateValueAndValidity();
            isTeamExistsResult.error('some error');
        });
        testing_1.it('on valid team name should not use the team service', function () {
            validator.isExists(control);
            control.updateValue(validTeamNames[0]);
            control.updateValueAndValidity();
            chai_1.expect(isTeamExistsSpy.callCount).to.be.equal(0);
        });
        testing_1.it('on another valid team name should not use the team service', function () {
            validator.isExists(control);
            control.updateValue(validTeamNames[1]);
            control.updateValueAndValidity();
            chai_1.expect(isTeamExistsSpy.callCount).to.be.equal(0);
        });
        testing_1.it('on valid team name should return null', function () {
            control.updateValue(validTeamNames[0]);
            var actualResult;
            validator.isExists(control).subscribe(function (_result) {
                actualResult = _result;
            });
            control.updateValueAndValidity();
            chai_1.expect(actualResult).to.be.null;
        });
        testing_1.it('on another valid team name should return null', function () {
            control.updateValue(validTeamNames[1]);
            var actualResult;
            validator.isExists(control).subscribe(function (_result) {
                actualResult = _result;
            });
            control.updateValueAndValidity();
            chai_1.expect(actualResult).to.be.null;
        });
    });
    testing_1.describe('destroy', function () {
        testing_1.beforeEach(function () {
            validator.destroy();
        });
        testing_1.it('calling destroy before binding to control should not fail', function () {
            new teamExistsValidator_1.TeamExistsValidator(validTeamNames, teamServiceMock).destroy();
        });
        testing_1.describe('teamExists', function () {
            testing_1.it('on subscribtion should not return anything', function () {
                var numberOfTimesCalled = 0;
                validator.isExists(control).subscribe(function (_result) {
                    numberOfTimesCalled++;
                });
                teamName = 'some name';
                control.updateValue(teamName);
                control.updateValueAndValidity();
                chai_1.expect(numberOfTimesCalled).to.equal(0);
            });
            testing_1.it('value changes should not fail', function () {
                teamName = 'some name';
                control.updateValue(teamName);
                control.updateValueAndValidity();
            });
            testing_1.it('on valid team name should not use the team service', function () {
                validator.isExists(control).subscribe(function (_result) {
                });
                teamName = 'some name';
                control.updateValue(teamName);
                control.updateValueAndValidity();
                chai_1.expect(isTeamExistsSpy.callCount).to.be.equal(0);
            });
        });
    });
});
//# sourceMappingURL=teamExistsValidator.test.js.map