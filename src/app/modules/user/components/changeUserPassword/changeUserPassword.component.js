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
var equalFieldsValidator_1 = require("../../../common/validators/equalFieldsValidator");
var circularLoading_component_1 = require("../../../common/components/circularLoading/circularLoading.component");
var editUserPasswordModel_1 = require("../../models/editUserPasswordModel");
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var userService_1 = require("../../../common/services/userService");
var ChangeUserPasswordComponent = (function (_super) {
    __extends(ChangeUserPasswordComponent, _super);
    function ChangeUserPasswordComponent(formBuilder, userService) {
        _super.call(this);
        this.formBuilder = formBuilder;
        this.userService = userService;
    }
    ChangeUserPasswordComponent.prototype.ngOnInit = function () {
        if (!this.userIdDetails) {
            throw 'userIdDetails is not set';
        }
        if (this.shouldShowTitle === undefined) {
            this.shouldShowTitle = true;
        }
        if (this.shouldVerifyCurrentPassword === undefined) {
            this.shouldVerifyCurrentPassword = true;
        }
        if (this.showInCard === undefined) {
            this.showInCard = true;
        }
        this.isPasswordUpdated = false;
        this.isUpdatingPassword = false;
        this._createEmptyModel();
        this._createEmptyForm();
    };
    ChangeUserPasswordComponent.prototype.changeUserPassword = function () {
        var _this = this;
        this.updateUserPasswordError = null;
        this.isUpdatingPassword = true;
        this.isPasswordUpdated = false;
        this.userService.updateUserPassword(this.userIdDetails.id, this.model.password, this.model.newPassword)
            .finally(function () { return _this._setAsFinishedUpdatingPassword(); })
            .subscribe(function () { return _this._setAsPasswordUpdated(); }, function (error) { return _this._setUpdatingUserPasswordError(error); });
    };
    ChangeUserPasswordComponent.prototype._createEmptyModel = function () {
        this.model = new editUserPasswordModel_1.EditUserPasswordModel();
    };
    ChangeUserPasswordComponent.prototype._createEmptyForm = function () {
        this.newPasswordsGroup = this.formBuilder.group({
            newPassword: ['', forms_1.Validators.required],
            newPasswordRepeated: ['', forms_1.Validators.required]
        }, {
            validator: equalFieldsValidator_1.EqualFieldsValidator.allFieldsEqual
        });
        var passwordDefinition = [''];
        if (this.shouldVerifyCurrentPassword) {
            passwordDefinition.push(forms_1.Validators.required);
        }
        this.userPasswordFormGroup = this.formBuilder.group({
            password: passwordDefinition,
            newPasswordsGroup: this.newPasswordsGroup
        });
    };
    ChangeUserPasswordComponent.prototype._setAsFinishedUpdatingPassword = function () {
        this.isUpdatingPassword = false;
    };
    ChangeUserPasswordComponent.prototype._setAsPasswordUpdated = function () {
        this.isPasswordUpdated = true;
        this.model.password = '';
        this.model.newPassword = '';
        this.model.newPasswordRepeated = '';
        this.resetControlAsUntouchedAndNotDirty(this.userPasswordFormGroup.controls['password']);
        this.resetControlAsUntouchedAndNotDirty(this.newPasswordsGroup.controls['newPassword']);
        this.resetControlAsUntouchedAndNotDirty(this.newPasswordsGroup.controls['newPasswordRepeated']);
        setTimeout(function () { return Materialize.updateTextFields(); }, 0);
    };
    ChangeUserPasswordComponent.prototype._setUpdatingUserPasswordError = function (error) {
        this.updateUserPasswordError = error;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ChangeUserPasswordComponent.prototype, "userIdDetails", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], ChangeUserPasswordComponent.prototype, "shouldVerifyCurrentPassword", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], ChangeUserPasswordComponent.prototype, "shouldShowTitle", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], ChangeUserPasswordComponent.prototype, "showInCard", void 0);
    ChangeUserPasswordComponent = __decorate([
        core_1.Component({
            selector: 'change-user-password',
            template: require('./changeUserPassword.component.html'),
            styles: [require('./changeUserPassword.component.scss')],
            directives: [forms_1.REACTIVE_FORM_DIRECTIVES, circularLoading_component_1.CircularLoadingComponent],
            providers: [forms_1.FormBuilder]
        }), 
        __metadata('design:paramtypes', [forms_1.FormBuilder, userService_1.UserService])
    ], ChangeUserPasswordComponent);
    return ChangeUserPasswordComponent;
}(formComponentBase_1.FormComponentBase));
exports.ChangeUserPasswordComponent = ChangeUserPasswordComponent;
//# sourceMappingURL=changeUserPassword.component.js.map