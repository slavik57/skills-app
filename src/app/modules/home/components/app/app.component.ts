import {UserProfileComponent} from "../../../user/components/userProfile/userProfile.component";
import {HomeComponent} from "../home/home.component";
import { Component } from '@angular/core';
import {NavigationComponent} from "../../../common/components/navigation/navigation.component";
import {CreditsComponent} from "../../../common/components/credits/credits.component";
import { Router, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { HTTP_PROVIDERS } from '@angular/http';
import {UserService} from "../../../common/services/userService";
import * as _ from 'lodash';

@Component({
  selector: 'skills-app',
  template: require('./app.component.html'),
  styles: [require('./_app.component.scss')],
  directives: _.union(ROUTER_DIRECTIVES, [NavigationComponent, CreditsComponent]),
  providers: [
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    UserService
  ]
})
@RouteConfig([
  {
    path: '/',
    name: 'Home',
    component: HomeComponent
  },
  {
    path: '/profile',
    name: 'UserProfile',
    component: UserProfileComponent
  },
  {
    path: '/settings',
    name: 'Settings',
    component: HomeComponent
  },
  {
    path: '/skillsPrerequisites',
    name: 'SkillsPrerequisites',
    component: HomeComponent
  },
  {
    path: '/skills',
    name: 'Skills',
    component: HomeComponent
  },
  {
    path: '/teams',
    name: 'Teams',
    component: HomeComponent
  }
])
export class AppComponent {
}
