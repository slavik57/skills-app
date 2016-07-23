import {IUserPermission} from "../../../common/interfaces/iUserPermission";
import {GlobalPermissionsNamePipe} from "../../../common/pipes/globalPermissionsNamePipe";
import {CircularLoadingComponent} from "../../../common/components/circularLoading/circularLoading.component";
import {LoadingComponentBase} from "../../../common/components/loadingComponentBase/loadingComponentBase";
import {UserService} from "../../../common/services/userService";
import {IUsernameDetails} from "../../../common/interfaces/iUsernameDetails";
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'user-permissions-settings',
  template: require('./userPermissionsSettings.component.html'),
  styles: [require('./userPermissionsSettings.component.scss')],
  directives: [CircularLoadingComponent],
  pipes: [GlobalPermissionsNamePipe]
})
export class UserPermissionsSettingsComponent extends LoadingComponentBase<IUserPermission[]> implements OnInit {
  @Input() public userDetails: IUsernameDetails;
  public isLoadingUserPermissions: boolean;
  public loadingUserPermissionsError: any;
  public userPermissions: IUserPermission[];

  constructor(private userService: UserService) {
    super();
  }

  protected setIsLoading(value: boolean): void {
    this.isLoadingUserPermissions = value;
  }

  protected setLoadingError(error: any): void {
    this.loadingUserPermissionsError = error;
  }

  protected setLoadingResult(result: IUserPermission[]): void {
    this.userPermissions = result;
  }

  protected get(): Observable<IUserPermission[]> {
    return this.userService.getUserPermissions(this.userDetails.id);
  }
}
