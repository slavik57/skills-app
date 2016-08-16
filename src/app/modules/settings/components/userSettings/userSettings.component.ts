import {CircularLoadingComponent} from "../../../common/components/circularLoading/circularLoading.component";
import {UserService} from "../../../common/services/userService";
import {ChangeUserPasswordComponent} from "../../../user/components/changeUserPassword/changeUserPassword.component";
import {IUsernameDetails} from "../../../common/interfaces/iUsernameDetails";
import { Component, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {UserPermissionsSettingsComponent} from "../userPermissionsSettings/userPermissionsSettings.component";
import {LoadingComponentBase} from "../../../common/components/loadingComponentBase/loadingComponentBase";
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'user-settings',
  template: require('./userSettings.component.html'),
  styles: [require('./_userSettings.component.scss')],
  directives: [
    UserPermissionsSettingsComponent,
    ChangeUserPasswordComponent,
    CircularLoadingComponent
  ],
})
export class UserSettingsComponent extends LoadingComponentBase<boolean> implements AfterViewInit {
  @Input() public userDetails: IUsernameDetails;
  @ViewChild('availableUserSettings') availableUserSettings: ElementRef;
  public isCheckingCanUserUpdatePassword: boolean;
  public userUpdatePasswordCheckError: any;
  public canUserUpdatePassword: boolean;

  constructor(private userService: UserService) {
    super();
  }

  public ngAfterViewInit(): void {
    $(this.availableUserSettings.nativeElement).tabs();
  }

  public ngOnInit(): void {
    this.canUserUpdatePassword = false;

    super.ngOnInit();
  }

  protected get(): Observable<boolean> {
    return this.userService.canUserUpdatePassword(this.userDetails.id);
  }

  protected setIsLoading(value: boolean): void {
    this.isCheckingCanUserUpdatePassword = value;
  }

  protected setLoadingError(error: any): void {
    this.userUpdatePasswordCheckError = error;
  }

  protected setLoadingResult(result: boolean): void {
    if (!result) {
      result = false;
    }
    this.canUserUpdatePassword = result;
  }
}
