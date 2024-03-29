import {UpdateUserPermissionsComponent} from "../updateUserPermissions/updateUserPermissions.component";
import {ReadonlyUserPermissionsComponent} from "../readonlyUserPermissions/readonlyUserPermissions.component";
import {CircularLoadingComponent} from "../../../common/components/circularLoading/circularLoading.component";
import {IUsernameDetails} from "../../../common/interfaces/iUsernameDetails";
import { Component, Input, OnInit } from '@angular/core';

export enum UserPermissionsSettingsState {
  READONLY,
  UPDATE
}

@Component({
  selector: 'user-permissions-settings',
  template: require('./userPermissionsSettings.component.html'),
  styles: [require('./_userPermissionsSettings.component.scss')],
  directives: [CircularLoadingComponent, ReadonlyUserPermissionsComponent, UpdateUserPermissionsComponent],
})
export class UserPermissionsSettingsComponent implements OnInit {
  @Input() public userDetails: IUsernameDetails;
  public state: UserPermissionsSettingsState;
  public UserPermissionsSettingsState: any;

  public ngOnInit(): void {
    this.UserPermissionsSettingsState = UserPermissionsSettingsState;
    this.state = UserPermissionsSettingsState.READONLY;
  }

  public updatePermissions(): void {
    this.state = UserPermissionsSettingsState.UPDATE;
  }

  public cancelUpdatingPermissions(): void {
    this.state = UserPermissionsSettingsState.READONLY;
  }
}
