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
var locationService_1 = require("../../../common/services/locationService");
var circularLoading_component_1 = require("../../../common/components/circularLoading/circularLoading.component");
var userService_1 = require("../../../common/services/userService");
var signinModel_1 = require("../../../models/signinModel");
var core_1 = require('@angular/core');
var router_deprecated_1 = require('@angular/router-deprecated');
var common_1 = require('@angular/common');
var SigninComponent = (function () {
    function SigninComponent(userService, locationService) {
        this.userService = userService;
        this.locationService = locationService;
        this.error = null;
        this.model = new signinModel_1.SigninModel();
        this.submitting = false;
    }
    SigninComponent.prototype.onSubmit = function () {
        var _this = this;
        this.submitting = true;
        this.error = null;
        this.userService.signinUser(this.model.username, this.model.password)
            .finally(function () { return _this._submitted(); })
            .subscribe(function (_redirectLocation) { return _this._redirect(_redirectLocation); }, function (_error) { return _this._setError(_error); });
    };
    SigninComponent.prototype._redirect = function (redirectPath) {
        this.locationService.goToUrl(redirectPath);
    };
    SigninComponent.prototype._setError = function (_error) {
        this.error = _error;
    };
    SigninComponent.prototype._submitted = function () {
        this.submitting = false;
    };
    SigninComponent = __decorate([
        core_1.Component({
            selector: 'signin',
            template: require('./signin.component.html'),
            styles: [require('./_signin.component.scss')],
            directives: [router_deprecated_1.ROUTER_DIRECTIVES, common_1.NgClass, circularLoading_component_1.CircularLoadingComponent],
            providers: [userService_1.UserService, locationService_1.LocationService]
        }), 
        __metadata('design:paramtypes', [userService_1.UserService, locationService_1.LocationService])
    ], SigninComponent);
    return SigninComponent;
}());
exports.SigninComponent = SigninComponent;
//# sourceMappingURL=signin.component.js.map