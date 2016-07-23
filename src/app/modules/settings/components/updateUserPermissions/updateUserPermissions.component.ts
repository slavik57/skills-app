import {IUserPermissionRule} from "../../../common/interfaces/iUserPermissionRule";
import {IUserPermission} from "../../../common/interfaces/iUserPermission";
import {GlobalPermissionsNamePipe} from "../../../common/pipes/globalPermissionsNamePipe";
import {CircularLoadingComponent} from "../../../common/components/circularLoading/circularLoading.component";
import {LoadingComponentBase} from "../../../common/components/loadingComponentBase/loadingComponentBase";
import {UserService} from "../../../common/services/userService";
import {IUsernameDetails} from "../../../common/interfaces/iUsernameDetails";
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'update-user-permissions',
  template: require('./updateUserPermissions.component.html'),
  styles: [require('./updateUserPermissions.component.scss')],
  directives: [CircularLoadingComponent],
  pipes: [GlobalPermissionsNamePipe]
})
export class UpdateUserPermissionsComponent extends LoadingComponentBase<IUserPermissionRule[]> implements OnInit {
  @Input() public userDetails: IUsernameDetails;
  @Input() public userPermissions: IUserPermission[];
  public isLoadingUserPermissionsRules: boolean;
  public loadingUserPermissionsRulesError: any;
  public userPermissionsRules: IUserPermissionRule[];

  constructor(private userService: UserService) {
    super();
  }

  public canEditPermission(permission: IUserPermission): boolean {
    if (!this.userPermissionsRules) {
      return false;
    }

    var permissionRule: IUserPermissionRule =
      this.userPermissionsRules.find(_ => _.value === permission.value)

    return permissionRule.allowedToChange;
  }

  public hasPermission(permission: IUserPermission): boolean {
    var userPermissionValues =
      this.userPermissions.map(_ => _.value);

    return userPermissionValues.indexOf(permission.value) >= 0;
  }

  protected setIsLoading(value: boolean): void {
    this.isLoadingUserPermissionsRules = value;
  }

  protected setLoadingError(error: any): void {
    this.loadingUserPermissionsRulesError = error;
  }

  protected setLoadingResult(result: IUserPermissionRule[]): void {
    this.userPermissionsRules = result;
  }

  protected get(): Observable<IUserPermissionRule[]> {
    return this.userService.getUserPermissionsModificationRules();
  }
}
