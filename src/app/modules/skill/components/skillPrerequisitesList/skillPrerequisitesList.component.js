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
var skillService_1 = require("../../../common/services/skillService");
var loadingComponentBase_1 = require("../../../common/components/loadingComponentBase/loadingComponentBase");
var core_1 = require('@angular/core');
var SkillPrerequisitesListComponent = (function (_super) {
    __extends(SkillPrerequisitesListComponent, _super);
    function SkillPrerequisitesListComponent(skillService) {
        _super.call(this);
        this.skillService = skillService;
        this.skillPrerequisitesChangedEvent = new core_1.EventEmitter();
        this.changingSkillPrerequisitesEvent = new core_1.EventEmitter();
        this.updatingSkillPrerequisite = false;
        this.updatingSkillPrerequisiteError = null;
    }
    SkillPrerequisitesListComponent.prototype.removeSkillPrerequisite = function (skillPrerequisite) {
        var _this = this;
        this._setAsUpdatingSkillPrerequisite();
        this.skillService.removeSkillPrerequisite(this.skillDetails.id, skillPrerequisite.id)
            .finally(function () { return _this._changeUpdatingSkillPrerequisite(false); })
            .subscribe(function () { return _this._removeSkillPrerequisiteFromSkillPrerequisitesList(skillPrerequisite); }, function (_error) { return _this.updatingSkillPrerequisiteError = _error; });
    };
    SkillPrerequisitesListComponent.prototype.setIsLoading = function (value) {
        this.isLoadingSkillPrerequisites = value;
    };
    SkillPrerequisitesListComponent.prototype.setLoadingError = function (error) {
        this.loadingSkillPrerequisitesError = error;
    };
    SkillPrerequisitesListComponent.prototype.setLoadingResult = function (result) {
        this._setSkillPrerequisites(result);
    };
    SkillPrerequisitesListComponent.prototype.get = function () {
        return this.skillService.getSkillPrerequisites(this.skillDetails.id);
    };
    SkillPrerequisitesListComponent.prototype._setAsUpdatingSkillPrerequisite = function () {
        this._changeUpdatingSkillPrerequisite(true);
        this.updatingSkillPrerequisiteError = null;
    };
    SkillPrerequisitesListComponent.prototype._changeUpdatingSkillPrerequisite = function (isUpdating) {
        this.updatingSkillPrerequisite = isUpdating;
        this.changingSkillPrerequisitesEvent.emit(isUpdating);
    };
    SkillPrerequisitesListComponent.prototype._removeSkillPrerequisiteFromSkillPrerequisitesList = function (skllPrerequisite) {
        var skillPrerequisiteIndex = this.skillPrerequisites.indexOf(skllPrerequisite);
        this.skillPrerequisites.splice(skillPrerequisiteIndex, 1);
        this._setSkillPrerequisites(this.skillPrerequisites);
    };
    SkillPrerequisitesListComponent.prototype._setSkillPrerequisites = function (skillPrerequisites) {
        this.skillPrerequisites = skillPrerequisites;
        if (skillPrerequisites) {
            this.skillPrerequisitesChangedEvent.emit(skillPrerequisites);
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], SkillPrerequisitesListComponent.prototype, "skillDetails", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], SkillPrerequisitesListComponent.prototype, "canModify", void 0);
    __decorate([
        core_1.Output('skillPrerequisites'), 
        __metadata('design:type', core_1.EventEmitter)
    ], SkillPrerequisitesListComponent.prototype, "skillPrerequisitesChangedEvent", void 0);
    __decorate([
        core_1.Output('changingSkillPrerequisites'), 
        __metadata('design:type', core_1.EventEmitter)
    ], SkillPrerequisitesListComponent.prototype, "changingSkillPrerequisitesEvent", void 0);
    SkillPrerequisitesListComponent = __decorate([
        core_1.Component({
            selector: 'skill-prerequisites-list',
            template: require('./skillPrerequisitesList.component.html'),
            styles: [require('./_skillPrerequisitesList.component.scss')]
        }), 
        __metadata('design:paramtypes', [skillService_1.SkillService])
    ], SkillPrerequisitesListComponent);
    return SkillPrerequisitesListComponent;
}(loadingComponentBase_1.LoadingComponentBase));
exports.SkillPrerequisitesListComponent = SkillPrerequisitesListComponent;
//# sourceMappingURL=skillPrerequisitesList.component.js.map