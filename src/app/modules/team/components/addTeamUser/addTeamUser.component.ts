import {CircularLoadingComponent} from "../../../common/components/circularLoading/circularLoading.component";
import {TeamService} from "../../../common/services/teamService";
import {ITeamMemberDetails} from "../../../common/interfaces/iTeamMemberDetails";
import {FormComponentBase} from "../../../common/components/formComponentBase/formComponentBase";
import {UserService} from "../../../common/services/userService";
import {IUsernameDetails} from "../../../common/interfaces/iUsernameDetails";
import {SourcedAutocompleteComponent} from "../../../common/components/sourcedAutocomplete/sourcedAutocomplete.component";
import {ITeamNameDetails} from "../../../common/interfaces/iTeamNameDetails";
import {IItemsSource} from '../../../common/components/sourcedAutocomplete/iItemsSource';
import {Component, Input, Output, OnInit, OnDestroy, EventEmitter} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {REACTIVE_FORM_DIRECTIVES, FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {
  IUsernameNotExistsValidator,
  UsernameNotExistsValidator,
  UsernameNotExistsValidatorFactory
} from "../../../common/validators/usernameNotExistsValidator";

@Component({
  selector: 'add-team-user',
  template: require('./addTeamUser.component.html'),
  styles: [require('./addTeamUser.component.scss')],
  directives: [REACTIVE_FORM_DIRECTIVES, SourcedAutocompleteComponent, CircularLoadingComponent],
  providers: [FormBuilder, UsernameNotExistsValidatorFactory]
})
export class AddTeamUserComponent extends FormComponentBase implements OnInit, OnDestroy {
  public static MAX_NUMBER_OF_SUGGESTED_USERS = 3;
  @Input('teamDetails') public teamDetails: ITeamNameDetails;
  @Output('teamMemberAdded') teamMemberAddedEvent: EventEmitter<ITeamMemberDetails>;
  public usersByPartialUsernameSource: IItemsSource;
  public addTeamUserFormGroup: FormGroup;
  public usernameControl: FormControl;
  public isAddingTeamUser: boolean;
  public addTeamUserError: any;

  private _usernameNotExistsValidator: IUsernameNotExistsValidator;

  constructor(private userService: UserService,
    private teamService: TeamService,
    private formBuilder: FormBuilder,
    private usernameNotExistsValidatorFactory: UsernameNotExistsValidatorFactory) {
    super();

    this.teamMemberAddedEvent = new EventEmitter<ITeamMemberDetails>();
  }

  public ngOnInit() {
    this.usersByPartialUsernameSource = {
      getItems: (partialUsername: string) => {
        return this.userService.getUsersDetailsByPartialUsername(partialUsername, AddTeamUserComponent.MAX_NUMBER_OF_SUGGESTED_USERS);
      },
      converItemToString: (teamMember: IUsernameDetails) => {
        return teamMember.username;
      }
    }

    this._initialize();
  }

  public ngOnDestroy(): void {
    this._usernameNotExistsValidator.destroy();
  }

  public addTeamUser(): void {
    this.isAddingTeamUser = true;
    this.addTeamUserError = null;

    this.teamService.addTeamMember(this.teamDetails.id, this.usernameControl.value)
      .finally(() => this._setAsNotAddingTeamUser())
      .subscribe(
      (teamMemberDetails: ITeamMemberDetails) => this._onTeamMemberAdded(teamMemberDetails),
      (error: any) => this._setAddTeamUserError(error));
  }

  public canAddUserToTeam(): boolean {
    return this.addTeamUserFormGroup.valid && !!this.usernameControl.value;
  }

  private _initialize(): void {
    this.isAddingTeamUser = false;

    this._initializeFormGroup();
  }

  private _initializeFormGroup(): void {
    this._usernameNotExistsValidator =
      this.usernameNotExistsValidatorFactory.create();

    this.addTeamUserFormGroup = this.formBuilder.group({
      usernameControl: ['', Validators.required, this._usernameNotExistsValidator.isExists.bind(this._usernameNotExistsValidator)],
    });

    this.usernameControl =
      <FormControl>this.addTeamUserFormGroup.controls['usernameControl'];

    this._usernameNotExistsValidator.bindControl(this.usernameControl);
  }

  private _setAsNotAddingTeamUser(): void {
    this.isAddingTeamUser = false;
  }

  private _setAddTeamUserError(error: any): void {
    this.addTeamUserError = error;
  }

  private _onTeamMemberAdded(teamMemberDetails: ITeamMemberDetails): void {
    this.usernameControl.updateValue('');
    this.resetControlAsUntouchedAndNotDirty(this.usernameControl);

    this.teamMemberAddedEvent.emit(teamMemberDetails);

    setTimeout(() => Materialize.updateTextFields(), 0);
  }
}
