import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppComponent } from './modules/app.component';
if (process.env.ENV === 'production') {
  enableProdMode();
}
bootstrap(AppComponent, []);
