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
var teamSettings_component_1 = require("../teamSettings/teamSettings.component");
var userService_1 = require("../../../common/services/userService");
var createTeam_component_1 = require("../createTeam/createTeam.component");
var teamService_1 = require("../../../common/services/teamService");
var circularLoading_component_1 = require("../../../common/components/circularLoading/circularLoading.component");
var loadingComponentBase_1 = require("../../../common/components/loadingComponentBase/loadingComponentBase");
var core_1 = require('@angular/core');
var Observable_1 = require('rxjs/Observable');
var TeamsSettingsComponent = (function (_super) {
    __extends(TeamsSettingsComponent, _super);
    function TeamsSettingsComponent(teamService, userService, zone) {
        _super.call(this);
        this.teamService = teamService;
        this.userService = userService;
        this.zone = zone;
    }
    TeamsSettingsComponent.prototype.ngOnInit = function () {
        this.teamToDelete = null;
        this.isDeletingTeam = false;
        this.deletingTeamError = null;
        _super.prototype.ngOnInit.call(this);
    };
    TeamsSettingsComponent.prototype.selectTeam = function (teamDetails) {
        this.selectedTeam = teamDetails;
        this._openModal(this.teamSettingsModal);
    };
    TeamsSettingsComponent.prototype.deleteTeam = function (teamDetails) {
        var _this = this;
        this.teamToDelete = teamDetails;
        this._openModal(this.deleteTeamModal, function () {
            _this.teamToDelete = null;
        });
    };
    TeamsSettingsComponent.prototype.confirmDeletingTeam = function () {
        var _this = this;
        this.isDeletingTeam = true;
        this.deletingTeamError = null;
        this.teamService.deleteTeam(this.teamToDelete.id)
            .finally(function () { return _this._setAsNotDeletingTeam(); })
            .subscribe(function () { return _this._onTeamDeletedSuccessfully(); }, function (error) { return _this._setDeletingTeamError(error); });
    };
    TeamsSettingsComponent.prototype.setAsCreatingTeam = function () {
        var _this = this;
        this.isCreatingTeam = true;
        this._openModal(this.creatingTeamModal, function () {
            _this.isCreatingTeam = false;
        });
    };
    TeamsSettingsComponent.prototype.onTeamCreated = function (newTeamNameDetails) {
        this._closeModal(this.creatingTeamModal);
        this.teamsDetails.unshift(newTeamNameDetails);
        this.selectTeam(newTeamNameDetails);
    };
    TeamsSettingsComponent.prototype.load = function () {
        this.selectedTeam = null;
        this.isCreatingTeam = false;
        _super.prototype.load.call(this);
    };
    TeamsSettingsComponent.prototype.get = function () {
        return Observable_1.Observable.combineLatest(this.teamService.getTeamsDetails(), this.userService.canUserModifyTeams());
    };
    TeamsSettingsComponent.prototype.setIsLoading = function (value) {
        this.isLoadingTeams = value;
    };
    TeamsSettingsComponent.prototype.setLoadingResult = function (result) {
        if (!result) {
            this.teamsDetails = null;
            this.canUserModifyTeams = false;
            return;
        }
        this.teamsDetails = result[0];
        this.canUserModifyTeams = result[1];
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
    TeamsSettingsComponent.prototype._closeModal = function (modalElement) {
        $(modalElement.nativeElement).closeModal();
    };
    TeamsSettingsComponent.prototype._setAsNotDeletingTeam = function () {
        this.isDeletingTeam = false;
    };
    TeamsSettingsComponent.prototype._onTeamDeletedSuccessfully = function () {
        var teamToDeleteIndex = this.teamsDetails.indexOf(this.teamToDelete);
        this.teamsDetails.splice(teamToDeleteIndex, 1);
        this._closeModal(this.deleteTeamModal);
    };
    TeamsSettingsComponent.prototype._setDeletingTeamError = function (error) {
        this.deletingTeamError = error;
    };
    __decorate([
        core_1.ViewChild('teamSettingsModal'), 
        __metadata('design:type', core_1.ElementRef)
    ], TeamsSettingsComponent.prototype, "teamSettingsModal", void 0);
    __decorate([
        core_1.ViewChild('creatingTeamModal'), 
        __metadata('design:type', core_1.ElementRef)
    ], TeamsSettingsComponent.prototype, "creatingTeamModal", void 0);
    __decorate([
        core_1.ViewChild('deleteTeamModal'), 
        __metadata('design:type', core_1.ElementRef)
    ], TeamsSettingsComponent.prototype, "deleteTeamModal", void 0);
    TeamsSettingsComponent = __decorate([
        core_1.Component({
            selector: 'teams-settings',
            template: require('./teamsSettings.component.html'),
            styles: [require('./_teamsSettings.component.scss')],
            directives: [circularLoading_component_1.CircularLoadingComponent, createTeam_component_1.CreateTeamComponent, teamSettings_component_1.TeamSettingsComponent]
        }), 
        __metadata('design:paramtypes', [teamService_1.TeamService, userService_1.UserService, core_1.NgZone])
    ], TeamsSettingsComponent);
    return TeamsSettingsComponent;
}(loadingComponentBase_1.LoadingComponentBase));
exports.TeamsSettingsComponent = TeamsSettingsComponent;
//# sourceMappingURL=teamsSettings.component.js.map