import {EditUserProfile} from "../models/editUserProfileModel";
import {UserService, IUserDetails} from "../../common/services/userService";
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'user-profile',
  template: require('./userProfile.component.html'),
  styles: [require('./_userProfile.component.scss')],
})
export class UserProfileComponent implements OnInit {
  public editUserProfileModel: EditUserProfile;
  public gettingUserDetails: boolean;
  public gettingUserDetailsError: any;

  constructor(private userService: UserService) {
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
    this.editUserProfileModel = EditUserProfile.fromUserDetails(userDetails);
  }

  private _setGettingUserDetailsError(error: any): void {
    this.gettingUserDetailsError = error;
  }
}
