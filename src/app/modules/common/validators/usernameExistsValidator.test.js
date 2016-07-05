"use strict";
var testing_1 = require('@angular/core/testing');
var core_1 = require('@angular/core');
var chai_1 = require('chai');
var userService_1 = require("../services/userService");
var usernameExistsValidator_1 = require("./usernameExistsValidator");
var Subject_1 = require('rxjs/Subject');
var Observable_1 = require('rxjs/Observable');
var forms_1 = require('@angular/forms');
testing_1.describe('UsernameExistsValidatorFactory', function () {
    var userServiceMock;
    var usernameExistsValidatorFactory;
    testing_1.beforeEachProviders(function () {
        userServiceMock = {
            signinUser: function () { return null; },
            registerUser: function () { return null; },
            isUsernameExists: function () { return null; }
        };
        return [
            core_1.provide(userService_1.UserService, { useValue: userServiceMock }),
            usernameExistsValidator_1.UsernameExistsValidatorFactory
        ];
    });
    testing_1.beforeEach(testing_1.inject([usernameExistsValidator_1.UsernameExistsValidatorFactory], function (_usernameExistsValidatorFactory) {
        usernameExistsValidatorFactory = _usernameExistsValidatorFactory;
    }));
    testing_1.describe('create', function () {
        testing_1.it('should create correct UsernameExistsValidator', function () {
            var validator = usernameExistsValidatorFactory.create();
            chai_1.expect(validator).to.be.instanceof(usernameExistsValidator_1.UsernameExistsValidator);
            chai_1.expect(validator['userService']).to.be.equal(userServiceMock);
        });
    });
});
testing_1.describe('UsernameExistsValidator', function () {
    var username;
    var isUsernameExistsResult;
    var userServiceMock;
    var control;
    var validator;
    var originalDebounce;
    testing_1.beforeEach(function () {
        originalDebounce = Observable_1.Observable.prototype.debounce;
        Observable_1.Observable.prototype.debounceTime = function () {
            return this;
        };
        isUsernameExistsResult = new Subject_1.Subject();
        userServiceMock = {
            signinUser: function () { return null; },
            registerUser: function () { return null; },
            isUsernameExists: function () { return isUsernameExistsResult; }
        };
        control = new forms_1.FormControl();
        validator = new usernameExistsValidator_1.UsernameExistsValidator(userServiceMock);
        validator.bindControl(control);
    });
    testing_1.afterEach(function () {
        Observable_1.Observable.prototype.debounce = originalDebounce;
    });
    testing_1.describe('usernameExists', function () {
        testing_1.it('isUsernameExists returns true should return error', function () {
            validator.usernameExists(control).subscribe(function (_result) {
                chai_1.expect(_result).to.deep.equal({ 'usernameTaken': true });
            });
            username = 'some username';
            control.updateValue(username);
            control.updateValueAndValidity();
            isUsernameExistsResult.next(true);
            isUsernameExistsResult.complete();
        });
        testing_1.it('isUsernameExists returns false should be null', function () {
            validator.usernameExists(control).subscribe(function (_result) {
                chai_1.expect(_result).to.be.null;
            });
            username = 'some username';
            control.updateValue(username);
            control.updateValueAndValidity();
            isUsernameExistsResult.next(false);
            isUsernameExistsResult.complete();
        });
        testing_1.it('isUsernameExists rejects should return usernameTakenCheckFailed error', function () {
            validator.usernameExists(control).subscribe(function (_result) {
                chai_1.expect(_result).to.deep.equal({ 'usernameTakenCheckFailed': true });
            });
            username = 'some username';
            control.updateValue(username);
            control.updateValueAndValidity();
            isUsernameExistsResult.error('some error');
        });
        testing_1.it('value changes without subscriber should not fail', function () {
            username = 'some username';
            control.updateValue(username);
            control.updateValueAndValidity();
        });
        testing_1.it('null username should be null', function () {
            validator.usernameExists(control).subscribe(function (_result) {
                chai_1.expect(_result).to.be.null;
            });
            username = null;
            control.updateValue(username);
            control.updateValueAndValidity();
            isUsernameExistsResult.error('some error');
        });
        testing_1.it('undefined username should be null', function () {
            validator.usernameExists(control).subscribe(function (_result) {
                chai_1.expect(_result).to.be.null;
            });
            username = undefined;
            control.updateValue(username);
            control.updateValueAndValidity();
            isUsernameExistsResult.error('some error');
        });
        testing_1.it('empty username should be null', function () {
            validator.usernameExists(control).subscribe(function (_result) {
                chai_1.expect(_result).to.be.null;
            });
            username = '';
            control.updateValue(username);
            control.updateValueAndValidity();
            isUsernameExistsResult.error('some error');
        });
    });
});
//# sourceMappingURL=usernameExistsValidator.test.js.map