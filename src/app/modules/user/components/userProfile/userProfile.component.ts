import {CircularLoadingComponent} from "../../../common/components/circularLoading/circularLoading.component";
import {UserService} from "../../../common/services/userService";
import {ChangeUserPasswordComponent} from "../changeUserPassword/changeUserPassword.component";
import {EditUserDetailsComponent} from "../editUserDetails/editUserDetails.component";
import { Component, OnInit } from '@angular/core';
import { IUserDetails} from '../../../common/services/userService';

@Component({
  selector: 'user-profile',
  template: require('./userProfile.component.html'),
  styles: [require('./_userProfile.component.scss')],
  directives: [EditUserDetailsComponent, ChangeUserPasswordComponent, CircularLoadingComponent],
})
export class UserProfileComponent implements OnInit {
  public gettingUserDetails: boolean;
  public gettingUserDetailsError: any;
  public userDetails: IUserDetails;

  constructor(private userService: UserService) {
  }

  public ngOnInit(): void {
    this.loadUserDetails();
  }

  public loadUserDetails(): void {
    this.gettingUserDetailsError = null;
    this.gettingUserDetails = true;

    this.userService.getUserDetails()
      .finally(() => this._setAsNotGettingUserDetails())
      .subscribe((userDetails: IUserDetails) => this._setUserDetails(userDetails),
      (error: any) => this._setGettingUserDetailsError(error));
  }

  private _setAsNotGettingUserDetails(): void {
    this.gettingUserDetails = false;
  }

  private _setUserDetails(userDetails: IUserDetails): void {
    this.userDetails = userDetails;
  }

  private _setGettingUserDetailsError(error: any): void {
    this.gettingUserDetailsError = error;
  }
}
