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
var usernameExistsValidator_1 = require("../../common/validators/usernameExistsValidator");
var emailValidator_1 = require("../../common/validators/emailValidator");
var UserProfileComponent = (function (_super) {
    __extends(UserProfileComponent, _super);
    function UserProfileComponent(userService, formBuilder, usernameExistsValidatorFactory) {
        _super.call(this);
        this.userService = userService;
        this.formBuilder = formBuilder;
        this.usernameExistsValidatorFactory = usernameExistsValidatorFactory;
    }
    UserProfileComponent.prototype.ngOnInit = function () {
        this.updatingUserDetails = false;
        this.loadUserDetails();
    };
    UserProfileComponent.prototype.loadUserDetails = function () {
        var _this = this;
        this.gettingUserDetailsError = null;
        this.gettingUserDetails = true;
        this.userService.getUserDetails()
            .finally(function () { return _this._setAsNotGettingUserDetails(); })
            .subscribe(function (userDetails) { return _this._initializeEditUserProfile(userDetails); }, function (error) { return _this._setGettingUserDetailsError(error); });
    };
    UserProfileComponent.prototype.canUpdateUserDetails = function () {
        return this.userDetailsFormGroup.valid && this._isUserDetailsChanged();
    };
    UserProfileComponent.prototype.updateUserDetails = function () {
        var _this = this;
        this.updatingUserDetails = true;
        this.updatingUserDetailsError = null;
        this.userService.updateUserDetails(this._originalUserDetails.id, this.model.username, this.model.email, this.model.firstName, this.model.lastName)
            .finally(function () { return _this._setAsNotUpdatingUserDetails(); })
            .subscribe(function () { }, function (error) { return _this._setUpdatingUserDetailsError(error); });
    };
    UserProfileComponent.prototype._setAsNotGettingUserDetails = function () {
        this.gettingUserDetails = false;
    };
    UserProfileComponent.prototype._initializeEditUserProfile = function (userDetails) {
        this._originalUserDetails = userDetails;
        this.model = editUserProfileModel_1.EditUserProfile.fromUserDetails(userDetails);
        this._initializeFormGroup();
        setTimeout(function () { return Materialize.updateTextFields(); }, 0);
    };
    UserProfileComponent.prototype._setGettingUserDetailsError = function (error) {
        this.gettingUserDetailsError = error;
    };
    UserProfileComponent.prototype._initializeFormGroup = function () {
        var usernameExistsValidator = this.usernameExistsValidatorFactory.createWithAllowedUsers([this.model.username]);
        this.userDetailsFormGroup = this.formBuilder.group({
            username: [this.model.username, forms_1.Validators.required, usernameExistsValidator.usernameExists.bind(usernameExistsValidator)],
            email: [this.model.email, emailValidator_1.EmailValidator.mailFormat],
            firstName: [this.model.firstName, forms_1.Validators.required],
            lastName: [this.model.lastName, forms_1.Validators.required]
        });
        usernameExistsValidator.bindControl(this.userDetailsFormGroup.controls['username']);
    };
    UserProfileComponent.prototype._isUserDetailsChanged = function () {
        return this._originalUserDetails.username !== this.model.username ||
            this._isEmailDifferent() ||
            this._originalUserDetails.firstName !== this.model.firstName ||
            this._originalUserDetails.lastName !== this.model.lastName;
    };
    UserProfileComponent.prototype._isEmailDifferent = function () {
        if (this._originalUserDetails.email === this.model.email) {
            return false;
        }
        if (this._isNullUndefinedOrEmptyString(this._originalUserDetails.email) &&
            this._isNullUndefinedOrEmptyString(this.model.email)) {
            return false;
        }
        return true;
    };
    UserProfileComponent.prototype._isNullUndefinedOrEmptyString = function (value) {
        return value === null || value === undefined || value === '';
    };
    UserProfileComponent.prototype._setAsNotUpdatingUserDetails = function () {
        this.updatingUserDetails = false;
    };
    UserProfileComponent.prototype._setUpdatingUserDetailsError = function (error) {
        this.updatingUserDetailsError = error;
    };
    UserProfileComponent = __decorate([
        core_1.Component({
            selector: 'user-profile',
            template: require('./userProfile.component.html'),
            styles: [require('./_userProfile.component.scss')],
            directives: [forms_1.REACTIVE_FORM_DIRECTIVES, circularLoading_component_1.CircularLoadingComponent],
            providers: [forms_1.FormBuilder, usernameExistsValidator_1.UsernameExistsValidatorFactory]
        }), 
        __metadata('design:paramtypes', [userService_1.UserService, forms_1.FormBuilder, usernameExistsValidator_1.UsernameExistsValidatorFactory])
    ], UserProfileComponent);
    return UserProfileComponent;
}(formComponentBase_1.FormComponentBase));
exports.UserProfileComponent = UserProfileComponent;
//# sourceMappingURL=userProfile.component.js.map