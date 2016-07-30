import {SettingsComponent} from "../../../settings/components/settings/settings.component";
import {HomeComponent} from "../home/home.component";
import {UserProfileComponent} from "../../../user/components/userProfile/userProfile.component";
import { Component } from '@angular/core';
import {NavigationComponent} from "../../../common/components/navigation/navigation.component";
import {CreditsComponent} from "../../../common/components/credits/credits.component";
import { ROUTER_DIRECTIVES } from '@angular/router';
import { HTTP_PROVIDERS } from '@angular/http';
import {UserService} from "../../../common/services/userService";
import * as _ from 'lodash';

@Component({
  selector: 'skills-app',
  template: require('./app.component.html'),
  styles: [require('./app.component.scss')],
  directives: _.union(ROUTER_DIRECTIVES, [NavigationComponent, CreditsComponent]),
  providers: [
    HTTP_PROVIDERS,
    UserService
  ],
  precompile: [HomeComponent, UserProfileComponent, SettingsComponent]
})
export class AppComponent {
}
