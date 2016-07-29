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
var core_1 = require('@angular/core');
var userPermissionsSettings_component_1 = require("../userPermissionsSettings/userPermissionsSettings.component");
var UserSettingsComponent = (function () {
    function UserSettingsComponent() {
    }
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], UserSettingsComponent.prototype, "userDetails", void 0);
    UserSettingsComponent = __decorate([
        core_1.Component({
            selector: 'user-settings',
            template: require('./userSettings.component.html'),
            styles: [require('./userSettings.component.scss')],
            directives: [userPermissionsSettings_component_1.UserPermissionsSettingsComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], UserSettingsComponent);
    return UserSettingsComponent;
}());
exports.UserSettingsComponent = UserSettingsComponent;
//# sourceMappingURL=userSettings.component.js.map