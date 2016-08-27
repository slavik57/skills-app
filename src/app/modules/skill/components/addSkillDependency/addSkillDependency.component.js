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
var circularLoading_component_1 = require("../../../common/components/circularLoading/circularLoading.component");
var sourcedAutocomplete_component_1 = require("../../../common/components/sourcedAutocomplete/sourcedAutocomplete.component");
var formComponentBase_1 = require("../../../common/components/formComponentBase/formComponentBase");
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var skillNotExistsValidator_1 = require("../../../common/validators/skillNotExistsValidator");
var AddSkillDependencyComponent = (function (_super) {
    __extends(AddSkillDependencyComponent, _super);
    function AddSkillDependencyComponent(skillService, formBuilder, skillNotExistsValidatorFactory) {
        _super.call(this);
        this.skillService = skillService;
        this.formBuilder = formBuilder;
        this.skillNotExistsValidatorFactory = skillNotExistsValidatorFactory;
        this.skillDependencyAddedEvent = new core_1.EventEmitter();
    }
    AddSkillDependencyComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.skillsByPartialSkillNameSource = {
            getItems: function (partialSkillName) {
                return _this.skillService.getSkillsDetailsByPartialSkillName(partialSkillName, AddSkillDependencyComponent.MAX_NUMBER_OF_SUGGESTED_SKILLS);
            },
            converItemToString: function (_skillDetails) {
                return _skillDetails.skillName;
            }
        };
        this._initialize();
    };
    AddSkillDependencyComponent.prototype.ngOnDestroy = function () {
        this._skillNotExistsValidator.destroy();
    };
    AddSkillDependencyComponent.prototype.addSkillDependency = function () {
        var _this = this;
        this.isAddingSkillDependency = true;
        this.addSkillDependencyError = null;
        this.skillService.addSkillDependency(this.skillDetails.id, this.skillNameControl.value)
            .finally(function () { return _this._setAsNotAddingSkillDependency(); })
            .subscribe(function (skillDependencyDetails) { return _this._onSkillDependencyAdded(skillDependencyDetails); }, function (error) { return _this._setAddSkillDependencyError(error); });
    };
    AddSkillDependencyComponent.prototype.canAddSkillDependency = function () {
        return this.addSkillDependencyFormGroup.valid && !!this.skillNameControl.value;
    };
    AddSkillDependencyComponent.prototype._initialize = function () {
        this.isAddingSkillDependency = false;
        this._initializeFormGroup();
    };
    AddSkillDependencyComponent.prototype._initializeFormGroup = function () {
        this._skillNotExistsValidator =
            this.skillNotExistsValidatorFactory.create();
        this.addSkillDependencyFormGroup = this.formBuilder.group({
            skillNameControl: ['', forms_1.Validators.required, this._skillNotExistsValidator.isExists.bind(this._skillNotExistsValidator)],
        });
        this.skillNameControl =
            this.addSkillDependencyFormGroup.controls['skillNameControl'];
        this._skillNotExistsValidator.bindControl(this.skillNameControl);
    };
    AddSkillDependencyComponent.prototype._setAsNotAddingSkillDependency = function () {
        this.isAddingSkillDependency = false;
    };
    AddSkillDependencyComponent.prototype._setAddSkillDependencyError = function (error) {
        this.addSkillDependencyError = error;
    };
    AddSkillDependencyComponent.prototype._onSkillDependencyAdded = function (skillDependencyDetails) {
        this.skillNameControl.updateValue('');
        this.resetControlAsUntouchedAndNotDirty(this.skillNameControl);
        this.skillDependencyAddedEvent.emit(skillDependencyDetails);
        setTimeout(function () { return Materialize.updateTextFields(); }, 0);
    };
    AddSkillDependencyComponent.MAX_NUMBER_OF_SUGGESTED_SKILLS = 3;
    __decorate([
        core_1.Input('skillDetails'), 
        __metadata('design:type', Object)
    ], AddSkillDependencyComponent.prototype, "skillDetails", void 0);
    __decorate([
        core_1.Output('skillDependencyAdded'), 
        __metadata('design:type', core_1.EventEmitter)
    ], AddSkillDependencyComponent.prototype, "skillDependencyAddedEvent", void 0);
    AddSkillDependencyComponent = __decorate([
        core_1.Component({
            selector: 'add-skill-dependency',
            template: require('./addSkillDependency.component.html'),
            styles: [require('./_addSkillDependency.component.scss')],
            directives: [forms_1.REACTIVE_FORM_DIRECTIVES, sourcedAutocomplete_component_1.SourcedAutocompleteComponent, circularLoading_component_1.CircularLoadingComponent],
            providers: [forms_1.FormBuilder, skillNotExistsValidator_1.SkillNotExistsValidatorFactory]
        }), 
        __metadata('design:paramtypes', [skillService_1.SkillService, forms_1.FormBuilder, skillNotExistsValidator_1.SkillNotExistsValidatorFactory])
    ], AddSkillDependencyComponent);
    return AddSkillDependencyComponent;
}(formComponentBase_1.FormComponentBase));
exports.AddSkillDependencyComponent = AddSkillDependencyComponent;
//# sourceMappingURL=addSkillDependency.component.js.map