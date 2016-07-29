import {IUsernameDetails} from "../../../common/interfaces/iUsernameDetails";
import { Component, Input } from '@angular/core';
import {UserPermissionsSettingsComponent} from "../userPermissionsSettings/userPermissionsSettings.component";

@Component({
  selector: 'user-settings',
  template: require('./userSettings.component.html'),
  styles: [require('./userSettings.component.scss')],
  directives: [UserPermissionsSettingsComponent]
})
export class UserSettingsComponent {
  @Input() public userDetails: IUsernameDetails;
}
