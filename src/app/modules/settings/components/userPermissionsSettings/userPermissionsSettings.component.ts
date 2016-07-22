import {UserService} from "../../../common/services/userService";
import {IUsernameDetails} from "../../../common/interfaces/iUsernameDetails";
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'user-permissions-settings',
  template: require('./userPermissionsSettings.component.html'),
  styles: [require('./userPermissionsSettings.component.scss')],
})
export class UserPermissionsSettingsComponent implements OnInit {
  @Input() public userDetails: IUsernameDetails;
  public isLoadingUserPermissions: boolean;
  public loadingUserPermissionsError: any;
  public userPermissions: string[];

  constructor(private userService: UserService) {
  }

  public ngOnInit(): void {
    this._loadUserPermissions();
  }

  public reloadUserPermissions(): void {
    this._loadUserPermissions();
  }

  private _loadUserPermissions(): void {
    this.isLoadingUserPermissions = true;
    this.loadingUserPermissionsError = null;
    this.userPermissions = null;

    this.userService.getUserPermissions(this.userDetails.id)
      .finally(() => this._setAsNotLoadingUSerPermissions())
      .subscribe((_permissions: string[]) => this._setUserPermissions(_permissions),
      (_error: any) => this._setLoadingUserPermissionsError(_error));
  }

  private _setAsNotLoadingUSerPermissions(): void {
    this.isLoadingUserPermissions = false;
  }

  private _setUserPermissions(permissions: string[]): void {
    this.userPermissions = permissions;
  }

  private _setLoadingUserPermissionsError(error: any): void {
    this.loadingUserPermissionsError = error;
  }
}
