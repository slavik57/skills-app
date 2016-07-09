"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var userService_1 = require("../services/userService");
var core_1 = require('@angular/core');
var Observable_1 = require('rxjs/Observable');
var UsernameExistsValidator = (function () {
    function UsernameExistsValidator(allowedUsernames, userService) {
        this.allowedUsernames = allowedUsernames;
        this.userService = userService;
    }
    UsernameExistsValidator.prototype.bindControl = function (control) {
        var _this = this;
        control.valueChanges
            .debounceTime(2000)
            .subscribe(function (username) {
            if (!_this._subscriber) {
                return;
            }
            if (!username) {
                _this._resolveSubscriber(_this._subscriber, null);
                return;
            }
            _this.userService.isUsernameExists(username)
                .subscribe(function (isUsernameExist) { return _this._handleResult(isUsernameExist, _this._subscriber); }, function (error) { return _this._handleError(error, _this._subscriber); });
        });
    };
    UsernameExistsValidator.prototype.usernameExists = function (control) {
        var _this = this;
        return new Observable_1.Observable(function (subscriber) {
            if (_this.allowedUsernames.indexOf(control.value) >= 0) {
                _this._subscriber = null;
                _this._resolveSubscriber(subscriber, null);
                return;
            }
            _this._subscriber = subscriber;
        });
    };
    UsernameExistsValidator.prototype._handleResult = function (isUsernameExist, subscriber) {
        if (!isUsernameExist) {
            this._resolveSubscriber(subscriber, null);
        }
        else {
            var validationErrorResult = { 'usernameTaken': true };
            this._resolveSubscriber(subscriber, validationErrorResult);
        }
    };
    UsernameExistsValidator.prototype._handleError = function (error, subscriber) {
        var validationFailedErrorResult = { 'usernameTakenCheckFailed': true };
        this._resolveSubscriber(subscriber, validationFailedErrorResult);
    };
    UsernameExistsValidator.prototype._resolveSubscriber = function (subscriber, value) {
        subscriber.next(value);
        subscriber.complete();
    };
    return UsernameExistsValidator;
}());
exports.UsernameExistsValidator = UsernameExistsValidator;
var UsernameExistsValidatorFactory = (function () {
    function UsernameExistsValidatorFactory(userService) {
        this.userService = userService;
    }
    UsernameExistsValidatorFactory.prototype.create = function () {
        return new UsernameExistsValidator([], this.userService);
    };
    UsernameExistsValidatorFactory.prototype.createWithAllowedUsers = function (usernames) {
        return new UsernameExistsValidator(usernames, this.userService);
    };
    UsernameExistsValidatorFactory = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [userService_1.UserService])
    ], UsernameExistsValidatorFactory);
    return UsernameExistsValidatorFactory;
}());
exports.UsernameExistsValidatorFactory = UsernameExistsValidatorFactory;
//# sourceMappingURL=usernameExistsValidator.js.map