import {SkillsSettingsComponent} from "../skillsSettings/skillsSettings.component";
import {TeamsSettingsComponent} from "../teamsSettings/teamsSettings.component";
import {UsersSettingsComponent} from "../usersSettings/usersSettings.component";
import {SettingsComponent} from "./settings.component";
import { RouterConfig } from '@angular/router';

export const settingsRoutes: RouterConfig = [
  {
    path: 'settings',
    component: SettingsComponent,
    children: [
      {
        path: '',
        redirectTo: 'users'
      },
      {
        path: 'users',
        component: UsersSettingsComponent
      },
      {
        path: 'teams',
        component: TeamsSettingsComponent
      },
      {
        path: 'skills',
        component: SkillsSettingsComponent
      }
    ]
  }];
