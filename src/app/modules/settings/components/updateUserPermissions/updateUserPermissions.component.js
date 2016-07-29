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
    function UpdateUserPermissionsComponent(userService, zone) {
        _super.call(this);
        this.userService = userService;
        this.zone = zone;
        this.cancelEvent = new core_1.EventEmitter();
        this.updatedUserPermissionsEvent = new core_1.EventEmitter();
    }
    UpdateUserPermissionsComponent.prototype.ngOnInit = function () {
        this.isSavingUserPermissions = false;
        this.savingUserPermissionsError = null;
        this._userPermissionAvailabilityMap = {};
        _super.prototype.ngOnInit.call(this);
    };
    UpdateUserPermissionsComponent.prototype.canEditPermission = function (permission) {
        if (!this.userPermissionsRules) {
            return false;
        }
        var permissionRule = this.userPermissionsRules.find(function (_) { return _.value === permission.value; });
        return permissionRule.allowedToChange;
    };
    UpdateUserPermissionsComponent.prototype.hasPermission = function (permission) {
        var userPermissionValues = this.userPermissions.map(function (_) { return _.value; });
        return userPermissionValues.indexOf(permission.value) >= 0;
    };
    UpdateUserPermissionsComponent.prototype.setPermission = function (permission, hasPermission) {
        this._userPermissionAvailabilityMap[permission.value] = hasPermission;
        this.zone.run(function () { });
    };
    UpdateUserPermissionsComponent.prototype.isPermissionsChanged = function () {
        if (!this.userPermissionsRules) {
            return false;
        }
        for (var _i = 0, _a = this.userPermissionsRules; _i < _a.length; _i++) {
            var permissionRule = _a[_i];
            var originalHasPermission = this.hasPermission(permissionRule);
            var currentHasPermission = this._userPermissionAvailabilityMap[permissionRule.value];
            if (originalHasPermission !== currentHasPermission) {
                return true;
            }
        }
        return false;
    };
    UpdateUserPermissionsComponent.prototype.savePermissions = function () {
        var _this = this;
        this._setSavingUserPermissions(true);
        this._setSavingUerPermissionsError(null);
        var permissionsToChange = this._getPermissionsToChange();
        this.userService.updateUserPermissions(this.userDetails.id, permissionsToChange.permissionsToAdd, permissionsToChange.permissionsToRemove)
            .finally(function () { return _this._setSavingUserPermissions(false); })
            .subscribe(function () { return _this._invalidateUserPermissionsAfterPermissionsUpdate(); }, function (_error) { return _this._setSavingUerPermissionsError(_error); });
    };
    UpdateUserPermissionsComponent.prototype.cancel = function () {
        this.cancelEvent.emit(null);
    };
    UpdateUserPermissionsComponent.prototype.setIsLoading = function (value) {
        this.isLoadingUserPermissionsRules = value;
    };
    UpdateUserPermissionsComponent.prototype.setLoadingError = function (error) {
        this.loadingUserPermissionsRulesError = error;
    };
    UpdateUserPermissionsComponent.prototype.setLoadingResult = function (result) {
        var _this = this;
        this.userPermissionsRules = result;
        if (!result) {
            return;
        }
        result.forEach(function (_permissionRule) {
            _this._userPermissionAvailabilityMap[_permissionRule.value] = _this.hasPermission(_permissionRule);
        });
    };
    UpdateUserPermissionsComponent.prototype.get = function () {
        return this.userService.getUserPermissionsModificationRules();
    };
    UpdateUserPermissionsComponent.prototype._setSavingUserPermissions = function (value) {
        this.isSavingUserPermissions = value;
    };
    UpdateUserPermissionsComponent.prototype._getPermissionsToChange = function () {
        var result = {
            permissionsToAdd: [],
            permissionsToRemove: []
        };
        for (var _i = 0, _a = this.userPermissionsRules; _i < _a.length; _i++) {
            var permissionRule = _a[_i];
            var originalHasPermission = this.hasPermission(permissionRule);
            var currentHasPermission = this._userPermissionAvailabilityMap[permissionRule.value];
            if (originalHasPermission && !currentHasPermission) {
                result.permissionsToRemove.push(permissionRule);
            }
            if (!originalHasPermission && currentHasPermission) {
                result.permissionsToAdd.push(permissionRule);
            }
        }
        return result;
    };
    UpdateUserPermissionsComponent.prototype._setSavingUerPermissionsError = function (error) {
        this.savingUserPermissionsError = error;
    };
    UpdateUserPermissionsComponent.prototype._invalidateUserPermissionsAfterPermissionsUpdate = function () {
        this.userPermissions = [];
        for (var _i = 0, _a = this.userPermissionsRules; _i < _a.length; _i++) {
            var permission = _a[_i];
            if (this._userPermissionAvailabilityMap[permission.value]) {
                this.userPermissions.push(permission);
            }
        }
        this.updatedUserPermissionsEvent.emit(null);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], UpdateUserPermissionsComponent.prototype, "userDetails", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], UpdateUserPermissionsComponent.prototype, "userPermissions", void 0);
    __decorate([
        core_1.Output('cancel'), 
        __metadata('design:type', core_1.EventEmitter)
    ], UpdateUserPermissionsComponent.prototype, "cancelEvent", void 0);
    __decorate([
        core_1.Output('updatedUserPermissions'), 
        __metadata('design:type', core_1.EventEmitter)
    ], UpdateUserPermissionsComponent.prototype, "updatedUserPermissionsEvent", void 0);
    UpdateUserPermissionsComponent = __decorate([
        core_1.Component({
            selector: 'update-user-permissions',
            template: require('./updateUserPermissions.component.html'),
            styles: [require('./updateUserPermissions.component.scss')],
            directives: [circularLoading_component_1.CircularLoadingComponent],
            pipes: [globalPermissionsNamePipe_1.GlobalPermissionsNamePipe]
        }), 
        __metadata('design:paramtypes', [userService_1.UserService, core_1.NgZone])
    ], UpdateUserPermissionsComponent);
    return UpdateUserPermissionsComponent;
}(loadingComponentBase_1.LoadingComponentBase));
exports.UpdateUserPermissionsComponent = UpdateUserPermissionsComponent;
//# sourceMappingURL=updateUserPermissions.component.js.map