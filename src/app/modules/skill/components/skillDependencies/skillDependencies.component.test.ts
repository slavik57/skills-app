import {ISkillNameDetails} from "../../../common/interfaces/iSkillNameDetails";
import {
  SkillDependenciesComponent,
  SkillDependenciesState
} from "./skillDependencies.component";
import {
  it,
  inject,
  describe,
  beforeEach,
  beforeEachProviders,
} from '@angular/core/testing';
import {expect} from 'chai';

describe('SkillDependenciesComponent', () => {

  var skillDetails: ISkillNameDetails;
  var component: SkillDependenciesComponent;

  beforeEachProviders(() => {
    return [
      SkillDependenciesComponent
    ];
  });

  beforeEach(inject([SkillDependenciesComponent], (_component: SkillDependenciesComponent) => {
    component = _component;

    skillDetails = {
      id: 12334,
      skillName: 'some skill name'
    };

    component.skillDetails = skillDetails;

    component.ngOnInit();
  }));

  it('SkillDependenciesState should be initialized correctly', () => {
    expect(component.SkillDependenciesState).to.be.equal(SkillDependenciesState);
  })

  it('state should be correct', () => {
    expect(component.state).to.be.equal(SkillDependenciesState.LIST_DEPENDENCIES);
  });

  describe('addDependency', () => {

    beforeEach(() => {
      component.addDependency();
    });

    it('should set state correctly', () => {
      expect(component.state).to.be.equal(SkillDependenciesState.ADD_DEPENDENCY);
    });

    describe('cancelAddingDependency', () => {

      beforeEach(() => {
        component.cancelAddingDependency();
      });

      it('should set state correctly', () => {
        expect(component.state).to.be.equal(SkillDependenciesState.LIST_DEPENDENCIES);
      });

    })

  });

});
