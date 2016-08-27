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
import { SkillDependantsComponent } from './skillDependants.component';

describe('SkillDependantsComponent', () => {

  var component: SkillDependantsComponent;

  beforeEachProviders(() => {
    return [
      SkillDependantsComponent
    ];
  });

  beforeEach(inject([SkillDependantsComponent], (_component: SkillDependantsComponent) => {
    component = _component;
  }));

});
