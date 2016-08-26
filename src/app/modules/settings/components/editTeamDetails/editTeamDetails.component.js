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
var circularLoading_component_1 = require("../../../common/components/circularLoading/circularLoading.component");
var teamService_1 = require("../../../common/services/teamService");
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var teamExistsValidator_1 = require("../../../common/validators/teamExistsValidator");
var EditTeamDetailsComponent = (function (_super) {
    __extends(EditTeamDetailsComponent, _super);
    function EditTeamDetailsComponent(teamService, formBuilder, teamExistsValidatorFactory) {
        _super.call(this);
        this.teamService = teamService;
        this.formBuilder = formBuilder;
        this.teamExistsValidatorFactory = teamExistsValidatorFactory;
    }
    EditTeamDetailsComponent.prototype.ngOnInit = function () {
        if (!this.teamDetails) {
            throw 'teamDetails is not set';
        }
        if (this.canModifyTeamDetails === null ||
            this.canModifyTeamDetails === undefined) {
            throw 'canModifyTeamDetails is not set';
        }
        this.updatingTeamDetails = false;
        this.isTeamDetailsUpdated = false;
        this.updatingTeamDetailsError = null;
        this._initializeEditTeamName();
    };
    EditTeamDetailsComponent.prototype.ngOnDestroy = function () {
        this._teamExistsValidator.destroy();
    };
    EditTeamDetailsComponent.prototype.canUpdateTeamDetails = function () {
        return this.canModifyTeamDetails &&
            this.teamDetailsFormGroup.valid &&
            this._isTeamNameDetailsChanged();
    };
    EditTeamDetailsComponent.prototype.updateTeamDetails = function () {
        var _this = this;
        if (!this.canUpdateTeamDetails()) {
            return;
        }
        this.updatingTeamDetails = true;
        this.updatingTeamDetailsError = null;
        this.isTeamDetailsUpdated = false;
        this.teamService.updateTeamName(this.teamDetails.id, this.teamName)
            .finally(function () { return _this._setAsNotUpdatingTeamDetails(); })
            .subscribe(function (updatedTeamDetais) { return _this._setTeamDetailsAsUpdated(updatedTeamDetais); }, function (error) { return _this._setUpdatingTeamDetailsError(error); });
    };
    EditTeamDetailsComponent.prototype._initializeEditTeamName = function () {
        this.teamName = this.teamDetails.teamName;
        this._initializeFormGroup();
        setTimeout(function () { return Materialize.updateTextFields(); }, 0);
    };
    EditTeamDetailsComponent.prototype._initializeFormGroup = function () {
        this._teamExistsValidator =
            this.teamExistsValidatorFactory.createWithAllowedTeams([this.teamName]);
        this.teamDetailsFormGroup = this.formBuilder.group({
            teamName: [this.teamName, forms_1.Validators.required, this._teamExistsValidator.isExists.bind(this._teamExistsValidator)],
        });
        this._teamExistsValidator.bindControl(this.teamDetailsFormGroup.controls['teamName']);
    };
    EditTeamDetailsComponent.prototype._isTeamNameDetailsChanged = function () {
        return this.teamDetails.teamName !== this.teamName;
    };
    EditTeamDetailsComponent.prototype._setAsNotUpdatingTeamDetails = function () {
        this.updatingTeamDetails = false;
    };
    EditTeamDetailsComponent.prototype._setUpdatingTeamDetailsError = function (error) {
        this.updatingTeamDetailsError = error;
    };
    EditTeamDetailsComponent.prototype._setTeamDetailsAsUpdated = function (updatedTeamDetais) {
        this.teamDetails.teamName = updatedTeamDetais.teamName;
        this.isTeamDetailsUpdated = true;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], EditTeamDetailsComponent.prototype, "teamDetails", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], EditTeamDetailsComponent.prototype, "canModifyTeamDetails", void 0);
    EditTeamDetailsComponent = __decorate([
        core_1.Component({
            selector: 'edit-team-details',
            template: require('./editTeamDetails.component.html'),
            styles: [require('./_editTeamDetails.component.scss')],
            directives: [forms_1.REACTIVE_FORM_DIRECTIVES, circularLoading_component_1.CircularLoadingComponent],
            providers: [forms_1.FormBuilder, teamExistsValidator_1.TeamExistsValidatorFactory]
        }), 
        __metadata('design:paramtypes', [teamService_1.TeamService, forms_1.FormBuilder, teamExistsValidator_1.TeamExistsValidatorFactory])
    ], EditTeamDetailsComponent);
    return EditTeamDetailsComponent;
}(formComponentBase_1.FormComponentBase));
exports.EditTeamDetailsComponent = EditTeamDetailsComponent;
//# sourceMappingURL=editTeamDetails.component.js.map