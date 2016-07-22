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
var userService_1 = require("../../../common/services/userService");
var core_1 = require('@angular/core');
var UserPermissionsSettingsComponent = (function () {
    function UserPermissionsSettingsComponent(userService) {
        this.userService = userService;
    }
    UserPermissionsSettingsComponent.prototype.ngOnInit = function () {
        this._loadUserPermissions();
    };
    UserPermissionsSettingsComponent.prototype.reloadUserPermissions = function () {
        this._loadUserPermissions();
    };
    UserPermissionsSettingsComponent.prototype._loadUserPermissions = function () {
        var _this = this;
        this.isLoadingUserPermissions = true;
        this.loadingUserPermissionsError = null;
        this.userPermissions = null;
        this.userService.getUserPermissions(this.userDetails.id)
            .finally(function () { return _this._setAsNotLoadingUSerPermissions(); })
            .subscribe(function (_permissions) { return _this._setUserPermissions(_permissions); }, function (_error) { return _this._setLoadingUserPermissionsError(_error); });
    };
    UserPermissionsSettingsComponent.prototype._setAsNotLoadingUSerPermissions = function () {
        this.isLoadingUserPermissions = false;
    };
    UserPermissionsSettingsComponent.prototype._setUserPermissions = function (permissions) {
        this.userPermissions = permissions;
    };
    UserPermissionsSettingsComponent.prototype._setLoadingUserPermissionsError = function (error) {
        this.loadingUserPermissionsError = error;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], UserPermissionsSettingsComponent.prototype, "userDetails", void 0);
    UserPermissionsSettingsComponent = __decorate([
        core_1.Component({
            selector: 'user-permissions-settings',
            template: require('./userPermissionsSettings.component.html'),
            styles: [require('./userPermissionsSettings.component.scss')],
        }), 
        __metadata('design:paramtypes', [userService_1.UserService])
    ], UserPermissionsSettingsComponent);
    return UserPermissionsSettingsComponent;
}());
exports.UserPermissionsSettingsComponent = UserPermissionsSettingsComponent;
//# sourceMappingURL=userPermissionsSettings.component.js.map