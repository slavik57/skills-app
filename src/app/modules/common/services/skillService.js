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
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var _ = require('lodash');
var SkillService = (function (_super) {
    __extends(SkillService, _super);
    function SkillService(http) {
        _super.call(this, http);
        this._skillsControllerUrl = '/api/skills/';
        this._skillExistsUrlSuffix = '/exists';
        this._skillDependenciesUrlSuffix = '/dependencies';
    }
    SkillService.prototype.getSkillsDetails = function () {
        var _this = this;
        return this._get(this._skillsControllerUrl)
            .map(function (response) { return _this._extractSkillsDetails(response); })
            .catch(function (error) { return _this._throwOnUnauthorizedOrGenericError(error); });
    };
    SkillService.prototype.isSkillExists = function (skillName) {
        var _this = this;
        var url = this._skillsControllerUrl + skillName + this._skillExistsUrlSuffix;
        return this._get(url)
            .map(function (response) { return _this._extractPropertyFromBody(response, 'skillExists'); })
            .catch(function (error) { return _this._failWithGenericError(error); });
    };
    SkillService.prototype.deleteSkill = function (skillId) {
        var _this = this;
        var url = this._skillsControllerUrl + skillId;
        return this._delete(url)
            .map(function (response) { return _this._throwErrorIfStatusIsNotOk(response); })
            .catch(function (error) { return _this._handleServerError(error); });
    };
    SkillService.prototype.createSkill = function (skillName) {
        var _this = this;
        var body = JSON.stringify({
            name: skillName
        });
        return this._post(this._skillsControllerUrl, body)
            .map(function (response) { return _this._extractAllBody(response); })
            .catch(function (error) { return _this._handleServerError(error); });
    };
    SkillService.prototype.getSkillDependencies = function (skillId) {
        var _this = this;
        var url = this._skillsControllerUrl + skillId + this._skillDependenciesUrlSuffix;
        return this._get(url)
            .map(function (response) { return _this._extractSkillDependencies(response); })
            .catch(function (error) { return _this._throwOnUnauthorizedOrGenericError(error); });
    };
    SkillService.prototype.removeSkillDependency = function (skillId, dependencyId) {
        var _this = this;
        var url = this._skillsControllerUrl + skillId + this._skillDependenciesUrlSuffix;
        var body = JSON.stringify({
            dependencyId: dependencyId
        });
        return this._delete(url, body)
            .map(function (response) { return _this._throwErrorIfStatusIsNotOk(response); })
            .catch(function (error) { return _this._handleServerError(error); });
    };
    SkillService.prototype._extractSkillsDetails = function (response) {
        var _this = this;
        this._throwErrorIfStatusIsNotOk(response);
        var result = response.json();
        if (!result || !(result instanceof Array)) {
            throw 'Unexpected result';
        }
        var skillNameDetails = _.map(result, function (_serverSkillNameDetails) {
            _this._validateServerSkillNameDetails(_serverSkillNameDetails);
            return {
                id: _serverSkillNameDetails.id,
                skillName: _serverSkillNameDetails.skillName
            };
        });
        return skillNameDetails;
    };
    SkillService.prototype._validateServerSkillNameDetails = function (serverSkillNameDetails) {
        if (serverSkillNameDetails.id === null ||
            serverSkillNameDetails.id === undefined) {
            throw 'Skill id is missing';
        }
        if (!serverSkillNameDetails.skillName) {
            throw 'Skill name is missing';
        }
    };
    SkillService.prototype._extractSkillDependencies = function (response) {
        var _this = this;
        this._throwErrorIfStatusIsNotOk(response);
        var result = response.json();
        if (!result || !(result instanceof Array)) {
            throw 'Unexpected result';
        }
        var skillDependencies = _.map(result, function (_serverSkillDependency) {
            _this._validateServerSkillDependency(_serverSkillDependency);
            return {
                id: _serverSkillDependency.id,
                skillName: _serverSkillDependency.skillName,
            };
        });
        return skillDependencies;
    };
    SkillService.prototype._validateServerSkillDependency = function (serverSkillDependency) {
        if (serverSkillDependency.id === null ||
            serverSkillDependency.id === undefined) {
            throw 'Skill id is missing';
        }
        if (!serverSkillDependency.skillName) {
            throw 'skillName is missing';
        }
    };
    SkillService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], SkillService);
    return SkillService;
}(httpServiceBase_1.HttpServiceBase));
exports.SkillService = SkillService;
//# sourceMappingURL=skillService.js.map