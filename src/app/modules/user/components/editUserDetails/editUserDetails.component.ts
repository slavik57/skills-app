import {FormComponentBase} from "../../../common/components/formComponentBase/formComponentBase";
import {CircularLoadingComponent} from "../../../common/components/circularLoading/circularLoading.component";
import {EditUserProfile} from "../../models/editUserProfileModel";
import {UserService, IUserDetails} from "../../../common/services/userService";
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import {IUsernameExistsValidator, UsernameExistsValidator, UsernameExistsValidatorFactory} from "../../../common/validators/usernameExistsValidator";
import {EmailValidator} from "../../../common/validators/emailValidator";

@Component({
  selector: 'edit-user-details',
  template: require('./editUserDetails.component.html'),
  styles: [require('./editUserDetails.component.scss')],
  directives: [REACTIVE_FORM_DIRECTIVES, CircularLoadingComponent],
  providers: [FormBuilder, UsernameExistsValidatorFactory]
})
export class EditUserDetailsComponent extends FormComponentBase implements OnInit, OnDestroy {
  @Input() public userDetails: IUserDetails;

  public model: EditUserProfile;
  public userDetailsFormGroup: FormGroup;
  public updatingUserDetails: boolean;
  public updatingUserDetailsError: any;
  public isUserDetailsUpdated: boolean;

  private _usernameExistsValidator: IUsernameExistsValidator;

  constructor(private userService: UserService,
    private formBuilder: FormBuilder,
    private usernameExistsValidatorFactory: UsernameExistsValidatorFactory) {
    super();
  }

  public ngOnInit(): void {
    if (!this.userDetails) {
      throw 'userDetails is not set';
    }

    this.updatingUserDetails = false;
    this.isUserDetailsUpdated = false;

    this._initializeEditUserProfile();
  }

  public ngOnDestroy(): void {
    this._usernameExistsValidator.destroy();
  }

  public canUpdateUserDetails(): boolean {
    return this.userDetailsFormGroup.valid && this._isUserDetailsChanged();
  }

  public updateUserDetails(): void {
    this.updatingUserDetails = true;
    this.updatingUserDetailsError = null;
    this.isUserDetailsUpdated = false;

    this.userService.updateUserDetails(this.userDetails.id,
      this.model.username,
      this.model.email,
      this.model.firstName,
      this.model.lastName)
      .finally(() => this._setAsNotUpdatingUserDetails())
      .subscribe(
      () => this._setUserDetailsAsUpdated(),
      (error: any) => this._setUpdatingUserDetailsError(error));
  }

  private _initializeEditUserProfile(): void {
    this.model = EditUserProfile.fromUserDetails(this.userDetails);
    this._initializeFormGroup();
    setTimeout(() => Materialize.updateTextFields(), 0);
  }

  private _initializeFormGroup(): void {
    this._usernameExistsValidator =
      this.usernameExistsValidatorFactory.createWithAllowedUsers([this.model.username]);

    this.userDetailsFormGroup = this.formBuilder.group({
      username: [this.model.username, Validators.required, this._usernameExistsValidator.usernameExists.bind(this._usernameExistsValidator)],
      email: [this.model.email, EmailValidator.mailFormat],
      firstName: [this.model.firstName, Validators.required],
      lastName: [this.model.lastName, Validators.required]
    });

    this._usernameExistsValidator.bindControl(this.userDetailsFormGroup.controls['username']);
  }

  private _isUserDetailsChanged(): boolean {
    return this.userDetails.username !== this.model.username ||
      this._isEmailDifferent() ||
      this.userDetails.firstName !== this.model.firstName ||
      this.userDetails.lastName !== this.model.lastName;
  }

  private _isEmailDifferent(): boolean {
    if (this.userDetails.email === this.model.email) {
      return false;
    }

    if (this._isNullUndefinedOrEmptyString(this.userDetails.email) &&
      this._isNullUndefinedOrEmptyString(this.model.email)) {
      return false;
    }

    return true;
  }

  private _isNullUndefinedOrEmptyString(value: string): boolean {
    return value === null || value === undefined || value === '';
  }

  private _setAsNotUpdatingUserDetails(): void {
    this.updatingUserDetails = false;
  }

  private _setUpdatingUserDetailsError(error: any): void {
    this.updatingUserDetailsError = error;
  }

  private _setUserDetailsAsUpdated(): void {
    this.userDetails.username = this.model.username;
    this.userDetails.email = this.model.email;
    this.userDetails.firstName = this.model.firstName;
    this.userDetails.lastName = this.model.lastName;

    this.isUserDetailsUpdated = true;
  }
}
