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
var globalPermissionsNamePipe_1 = require("../../../common/pipes/globalPermissionsNamePipe");
var circularLoading_component_1 = require("../../../common/components/circularLoading/circularLoading.component");
var loadingComponentBase_1 = require("../../../common/components/loadingComponentBase/loadingComponentBase");
var userService_1 = require("../../../common/services/userService");
var core_1 = require('@angular/core');
var UpdateUserPermissionsComponent = (function (_super) {
    __extends(UpdateUserPermissionsComponent, _super);
    function UpdateUserPermissionsComponent(userService) {
        _super.call(this);
        this.userService = userService;
    }
    UpdateUserPermissionsComponent.prototype.canEditPermission = function (permission) {
        if (!this.userPermissionsRules) {
            return false;
        }
        var permissionRule = this.userPermissionsRules.find(function (_) { return _.value === permission.value; });
        return permissionRule.allowedToChange;
    };
    UpdateUserPermissionsComponent.prototype.setIsLoading = function (value) {
        this.isLoadingUserPermissionsRules = value;
    };
    UpdateUserPermissionsComponent.prototype.setLoadingError = function (error) {
        this.loadingUserPermissionsRulesError = error;
    };
    UpdateUserPermissionsComponent.prototype.setLoadingResult = function (result) {
        this.userPermissionsRules = result;
    };
    UpdateUserPermissionsComponent.prototype.get = function () {
        return this.userService.getUserPermissionsModificationRules();
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], UpdateUserPermissionsComponent.prototype, "userDetails", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], UpdateUserPermissionsComponent.prototype, "userPermissions", void 0);
    UpdateUserPermissionsComponent = __decorate([
        core_1.Component({
            selector: 'readonly-user-permissions',
            template: require('./updateUserPermissions.component.html'),
            styles: [require('./updateUserPermissions.component.scss')],
            directives: [circularLoading_component_1.CircularLoadingComponent],
            pipes: [globalPermissionsNamePipe_1.GlobalPermissionsNamePipe]
        }), 
        __metadata('design:paramtypes', [userService_1.UserService])
    ], UpdateUserPermissionsComponent);
    return UpdateUserPermissionsComponent;
}(loadingComponentBase_1.LoadingComponentBase));
exports.UpdateUserPermissionsComponent = UpdateUserPermissionsComponent;
//# sourceMappingURL=updateUserPermissions.component.js.map