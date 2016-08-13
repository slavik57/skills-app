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
var circularLoading_component_1 = require("../../../common/components/circularLoading/circularLoading.component");
var teamService_1 = require("../../../common/services/teamService");
var formComponentBase_1 = require("../../../common/components/formComponentBase/formComponentBase");
var userService_1 = require("../../../common/services/userService");
var sourcedAutocomplete_component_1 = require("../../../common/components/sourcedAutocomplete/sourcedAutocomplete.component");
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var usernameNotExistsValidator_1 = require("../../../common/validators/usernameNotExistsValidator");
var AddTeamUserComponent = (function (_super) {
    __extends(AddTeamUserComponent, _super);
    function AddTeamUserComponent(userService, teamService, formBuilder, usernameNotExistsValidatorFactory) {
        _super.call(this);
        this.userService = userService;
        this.teamService = teamService;
        this.formBuilder = formBuilder;
        this.usernameNotExistsValidatorFactory = usernameNotExistsValidatorFactory;
        this.teamMemberAddedEvent = new core_1.EventEmitter();
    }
    AddTeamUserComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.usersByPartialUsernameSource = {
            getItems: function (partialUsername) {
                return _this.userService.getUsersDetailsByPartialUsername(partialUsername, AddTeamUserComponent.MAX_NUMBER_OF_SUGGESTED_USERS);
            }
        };
        this._initialize();
    };
    AddTeamUserComponent.prototype.ngOnDestroy = function () {
        this._usernameNotExistsValidator.destroy();
    };
    AddTeamUserComponent.prototype.addTeamUser = function () {
        var _this = this;
        this.isAddingTeamUser = true;
        this.addTeamUserError = null;
        this.teamService.addTeamMember(this.teamDetails.id, this.usernameControl.value)
            .finally(function () { return _this._setAsNotAddingTeamUser(); })
            .subscribe(function (teamMemberDetails) { return _this._onTeamMemberAdded(teamMemberDetails); }, function (error) { return _this._setAddTeamUserError(error); });
    };
    AddTeamUserComponent.prototype.canAddUserToTeam = function () {
        return this.addTeamUserFormGroup.valid && !!this.usernameControl.value;
    };
    AddTeamUserComponent.prototype._initialize = function () {
        this.isAddingTeamUser = false;
        this._initializeFormGroup();
    };
    AddTeamUserComponent.prototype._initializeFormGroup = function () {
        this._usernameNotExistsValidator =
            this.usernameNotExistsValidatorFactory.create();
        this.addTeamUserFormGroup = this.formBuilder.group({
            usernameControl: ['', forms_1.Validators.required, this._usernameNotExistsValidator.isExists.bind(this._usernameNotExistsValidator)],
        });
        this.usernameControl =
            this.addTeamUserFormGroup.controls['usernameControl'];
        this._usernameNotExistsValidator.bindControl(this.usernameControl);
    };
    AddTeamUserComponent.prototype._setAsNotAddingTeamUser = function () {
        this.isAddingTeamUser = false;
    };
    AddTeamUserComponent.prototype._setAddTeamUserError = function (error) {
        this.addTeamUserError = error;
    };
    AddTeamUserComponent.prototype._onTeamMemberAdded = function (teamMemberDetails) {
        this.usernameControl.updateValue('');
        this.resetControlAsUntouchedAndNotDirty(this.usernameControl);
        this.teamMemberAddedEvent.emit(teamMemberDetails);
        setTimeout(function () { return Materialize.updateTextFields(); }, 0);
    };
    AddTeamUserComponent.MAX_NUMBER_OF_SUGGESTED_USERS = 3;
    __decorate([
        core_1.Input('teamDetails'), 
        __metadata('design:type', Object)
    ], AddTeamUserComponent.prototype, "teamDetails", void 0);
    __decorate([
        core_1.Output('teamMemberAdded'), 
        __metadata('design:type', core_1.EventEmitter)
    ], AddTeamUserComponent.prototype, "teamMemberAddedEvent", void 0);
    AddTeamUserComponent = __decorate([
        core_1.Component({
            selector: 'add-team-user',
            template: require('./addTeamUser.component.html'),
            styles: [require('./addTeamUser.component.scss')],
            directives: [forms_1.REACTIVE_FORM_DIRECTIVES, sourcedAutocomplete_component_1.SourcedAutocompleteComponent, circularLoading_component_1.CircularLoadingComponent],
            providers: [forms_1.FormBuilder, usernameNotExistsValidator_1.UsernameNotExistsValidatorFactory]
        }), 
        __metadata('design:paramtypes', [userService_1.UserService, teamService_1.TeamService, forms_1.FormBuilder, usernameNotExistsValidator_1.UsernameNotExistsValidatorFactory])
    ], AddTeamUserComponent);
    return AddTeamUserComponent;
}(formComponentBase_1.FormComponentBase));
exports.AddTeamUserComponent = AddTeamUserComponent;
//# sourceMappingURL=addTeamUser.component.js.map