"use strict";
var userServiceMockFactory_1 = require("../../../testUtils/mockFactories/userServiceMockFactory");
var testing_1 = require('@angular/core/testing');
var core_1 = require('@angular/core');
var chai_1 = require('chai');
var userService_1 = require("../services/userService");
var usernameNotExistsValidator_1 = require("./usernameNotExistsValidator");
var Subject_1 = require('rxjs/Subject');
var Observable_1 = require('rxjs/Observable');
var forms_1 = require('@angular/forms');
var sinon_1 = require('sinon');
testing_1.describe('UsernameNotExistsValidatorFactory', function () {
    var userServiceMock;
    var usernameNotExistsValidatorFactory;
    testing_1.beforeEachProviders(function () {
        userServiceMock = userServiceMockFactory_1.UserServiceMockFactory.createUserServiceMock();
        return [
            core_1.provide(userService_1.UserService, { useValue: userServiceMock }),
            usernameNotExistsValidator_1.UsernameNotExistsValidatorFactory
        ];
    });
    testing_1.beforeEach(testing_1.inject([usernameNotExistsValidator_1.UsernameNotExistsValidatorFactory], function (_factory) {
        usernameNotExistsValidatorFactory = _factory;
    }));
    testing_1.describe('create', function () {
        testing_1.it('should create correct UsernameNotExistsValidator', function () {
            var validator = usernameNotExistsValidatorFactory.create();
            chai_1.expect(validator).to.be.instanceof(usernameNotExistsValidator_1.UsernameNotExistsValidator);
            chai_1.expect(validator['userService']).to.be.equal(userServiceMock);
            chai_1.expect(validator['allowedValues']).to.be.deep.equal([]);
        });
    });
});
testing_1.describe('UsernameNotExistsValidator', function () {
    var username;
    var isUsernameExistsResult;
    var userServiceMock;
    var control;
    var validator;
    var originalDebounce;
    var isUsernameExistsSpy;
    testing_1.beforeEach(function () {
        originalDebounce = Observable_1.Observable.prototype.debounce;
        Observable_1.Observable.prototype.debounceTime = function () {
            return this;
        };
        isUsernameExistsResult = new Subject_1.Subject();
        userServiceMock = userServiceMockFactory_1.UserServiceMockFactory.createUserServiceMock();
        userServiceMock.isUsernameExists = function () { return isUsernameExistsResult; };
        control = new forms_1.FormControl();
        validator = new usernameNotExistsValidator_1.UsernameNotExistsValidator(userServiceMock);
        validator.bindControl(control);
        isUsernameExistsSpy = sinon_1.spy(userServiceMock, 'isUsernameExists');
    });
    testing_1.afterEach(function () {
        Observable_1.Observable.prototype.debounce = originalDebounce;
    });
    testing_1.describe('usernameExists', function () {
        testing_1.it('isUsernameExists returns false should return error', function () {
            var actualResult;
            validator.isExists(control).subscribe(function (_result) {
                actualResult = _result;
            });
            username = 'some username';
            control.updateValue(username);
            control.updateValueAndValidity();
            isUsernameExistsResult.next(false);
            isUsernameExistsResult.complete();
            chai_1.expect(actualResult).to.deep.equal({ 'usernameDoesNotExist': true });
        });
        testing_1.it('isUsernameExists returns true should be null', function () {
            var actualResult;
            validator.isExists(control).subscribe(function (_result) {
                actualResult = _result;
            });
            username = 'some username';
            control.updateValue(username);
            control.updateValueAndValidity();
            isUsernameExistsResult.next(true);
            isUsernameExistsResult.complete();
            chai_1.expect(actualResult).to.be.null;
        });
        testing_1.it('isUsernameExists rejects should return usernameDoesNotExistCheckFailed error', function () {
            var actualResult;
            validator.isExists(control).subscribe(function (_result) {
                actualResult = _result;
            });
            username = 'some username';
            control.updateValue(username);
            control.updateValueAndValidity();
            isUsernameExistsResult.error('some error');
            chai_1.expect(actualResult).to.deep.equal({ 'usernameDoesNotExistCheckFailed': true });
        });
        testing_1.it('value changes without subscriber should not fail', function () {
            username = 'some username';
            control.updateValue(username);
            control.updateValueAndValidity();
        });
        testing_1.it('null username should be null', function () {
            var actualResult;
            validator.isExists(control).subscribe(function (_result) {
                actualResult = _result;
            });
            username = null;
            control.updateValue(username);
            control.updateValueAndValidity();
            isUsernameExistsResult.error('some error');
            chai_1.expect(actualResult).to.be.null;
        });
        testing_1.it('undefined username should be null', function () {
            var actualResult;
            validator.isExists(control).subscribe(function (_result) {
                actualResult = _result;
            });
            username = undefined;
            control.updateValue(username);
            control.updateValueAndValidity();
            isUsernameExistsResult.error('some error');
            chai_1.expect(actualResult).to.be.null;
        });
        testing_1.it('empty username should be null', function () {
            validator.isExists(control).subscribe(function (_result) {
                chai_1.expect(_result).to.be.null;
            });
            username = '';
            control.updateValue(username);
            control.updateValueAndValidity();
            isUsernameExistsResult.error('some error');
        });
    });
    testing_1.describe('destroy', function () {
        testing_1.beforeEach(function () {
            validator.destroy();
        });
        testing_1.it('calling destroy before binding to control should not fail', function () {
            new usernameNotExistsValidator_1.UsernameNotExistsValidator(userServiceMock).destroy();
        });
        testing_1.describe('usernameExists', function () {
            testing_1.it('on subscribtion should not return anything', function () {
                var numberOfTimesCalled = 0;
                validator.isExists(control).subscribe(function (_result) {
                    numberOfTimesCalled++;
                });
                username = 'some username';
                control.updateValue(username);
                control.updateValueAndValidity();
                chai_1.expect(numberOfTimesCalled).to.equal(0);
            });
            testing_1.it('value changes should not fail', function () {
                username = 'some username';
                control.updateValue(username);
                control.updateValueAndValidity();
            });
            testing_1.it('on valid username should not use the user service', function () {
                validator.isExists(control).subscribe(function (_result) {
                });
                username = 'some username';
                control.updateValue(username);
                control.updateValueAndValidity();
                chai_1.expect(isUsernameExistsSpy.callCount).to.be.equal(0);
            });
        });
    });
});
//# sourceMappingURL=usernameNotExistsValidator.test.js.map