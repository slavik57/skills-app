import {LoadingComponentBase} from "../../../common/components/loadingComponentBase/loadingComponentBase";
import {UserService} from "../../../common/services/userService";
import {IUsernameDetails} from "../../../common/interfaces/iUsernameDetails";
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'user-permissions-settings',
  template: require('./userPermissionsSettings.component.html'),
  styles: [require('./userPermissionsSettings.component.scss')],
})
export class UserPermissionsSettingsComponent extends LoadingComponentBase<string[]> implements OnInit {
  @Input() public userDetails: IUsernameDetails;
  public isLoadingUserPermissions: boolean;
  public loadingUserPermissionsError: any;
  public userPermissions: string[];

  constructor(private userService: UserService) {
    super();
  }

  protected setIsLoading(value: boolean): void {
    this.isLoadingUserPermissions = value;
  }

  protected setLoadingError(error: any): void {
    this.loadingUserPermissionsError = error;
  }

  protected setLoadingResult(result: string[]): void {
    this.userPermissions = result;
  }

  protected get(): Observable<string[]> {
    return this.userService.getUserPermissions(this.userDetails.id);
  }
}
