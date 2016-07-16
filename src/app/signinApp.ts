import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppComponent } from './modules/signin/components/app/app.component';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import { signinRouterProviders } from './modules/signin/components/app/app.routes';

if (process.env.ENV === 'production') {
  enableProdMode();
}
bootstrap(AppComponent, [
  signinRouterProviders,
  disableDeprecatedForms(),
  provideForms()
])
  .catch((err: any) => console.error(err));
