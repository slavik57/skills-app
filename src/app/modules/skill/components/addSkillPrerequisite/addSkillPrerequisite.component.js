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
var formComponentBase_1 = require("../../../common/components/formComponentBase/formComponentBase");
var circularLoading_component_1 = require("../../../common/components/circularLoading/circularLoading.component");
var sourcedAutocomplete_component_1 = require("../../../common/components/sourcedAutocomplete/sourcedAutocomplete.component");
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var skillNotExistsValidator_1 = require("../../../common/validators/skillNotExistsValidator");
var AddSkillPrerequisiteComponent = (function (_super) {
    __extends(AddSkillPrerequisiteComponent, _super);
    function AddSkillPrerequisiteComponent(skillService, formBuilder, skillNotExistsValidatorFactory) {
        _super.call(this);
        this.skillService = skillService;
        this.formBuilder = formBuilder;
        this.skillNotExistsValidatorFactory = skillNotExistsValidatorFactory;
        this.skillPrerequisiteAddedEvent = new core_1.EventEmitter();
    }
    AddSkillPrerequisiteComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.skillsByPartialSkillNameSource = {
            getItems: function (partialSkillName) {
                return _this.skillService.getSkillsDetailsByPartialSkillName(partialSkillName, AddSkillPrerequisiteComponent.MAX_NUMBER_OF_SUGGESTED_SKILLS);
            },
            converItemToString: function (_skillDetails) {
                return _skillDetails.skillName;
            }
        };
        this._initialize();
    };
    AddSkillPrerequisiteComponent.prototype.ngOnDestroy = function () {
        this._skillNotExistsValidator.destroy();
    };
    AddSkillPrerequisiteComponent.prototype.addSkillPrerequisite = function () {
        var _this = this;
        this.isAddingSkillPrerequisite = true;
        this.addSkillPrerequisiteError = null;
        this.skillService.addSkillPrerequisite(this.skillDetails.id, this.skillNameControl.value)
            .finally(function () { return _this._setAsNotAddingSkillPrerequisite(); })
            .subscribe(function (skillPrerequisiteDetails) { return _this._onSkillPrerequisiteAdded(skillPrerequisiteDetails); }, function (error) { return _this._setAddSkillPrerequisiteError(error); });
    };
    AddSkillPrerequisiteComponent.prototype.canAddSkillPrerequisite = function () {
        return this.addSkillPrerequisiteFormGroup.valid && !!this.skillNameControl.value;
    };
    AddSkillPrerequisiteComponent.prototype._initialize = function () {
        this.isAddingSkillPrerequisite = false;
        this._initializeFormGroup();
    };
    AddSkillPrerequisiteComponent.prototype._initializeFormGroup = function () {
        this._skillNotExistsValidator =
            this.skillNotExistsValidatorFactory.create();
        this.addSkillPrerequisiteFormGroup = this.formBuilder.group({
            skillNameControl: ['', forms_1.Validators.required, this._skillNotExistsValidator.isExists.bind(this._skillNotExistsValidator)],
        });
        this.skillNameControl =
            this.addSkillPrerequisiteFormGroup.controls['skillNameControl'];
        this._skillNotExistsValidator.bindControl(this.skillNameControl);
    };
    AddSkillPrerequisiteComponent.prototype._setAsNotAddingSkillPrerequisite = function () {
        this.isAddingSkillPrerequisite = false;
    };
    AddSkillPrerequisiteComponent.prototype._setAddSkillPrerequisiteError = function (error) {
        this.addSkillPrerequisiteError = error;
    };
    AddSkillPrerequisiteComponent.prototype._onSkillPrerequisiteAdded = function (skillPrerequisiteDetails) {
        this.skillNameControl.updateValue('');
        this.resetControlAsUntouchedAndNotDirty(this.skillNameControl);
        this.skillPrerequisiteAddedEvent.emit(skillPrerequisiteDetails);
        setTimeout(function () { return Materialize.updateTextFields(); }, 0);
    };
    AddSkillPrerequisiteComponent.MAX_NUMBER_OF_SUGGESTED_SKILLS = 3;
    __decorate([
        core_1.Input('skillDetails'), 
        __metadata('design:type', Object)
    ], AddSkillPrerequisiteComponent.prototype, "skillDetails", void 0);
    __decorate([
        core_1.Output('skillPrerequisiteAdded'), 
        __metadata('design:type', core_1.EventEmitter)
    ], AddSkillPrerequisiteComponent.prototype, "skillPrerequisiteAddedEvent", void 0);
    AddSkillPrerequisiteComponent = __decorate([
        core_1.Component({
            selector: 'add-skill-prerequisite',
            template: require('./addSkillPrerequisite.component.html'),
            styles: [require('./_addSkillPrerequisite.component.scss')],
            directives: [forms_1.REACTIVE_FORM_DIRECTIVES, sourcedAutocomplete_component_1.SourcedAutocompleteComponent, circularLoading_component_1.CircularLoadingComponent],
            providers: [forms_1.FormBuilder, skillNotExistsValidator_1.SkillNotExistsValidatorFactory]
        }), 
        __metadata('design:paramtypes', [skillService_1.SkillService, forms_1.FormBuilder, skillNotExistsValidator_1.SkillNotExistsValidatorFactory])
    ], AddSkillPrerequisiteComponent);
    return AddSkillPrerequisiteComponent;
}(formComponentBase_1.FormComponentBase));
exports.AddSkillPrerequisiteComponent = AddSkillPrerequisiteComponent;
//# sourceMappingURL=addSkillPrerequisite.component.js.map