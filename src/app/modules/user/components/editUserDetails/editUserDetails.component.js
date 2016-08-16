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
var formComponentBase_1 = require("../../../common/components/formComponentBase/formComponentBase");
var circularLoading_component_1 = require("../../../common/components/circularLoading/circularLoading.component");
var editUserProfileModel_1 = require("../../models/editUserProfileModel");
var userService_1 = require("../../../common/services/userService");
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var usernameExistsValidator_1 = require("../../../common/validators/usernameExistsValidator");
var emailValidator_1 = require("../../../common/validators/emailValidator");
var EditUserDetailsComponent = (function (_super) {
    __extends(EditUserDetailsComponent, _super);
    function EditUserDetailsComponent(userService, formBuilder, usernameExistsValidatorFactory) {
        _super.call(this);
        this.userService = userService;
        this.formBuilder = formBuilder;
        this.usernameExistsValidatorFactory = usernameExistsValidatorFactory;
    }
    EditUserDetailsComponent.prototype.ngOnInit = function () {
        if (!this.userDetails) {
            throw 'userDetails is not set';
        }
        this.updatingUserDetails = false;
        this.isUserDetailsUpdated = false;
        this._initializeEditUserProfile();
    };
    EditUserDetailsComponent.prototype.ngOnDestroy = function () {
        this._usernameExistsValidator.destroy();
    };
    EditUserDetailsComponent.prototype.canUpdateUserDetails = function () {
        return this.userDetailsFormGroup.valid && this._isUserDetailsChanged();
    };
    EditUserDetailsComponent.prototype.updateUserDetails = function () {
        var _this = this;
        this.updatingUserDetails = true;
        this.updatingUserDetailsError = null;
        this.isUserDetailsUpdated = false;
        this.userService.updateUserDetails(this.userDetails.id, this.model.username, this.model.email, this.model.firstName, this.model.lastName)
            .finally(function () { return _this._setAsNotUpdatingUserDetails(); })
            .subscribe(function () { return _this._setUserDetailsAsUpdated(); }, function (error) { return _this._setUpdatingUserDetailsError(error); });
    };
    EditUserDetailsComponent.prototype._initializeEditUserProfile = function () {
        this.model = editUserProfileModel_1.EditUserProfile.fromUserDetails(this.userDetails);
        this._initializeFormGroup();
        setTimeout(function () { return Materialize.updateTextFields(); }, 0);
    };
    EditUserDetailsComponent.prototype._initializeFormGroup = function () {
        this._usernameExistsValidator =
            this.usernameExistsValidatorFactory.createWithAllowedUsers([this.model.username]);
        this.userDetailsFormGroup = this.formBuilder.group({
            username: [this.model.username, forms_1.Validators.required, this._usernameExistsValidator.isExists.bind(this._usernameExistsValidator)],
            email: [this.model.email, emailValidator_1.EmailValidator.mailFormat],
            firstName: [this.model.firstName, forms_1.Validators.required],
            lastName: [this.model.lastName, forms_1.Validators.required]
        });
        this._usernameExistsValidator.bindControl(this.userDetailsFormGroup.controls['username']);
    };
    EditUserDetailsComponent.prototype._isUserDetailsChanged = function () {
        return this.userDetails.username !== this.model.username ||
            this._isEmailDifferent() ||
            this.userDetails.firstName !== this.model.firstName ||
            this.userDetails.lastName !== this.model.lastName;
    };
    EditUserDetailsComponent.prototype._isEmailDifferent = function () {
        if (this.userDetails.email === this.model.email) {
            return false;
        }
        if (this._isNullUndefinedOrEmptyString(this.userDetails.email) &&
            this._isNullUndefinedOrEmptyString(this.model.email)) {
            return false;
        }
        return true;
    };
    EditUserDetailsComponent.prototype._isNullUndefinedOrEmptyString = function (value) {
        return value === null || value === undefined || value === '';
    };
    EditUserDetailsComponent.prototype._setAsNotUpdatingUserDetails = function () {
        this.updatingUserDetails = false;
    };
    EditUserDetailsComponent.prototype._setUpdatingUserDetailsError = function (error) {
        this.updatingUserDetailsError = error;
    };
    EditUserDetailsComponent.prototype._setUserDetailsAsUpdated = function () {
        this.userDetails.username = this.model.username;
        this.userDetails.email = this.model.email;
        this.userDetails.firstName = this.model.firstName;
        this.userDetails.lastName = this.model.lastName;
        this.isUserDetailsUpdated = true;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], EditUserDetailsComponent.prototype, "userDetails", void 0);
    EditUserDetailsComponent = __decorate([
        core_1.Component({
            selector: 'edit-user-details',
            template: require('./editUserDetails.component.html'),
            styles: [require('./_editUserDetails.component.scss')],
            directives: [forms_1.REACTIVE_FORM_DIRECTIVES, circularLoading_component_1.CircularLoadingComponent],
            providers: [forms_1.FormBuilder, usernameExistsValidator_1.UsernameExistsValidatorFactory]
        }), 
        __metadata('design:paramtypes', [userService_1.UserService, forms_1.FormBuilder, usernameExistsValidator_1.UsernameExistsValidatorFactory])
    ], EditUserDetailsComponent);
    return EditUserDetailsComponent;
}(formComponentBase_1.FormComponentBase));
exports.EditUserDetailsComponent = EditUserDetailsComponent;
//# sourceMappingURL=editUserDetails.component.js.map