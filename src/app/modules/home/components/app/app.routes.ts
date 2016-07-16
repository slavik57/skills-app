import {settingsRoutes} from "../../../settings/components/settings/settings.routes";
import {SettingsComponent} from "../../../settings/components/settings/settings.component";
import {UserProfileComponent} from "../../../user/components/userProfile/userProfile.component";
import {HomeComponent} from "../home/home.component";
import { provideRouter, RouterConfig } from '@angular/router';

const routes: RouterConfig = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'profile',
    component: UserProfileComponent
  },
  ...settingsRoutes,
  {
    path: 'skillsPrerequisites',
    component: HomeComponent
  },
  {
    path: 'skills',
    component: HomeComponent
  },
  {
    path: 'teams',
    component: HomeComponent
  }
];

export const appRouterProviders = [
  provideRouter(routes)
];
