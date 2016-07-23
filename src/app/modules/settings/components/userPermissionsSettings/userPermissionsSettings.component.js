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
var readonlyUserPermissions_component_1 = require("../readonlyUserPermissions/readonlyUserPermissions.component");
var circularLoading_component_1 = require("../../../common/components/circularLoading/circularLoading.component");
var core_1 = require('@angular/core');
(function (UserPermissionsSettingsState) {
    UserPermissionsSettingsState[UserPermissionsSettingsState["READONLY"] = 0] = "READONLY";
    UserPermissionsSettingsState[UserPermissionsSettingsState["UPDATE"] = 1] = "UPDATE";
})(exports.UserPermissionsSettingsState || (exports.UserPermissionsSettingsState = {}));
var UserPermissionsSettingsState = exports.UserPermissionsSettingsState;
var UserPermissionsSettingsComponent = (function () {
    function UserPermissionsSettingsComponent() {
    }
    UserPermissionsSettingsComponent.prototype.ngOnInit = function () {
        this.UserPermissionsSettingsState = UserPermissionsSettingsState;
        this.state = UserPermissionsSettingsState.READONLY;
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
            directives: [circularLoading_component_1.CircularLoadingComponent, readonlyUserPermissions_component_1.ReadonlyUserPermissionsComponent],
        }), 
        __metadata('design:paramtypes', [])
    ], UserPermissionsSettingsComponent);
    return UserPermissionsSettingsComponent;
}());
exports.UserPermissionsSettingsComponent = UserPermissionsSettingsComponent;
//# sourceMappingURL=userPermissionsSettings.component.js.map