import {
  it,
  inject,
  describe,
  beforeEachProviders,
} from '@angular/core/testing';

import {expect} from 'chai';

import { AppComponent } from './app.component';

describe('AppComponent', () => {

  beforeEachProviders(() => [
    AppComponent
  ]);

  it('should work', inject([AppComponent], (app: AppComponent) => {
    expect(true).to.be.true;
  }));

});
