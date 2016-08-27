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
var SkillDependenciesListComponent = (function (_super) {
    __extends(SkillDependenciesListComponent, _super);
    function SkillDependenciesListComponent(skillService) {
        _super.call(this);
        this.skillService = skillService;
        this.skillDependenciesChangedEvent = new core_1.EventEmitter();
        this.changingSkillDependenciesEvent = new core_1.EventEmitter();
        this.updatingSkillDependency = false;
        this.updatingSkillDependencyError = null;
    }
    SkillDependenciesListComponent.prototype.removeSkillDependency = function (skillDependency) {
        var _this = this;
        this._setAsUpdatingSkillDependency();
        this.skillService.removeSkillDependency(this.skillDetails.id, skillDependency.id)
            .finally(function () { return _this._changeUpdatingSkillDependency(false); })
            .subscribe(function () { return _this._removeSkillDependencyFromSkillDependenciesList(skillDependency); }, function (_error) { return _this.updatingSkillDependencyError = _error; });
    };
    SkillDependenciesListComponent.prototype.setIsLoading = function (value) {
        this.isLoadingSkillDependencies = value;
    };
    SkillDependenciesListComponent.prototype.setLoadingError = function (error) {
        this.loadingSkillDependenciesError = error;
    };
    SkillDependenciesListComponent.prototype.setLoadingResult = function (result) {
        this._setSkillDependencies(result);
    };
    SkillDependenciesListComponent.prototype.get = function () {
        return this.skillService.getSkillDependencies(this.skillDetails.id);
    };
    SkillDependenciesListComponent.prototype._setAsUpdatingSkillDependency = function () {
        this._changeUpdatingSkillDependency(true);
        this.updatingSkillDependencyError = null;
    };
    SkillDependenciesListComponent.prototype._changeUpdatingSkillDependency = function (isUpdating) {
        this.updatingSkillDependency = isUpdating;
        this.changingSkillDependenciesEvent.emit(isUpdating);
    };
    SkillDependenciesListComponent.prototype._removeSkillDependencyFromSkillDependenciesList = function (skllDependency) {
        var skillDependencyIndex = this.skillDependencies.indexOf(skllDependency);
        this.skillDependencies.splice(skillDependencyIndex, 1);
        this._setSkillDependencies(this.skillDependencies);
    };
    SkillDependenciesListComponent.prototype._setSkillDependencies = function (skillDependencies) {
        this.skillDependencies = skillDependencies;
        if (skillDependencies) {
            this.skillDependenciesChangedEvent.emit(skillDependencies);
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], SkillDependenciesListComponent.prototype, "skillDetails", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], SkillDependenciesListComponent.prototype, "canModify", void 0);
    __decorate([
        core_1.Output('skillDependencies'), 
        __metadata('design:type', core_1.EventEmitter)
    ], SkillDependenciesListComponent.prototype, "skillDependenciesChangedEvent", void 0);
    __decorate([
        core_1.Output('changingSkillDependencies'), 
        __metadata('design:type', core_1.EventEmitter)
    ], SkillDependenciesListComponent.prototype, "changingSkillDependenciesEvent", void 0);
    SkillDependenciesListComponent = __decorate([
        core_1.Component({
            selector: 'skill-dependencies-list',
            template: require('./skillDependenciesList.component.html'),
            styles: [require('./_skillDependenciesList.component.scss')]
        }), 
        __metadata('design:paramtypes', [skillService_1.SkillService])
    ], SkillDependenciesListComponent);
    return SkillDependenciesListComponent;
}(loadingComponentBase_1.LoadingComponentBase));
exports.SkillDependenciesListComponent = SkillDependenciesListComponent;
//# sourceMappingURL=skillDependenciesList.component.js.map