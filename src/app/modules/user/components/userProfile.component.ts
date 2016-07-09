import {FormComponentBase} from "../../common/components/formComponentBase/formComponentBase";
import {CircularLoadingComponent} from "../../common/components/circularLoading/circularLoading.component";
import {EditUserProfile} from "../models/editUserProfileModel";
import {UserService, IUserDetails} from "../../common/services/userService";
import { Component, OnInit } from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'user-profile',
  template: require('./userProfile.component.html'),
  styles: [require('./_userProfile.component.scss')],
  directives: [REACTIVE_FORM_DIRECTIVES, CircularLoadingComponent]
})
export class UserProfileComponent extends FormComponentBase implements OnInit {
  public model: EditUserProfile;
  public gettingUserDetails: boolean;
  public gettingUserDetailsError: any;

  constructor(private userService: UserService) {
    super();
  }

  public ngOnInit(): void {
    this.loadUserDetails();
  }

  public canReloadUserDetails(): boolean {
    return !this.gettingUserDetails &&
      !!this.gettingUserDetailsError;
  }

  public loadUserDetails(): void {
    this.gettingUserDetailsError = null;
    this.gettingUserDetails = true;

    this.userService.getUserDetails()
      .finally(() => this._setAsNotGettingUserDetails())
      .subscribe((userDetails: IUserDetails) => this._initializeEditUserProfileModel(userDetails),
      (error: any) => this._setGettingUserDetailsError(error));
  }

  private _setAsNotGettingUserDetails(): void {
    this.gettingUserDetails = false;
  }

  private _initializeEditUserProfileModel(userDetails: IUserDetails): void {
    this.model = EditUserProfile.fromUserDetails(userDetails);
    setTimeout(() => Materialize.updateTextFields(), 0);
  }

  private _setGettingUserDetailsError(error: any): void {
    this.gettingUserDetailsError = error;
  }
}
