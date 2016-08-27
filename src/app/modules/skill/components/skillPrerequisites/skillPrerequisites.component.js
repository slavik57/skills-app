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
var core_1 = require('@angular/core');
(function (SkillPrerequisitesState) {
    SkillPrerequisitesState[SkillPrerequisitesState["LIST_PREREQUISITES"] = 0] = "LIST_PREREQUISITES";
    SkillPrerequisitesState[SkillPrerequisitesState["ADD_PREREQUISITE"] = 1] = "ADD_PREREQUISITE";
})(exports.SkillPrerequisitesState || (exports.SkillPrerequisitesState = {}));
var SkillPrerequisitesState = exports.SkillPrerequisitesState;
var SkillPrerequisitesComponent = (function () {
    function SkillPrerequisitesComponent() {
    }
    SkillPrerequisitesComponent.prototype.ngOnInit = function () {
        this.SkillPrerequisitesState = SkillPrerequisitesState;
        this.state = SkillPrerequisitesState.LIST_PREREQUISITES;
    };
    SkillPrerequisitesComponent.prototype.addPrerequisite = function () {
        this.state = SkillPrerequisitesState.ADD_PREREQUISITE;
    };
    SkillPrerequisitesComponent.prototype.cancelAddingPrerequisite = function () {
        this.state = SkillPrerequisitesState.LIST_PREREQUISITES;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], SkillPrerequisitesComponent.prototype, "skillDetails", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], SkillPrerequisitesComponent.prototype, "canModify", void 0);
    SkillPrerequisitesComponent = __decorate([
        core_1.Component({
            selector: 'skill-prerequisites',
            template: require('./skillPrerequisites.component.html'),
            styles: [require('./_skillPrerequisites.component.scss')]
        }), 
        __metadata('design:paramtypes', [])
    ], SkillPrerequisitesComponent);
    return SkillPrerequisitesComponent;
}());
exports.SkillPrerequisitesComponent = SkillPrerequisitesComponent;
//# sourceMappingURL=skillPrerequisites.component.js.map