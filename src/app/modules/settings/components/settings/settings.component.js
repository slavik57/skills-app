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
var teamsSettings_component_1 = require("../teamsSettings/teamsSettings.component");
var skillsSettings_component_1 = require("../skillsSettings/skillsSettings.component");
var usersSettings_component_1 = require("../usersSettings/usersSettings.component");
var router_1 = require('@angular/router');
var core_1 = require('@angular/core');
var SettingsComponent = (function () {
    function SettingsComponent() {
    }
    SettingsComponent.prototype.ngAfterViewChecked = function () {
        $(this.availableSettings.nativeElement).tabs();
    };
    __decorate([
        core_1.ViewChild('availableSettings'), 
        __metadata('design:type', core_1.ElementRef)
    ], SettingsComponent.prototype, "availableSettings", void 0);
    SettingsComponent = __decorate([
        core_1.Component({
            selector: 'settings',
            template: require('./settings.component.html'),
            styles: [require('./settings.component.scss')],
            directives: [router_1.ROUTER_DIRECTIVES],
            precompile: [usersSettings_component_1.UsersSettingsComponent, skillsSettings_component_1.SkillsSettingsComponent, teamsSettings_component_1.TeamsSettingsComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], SettingsComponent);
    return SettingsComponent;
}());
exports.SettingsComponent = SettingsComponent;
//# sourceMappingURL=settings.component.js.map