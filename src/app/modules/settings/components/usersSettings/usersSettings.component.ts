import {IUsernameDetails} from "../../../common/interfaces/iUsernameDetails";
import {UserService} from "../../../common/services/userService";
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'users-settings',
  template: require('./usersSettings.component.html'),
  // styles: [require('./usersSettings.component.scss')],
})
export class UsersSettingsComponent implements OnInit {
  public isLoadingUsers: boolean;
  public loadingUsersError: any;
  public usersDetails: IUsernameDetails[];

  constructor(private userService: UserService) {
  }

  public ngOnInit(): void {
    this._loadUserDetails();
  }

  public reloadUsersDetails(): void {
    this._loadUserDetails();
  }

  private _loadUserDetails(): void {
    this.isLoadingUsers = true;
    this.loadingUsersError = null;
    this.usersDetails = null;

    this.userService.getUsersDetails()
      .finally(() => this._setAsFinishedLoadingUsers())
      .subscribe((_usersDetails: IUsernameDetails[]) => this._setUserDetails(_usersDetails),
      (_error) => this._setGettingUsersError(_error));
  }

  private _setAsFinishedLoadingUsers(): void {
    this.isLoadingUsers = false;
  }

  private _setUserDetails(usersDetails: IUsernameDetails[]): void {
    this.usersDetails = usersDetails;
  }

  private _setGettingUsersError(error: any): void {
    this.loadingUsersError = error;
  }
}
