import {ISkillPrerequisiteDetails} from "../../../common/interfaces/iSkillPrerequisiteDetails";
import {ISkillNameDetails} from "../../../common/interfaces/iSkillNameDetails";
import {SkillServiceMockFactory} from "../../../../testUtils/mockFactories/skillServiceMockFactory";
import {IValidationResult} from "../../../common/validators/iValidationResult";
import {FormFiller} from "../../../../testUtils/formFiller";
import {
  it,
  inject,
  describe,
  beforeEach,
  afterEach,
  beforeEachProviders,
  tick,
  fakeAsync
} from '@angular/core/testing';
import {provide} from '@angular/core';
import {ISkillService, SkillService} from "../../../common/services/skillService";
import {SinonSpy, spy, stub} from 'sinon';
import {expect} from 'chai';
import {AddSkillPrerequisiteComponent} from "./addSkillPrerequisite.component";
import { Subject } from 'rxjs/Subject';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  ISkillNotExistsValidator,
  SkillNotExistsValidator,
  ISkillNotExistsValidatorFactory,
  SkillNotExistsValidatorFactory
} from "../../../common/validators/skillNotExistsValidator";

describe('AddSkillPrerequisiteComponent', () => {

  var skillDetails: ISkillNameDetails;
  var skillServiceMock: ISkillService;
  var component: AddSkillPrerequisiteComponent;
  var getSkillsDetailsByPartialSkillNameSpy: SinonSpy;
  var getSkillsDetailsByPartialSkillNameResult: Subject<ISkillNameDetails[]>;
  var skillNotExistsResult: Subject<IValidationResult>;
  var skillNotExistsValidatorMock: ISkillNotExistsValidator;
  var skillNotExistsValidatorFactoryMock: ISkillNotExistsValidatorFactory;
  var skillNotExistsValidatorBindControlSpy: SinonSpy;
  var createSkillNotExistsValidatorSpy: SinonSpy;
  var destroySkillNotExistsValidatorSpy: SinonSpy;

  beforeEachProviders(() => {

    skillServiceMock = SkillServiceMockFactory.createSkillServiceMock();

    getSkillsDetailsByPartialSkillNameSpy =
      stub(skillServiceMock, 'getSkillsDetailsByPartialSkillName', () => {
        getSkillsDetailsByPartialSkillNameResult = new Subject<ISkillNameDetails[]>();
        return getSkillsDetailsByPartialSkillNameResult;
      });

    skillNotExistsValidatorMock = {
      bindControl: () => { },
      isExists: () => {
        skillNotExistsResult = new Subject<IValidationResult>();

        return skillNotExistsResult;
      },
      destroy: () => null
    }

    skillNotExistsValidatorBindControlSpy =
      spy(skillNotExistsValidatorMock, 'bindControl');

    skillNotExistsValidatorFactoryMock = {
      create: () => skillNotExistsValidatorMock,
    }

    createSkillNotExistsValidatorSpy =
      spy(skillNotExistsValidatorFactoryMock, 'create');

    destroySkillNotExistsValidatorSpy =
      spy(skillNotExistsValidatorMock, 'destroy');

    return [
      FormBuilder,
      provide(SkillService, { useValue: skillServiceMock }),
      provide(SkillNotExistsValidatorFactory, { useValue: skillNotExistsValidatorFactoryMock }),
      AddSkillPrerequisiteComponent
    ];
  });

  beforeEach(inject([AddSkillPrerequisiteComponent], (_component: AddSkillPrerequisiteComponent) => {
    component = _component;

    skillDetails = {
      id: 12334,
      skillName: 'some skill name'
    };

    component.skillDetails = skillDetails;
  }));

  describe('initialize', () => {

    beforeEach(() => {
      component.ngOnInit();
    });

    describe('skillsByPartialSkillNameSource.getItems', () => {

      var partialSkillName: string;
      var actualSkills: ISkillNameDetails[];
      var actualError: any;

      beforeEach(() => {
        partialSkillName = 'partialSkillName';

        component.skillsByPartialSkillNameSource.getItems(partialSkillName)
          .subscribe((_skills: ISkillNameDetails[]) => {
            actualSkills = _skills;
          },
          (_error: any) => {
            actualError = _error;
          });
      });

      it('should call skillService.getSkillsDetailsByPartialSkillName', () => {
        expect(getSkillsDetailsByPartialSkillNameSpy.callCount).to.be.equal(1);
        expect(getSkillsDetailsByPartialSkillNameSpy.args[0]).to.deep.equal([partialSkillName, AddSkillPrerequisiteComponent.MAX_NUMBER_OF_SUGGESTED_SKILLS])
      });

      describe('service fails', () => {

        var error: any;

        beforeEach(() => {
          error = 'some error';
          getSkillsDetailsByPartialSkillNameResult.error(error);
        });

        it('should fail correctly', () => {
          expect(actualError).to.be.equal(error);
        });

      });

      describe('service succeeds', () => {

        var skills: ISkillNameDetails[];

        beforeEach(() => {
          skills = [
            {
              id: 1,
              skillName: 'skillName1'
            },
            {
              id: 2,
              skillName: 'skillName2'
            }]

          getSkillsDetailsByPartialSkillNameResult.next(skills);
          getSkillsDetailsByPartialSkillNameResult.complete();
        });

        it('should return correct result', () => {
          expect(actualSkills).to.be.equal(skills);
        });

      });

    });

    it('skillsByPartialSkillNameSource.convertItemToString should return the skill name', () => {
      var skillName = 'some skillName1';

      var userDetails: ISkillNameDetails = {
        id: 123,
        skillName: skillName
      }

      expect(component.skillsByPartialSkillNameSource.converItemToString(userDetails)).to.be.equal(skillName);
    });

    it('when the component is destroyed should destroy the SkillNotExistsValidator', () => {
      component.ngOnDestroy();

      expect(destroySkillNotExistsValidatorSpy.callCount).to.be.equal(1);
    });

    it('addSkillPrerequisiteError should be correct', () => {
      expect(component.addSkillPrerequisiteError).to.be.undefined;
    });

    it('isAddingSkillPrerequisite should be correct', () => {
      expect(component.isAddingSkillPrerequisite).to.be.false;
    });

    it('should initialize the addSkillPrerequisiteFormGroup', () => {
      expect(component.addSkillPrerequisiteFormGroup).to.exist;
    });

    it('canAddSkillPrerequisite() should return false', () => {
      expect(component.canAddSkillPrerequisite()).to.be.false;
    });

    describe('skillNameControl', () => {

      it('value should be correct', () => {
        expect(component.skillNameControl.value).to.be.equal('');
      });

      it('should initialize the SkillNotExistsValidator correctly', () => {
        expect(createSkillNotExistsValidatorSpy.callCount).to.be.equal(1);
      });

      it('should bind the SkillNotExistsValidator to skillNameControl', () => {
        expect(skillNotExistsValidatorBindControlSpy.callCount).to.be.equal(1);
        expect(skillNotExistsValidatorBindControlSpy.args[0][0]).to.be.equal(component.skillNameControl);
      });

      describe('change the skill name', () => {

        describe('to empty', () => {

          beforeEach(() => {
            var value = '';
            FormFiller.fillFormControl(component.addSkillPrerequisiteFormGroup, component.skillNameControl, value);
          });

          it('control should be invalid', () => {
            expect(component.skillNameControl.errors).to.exist;
          });

          it('canAddSkillPrerequisite() should return false', () => {
            expect(component.canAddSkillPrerequisite()).to.be.false;
          });

        });

        describe('to some skill name', () => {

          beforeEach(() => {
            var value = 'some skill name';
            FormFiller.fillFormControl(component.addSkillPrerequisiteFormGroup, component.skillNameControl, value);

            skillNotExistsResult.next(null);
            skillNotExistsResult.complete();
          });

          it('control should be valid', () => {
            expect(component.skillNameControl.errors).to.not.exist;
          });

          it('canAddSkillPrerequisite() should return true', () => {
            expect(component.canAddSkillPrerequisite()).to.be.true;
          });

          describe('clear skill name', () => {

            beforeEach(() => {
              var value = '';
              FormFiller.fillFormControl(component.addSkillPrerequisiteFormGroup, component.skillNameControl, value);
            });

            it('control should be valid', () => {
              expect(component.skillNameControl.errors).to.exist;
            });

            it('canAddSkillPrerequisite() should return false', () => {
              expect(component.canAddSkillPrerequisite()).to.be.false;
            });

          });

        });

        describe('to existing skill name', () => {

          beforeEach(() => {
            var value = 'existing skill name';
            FormFiller.fillFormControl(component.addSkillPrerequisiteFormGroup, component.skillNameControl, value);

            skillNotExistsResult.next({ 'someError': true });
            skillNotExistsResult.complete();
          });

          it('control should be invalid', () => {
            expect(component.skillNameControl.errors).to.exist;
          });

          it('canAddSkillPrerequisite() should return false', () => {
            expect(component.canAddSkillPrerequisite()).to.be.false;
          });

        });

      });

    });

    describe('addSkillPrerequisite()', () => {

      var skillName: string;
      var addSkillPrerequisiteResult: Subject<ISkillPrerequisiteDetails>;
      var addSkillPrerequisiteSpy: SinonSpy;
      var emittedSkillPrerequisites: ISkillPrerequisiteDetails[];

      beforeEach(() => {
        skillName = 'some skill name';

        FormFiller.fillFormControl(component.addSkillPrerequisiteFormGroup, component.skillNameControl, skillName);
        skillNotExistsResult.next(null);
        skillNotExistsResult.complete();

        addSkillPrerequisiteSpy =
          stub(skillServiceMock, 'addSkillPrerequisite', () => {
            addSkillPrerequisiteResult = new Subject<ISkillPrerequisiteDetails>();
            return addSkillPrerequisiteResult;
          });

        emittedSkillPrerequisites = [];
        component.skillPrerequisiteAddedEvent.subscribe(
          (_skillPrerequisite: ISkillPrerequisiteDetails) => {
            emittedSkillPrerequisites.push(_skillPrerequisite);
          }
        )

        component.addSkillPrerequisite();
      });

      afterEach(() => {
        addSkillPrerequisiteSpy.restore();
      })

      it('should call skillService.addSkillPrerequisite() correctly', () => {
        expect(addSkillPrerequisiteSpy.callCount).to.be.equal(1);
        expect(addSkillPrerequisiteSpy.args[0]).to.be.deep.equal([skillDetails.id, skillName]);
      });

      it('should set isAddingSkillPrerequisite to true', () => {
        expect(component.isAddingSkillPrerequisite).to.be.true;
      });

      it('should set addSkillPrerequisiteError to null', () => {
        expect(component.addSkillPrerequisiteError).to.be.null;
      });

      it('skillPrerequisiteAddedEvent should not be emitted', () => {
        expect(emittedSkillPrerequisites).to.deep.equal([]);
      });

      describe('updating fails', () => {

        var error: string;

        beforeEach(() => {
          error = 'create skill prerequisite error';

          addSkillPrerequisiteResult.error(error);
        });

        it('should set isAddingSkilPrerequisite to false', () => {
          expect(component.isAddingSkillPrerequisite).to.be.false;
        });

        it('should set addSkillPrerequisiteError correctly', () => {
          expect(component.addSkillPrerequisiteError).to.be.equal(error);
        });

        it('skillPrerequisiteAddedEvent should not be emitted', () => {
          expect(emittedSkillPrerequisites).to.deep.equal([]);
        });

      });

      describe('updating succeeds', () => {

        var addedSkillPrerequisite: ISkillPrerequisiteDetails;
        var updateTextFieldsSpy: SinonSpy;

        beforeEach(fakeAsync(() => {
          addedSkillPrerequisite = {
            id: 12345,
            skillName: 'some added skill name'
          };

          updateTextFieldsSpy = spy(Materialize, 'updateTextFields');

          addSkillPrerequisiteResult.next(addedSkillPrerequisite);
          addSkillPrerequisiteResult.complete();

          tick(0);
        }));

        afterEach(() => {
          updateTextFieldsSpy.restore();
        });

        it('should set isAddingSkillPrerequisite to false', () => {
          expect(component.isAddingSkillPrerequisite).to.be.false;
        });

        it('should set addSkillPrerequisiteError to null', () => {
          expect(component.addSkillPrerequisiteError).to.be.null;
        });

        it('canAddSkillPrerequisite() should return false', () => {
          expect(component.canAddSkillPrerequisite()).to.be.false;
        });

        it('should raise skill prerequisite created event correctly', () => {
          expect(emittedSkillPrerequisites).to.be.deep.equal([addedSkillPrerequisite]);
        });

        it('should clear the skillNameControl', () => {
          expect(component.skillNameControl.value).to.be.empty;
        });

        it('should set the skillNameControl as untouched', () => {
          expect(component.skillNameControl.touched).to.be.false;
        });

        it('should set the skillNameControl as pristine', () => {
          expect(component.skillNameControl.pristine).to.be.true;
        });

        it('should call Materialize.updateTextFields()', () => {
          expect(updateTextFieldsSpy.callCount).to.be.equal(1);
        });

        describe('addSkillPrerequisite()', () => {

          beforeEach(() => {
            component.addSkillPrerequisite();
          });

          it('should set isAddingSkillPrerequisite to true', () => {
            expect(component.isAddingSkillPrerequisite).to.be.true;
          });

        });

      });

    })

  });

});
