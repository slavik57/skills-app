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
var userPermissionsSettings_component_1 = require("../userPermissionsSettings/userPermissionsSettings.component");
var circularLoading_component_1 = require("../../../common/components/circularLoading/circularLoading.component");
var userService_1 = require("../../../common/services/userService");
var core_1 = require('@angular/core');
var UsersSettingsComponent = (function () {
    function UsersSettingsComponent(userService) {
        this.userService = userService;
    }
    UsersSettingsComponent.prototype.ngOnInit = function () {
        this._loadUserDetails();
    };
    UsersSettingsComponent.prototype.reloadUsersDetails = function () {
        this._loadUserDetails();
    };
    UsersSettingsComponent.prototype.selectUser = function (userDetails) {
        this.selectedUser = userDetails;
        $(this.userSettingsModal.nativeElement).openModal();
    };
    UsersSettingsComponent.prototype._loadUserDetails = function () {
        var _this = this;
        this.isLoadingUsers = true;
        this.loadingUsersError = null;
        this.usersDetails = null;
        this.selectedUser = null;
        this.userService.getUsersDetails()
            .finally(function () { return _this._setAsFinishedLoadingUsers(); })
            .subscribe(function (_usersDetails) { return _this._setUserDetails(_usersDetails); }, function (_error) { return _this._setGettingUsersError(_error); });
    };
    UsersSettingsComponent.prototype._setAsFinishedLoadingUsers = function () {
        this.isLoadingUsers = false;
    };
    UsersSettingsComponent.prototype._setUserDetails = function (usersDetails) {
        this.usersDetails = usersDetails;
    };
    UsersSettingsComponent.prototype._setGettingUsersError = function (error) {
        this.loadingUsersError = error;
    };
    __decorate([
        core_1.ViewChild('userDetailsList'), 
        __metadata('design:type', core_1.ElementRef)
    ], UsersSettingsComponent.prototype, "userDetailsList", void 0);
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
}());
exports.UsersSettingsComponent = UsersSettingsComponent;
//# sourceMappingURL=usersSettings.component.js.map