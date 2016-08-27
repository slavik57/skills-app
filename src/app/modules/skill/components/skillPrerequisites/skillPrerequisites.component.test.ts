import {ISkillNameDetails} from "../../../common/interfaces/iSkillNameDetails";
import {
  SkillPrerequisitesComponent,
  SkillPrerequisitesState
} from "./skillPrerequisites.component";
import {
  it,
  inject,
  describe,
  beforeEach,
  beforeEachProviders,
} from '@angular/core/testing';
import {expect} from 'chai';

describe('SkillPrerequisitesComponent', () => {

  var skillDetails: ISkillNameDetails;
  var component: SkillPrerequisitesComponent;

  beforeEachProviders(() => {
    return [
      SkillPrerequisitesComponent
    ];
  });

  beforeEach(inject([SkillPrerequisitesComponent], (_component: SkillPrerequisitesComponent) => {
    component = _component;

    skillDetails = {
      id: 12334,
      skillName: 'some skill name'
    };

    component.skillDetails = skillDetails;

    component.ngOnInit();
  }));

  it('SkillPrerequisitesState should be initialized correctly', () => {
    expect(component.SkillPrerequisitesState).to.be.equal(SkillPrerequisitesState);
  })

  it('state should be correct', () => {
    expect(component.state).to.be.equal(SkillPrerequisitesState.LIST_PREREQUISITES);
  });

  describe('addPrerequisite', () => {

    beforeEach(() => {
      component.addPrerequisite();
    });

    it('should set state correctly', () => {
      expect(component.state).to.be.equal(SkillPrerequisitesState.ADD_PREREQUISITE);
    });

    describe('cancelAddingPrerequisite', () => {

      beforeEach(() => {
        component.cancelAddingPrerequisite();
      });

      it('should set state correctly', () => {
        expect(component.state).to.be.equal(SkillPrerequisitesState.LIST_PREREQUISITES);
      });

    })

  });

});
