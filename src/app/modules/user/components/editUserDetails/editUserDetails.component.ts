import {FormComponentBase} from "../../../common/components/formComponentBase/formComponentBase";
import {CircularLoadingComponent} from "../../../common/components/circularLoading/circularLoading.component";
import {EditUserProfile} from "../../models/editUserProfileModel";
import {UserService, IUserDetails} from "../../../common/services/userService";
import { Component, OnInit } from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import {IUsernameExistsValidator, UsernameExistsValidator, UsernameExistsValidatorFactory} from "../../../common/validators/usernameExistsValidator";
import {EmailValidator} from "../../../common/validators/emailValidator";

@Component({
  selector: 'edit-user-details',
  template: require('./editUserDetails.component.html'),
  styles: [require('./_editUserDetails.component.scss')],
  directives: [REACTIVE_FORM_DIRECTIVES, CircularLoadingComponent],
  providers: [FormBuilder, UsernameExistsValidatorFactory]
})
export class EditUserDetailsComponent extends FormComponentBase implements OnInit {
  private _originalUserDetails: IUserDetails;

  public model: EditUserProfile;
  public gettingUserDetails: boolean;
  public gettingUserDetailsError: any;
  public userDetailsFormGroup: FormGroup;
  public updatingUserDetails: boolean;
  public updatingUserDetailsError: any;

  constructor(private userService: UserService,
    private formBuilder: FormBuilder,
    private usernameExistsValidatorFactory: UsernameExistsValidatorFactory) {
    super();
  }

  public ngOnInit(): void {
    this.updatingUserDetails = false;

    this.loadUserDetails();
  }

  public loadUserDetails(): void {
    this.gettingUserDetailsError = null;
    this.gettingUserDetails = true;

    this.userService.getUserDetails()
      .finally(() => this._setAsNotGettingUserDetails())
      .subscribe((userDetails: IUserDetails) => this._initializeEditUserProfile(userDetails),
      (error: any) => this._setGettingUserDetailsError(error));
  }

  public canUpdateUserDetails(): boolean {
    return this.userDetailsFormGroup.valid && this._isUserDetailsChanged();
  }

  public updateUserDetails(): void {
    this.updatingUserDetails = true;
    this.updatingUserDetailsError = null;

    this.userService.updateUserDetails(this._originalUserDetails.id,
      this.model.username,
      this.model.email,
      this.model.firstName,
      this.model.lastName)
      .finally(() => this._setAsNotUpdatingUserDetails())
      .subscribe(
      () => this._updateTheOriginalUserDetailsByModel(),
      (error: any) => this._setUpdatingUserDetailsError(error));
  }

  private _setAsNotGettingUserDetails(): void {
    this.gettingUserDetails = false;
  }

  private _initializeEditUserProfile(userDetails: IUserDetails): void {
    this._originalUserDetails = userDetails;

    this.model = EditUserProfile.fromUserDetails(userDetails);
    this._initializeFormGroup();
    setTimeout(() => Materialize.updateTextFields(), 0);
  }

  private _setGettingUserDetailsError(error: any): void {
    this.gettingUserDetailsError = error;
  }

  private _initializeFormGroup(): void {
    var usernameExistsValidator: IUsernameExistsValidator =
      this.usernameExistsValidatorFactory.createWithAllowedUsers([this.model.username]);

    this.userDetailsFormGroup = this.formBuilder.group({
      username: [this.model.username, Validators.required, usernameExistsValidator.usernameExists.bind(usernameExistsValidator)],
      email: [this.model.email, EmailValidator.mailFormat],
      firstName: [this.model.firstName, Validators.required],
      lastName: [this.model.lastName, Validators.required]
    });

    usernameExistsValidator.bindControl(this.userDetailsFormGroup.controls['username']);
  }

  private _isUserDetailsChanged(): boolean {
    return this._originalUserDetails.username !== this.model.username ||
      this._isEmailDifferent() ||
      this._originalUserDetails.firstName !== this.model.firstName ||
      this._originalUserDetails.lastName !== this.model.lastName;
  }

  private _isEmailDifferent(): boolean {
    if (this._originalUserDetails.email === this.model.email) {
      return false;
    }

    if (this._isNullUndefinedOrEmptyString(this._originalUserDetails.email) &&
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

  private _updateTheOriginalUserDetailsByModel(): void {
    this._originalUserDetails.username = this.model.username;
    this._originalUserDetails.email = this.model.email;
    this._originalUserDetails.firstName = this.model.firstName;
    this._originalUserDetails.lastName = this.model.lastName;
  }
}
