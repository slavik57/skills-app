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
var globalPermissions_1 = require("../enums/globalPermissions");
var core_1 = require('@angular/core');
var GlobalPermissionsNamePipe = (function () {
    function GlobalPermissionsNamePipe() {
    }
    GlobalPermissionsNamePipe.prototype.transform = function (value) {
        var permission = globalPermissions_1.GlobalPermission[value];
        switch (permission) {
            case globalPermissions_1.GlobalPermission.ADMIN:
                return 'Admin - Can do anything';
            case globalPermissions_1.GlobalPermission.TEAMS_LIST_ADMIN:
                return 'Teams list admin - Can create/destroy teams';
            case globalPermissions_1.GlobalPermission.SKILLS_LIST_ADMIN:
                return 'Skills list admin - Can create/destroy skills';
            case globalPermissions_1.GlobalPermission.READER:
                return 'Reader - Registered user';
            case globalPermissions_1.GlobalPermission.GUEST:
                return 'Guest - Unregistered user';
            default:
                return value + ' - Unknown permission';
        }
    };
    GlobalPermissionsNamePipe = __decorate([
        core_1.Pipe({ name: 'globalPermissionsName' }), 
        __metadata('design:paramtypes', [])
    ], GlobalPermissionsNamePipe);
    return GlobalPermissionsNamePipe;
}());
exports.GlobalPermissionsNamePipe = GlobalPermissionsNamePipe;
//# sourceMappingURL=globalPermissionsNamePipe.js.map