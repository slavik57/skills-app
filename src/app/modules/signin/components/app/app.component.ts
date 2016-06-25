import {CreditsComponent} from "../../../common/components/credits/credits.component";
import {RegisterComponent} from "../register/register.component";
import {SigninComponent} from "../signin/signin.component";
import {NavigationComponent} from "../../../common/components/navigation/navigation.component";
import { Component } from '@angular/core';
import { Router, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';
import * as _ from 'lodash';

@Component({
  selector: 'signin-app',
  template: require('./app.component.html'),
  styles: [require('./_app.component.scss')],
  directives: _.union(ROUTER_DIRECTIVES, [NavigationComponent, CreditsComponent]),
  providers: [
    ROUTER_PROVIDERS
  ]
})
@RouteConfig([
  {
    path: '/',
    name: 'Signin',
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
