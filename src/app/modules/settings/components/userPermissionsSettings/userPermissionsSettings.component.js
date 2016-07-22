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
var circularLoading_component_1 = require("../../../common/components/circularLoading/circularLoading.component");
var loadingComponentBase_1 = require("../../../common/components/loadingComponentBase/loadingComponentBase");
var userService_1 = require("../../../common/services/userService");
var core_1 = require('@angular/core');
var UserPermissionsSettingsComponent = (function (_super) {
    __extends(UserPermissionsSettingsComponent, _super);
    function UserPermissionsSettingsComponent(userService) {
        _super.call(this);
        this.userService = userService;
    }
    UserPermissionsSettingsComponent.prototype.setIsLoading = function (value) {
        this.isLoadingUserPermissions = value;
    };
    UserPermissionsSettingsComponent.prototype.setLoadingError = function (error) {
        this.loadingUserPermissionsError = error;
    };
    UserPermissionsSettingsComponent.prototype.setLoadingResult = function (result) {
        this.userPermissions = result;
    };
    UserPermissionsSettingsComponent.prototype.get = function () {
        return this.userService.getUserPermissions(this.userDetails.id);
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
            directives: [circularLoading_component_1.CircularLoadingComponent]
        }), 
        __metadata('design:paramtypes', [userService_1.UserService])
    ], UserPermissionsSettingsComponent);
    return UserPermissionsSettingsComponent;
}(loadingComponentBase_1.LoadingComponentBase));
exports.UserPermissionsSettingsComponent = UserPermissionsSettingsComponent;
//# sourceMappingURL=userPermissionsSettings.component.js.map