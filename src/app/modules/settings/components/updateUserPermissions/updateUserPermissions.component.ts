import {IUserPermissionRule} from "../../../common/interfaces/iUserPermissionRule";
import {IUserPermission} from "../../../common/interfaces/iUserPermission";
import {GlobalPermissionsNamePipe} from "../../../common/pipes/globalPermissionsNamePipe";
import {CircularLoadingComponent} from "../../../common/components/circularLoading/circularLoading.component";
import {LoadingComponentBase} from "../../../common/components/loadingComponentBase/loadingComponentBase";
import {UserService} from "../../../common/services/userService";
import {IUsernameDetails} from "../../../common/interfaces/iUsernameDetails";
import { Component, Input, Output, OnInit, NgZone, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

interface IPermissionAvailabilityMap {
  [permissionValue: number]: boolean;
}

interface IUserPermissionsToChange {
  permissionsToAdd: IUserPermission[];
  permissionsToRemove: IUserPermission[];
}

@Component({
  selector: 'update-user-permissions',
  template: require('./updateUserPermissions.component.html'),
  styles: [require('./_updateUserPermissions.component.scss')],
  directives: [CircularLoadingComponent],
  pipes: [GlobalPermissionsNamePipe]
})
export class UpdateUserPermissionsComponent extends LoadingComponentBase<IUserPermissionRule[]> implements OnInit {
  @Input() public userDetails: IUsernameDetails;
  @Input() public userPermissions: IUserPermission[];
  @Output('cancel') public cancelEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output('updatedUserPermissions') public updatedUserPermissionsEvent: EventEmitter<void> = new EventEmitter<void>();
  public isLoadingUserPermissionsRules: boolean;
  public loadingUserPermissionsRulesError: any;
  public userPermissionsRules: IUserPermissionRule[];
  public isSavingUserPermissions: boolean;
  public savingUserPermissionsError: any;
  private _userPermissionAvailabilityMap: IPermissionAvailabilityMap;

  constructor(private userService: UserService, private zone: NgZone) {
    super();
  }

  public ngOnInit(): void {
    this.isSavingUserPermissions = false;
    this.savingUserPermissionsError = null;
    this._userPermissionAvailabilityMap = {};

    super.ngOnInit();
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

  public setPermission(permission: IUserPermission, hasPermission: boolean): void {
    this._userPermissionAvailabilityMap[permission.value] = hasPermission;

    this.zone.run(() => { });
  }

  public isPermissionsChanged(): boolean {
    if (!this.userPermissionsRules) {
      return false;
    }

    for (var permissionRule of this.userPermissionsRules) {
      var originalHasPermission = this.hasPermission(permissionRule);

      var currentHasPermission = this._userPermissionAvailabilityMap[permissionRule.value];

      if (originalHasPermission !== currentHasPermission) {
        return true;
      }
    }

    return false;
  }

  public savePermissions(): void {
    this._setSavingUserPermissions(true);
    this._setSavingUerPermissionsError(null);

    var permissionsToChange: IUserPermissionsToChange = this._getPermissionsToChange();


    this.userService.updateUserPermissions(this.userDetails.id,
      permissionsToChange.permissionsToAdd,
      permissionsToChange.permissionsToRemove)
      .finally(() => this._setSavingUserPermissions(false))
      .subscribe(() => this._invalidateUserPermissionsAfterPermissionsUpdate(),
      (_error) => this._setSavingUerPermissionsError(_error));
  }

  public cancel(): void {
    this.cancelEvent.emit(null);
  }

  protected setIsLoading(value: boolean): void {
    this.isLoadingUserPermissionsRules = value;
  }

  protected setLoadingError(error: any): void {
    this.loadingUserPermissionsRulesError = error;
  }

  protected setLoadingResult(result: IUserPermissionRule[]): void {
    this.userPermissionsRules = result;

    if (!result) {
      return;
    }

    result.forEach((_permissionRule: IUserPermissionRule) => {
      this._userPermissionAvailabilityMap[_permissionRule.value] = this.hasPermission(_permissionRule);
    });
  }

  protected get(): Observable<IUserPermissionRule[]> {
    return this.userService.getUserPermissionsModificationRules();
  }

  private _setSavingUserPermissions(value: boolean): void {
    this.isSavingUserPermissions = value;
  }

  private _getPermissionsToChange(): IUserPermissionsToChange {
    var result: IUserPermissionsToChange = {
      permissionsToAdd: [],
      permissionsToRemove: []
    }

    for (var permissionRule of this.userPermissionsRules) {
      var originalHasPermission = this.hasPermission(permissionRule);
      var currentHasPermission = this._userPermissionAvailabilityMap[permissionRule.value];

      if (originalHasPermission && !currentHasPermission) {
        result.permissionsToRemove.push(permissionRule);
      }

      if (!originalHasPermission && currentHasPermission) {
        result.permissionsToAdd.push(permissionRule);
      }
    }

    return result;
  }

  private _setSavingUerPermissionsError(error: any): void {
    this.savingUserPermissionsError = error;
  }

  private _invalidateUserPermissionsAfterPermissionsUpdate(): void {
    this.userPermissions = [];

    for (var permission of this.userPermissionsRules) {
      if (this._userPermissionAvailabilityMap[permission.value]) {
        this.userPermissions.push(permission);
      }
    }

    this.updatedUserPermissionsEvent.emit(null);
  }
}
