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
var skillService_1 = require("../services/skillService");
var core_1 = require('@angular/core');
var SkillNotExistsValidator = (function (_super) {
    __extends(SkillNotExistsValidator, _super);
    function SkillNotExistsValidator(skillService) {
        _super.call(this, [], 'skillDoesNotExist', 'skillDoesNotExistCheckFailed', existsValidatorBase_1.ExistsValidationMode.FAIL_IF_NOT_EXISTS);
        this.skillService = skillService;
    }
    SkillNotExistsValidator.prototype.isValueExists = function (skillName) {
        return this.skillService.isSkillExists(skillName);
    };
    return SkillNotExistsValidator;
}(existsValidatorBase_1.ExistsValidatorBase));
exports.SkillNotExistsValidator = SkillNotExistsValidator;
var SkillNotExistsValidatorFactory = (function () {
    function SkillNotExistsValidatorFactory(skillService) {
        this.skillService = skillService;
    }
    SkillNotExistsValidatorFactory.prototype.create = function () {
        return new SkillNotExistsValidator(this.skillService);
    };
    SkillNotExistsValidatorFactory = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [skillService_1.SkillService])
    ], SkillNotExistsValidatorFactory);
    return SkillNotExistsValidatorFactory;
}());
exports.SkillNotExistsValidatorFactory = SkillNotExistsValidatorFactory;
//# sourceMappingURL=skillNotExistsValidator.js.map