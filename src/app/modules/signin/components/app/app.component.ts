import {RegisterComponent} from "../register/register.component";
import {SigninComponent} from "../signin/signin.component";
import {NavigationComponent} from "../../../navigation/components/navigation/navigation.component";
import { Component } from '@angular/core';
import { Router, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';
import * as _ from 'lodash';

@Component({
  selector: 'signin-app',
  template: require('./app.component.html'),
  styles: [require('./app.component.css')],
  directives: _.union(ROUTER_DIRECTIVES, [NavigationComponent]),
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
  constructor() {
  }
}