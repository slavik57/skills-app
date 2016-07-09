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
var formComponentBase_1 = require("../../common/components/formComponentBase/formComponentBase");
var circularLoading_component_1 = require("../../common/components/circularLoading/circularLoading.component");
var editUserProfileModel_1 = require("../models/editUserProfileModel");
var userService_1 = require("../../common/services/userService");
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var UserProfileComponent = (function (_super) {
    __extends(UserProfileComponent, _super);
    function UserProfileComponent(userService) {
        _super.call(this);
        this.userService = userService;
    }
    UserProfileComponent.prototype.ngOnInit = function () {
        this.loadUserDetails();
    };
    UserProfileComponent.prototype.canReloadUserDetails = function () {
        return !this.gettingUserDetails &&
            !!this.gettingUserDetailsError;
    };
    UserProfileComponent.prototype.loadUserDetails = function () {
        var _this = this;
        this.gettingUserDetailsError = null;
        this.gettingUserDetails = true;
        this.userService.getUserDetails()
            .finally(function () { return _this._setAsNotGettingUserDetails(); })
            .subscribe(function (userDetails) { return _this._initializeEditUserProfileModel(userDetails); }, function (error) { return _this._setGettingUserDetailsError(error); });
    };
    UserProfileComponent.prototype._setAsNotGettingUserDetails = function () {
        this.gettingUserDetails = false;
    };
    UserProfileComponent.prototype._initializeEditUserProfileModel = function (userDetails) {
        this.model = editUserProfileModel_1.EditUserProfile.fromUserDetails(userDetails);
        setTimeout(function () { return Materialize.updateTextFields(); }, 0);
    };
    UserProfileComponent.prototype._setGettingUserDetailsError = function (error) {
        this.gettingUserDetailsError = error;
    };
    UserProfileComponent = __decorate([
        core_1.Component({
            selector: 'user-profile',
            template: require('./userProfile.component.html'),
            styles: [require('./_userProfile.component.scss')],
            directives: [forms_1.REACTIVE_FORM_DIRECTIVES, circularLoading_component_1.CircularLoadingComponent]
        }), 
        __metadata('design:paramtypes', [userService_1.UserService])
    ], UserProfileComponent);
    return UserProfileComponent;
}(formComponentBase_1.FormComponentBase));
exports.UserProfileComponent = UserProfileComponent;
//# sourceMappingURL=userProfile.component.js.map