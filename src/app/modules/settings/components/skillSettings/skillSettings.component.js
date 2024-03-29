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
var skillDependencies_component_1 = require("../../../skill/components/skillDependencies/skillDependencies.component");
var circularLoading_component_1 = require("../../../common/components/circularLoading/circularLoading.component");
var skillPrerequisites_component_1 = require("../../../skill/components/skillPrerequisites/skillPrerequisites.component");
var userService_1 = require("../../../common/services/userService");
var loadingComponentBase_1 = require("../../../common/components/loadingComponentBase/loadingComponentBase");
var core_1 = require('@angular/core');
var SkillSettingsComponent = (function (_super) {
    __extends(SkillSettingsComponent, _super);
    function SkillSettingsComponent(userService) {
        _super.call(this);
        this.userService = userService;
    }
    SkillSettingsComponent.prototype.setIsLoading = function (value) {
        this.isLoadingPermissions = value;
    };
    SkillSettingsComponent.prototype.setLoadingError = function (error) {
        this.loadingPermissionsError = error;
    };
    SkillSettingsComponent.prototype.setLoadingResult = function (result) {
        var _this = this;
        this.permissions = result;
        if (result) {
            setTimeout(function () {
                $(_this.availableSkillSettings.nativeElement).tabs();
            }, 0);
        }
    };
    SkillSettingsComponent.prototype.get = function () {
        return this.userService.getSkillModificationPermissions(this.skillDetails.id);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], SkillSettingsComponent.prototype, "skillDetails", void 0);
    __decorate([
        core_1.ViewChild('availableSkillSettings'), 
        __metadata('design:type', core_1.ElementRef)
    ], SkillSettingsComponent.prototype, "availableSkillSettings", void 0);
    SkillSettingsComponent = __decorate([
        core_1.Component({
            selector: 'skill-settings',
            template: require('./skillSettings.component.html'),
            styles: [require('./_skillSettings.component.scss')],
            directives: [
                skillPrerequisites_component_1.SkillPrerequisitesComponent,
                skillDependencies_component_1.SkillDependenciesComponent,
                circularLoading_component_1.CircularLoadingComponent
            ]
        }), 
        __metadata('design:paramtypes', [userService_1.UserService])
    ], SkillSettingsComponent);
    return SkillSettingsComponent;
}(loadingComponentBase_1.LoadingComponentBase));
exports.SkillSettingsComponent = SkillSettingsComponent;
//# sourceMappingURL=skillSettings.component.js.map