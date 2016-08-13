import {FormComponentBase} from "../../../common/components/formComponentBase/formComponentBase";
import {TeamService} from "../../../common/services/teamService";
import {ITeamNameDetails} from "../../../common/interfaces/iTeamNameDetails";
import {CircularLoadingComponent} from "../../../common/components/circularLoading/circularLoading.component";
import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import {ITeamExistsValidator, TeamExistsValidator, TeamExistsValidatorFactory} from "../../../common/validators/teamExistsValidator";

@Component({
  selector: 'create-team',
  template: require('./createTeam.component.html'),
  styles: [require('./createTeam.component.scss')],
  directives: [REACTIVE_FORM_DIRECTIVES, CircularLoadingComponent],
  providers: [FormBuilder, TeamExistsValidatorFactory]
})
export class CreateTeamComponent extends FormComponentBase implements OnInit, OnDestroy {
  @Output('onTeamCreated') public teamCreatedEvent: EventEmitter<ITeamNameDetails>;
  public submitting: boolean;
  public error: any;
  public createTeamFormGroup: FormGroup;
  public createTeamError: any;
  public creatingTeam: boolean;
  public isTeamCreated: boolean;
  public teamName: string;

  private _teamExistsValidator: ITeamExistsValidator;
  private _teamNameControl: AbstractControl;

  constructor(private teamService: TeamService,
    private formBuilder: FormBuilder,
    private teamExistsValidatorFactory: TeamExistsValidatorFactory) {
    super();

    this.teamCreatedEvent = new EventEmitter<ITeamNameDetails>();
  }

  public ngOnInit(): void {
    this.creatingTeam = false;
    this.isTeamCreated = false;

    this._initialize();
  }

  public ngOnDestroy(): void {
    this._teamExistsValidator.destroy();
  }

  public canCreateTeam(): boolean {
    return this.createTeamFormGroup.valid && !!this.teamName;
  }

  public createTeam(): void {
    this.creatingTeam = true;
    this.createTeamError = null;
    this.isTeamCreated = false;

    this.teamService.createTeam(this.teamName)
      .finally(() => this._setAsNotCreatingTeam())
      .subscribe(
      (teamDetails: ITeamNameDetails) => this._onTeamCreated(teamDetails),
      (error: any) => this._setCreateTeamError(error));
  }

  private _initialize(): void {
    this.teamName = '';
    this._initializeFormGroup();
    setTimeout(() => Materialize.updateTextFields(), 0);
  }

  private _initializeFormGroup(): void {
    this._teamExistsValidator =
      this.teamExistsValidatorFactory.create();

    this.createTeamFormGroup = this.formBuilder.group({
      teamName: [this.teamName, Validators.required, this._teamExistsValidator.isExists.bind(this._teamExistsValidator)],
    });

    this._teamNameControl = this.createTeamFormGroup.controls['teamName'];

    this._teamExistsValidator.bindControl(this._teamNameControl);
  }

  private _setAsNotCreatingTeam(): void {
    this.creatingTeam = false;
  }

  private _setCreateTeamError(error: any): void {
    this.createTeamError = error;
  }

  private _onTeamCreated(teamDetails: ITeamNameDetails): void {
    this.teamName = '';
    this.isTeamCreated = true;

    this.resetControlAsUntouchedAndNotDirty(this._teamNameControl);

    this.teamCreatedEvent.emit(teamDetails);

    setTimeout(() => Materialize.updateTextFields(), 0);
  }
}
