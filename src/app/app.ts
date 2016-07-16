import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppComponent } from './modules/home/components/app/app.component';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import { appRouterProviders } from './modules/home/components/app/app.routes';

if (process.env.ENV === 'production') {
  enableProdMode();
}
bootstrap(AppComponent, [
  appRouterProviders,
  disableDeprecatedForms(),
  provideForms()
])
  .catch((err: any) => console.error(err));
