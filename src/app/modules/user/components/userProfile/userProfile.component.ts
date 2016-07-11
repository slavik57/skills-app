import {EditUserDetailsComponent} from "../editUserDetails/editUserDetails.component";
import { Component } from '@angular/core';

@Component({
  selector: 'user-profile',
  template: require('./userProfile.component.html'),
  styles: [require('./_userProfile.component.scss')],
  directives: [EditUserDetailsComponent],
})
export class UserProfileComponent {
}
