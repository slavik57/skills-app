import {UserPermissionsSettingsComponent} from "../userPermissionsSettings/userPermissionsSettings.component";
import {CircularLoadingComponent} from "../../../common/components/circularLoading/circularLoading.component";
import {IUsernameDetails} from "../../../common/interfaces/iUsernameDetails";
import {UserService} from "../../../common/services/userService";
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'users-settings',
  template: require('./usersSettings.component.html'),
  styles: [require('./usersSettings.component.scss')],
  directives: [CircularLoadingComponent, UserPermissionsSettingsComponent]
})
export class UsersSettingsComponent implements OnInit {
  public isLoadingUsers: boolean;
  public loadingUsersError: any;
  public usersDetails: IUsernameDetails[];
  public selectedUser: IUsernameDetails;
  @ViewChild('userDetailsList') public userDetailsList: ElementRef;
  @ViewChild('userSettingsModal') public userSettingsModal: ElementRef;

  constructor(private userService: UserService) {
  }

  public ngOnInit(): void {
    this._loadUserDetails();
  }

  public reloadUsersDetails(): void {
    this._loadUserDetails();
  }

  public selectUser(userDetails: IUsernameDetails): void {
    this.selectedUser = userDetails;

    $(this.userSettingsModal.nativeElement).openModal();
  }

  private _loadUserDetails(): void {
    this.isLoadingUsers = true;
    this.loadingUsersError = null;
    this.usersDetails = null;
    this.selectedUser = null;

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
