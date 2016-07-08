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
var locationService_1 = require("../../../common/services/locationService");
var userService_1 = require("../../../common/services/userService");
var circularLoading_component_1 = require("../../../common/components/circularLoading/circularLoading.component");
var usernameExistsValidator_1 = require("../../../common/validators/usernameExistsValidator");
var equalFieldsValidator_1 = require("../../../common/validators/equalFieldsValidator");
var formComponentBase_1 = require("../../../common/components/formComponentBase/formComponentBase");
var emailValidator_1 = require("../../../common/validators/emailValidator");
var registerModel_1 = require("../../models/registerModel");
var core_1 = require('@angular/core');
var router_deprecated_1 = require('@angular/router-deprecated');
var forms_1 = require('@angular/forms');
var RegisterComponent = (function (_super) {
    __extends(RegisterComponent, _super);
    function RegisterComponent(formBuilder, usernameExistsValidatorFactory, userService, locationService) {
        _super.call(this);
        this.formBuilder = formBuilder;
        this.usernameExistsValidatorFactory = usernameExistsValidatorFactory;
        this.userService = userService;
        this.locationService = locationService;
        this.error = undefined;
        this.submitting = false;
        this.model = new registerModel_1.RegisterModel();
    }
    RegisterComponent.prototype.ngOnInit = function () {
        this.passwordsGroup = this.formBuilder.group({
            password: ['', forms_1.Validators.required],
            repeatPassword: ['', forms_1.Validators.required]
        }, {
            validator: equalFieldsValidator_1.EqualFieldsValidator.allFieldsEqual
        });
        var usernameExistsValidator = this.usernameExistsValidatorFactory.create();
        this.registerFormGroup = this.formBuilder.group({
            username: ['', forms_1.Validators.required, usernameExistsValidator.usernameExists.bind(usernameExistsValidator)],
            firstName: ['', forms_1.Validators.required],
            passwordsGroup: this.passwordsGroup,
            lastName: ['', forms_1.Validators.required],
            email: ['', emailValidator_1.EmailValidator.mailFormat]
        });
        usernameExistsValidator.bindControl(this.registerFormGroup.controls['username']);
    };
    RegisterComponent.prototype.onSubmit = function () {
        var _this = this;
        this.submitting = true;
        this.error = null;
        this.userService.registerUser(this.model.username, this.model.password, this.model.email, this.model.firstName, this.model.lastName)
            .subscribe(function (_redirectLocation) { return _this._redirect(_redirectLocation); }, function (_error) { return _this._finishRegistrationWithError(_error); });
    };
    RegisterComponent.prototype._redirect = function (redirectPath) {
        this.locationService.goToUrl(redirectPath);
    };
    RegisterComponent.prototype._finishRegistrationWithError = function (_error) {
        this._submitted();
        this.error = _error;
    };
    RegisterComponent.prototype._submitted = function () {
        this.submitting = false;
    };
    RegisterComponent = __decorate([
        core_1.Component({
            selector: 'register',
            template: require('./register.component.html'),
            styles: [require('./_register.component.scss')],
            directives: [router_deprecated_1.ROUTER_DIRECTIVES, forms_1.REACTIVE_FORM_DIRECTIVES, circularLoading_component_1.CircularLoadingComponent],
            providers: [forms_1.FormBuilder, usernameExistsValidator_1.UsernameExistsValidatorFactory]
        }), 
        __metadata('design:paramtypes', [forms_1.FormBuilder, usernameExistsValidator_1.UsernameExistsValidatorFactory, userService_1.UserService, locationService_1.LocationService])
    ], RegisterComponent);
    return RegisterComponent;
}(formComponentBase_1.FormComponentBase));
exports.RegisterComponent = RegisterComponent;
//# sourceMappingURL=register.component.js.map