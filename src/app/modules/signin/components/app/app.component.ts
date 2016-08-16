import {LocationService} from "../../../common/services/locationService";
import {UserService} from "../../../common/services/userService";
import {CreditsComponent} from "../../../common/components/credits/credits.component";
import {RegisterComponent} from "../register/register.component";
import {SigninComponent} from "../signin/signin.component";
import {NavigationComponent} from "../../../common/components/navigation/navigation.component";
import { Component } from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';
import * as _ from 'lodash';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
  selector: 'signin-app',
  template: require('./app.component.html'),
  styles: [require('./_app.component.scss')],
  directives: _.union(ROUTER_DIRECTIVES, [NavigationComponent, CreditsComponent]),
  providers: [
    HTTP_PROVIDERS,
    UserService,
    LocationService
  ],
  precompile: [SigninComponent, RegisterComponent]
})
export class AppComponent {
}
