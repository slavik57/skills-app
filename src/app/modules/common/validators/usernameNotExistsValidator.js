"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var existsValidatorBase_1 = require("./base/existsValidatorBase");
var userService_1 = require("../services/userService");
var core_1 = require('@angular/core');
var UsernameNotExistsValidator = (function (_super) {
    __extends(UsernameNotExistsValidator, _super);
    function UsernameNotExistsValidator(userService) {
        _super.call(this, [], 'usernameDoesNotExist', 'usernameDoesNotExistCheckFailed', existsValidatorBase_1.ExistsValidationMode.FAIL_IF_NOT_EXISTS);
        this.userService = userService;
    }
    UsernameNotExistsValidator.prototype.isValueExists = function (username) {
        return this.userService.isUsernameExists(username);
    };
    return UsernameNotExistsValidator;
}(existsValidatorBase_1.ExistsValidatorBase));
exports.UsernameNotExistsValidator = UsernameNotExistsValidator;
var UsernameNotExistsValidatorFactory = (function () {
    function UsernameNotExistsValidatorFactory(userService) {
        this.userService = userService;
    }
    UsernameNotExistsValidatorFactory.prototype.create = function () {
        return new UsernameNotExistsValidator(this.userService);
    };
    UsernameNotExistsValidatorFactory = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [userService_1.UserService])
    ], UsernameNotExistsValidatorFactory);
    return UsernameNotExistsValidatorFactory;
}());
exports.UsernameNotExistsValidatorFactory = UsernameNotExistsValidatorFactory;
//# sourceMappingURL=usernameNotExistsValidator.js.map