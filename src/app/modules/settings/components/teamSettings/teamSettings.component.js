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
var circularLoading_component_1 = require("../../../common/components/circularLoading/circularLoading.component");
var teamService_1 = require("../../../common/services/teamService");
var core_1 = require('@angular/core');
var TeamSettingsComponent = (function () {
    function TeamSettingsComponent(teamService) {
        this.teamService = teamService;
    }
    TeamSettingsComponent.prototype.ngOnInit = function () {
    };
    TeamSettingsComponent.prototype.ngAfterViewInit = function () {
        $(this.availableTeamSettings.nativeElement).tabs();
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], TeamSettingsComponent.prototype, "teamDetails", void 0);
    __decorate([
        core_1.ViewChild('availableTeamSettings'), 
        __metadata('design:type', core_1.ElementRef)
    ], TeamSettingsComponent.prototype, "availableTeamSettings", void 0);
    TeamSettingsComponent = __decorate([
        core_1.Component({
            selector: 'team-settings',
            template: require('./teamSettings.component.html'),
            styles: [require('./teamSettings.component.scss')],
            directives: [
                circularLoading_component_1.CircularLoadingComponent
            ],
        }), 
        __metadata('design:paramtypes', [teamService_1.TeamService])
    ], TeamSettingsComponent);
    return TeamSettingsComponent;
}());
exports.TeamSettingsComponent = TeamSettingsComponent;
//# sourceMappingURL=teamSettings.component.js.map