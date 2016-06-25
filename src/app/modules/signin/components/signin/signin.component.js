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
var signinModel_1 = require("../../../models/signinModel");
var core_1 = require('@angular/core');
var router_deprecated_1 = require('@angular/router-deprecated');
var common_1 = require('@angular/common');
var SigninComponent = (function () {
    function SigninComponent() {
        this.model = new signinModel_1.SigninModel();
        this.submitting = false;
    }
    SigninComponent.prototype.onSubmit = function () {
        var _this = this;
        this.submitting = true;
        setTimeout(function () { return _this.submitting = false; }, 2000);
    };
    SigninComponent = __decorate([
        core_1.Component({
            selector: 'signin',
            template: require('./signin.component.html'),
            styles: [require('./_signin.component.scss')],
            directives: [router_deprecated_1.ROUTER_DIRECTIVES, common_1.NgClass]
        }), 
        __metadata('design:paramtypes', [])
    ], SigninComponent);
    return SigninComponent;
}());
exports.SigninComponent = SigninComponent;
//# sourceMappingURL=signin.component.js.map