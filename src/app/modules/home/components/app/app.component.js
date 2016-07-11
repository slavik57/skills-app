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
var userProfile_component_1 = require("../../../user/components/userProfile/userProfile.component");
var home_component_1 = require("../home/home.component");
var core_1 = require('@angular/core');
var navigation_component_1 = require("../../../common/components/navigation/navigation.component");
var credits_component_1 = require("../../../common/components/credits/credits.component");
var router_deprecated_1 = require('@angular/router-deprecated');
var http_1 = require('@angular/http');
var userService_1 = require("../../../common/services/userService");
var _ = require('lodash');
var AppComponent = (function () {
    function AppComponent() {
    }
    AppComponent = __decorate([
        core_1.Component({
            selector: 'skills-app',
            template: require('./app.component.html'),
            styles: [require('./_app.component.scss')],
            directives: _.union(router_deprecated_1.ROUTER_DIRECTIVES, [navigation_component_1.NavigationComponent, credits_component_1.CreditsComponent]),
            providers: [
                router_deprecated_1.ROUTER_PROVIDERS,
                http_1.HTTP_PROVIDERS,
                userService_1.UserService
            ]
        }),
        router_deprecated_1.RouteConfig([
            {
                path: '/',
                name: 'Home',
                component: home_component_1.HomeComponent
            },
            {
                path: '/profile',
                name: 'UserProfile',
                component: userProfile_component_1.UserProfileComponent
            },
            {
                path: '/settings',
                name: 'Settings',
                component: home_component_1.HomeComponent
            },
            {
                path: '/skillsPrerequisites',
                name: 'SkillsPrerequisites',
                component: home_component_1.HomeComponent
            },
            {
                path: '/skills',
                name: 'Skills',
                component: home_component_1.HomeComponent
            },
            {
                path: '/teams',
                name: 'Teams',
                component: home_component_1.HomeComponent
            }
        ]), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map