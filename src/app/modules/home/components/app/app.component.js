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
var settings_component_1 = require("../../../settings/components/settings/settings.component");
var home_component_1 = require("../home/home.component");
var userProfile_component_1 = require("../../../user/components/userProfile/userProfile.component");
var core_1 = require('@angular/core');
var navigation_component_1 = require("../../../common/components/navigation/navigation.component");
var credits_component_1 = require("../../../common/components/credits/credits.component");
var router_1 = require('@angular/router');
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
            styles: [require('./app.component.scss')],
            directives: _.union(router_1.ROUTER_DIRECTIVES, [navigation_component_1.NavigationComponent, credits_component_1.CreditsComponent]),
            providers: [
                http_1.HTTP_PROVIDERS,
                userService_1.UserService
            ],
            precompile: [home_component_1.HomeComponent, userProfile_component_1.UserProfileComponent, settings_component_1.SettingsComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map