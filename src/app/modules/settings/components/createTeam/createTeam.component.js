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
var teamService_1 = require("../../../common/services/teamService");
var circularLoading_component_1 = require("../../../common/components/circularLoading/circularLoading.component");
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var teamExistsValidator_1 = require("../../../common/validators/teamExistsValidator");
var CreateTeamComponent = (function (_super) {
    __extends(CreateTeamComponent, _super);
    function CreateTeamComponent(teamService, formBuilder, teamExistsValidatorFactory) {
        _super.call(this);
        this.teamService = teamService;
        this.formBuilder = formBuilder;
        this.teamExistsValidatorFactory = teamExistsValidatorFactory;
        this.teamCreatedEvent = new core_1.EventEmitter();
    }
    CreateTeamComponent.prototype.ngOnInit = function () {
        this.creatingTeam = false;
        this.isTeamCreated = false;
        this._initialize();
    };
    CreateTeamComponent.prototype.ngOnDestroy = function () {
        this._teamExistsValidator.destroy();
    };
    CreateTeamComponent.prototype.onSubmit = function () {
    };
    CreateTeamComponent.prototype.canCreateTeam = function () {
        return this.createTeamFormGroup.valid && !!this.teamName;
    };
    CreateTeamComponent.prototype.createTeam = function () {
        var _this = this;
        this.creatingTeam = true;
        this.createTeamError = null;
        this.isTeamCreated = false;
        this.teamService.createTeam(this.teamName)
            .finally(function () { return _this._setAsNotCreatingTeam(); })
            .subscribe(function (teamDetails) { return _this._onTeamCreated(teamDetails); }, function (error) { return _this._setCreateTeamError(error); });
    };
    CreateTeamComponent.prototype._initialize = function () {
        this.teamName = '';
        this._initializeFormGroup();
        setTimeout(function () { return Materialize.updateTextFields(); }, 0);
    };
    CreateTeamComponent.prototype._initializeFormGroup = function () {
        this._teamExistsValidator =
            this.teamExistsValidatorFactory.create();
        this.createTeamFormGroup = this.formBuilder.group({
            teamName: [this.teamName, forms_1.Validators.required, this._teamExistsValidator.isExists.bind(this._teamExistsValidator)],
        });
        this._teamNameControl = this.createTeamFormGroup.controls['teamName'];
        this._teamExistsValidator.bindControl(this._teamNameControl);
    };
    CreateTeamComponent.prototype._setAsNotCreatingTeam = function () {
        this.creatingTeam = false;
    };
    CreateTeamComponent.prototype._setCreateTeamError = function (error) {
        this.createTeamError = error;
    };
    CreateTeamComponent.prototype._onTeamCreated = function (teamDetails) {
        this.teamName = '';
        this.isTeamCreated = true;
        this.resetControlAsUntouchedAndNotDirty(this._teamNameControl);
        this.teamCreatedEvent.emit(teamDetails);
        setTimeout(function () { return Materialize.updateTextFields(); }, 0);
    };
    __decorate([
        core_1.Output('onTeamCreated'), 
        __metadata('design:type', core_1.EventEmitter)
    ], CreateTeamComponent.prototype, "teamCreatedEvent", void 0);
    CreateTeamComponent = __decorate([
        core_1.Component({
            selector: 'create-team',
            template: require('./createTeam.component.html'),
            styles: [require('./createTeam.component.scss')],
            directives: [forms_1.REACTIVE_FORM_DIRECTIVES, circularLoading_component_1.CircularLoadingComponent],
            providers: [forms_1.FormBuilder, teamExistsValidator_1.TeamExistsValidatorFactory]
        }), 
        __metadata('design:paramtypes', [teamService_1.TeamService, forms_1.FormBuilder, teamExistsValidator_1.TeamExistsValidatorFactory])
    ], CreateTeamComponent);
    return CreateTeamComponent;
}(formComponentBase_1.FormComponentBase));
exports.CreateTeamComponent = CreateTeamComponent;
//# sourceMappingURL=createTeam.component.js.map