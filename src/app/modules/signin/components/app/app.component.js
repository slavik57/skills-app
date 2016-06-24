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
var credits_component_1 = require("../../../common/components/credits/credits.component");
var register_component_1 = require("../register/register.component");
var signin_component_1 = require("../signin/signin.component");
var navigation_component_1 = require("../../../common/components/navigation/navigation.component");
var core_1 = require('@angular/core');
var router_deprecated_1 = require('@angular/router-deprecated');
var _ = require('lodash');
var AppComponent = (function () {
    function AppComponent() {
    }
    AppComponent = __decorate([
        core_1.Component({
            selector: 'signin-app',
            template: require('./app.component.html'),
            styles: [require('./_app.component.scss')],
            directives: _.union(router_deprecated_1.ROUTER_DIRECTIVES, [navigation_component_1.NavigationComponent, credits_component_1.CreditsComponent]),
            providers: [
                router_deprecated_1.ROUTER_PROVIDERS
            ]
        }),
        router_deprecated_1.RouteConfig([
            {
                path: '/',
                name: 'Signin',
                component: signin_component_1.SigninComponent
            },
            {
                path: '/register',
                name: 'Register',
                component: register_component_1.RegisterComponent
            }
        ]), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map