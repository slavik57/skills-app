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
var loadingComponentBase_1 = require("../../../common/components/loadingComponentBase/loadingComponentBase");
var userPermissionsSettings_component_1 = require("../userPermissionsSettings/userPermissionsSettings.component");
var circularLoading_component_1 = require("../../../common/components/circularLoading/circularLoading.component");
var userService_1 = require("../../../common/services/userService");
var core_1 = require('@angular/core');
var UsersSettingsComponent = (function (_super) {
    __extends(UsersSettingsComponent, _super);
    function UsersSettingsComponent(userService) {
        _super.call(this);
        this.userService = userService;
    }
    UsersSettingsComponent.prototype.selectUser = function (userDetails) {
        this.selectedUser = userDetails;
        $(this.userSettingsModal.nativeElement).openModal();
    };
    UsersSettingsComponent.prototype.load = function () {
        this.selectedUser = null;
        _super.prototype.load.call(this);
    };
    UsersSettingsComponent.prototype.get = function () {
        return this.userService.getUsersDetails();
    };
    UsersSettingsComponent.prototype.setIsLoading = function (value) {
        this.isLoadingUsers = value;
    };
    UsersSettingsComponent.prototype.setLoadingResult = function (usersDetails) {
        this.usersDetails = usersDetails;
    };
    UsersSettingsComponent.prototype.setLoadingError = function (error) {
        this.loadingUsersError = error;
    };
    __decorate([
        core_1.ViewChild('userSettingsModal'), 
        __metadata('design:type', core_1.ElementRef)
    ], UsersSettingsComponent.prototype, "userSettingsModal", void 0);
    UsersSettingsComponent = __decorate([
        core_1.Component({
            selector: 'users-settings',
            template: require('./usersSettings.component.html'),
            styles: [require('./usersSettings.component.scss')],
            directives: [circularLoading_component_1.CircularLoadingComponent, userPermissionsSettings_component_1.UserPermissionsSettingsComponent]
        }), 
        __metadata('design:paramtypes', [userService_1.UserService])
    ], UsersSettingsComponent);
    return UsersSettingsComponent;
}(loadingComponentBase_1.LoadingComponentBase));
exports.UsersSettingsComponent = UsersSettingsComponent;
//# sourceMappingURL=usersSettings.component.js.map