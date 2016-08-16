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
var circularLoading_component_1 = require("../../../common/components/circularLoading/circularLoading.component");
var userService_1 = require("../../../common/services/userService");
var changeUserPassword_component_1 = require("../changeUserPassword/changeUserPassword.component");
var editUserDetails_component_1 = require("../editUserDetails/editUserDetails.component");
var core_1 = require('@angular/core');
var UserProfileComponent = (function (_super) {
    __extends(UserProfileComponent, _super);
    function UserProfileComponent(userService) {
        _super.call(this);
        this.userService = userService;
    }
    UserProfileComponent.prototype.get = function () {
        return this.userService.getUserDetails();
    };
    UserProfileComponent.prototype.setIsLoading = function (value) {
        this.gettingUserDetails = value;
    };
    UserProfileComponent.prototype.setLoadingResult = function (userDetails) {
        this.userDetails = userDetails;
    };
    UserProfileComponent.prototype.setLoadingError = function (error) {
        this.gettingUserDetailsError = error;
    };
    UserProfileComponent = __decorate([
        core_1.Component({
            selector: 'user-profile',
            template: require('./userProfile.component.html'),
            styles: [require('./_userProfile.component.scss')],
            directives: [editUserDetails_component_1.EditUserDetailsComponent, changeUserPassword_component_1.ChangeUserPasswordComponent, circularLoading_component_1.CircularLoadingComponent],
        }), 
        __metadata('design:paramtypes', [userService_1.UserService])
    ], UserProfileComponent);
    return UserProfileComponent;
}(loadingComponentBase_1.LoadingComponentBase));
exports.UserProfileComponent = UserProfileComponent;
//# sourceMappingURL=userProfile.component.js.map