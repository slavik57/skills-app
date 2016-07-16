import {RegisterComponent} from "../register/register.component";
import {SigninComponent} from "../signin/signin.component";
import { provideRouter, RouterConfig } from '@angular/router';

const routes: RouterConfig = [
  {
    path: '',
    component: SigninComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  }
];

export const signinRouterProviders = [
  provideRouter(routes)
];
