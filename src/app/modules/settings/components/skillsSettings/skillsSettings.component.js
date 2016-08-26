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
var skillSettings_component_1 = require("../skillSettings/skillSettings.component");
var userService_1 = require("../../../common/services/userService");
var createSkill_component_1 = require("../createSkill/createSkill.component");
var skillService_1 = require("../../../common/services/skillService");
var circularLoading_component_1 = require("../../../common/components/circularLoading/circularLoading.component");
var loadingComponentBase_1 = require("../../../common/components/loadingComponentBase/loadingComponentBase");
var core_1 = require('@angular/core');
var Observable_1 = require('rxjs/Observable');
var SkillsSettingsComponent = (function (_super) {
    __extends(SkillsSettingsComponent, _super);
    function SkillsSettingsComponent(skillService, userService, zone) {
        _super.call(this);
        this.skillService = skillService;
        this.userService = userService;
        this.zone = zone;
    }
    SkillsSettingsComponent.prototype.ngOnInit = function () {
        this.skillToDelete = null;
        this.isDeletingSkill = false;
        this.deletingSkillError = null;
        _super.prototype.ngOnInit.call(this);
    };
    SkillsSettingsComponent.prototype.selectSkill = function (skillDetails) {
        this.selectedSkill = skillDetails;
        this._openModal(this.skillSettingsModal);
    };
    SkillsSettingsComponent.prototype.deleteSkill = function (skillDetails) {
        var _this = this;
        this.skillToDelete = skillDetails;
        this._openModal(this.deleteSkillModal, function () {
            _this.skillToDelete = null;
        });
    };
    SkillsSettingsComponent.prototype.confirmDeletingSkill = function () {
        var _this = this;
        this.isDeletingSkill = true;
        this.deletingSkillError = null;
        this.skillService.deleteSkill(this.skillToDelete.id)
            .finally(function () { return _this._setAsNotDeletingSkill(); })
            .subscribe(function () { return _this._onSkillDeletedSuccessfully(); }, function (error) { return _this._setDeletingSkillError(error); });
    };
    SkillsSettingsComponent.prototype.setAsCreatingSkill = function () {
        var _this = this;
        this.isCreatingSkill = true;
        this._openModal(this.creatingSkillModal, function () {
            _this.isCreatingSkill = false;
        });
    };
    SkillsSettingsComponent.prototype.onSkillCreated = function (newSkillNameDetails) {
        this._closeModal(this.creatingSkillModal);
        this.skillsDetails.unshift(newSkillNameDetails);
        this.selectSkill(newSkillNameDetails);
    };
    SkillsSettingsComponent.prototype.load = function () {
        this.selectedSkill = null;
        this.isCreatingSkill = false;
        _super.prototype.load.call(this);
    };
    SkillsSettingsComponent.prototype.get = function () {
        return Observable_1.Observable.combineLatest(this.skillService.getSkillsDetails(), this.userService.canUserModifySkills());
    };
    SkillsSettingsComponent.prototype.setIsLoading = function (value) {
        this.isLoadingSkills = value;
    };
    SkillsSettingsComponent.prototype.setLoadingResult = function (result) {
        if (!result) {
            this.skillsDetails = null;
            this.canUserModifySkills = false;
            return;
        }
        this.skillsDetails = result[0];
        this.canUserModifySkills = result[1];
    };
    SkillsSettingsComponent.prototype.setLoadingError = function (error) {
        this.loadingSkillsError = error;
    };
    SkillsSettingsComponent.prototype._openModal = function (modalElement, closeCallback) {
        var _this = this;
        if (closeCallback === void 0) { closeCallback = function () { }; }
        $(modalElement.nativeElement).openModal({
            complete: function () {
                _this.zone.run(closeCallback);
            }
        });
    };
    SkillsSettingsComponent.prototype._closeModal = function (modalElement) {
        $(modalElement.nativeElement).closeModal();
    };
    SkillsSettingsComponent.prototype._setAsNotDeletingSkill = function () {
        this.isDeletingSkill = false;
    };
    SkillsSettingsComponent.prototype._onSkillDeletedSuccessfully = function () {
        var skillToDeleteIndex = this.skillsDetails.indexOf(this.skillToDelete);
        this.skillsDetails.splice(skillToDeleteIndex, 1);
        this._closeModal(this.deleteSkillModal);
    };
    SkillsSettingsComponent.prototype._setDeletingSkillError = function (error) {
        this.deletingSkillError = error;
    };
    __decorate([
        core_1.ViewChild('skillSettingsModal'), 
        __metadata('design:type', core_1.ElementRef)
    ], SkillsSettingsComponent.prototype, "skillSettingsModal", void 0);
    __decorate([
        core_1.ViewChild('creatingSkillModal'), 
        __metadata('design:type', core_1.ElementRef)
    ], SkillsSettingsComponent.prototype, "creatingSkillModal", void 0);
    __decorate([
        core_1.ViewChild('deleteSkillModal'), 
        __metadata('design:type', core_1.ElementRef)
    ], SkillsSettingsComponent.prototype, "deleteSkillModal", void 0);
    SkillsSettingsComponent = __decorate([
        core_1.Component({
            selector: 'skills-settings',
            template: require('./skillsSettings.component.html'),
            styles: [require('./_skillsSettings.component.scss')],
            directives: [circularLoading_component_1.CircularLoadingComponent, createSkill_component_1.CreateSkillComponent, skillSettings_component_1.SkillSettingsComponent]
        }), 
        __metadata('design:paramtypes', [skillService_1.SkillService, userService_1.UserService, core_1.NgZone])
    ], SkillsSettingsComponent);
    return SkillsSettingsComponent;
}(loadingComponentBase_1.LoadingComponentBase));
exports.SkillsSettingsComponent = SkillsSettingsComponent;
//# sourceMappingURL=skillsSettings.component.js.map