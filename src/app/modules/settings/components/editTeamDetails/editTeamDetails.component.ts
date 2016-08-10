import {ITeamNameDetails} from "../../../common/interfaces/iTeamNameDetails";
import {FormComponentBase} from "../../../common/components/formComponentBase/formComponentBase";
import {CircularLoadingComponent} from "../../../common/components/circularLoading/circularLoading.component";
import {TeamService} from "../../../common/services/teamService";
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import {ITeamExistsValidator, TeamExistsValidator, TeamExistsValidatorFactory} from "../../../common/validators/teamExistsValidator";
import {EmailValidator} from "../../../common/validators/emailValidator";

@Component({
  selector: 'edit-team-details',
  template: require('./editTeamDetails.component.html'),
  styles: [require('./editTeamDetails.component.scss')],
  directives: [REACTIVE_FORM_DIRECTIVES, CircularLoadingComponent],
  providers: [FormBuilder, TeamExistsValidatorFactory]
})
export class EditTeamDetailsComponent extends FormComponentBase implements OnInit, OnDestroy {
  @Input() public teamDetails: ITeamNameDetails;

  public teamName: string;
  public teamDetailsFormGroup: FormGroup;
  public updatingTeamDetails: boolean;
  public updatingTeamDetailsError: any;
  public isTeamDetailsUpdated: boolean;

  private _teamExistsValidator: ITeamExistsValidator;

  constructor(private teamService: TeamService,
    private formBuilder: FormBuilder,
    private teamExistsValidatorFactory: TeamExistsValidatorFactory) {
    super();
  }

  public ngOnInit(): void {
    if (!this.teamDetails) {
      throw 'teamDetails is not set';
    }

    this.updatingTeamDetails = false;
    this.isTeamDetailsUpdated = false;

    this._initializeEditTeamName();
  }

  public ngOnDestroy(): void {
    this._teamExistsValidator.destroy();
  }

  public canUpdateTeamDetails(): boolean {
    return this.teamDetailsFormGroup.valid && this._isTeamNameDetailsChanged();
  }

  public updateTeamDetails(): void {
    this.updatingTeamDetails = true;
    this.updatingTeamDetailsError = null;
    this.isTeamDetailsUpdated = false;

    this.teamService.updateTeamName(this.teamDetails.id, this.teamName)
      .finally(() => this._setAsNotUpdatingTeamDetails())
      .subscribe(
      (updatedTeamDetais: ITeamNameDetails) => this._setTeamDetailsAsUpdated(updatedTeamDetais),
      (error: any) => this._setUpdatingTeamDetailsError(error));
  }

  private _initializeEditTeamName(): void {
    this.teamName = this.teamDetails.teamName;
    this._initializeFormGroup();
    setTimeout(() => Materialize.updateTextFields(), 0);
  }

  private _initializeFormGroup(): void {
    this._teamExistsValidator =
      this.teamExistsValidatorFactory.createWithAllowedTeams([this.teamName]);

    this.teamDetailsFormGroup = this.formBuilder.group({
      teamName: [this.teamName, Validators.required, this._teamExistsValidator.isExists.bind(this._teamExistsValidator)],
    });

    this._teamExistsValidator.bindControl(this.teamDetailsFormGroup.controls['teamName']);
  }

  private _isTeamNameDetailsChanged(): boolean {
    return this.teamDetails.teamName !== this.teamName;
  }

  private _setAsNotUpdatingTeamDetails(): void {
    this.updatingTeamDetails = false;
  }

  private _setUpdatingTeamDetailsError(error: any): void {
    this.updatingTeamDetailsError = error;
  }

  private _setTeamDetailsAsUpdated(updatedTeamDetais: ITeamNameDetails): void {
    this.teamDetails.teamName = updatedTeamDetais.teamName;

    this.isTeamDetailsUpdated = true;
  }
}
