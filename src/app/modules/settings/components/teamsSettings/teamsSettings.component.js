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
var teamService_1 = require("../../../common/services/teamService");
var circularLoading_component_1 = require("../../../common/components/circularLoading/circularLoading.component");
var loadingComponentBase_1 = require("../../../common/components/loadingComponentBase/loadingComponentBase");
var core_1 = require('@angular/core');
var TeamsSettingsComponent = (function (_super) {
    __extends(TeamsSettingsComponent, _super);
    function TeamsSettingsComponent(teamService, zone) {
        _super.call(this);
        this.teamService = teamService;
        this.zone = zone;
    }
    TeamsSettingsComponent.prototype.selectTeam = function (teamDetails) {
        this.selectedTeam = teamDetails;
        this._openModal(this.teamSettingsModal);
    };
    TeamsSettingsComponent.prototype.setAsCreatingTeam = function () {
        var _this = this;
        this.isCreatingTeam = true;
        this._openModal(this.creatingTeamModal, function () {
            _this.isCreatingTeam = false;
        });
    };
    TeamsSettingsComponent.prototype.load = function () {
        this.selectedTeam = null;
        this.isCreatingTeam = false;
        _super.prototype.load.call(this);
    };
    TeamsSettingsComponent.prototype.get = function () {
        return this.teamService.getTeamsDetails();
    };
    TeamsSettingsComponent.prototype.setIsLoading = function (value) {
        this.isLoadingTeams = value;
    };
    TeamsSettingsComponent.prototype.setLoadingResult = function (teamsDetails) {
        this.teamsDetails = teamsDetails;
    };
    TeamsSettingsComponent.prototype.setLoadingError = function (error) {
        this.loadingTeamsError = error;
    };
    TeamsSettingsComponent.prototype._openModal = function (modalElement, closeCallback) {
        var _this = this;
        if (closeCallback === void 0) { closeCallback = function () { }; }
        $(modalElement.nativeElement).openModal({
            complete: function () {
                _this.zone.run(closeCallback);
            }
        });
    };
    __decorate([
        core_1.ViewChild('teamSettingsModal'), 
        __metadata('design:type', core_1.ElementRef)
    ], TeamsSettingsComponent.prototype, "teamSettingsModal", void 0);
    __decorate([
        core_1.ViewChild('creatingTeamModal'), 
        __metadata('design:type', core_1.ElementRef)
    ], TeamsSettingsComponent.prototype, "creatingTeamModal", void 0);
    TeamsSettingsComponent = __decorate([
        core_1.Component({
            selector: 'teams-settings',
            template: require('./teamsSettings.component.html'),
            styles: [require('./teamsSettings.component.scss')],
            directives: [circularLoading_component_1.CircularLoadingComponent]
        }), 
        __metadata('design:paramtypes', [teamService_1.TeamService, core_1.NgZone])
    ], TeamsSettingsComponent);
    return TeamsSettingsComponent;
}(loadingComponentBase_1.LoadingComponentBase));
exports.TeamsSettingsComponent = TeamsSettingsComponent;
//# sourceMappingURL=teamsSettings.component.js.map