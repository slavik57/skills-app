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
var httpServiceBase_1 = require("./base/httpServiceBase");
var http_1 = require('@angular/http');
var core_1 = require('@angular/core');
var _ = require('lodash');
var TeamService = (function (_super) {
    __extends(TeamService, _super);
    function TeamService(http) {
        _super.call(this, http);
        this._teamsControllerUrl = '/api/teams/';
        this._teamExistsUrlSuffix = '/exists';
    }
    TeamService.prototype.getTeamsDetails = function () {
        var _this = this;
        return this._get(this._teamsControllerUrl)
            .map(function (response) { return _this._extractTeamsDetails(response); })
            .catch(function (error) { return _this._throwOnUnauthorizedOrGenericError(error); });
    };
    TeamService.prototype.isTeamExists = function (teamName) {
        var _this = this;
        var url = this._teamsControllerUrl + teamName + this._teamExistsUrlSuffix;
        return this._get(url)
            .map(function (response) { return _this._extractPropertyFromBody(response, 'teamExists'); })
            .catch(function (error) { return _this._failWithGenericError(error); });
    };
    TeamService.prototype.createTeam = function (teamName) {
        var _this = this;
        var body = JSON.stringify({
            name: teamName
        });
        return this._post(this._teamsControllerUrl, body)
            .map(function (response) { return _this._extractAllBody(response); })
            .catch(function (error) { return _this._handleServerError(error); });
    };
    TeamService.prototype._extractTeamsDetails = function (response) {
        var _this = this;
        this._throwErrorIfStatusIsNotOk(response);
        var result = response.json();
        if (!result || !(result instanceof Array)) {
            throw 'Unexpected result';
        }
        var teamNameDetails = _.map(result, function (_serverTeamNameDetails) {
            _this._validateServerTeamNameDetails(_serverTeamNameDetails);
            return {
                id: _serverTeamNameDetails.id,
                teamName: _serverTeamNameDetails.teamName
            };
        });
        return teamNameDetails;
    };
    TeamService.prototype._validateServerTeamNameDetails = function (serverTeamNameDetails) {
        if (serverTeamNameDetails.id === null ||
            serverTeamNameDetails.id === undefined) {
            throw 'Team id is missing';
        }
        if (!serverTeamNameDetails.teamName) {
            throw 'Team name is missing';
        }
    };
    TeamService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], TeamService);
    return TeamService;
}(httpServiceBase_1.HttpServiceBase));
exports.TeamService = TeamService;
//# sourceMappingURL=teamService.js.map