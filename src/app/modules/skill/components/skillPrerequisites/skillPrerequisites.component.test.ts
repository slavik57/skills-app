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
import { SkillPrerequisitesComponent } from './skillPrerequisites.component';

describe('SkillPrerequisitesComponent', () => {

  var component: SkillPrerequisitesComponent;

  beforeEachProviders(() => {
    return [
      SkillPrerequisitesComponent
    ];
  });

  beforeEach(inject([SkillPrerequisitesComponent], (_component: SkillPrerequisitesComponent) => {
    component = _component;
  }));

});
