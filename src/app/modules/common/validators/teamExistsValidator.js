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
var existsValidatorBase_1 = require("./base/existsValidatorBase");
var teamService_1 = require("../services/teamService");
var core_1 = require('@angular/core');
var TeamExistsValidator = (function (_super) {
    __extends(TeamExistsValidator, _super);
    function TeamExistsValidator(allowedTeamNames, teamService) {
        _super.call(this, allowedTeamNames, 'teamNameTaken', 'teamNameTakenCheckFailed');
        this.teamService = teamService;
    }
    TeamExistsValidator.prototype.isValueExists = function (teamName) {
        return this.teamService.isTeamExists(teamName);
    };
    return TeamExistsValidator;
}(existsValidatorBase_1.ExistsValidatorBase));
exports.TeamExistsValidator = TeamExistsValidator;
var TeamExistsValidatorFactory = (function () {
    function TeamExistsValidatorFactory(teamService) {
        this.teamService = teamService;
    }
    TeamExistsValidatorFactory.prototype.create = function () {
        return new TeamExistsValidator([], this.teamService);
    };
    TeamExistsValidatorFactory.prototype.createWithAllowedTeams = function (teamNames) {
        return new TeamExistsValidator(teamNames, this.teamService);
    };
    TeamExistsValidatorFactory = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [teamService_1.TeamService])
    ], TeamExistsValidatorFactory);
    return TeamExistsValidatorFactory;
}());
exports.TeamExistsValidatorFactory = TeamExistsValidatorFactory;
//# sourceMappingURL=teamExistsValidator.js.map