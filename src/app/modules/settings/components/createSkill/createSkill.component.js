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
var formComponentBase_1 = require("../../../common/components/formComponentBase/formComponentBase");
var skillService_1 = require("../../../common/services/skillService");
var circularLoading_component_1 = require("../../../common/components/circularLoading/circularLoading.component");
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var skillExistsValidator_1 = require("../../../common/validators/skillExistsValidator");
var CreateSkillComponent = (function (_super) {
    __extends(CreateSkillComponent, _super);
    function CreateSkillComponent(skillService, formBuilder, skillExistsValidatorFactory) {
        _super.call(this);
        this.skillService = skillService;
        this.formBuilder = formBuilder;
        this.skillExistsValidatorFactory = skillExistsValidatorFactory;
        this.skillCreatedEvent = new core_1.EventEmitter();
    }
    CreateSkillComponent.prototype.ngOnInit = function () {
        this.creatingSkill = false;
        this.isSkillCreated = false;
        this._initialize();
    };
    CreateSkillComponent.prototype.ngOnDestroy = function () {
        this._skillExistsValidator.destroy();
    };
    CreateSkillComponent.prototype.canCreateSkill = function () {
        return this.createSkillFormGroup.valid && !!this.skillName;
    };
    CreateSkillComponent.prototype.createSkill = function () {
        var _this = this;
        this.creatingSkill = true;
        this.createSkillError = null;
        this.isSkillCreated = false;
        this.skillService.createSkill(this.skillName)
            .finally(function () { return _this._setAsNotCreatingSkill(); })
            .subscribe(function (skillDetails) { return _this._onSkillCreated(skillDetails); }, function (error) { return _this._setCreateSkillError(error); });
    };
    CreateSkillComponent.prototype._initialize = function () {
        this.skillName = '';
        this._initializeFormGroup();
        setTimeout(function () { return Materialize.updateTextFields(); }, 0);
    };
    CreateSkillComponent.prototype._initializeFormGroup = function () {
        this._skillExistsValidator =
            this.skillExistsValidatorFactory.create();
        this.createSkillFormGroup = this.formBuilder.group({
            skillName: [this.skillName, forms_1.Validators.required, this._skillExistsValidator.isExists.bind(this._skillExistsValidator)],
        });
        this._skillNameControl = this.createSkillFormGroup.controls['skillName'];
        this._skillExistsValidator.bindControl(this._skillNameControl);
    };
    CreateSkillComponent.prototype._setAsNotCreatingSkill = function () {
        this.creatingSkill = false;
    };
    CreateSkillComponent.prototype._setCreateSkillError = function (error) {
        this.createSkillError = error;
    };
    CreateSkillComponent.prototype._onSkillCreated = function (skillDetails) {
        this.skillName = '';
        this.isSkillCreated = true;
        this.resetControlAsUntouchedAndNotDirty(this._skillNameControl);
        this.skillCreatedEvent.emit(skillDetails);
        setTimeout(function () { return Materialize.updateTextFields(); }, 0);
    };
    __decorate([
        core_1.Output('onSkillCreated'), 
        __metadata('design:type', core_1.EventEmitter)
    ], CreateSkillComponent.prototype, "skillCreatedEvent", void 0);
    CreateSkillComponent = __decorate([
        core_1.Component({
            selector: 'create-skill',
            template: require('./createSkill.component.html'),
            styles: [require('./_createSkill.component.scss')],
            directives: [forms_1.REACTIVE_FORM_DIRECTIVES, circularLoading_component_1.CircularLoadingComponent],
            providers: [forms_1.FormBuilder, skillExistsValidator_1.SkillExistsValidatorFactory]
        }), 
        __metadata('design:paramtypes', [skillService_1.SkillService, forms_1.FormBuilder, (typeof (_a = typeof skillExistsValidator_1.SkillExistsValidatorFactory !== 'undefined' && skillExistsValidator_1.SkillExistsValidatorFactory) === 'function' && _a) || Object])
    ], CreateSkillComponent);
    return CreateSkillComponent;
    var _a;
}(formComponentBase_1.FormComponentBase));
exports.CreateSkillComponent = CreateSkillComponent;
//# sourceMappingURL=createSkill.component.js.map