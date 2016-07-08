import {LocationService} from "../../../common/services/locationService";
import {UserService} from "../../../common/services/userService";
import {CreditsComponent} from "../../../common/components/credits/credits.component";
import {RegisterComponent} from "../register/register.component";
import {SigninComponent} from "../signin/signin.component";
import {NavigationComponent} from "../../../common/components/navigation/navigation.component";
import { Component } from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';
import { Router, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';
import * as _ from 'lodash';

@Component({
  selector: 'signin-app',
  template: require('./app.component.html'),
  styles: [require('./_app.component.scss')],
  directives: _.union(ROUTER_DIRECTIVES, [NavigationComponent, CreditsComponent]),
  providers: [
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    UserService,
    LocationService
  ]
})
@RouteConfig([
  {
    path: '/',
    name: 'Home',
    component: SigninComponent
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterComponent
  }
])
export class AppComponent {
}
