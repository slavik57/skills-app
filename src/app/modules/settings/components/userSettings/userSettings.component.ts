import {ChangeUserPasswordComponent} from "../../../user/components/changeUserPassword/changeUserPassword.component";
import {IUsernameDetails} from "../../../common/interfaces/iUsernameDetails";
import { Component, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {UserPermissionsSettingsComponent} from "../userPermissionsSettings/userPermissionsSettings.component";

@Component({
  selector: 'user-settings',
  template: require('./userSettings.component.html'),
  styles: [require('./userSettings.component.scss')],
  directives: [UserPermissionsSettingsComponent, ChangeUserPasswordComponent],
})
export class UserSettingsComponent implements AfterViewInit {
  @Input() public userDetails: IUsernameDetails;
  @ViewChild('availableUserSettings') availableUserSettings: ElementRef;

  public ngAfterViewInit(): void {
    $(this.availableUserSettings.nativeElement).tabs();
  }
}
