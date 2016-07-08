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
var editUserProfileModel_1 = require("../models/editUserProfileModel");
var userService_1 = require("../../common/services/userService");
var core_1 = require('@angular/core');
var UserProfileComponent = (function () {
    function UserProfileComponent(userService) {
        this.userService = userService;
    }
    UserProfileComponent.prototype.ngOnInit = function () {
        this.loadUserDetails();
    };
    UserProfileComponent.prototype.canReloadUserDetails = function () {
        return !this.gettingUserDetails &&
            !!this.gettingUserDetailsError;
    };
    UserProfileComponent.prototype.loadUserDetails = function () {
        var _this = this;
        this.gettingUserDetailsError = null;
        this.gettingUserDetails = true;
        this.userService.getUserDetails()
            .finally(function () { return _this._setAsNotGettingUserDetails(); })
            .subscribe(function (userDetails) { return _this._initializeEditUserProfileModel(userDetails); }, function (error) { return _this._setGettingUserDetailsError(error); });
    };
    UserProfileComponent.prototype._setAsNotGettingUserDetails = function () {
        this.gettingUserDetails = false;
    };
    UserProfileComponent.prototype._initializeEditUserProfileModel = function (userDetails) {
        this.editUserProfileModel = editUserProfileModel_1.EditUserProfile.fromUserDetails(userDetails);
    };
    UserProfileComponent.prototype._setGettingUserDetailsError = function (error) {
        this.gettingUserDetailsError = error;
    };
    UserProfileComponent = __decorate([
        core_1.Component({
            selector: 'user-profile',
            template: require('./userProfile.component.html'),
            styles: [require('./_userProfile.component.scss')],
        }), 
        __metadata('design:paramtypes', [userService_1.UserService])
    ], UserProfileComponent);
    return UserProfileComponent;
}());
exports.UserProfileComponent = UserProfileComponent;
//# sourceMappingURL=userProfile.component.js.map