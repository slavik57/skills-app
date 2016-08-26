import {
  it,
  inject,
  describe,
  beforeEach,
  beforeEachProviders,
} from '@angular/core/testing';
import {provide} from '@angular/core';
import {SinonSpy, stub, spy} from 'sinon';
import {expect} from 'chai';
import { SkillSettingsComponent } from './skillSettings.component';

describe('SkillSettingsComponent', () => {

  var component: SkillSettingsComponent;

  beforeEachProviders(() => {
    return [
      SkillSettingsComponent
    ];
  });

  beforeEach(inject([SkillSettingsComponent], (_component: SkillSettingsComponent) => {
    component = _component;
  }));

});
