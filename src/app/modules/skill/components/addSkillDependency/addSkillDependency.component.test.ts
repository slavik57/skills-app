import {ISkillDependencyDetails} from "../../../common/interfaces/iSkillDependencyDetails";
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
import {AddSkillDependencyComponent} from "./addSkillDependency.component";
import { Subject } from 'rxjs/Subject';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  ISkillNotExistsValidator,
  SkillNotExistsValidator,
  ISkillNotExistsValidatorFactory,
  SkillNotExistsValidatorFactory
} from "../../../common/validators/skillNotExistsValidator";

describe('AddSkillDependencyComponent', () => {

  var skillDetails: ISkillNameDetails;
  var skillServiceMock: ISkillService;
  var component: AddSkillDependencyComponent;
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
      AddSkillDependencyComponent
    ];
  });

  beforeEach(inject([AddSkillDependencyComponent], (_component: AddSkillDependencyComponent) => {
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
        expect(getSkillsDetailsByPartialSkillNameSpy.args[0]).to.deep.equal([partialSkillName, AddSkillDependencyComponent.MAX_NUMBER_OF_SUGGESTED_SKILLS])
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

    it('addSkillDependencyError should be correct', () => {
      expect(component.addSkillDependencyError).to.be.undefined;
    });

    it('isAddingSkillDependency should be correct', () => {
      expect(component.isAddingSkillDependency).to.be.false;
    });

    it('should initialize the addSkillDependencyFormGroup', () => {
      expect(component.addSkillDependencyFormGroup).to.exist;
    });

    it('canAddSkillDependency() should return false', () => {
      expect(component.canAddSkillDependency()).to.be.false;
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
            FormFiller.fillFormControl(component.addSkillDependencyFormGroup, component.skillNameControl, value);
          });

          it('control should be invalid', () => {
            expect(component.skillNameControl.errors).to.exist;
          });

          it('canAddSkillDependency() should return false', () => {
            expect(component.canAddSkillDependency()).to.be.false;
          });

        });

        describe('to some skill name', () => {

          beforeEach(() => {
            var value = 'some skill name';
            FormFiller.fillFormControl(component.addSkillDependencyFormGroup, component.skillNameControl, value);

            skillNotExistsResult.next(null);
            skillNotExistsResult.complete();
          });

          it('control should be valid', () => {
            expect(component.skillNameControl.errors).to.not.exist;
          });

          it('canAddSkillDependency() should return true', () => {
            expect(component.canAddSkillDependency()).to.be.true;
          });

          describe('clear skill name', () => {

            beforeEach(() => {
              var value = '';
              FormFiller.fillFormControl(component.addSkillDependencyFormGroup, component.skillNameControl, value);
            });

            it('control should be valid', () => {
              expect(component.skillNameControl.errors).to.exist;
            });

            it('canAddSkillDependency() should return false', () => {
              expect(component.canAddSkillDependency()).to.be.false;
            });

          });

        });

        describe('to existing skill name', () => {

          beforeEach(() => {
            var value = 'existing skill name';
            FormFiller.fillFormControl(component.addSkillDependencyFormGroup, component.skillNameControl, value);

            skillNotExistsResult.next({ 'someError': true });
            skillNotExistsResult.complete();
          });

          it('control should be invalid', () => {
            expect(component.skillNameControl.errors).to.exist;
          });

          it('canAddSkillDependency() should return false', () => {
            expect(component.canAddSkillDependency()).to.be.false;
          });

        });

      });

    });

    describe('addSkillDependency()', () => {

      var skillName: string;
      var addSkillDependencyResult: Subject<ISkillDependencyDetails>;
      var addSkillDependencySpy: SinonSpy;
      var emittedSkillDependencies: ISkillDependencyDetails[];

      beforeEach(() => {
        skillName = 'some skill name';

        FormFiller.fillFormControl(component.addSkillDependencyFormGroup, component.skillNameControl, skillName);
        skillNotExistsResult.next(null);
        skillNotExistsResult.complete();

        addSkillDependencySpy =
          stub(skillServiceMock, 'addSkillDependency', () => {
            addSkillDependencyResult = new Subject<ISkillDependencyDetails>();
            return addSkillDependencyResult;
          });

        emittedSkillDependencies = [];
        component.skillDependencyAddedEvent.subscribe(
          (_skillDependency: ISkillDependencyDetails) => {
            emittedSkillDependencies.push(_skillDependency);
          }
        )

        component.addSkillDependency();
      });

      afterEach(() => {
        addSkillDependencySpy.restore();
      })

      it('should call skillService.addSkillDependency() correctly', () => {
        expect(addSkillDependencySpy.callCount).to.be.equal(1);
        expect(addSkillDependencySpy.args[0]).to.be.deep.equal([skillDetails.id, skillName]);
      });

      it('should set isAddingSkillDependency to true', () => {
        expect(component.isAddingSkillDependency).to.be.true;
      });

      it('should set addSkillDependencyError to null', () => {
        expect(component.addSkillDependencyError).to.be.null;
      });

      it('skillDependencyAddedEvent should not be emitted', () => {
        expect(emittedSkillDependencies).to.deep.equal([]);
      });

      describe('updating fails', () => {

        var error: string;

        beforeEach(() => {
          error = 'create skill dependency error';

          addSkillDependencyResult.error(error);
        });

        it('should set isAddingSkillDependency to false', () => {
          expect(component.isAddingSkillDependency).to.be.false;
        });

        it('should set addSkillDependencyError correctly', () => {
          expect(component.addSkillDependencyError).to.be.equal(error);
        });

        it('skillDependencyAddedEvent should not be emitted', () => {
          expect(emittedSkillDependencies).to.deep.equal([]);
        });

      });

      describe('updating succeeds', () => {

        var addedSkillDependency: ISkillDependencyDetails;
        var updateTextFieldsSpy: SinonSpy;

        beforeEach(fakeAsync(() => {
          addedSkillDependency = {
            id: 12345,
            skillName: 'some added skill name'
          };

          updateTextFieldsSpy = spy(Materialize, 'updateTextFields');

          addSkillDependencyResult.next(addedSkillDependency);
          addSkillDependencyResult.complete();

          tick(0);
        }));

        afterEach(() => {
          updateTextFieldsSpy.restore();
        });

        it('should set isAddingSkillDependency to false', () => {
          expect(component.isAddingSkillDependency).to.be.false;
        });

        it('should set addSkillDependencyError to null', () => {
          expect(component.addSkillDependencyError).to.be.null;
        });

        it('canAddSkillDependency() should return false', () => {
          expect(component.canAddSkillDependency()).to.be.false;
        });

        it('should raise skill dependency created event correctly', () => {
          expect(emittedSkillDependencies).to.be.deep.equal([addedSkillDependency]);
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

        describe('addSkillDependency()', () => {

          beforeEach(() => {
            component.addSkillDependency();
          });

          it('should set isAddingSkillDependency to true', () => {
            expect(component.isAddingSkillDependency).to.be.true;
          });

        });

      });

    })

  });

});
