import {IUserPermission} from "../../../common/interfaces/iUserPermission";
import {GlobalPermissionsNamePipe} from "../../../common/pipes/globalPermissionsNamePipe";
import {CircularLoadingComponent} from "../../../common/components/circularLoading/circularLoading.component";
import {LoadingComponentBase} from "../../../common/components/loadingComponentBase/loadingComponentBase";
import {UserService} from "../../../common/services/userService";
import {IUsernameDetails} from "../../../common/interfaces/iUsernameDetails";
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'readonly-user-permissions',
  template: require('./readonlyUserPermissions.component.html'),
  styles: [require('./_readonlyUserPermissions.component.scss')],
  directives: [CircularLoadingComponent],
  pipes: [GlobalPermissionsNamePipe]
})
export class ReadonlyUserPermissionsComponent extends LoadingComponentBase<IUserPermission[]> implements OnInit {
  @Input() public userDetails: IUsernameDetails;
  @Output('userPermissions') public userPermissionsChanged: EventEmitter<IUserPermission[]>;
  public isLoadingUserPermissions: boolean;
  public loadingUserPermissionsError: any;
  public userPermissions: IUserPermission[];

  constructor(private userService: UserService) {
    super();

    this.userPermissionsChanged = new EventEmitter<IUserPermission[]>();
  }

  protected setIsLoading(value: boolean): void {
    this.isLoadingUserPermissions = value;
  }

  protected setLoadingError(error: any): void {
    this.loadingUserPermissionsError = error;
  }

  protected setLoadingResult(result: IUserPermission[]): void {
    this.userPermissions = result;

    if (result) {
      this.userPermissionsChanged.emit(result);
    }
  }

  protected get(): Observable<IUserPermission[]> {
    return this.userService.getUserPermissions(this.userDetails.id);
  }
}
