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
(function (SkillDependenciesState) {
    SkillDependenciesState[SkillDependenciesState["LIST_DEPENDENCIES"] = 0] = "LIST_DEPENDENCIES";
    SkillDependenciesState[SkillDependenciesState["ADD_DEPENDENCY"] = 1] = "ADD_DEPENDENCY";
})(exports.SkillDependenciesState || (exports.SkillDependenciesState = {}));
var SkillDependenciesState = exports.SkillDependenciesState;
var SkillDependenciesComponent = (function () {
    function SkillDependenciesComponent() {
    }
    SkillDependenciesComponent.prototype.ngOnInit = function () {
        this.SkillDependenciesState = SkillDependenciesState;
        this.state = SkillDependenciesState.LIST_DEPENDENCIES;
    };
    SkillDependenciesComponent.prototype.addDependency = function () {
        this.state = SkillDependenciesState.ADD_DEPENDENCY;
    };
    SkillDependenciesComponent.prototype.cancelAddingDependency = function () {
        this.state = SkillDependenciesState.LIST_DEPENDENCIES;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], SkillDependenciesComponent.prototype, "skillDetails", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], SkillDependenciesComponent.prototype, "canModify", void 0);
    SkillDependenciesComponent = __decorate([
        core_1.Component({
            selector: 'skill-dependencies',
            template: require('./skillDependencies.component.html'),
            styles: [require('./_skillDependencies.component.scss')]
        }), 
        __metadata('design:paramtypes', [])
    ], SkillDependenciesComponent);
    return SkillDependenciesComponent;
}());
exports.SkillDependenciesComponent = SkillDependenciesComponent;
//# sourceMappingURL=skillDependencies.component.js.map