import {IUsernameDetails} from "../../../common/interfaces/iUsernameDetails";
import { Component, Input } from '@angular/core';

@Component({
  selector: 'user-permissions-settings',
  template: require('./userPermissionsSettings.component.html'),
  styles: [require('./userPermissionsSettings.component.scss')],
})
export class UserPermissionsSettingsComponent {
  @Input() public userDetails: IUsernameDetails;
}
