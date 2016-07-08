import {
  it,
  inject,
  describe,
  beforeEachProviders,
} from '@angular/core/testing';

import {expect} from 'chai';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {

  beforeEachProviders(() => [
    HomeComponent
  ]);

  it('should work', inject([HomeComponent], (home: HomeComponent) => {
    expect(true).to.be.true;
  }));

});
