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
import {SinonSpy, stub, spy} from 'sinon';
import {expect} from 'chai';
import { CreateSkillComponent } from './createSkill.component';
import { Subject } from 'rxjs/Subject';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  ISkillExistsValidator,
  SkillExistsValidator,
  ISkillExistsValidatorFactory,
  SkillExistsValidatorFactory
} from "../../../common/validators/skillExistsValidator";

describe('CreateSkillComponent', () => {

  var skillServiceMock: ISkillService;
  var component: CreateSkillComponent;
  var skillExistsResult: Subject<IValidationResult>;
  var skillExistsValidatorMock: ISkillExistsValidator;
  var skillExistsValidatorFactoryMock: ISkillExistsValidatorFactory;
  var skillExistsValidatorBindControlSpy: SinonSpy;
  var createSkillExistsValidatorSpy: SinonSpy;
  var destroySkillExistsValidatorSpy: SinonSpy;

  beforeEachProviders(() => {
    skillServiceMock = SkillServiceMockFactory.createSkillServiceMock();

    skillExistsValidatorMock = {
      bindControl: () => { },
      isExists: () => {
        skillExistsResult = new Subject<IValidationResult>();

        return skillExistsResult;
      },
      destroy: () => null
    }

    skillExistsValidatorBindControlSpy =
      spy(skillExistsValidatorMock, 'bindControl');

    skillExistsValidatorFactoryMock = {
      create: () => skillExistsValidatorMock,
      createWithAllowedSkills: () => null
    }

    createSkillExistsValidatorSpy =
      spy(skillExistsValidatorFactoryMock, 'create');

    destroySkillExistsValidatorSpy =
      spy(skillExistsValidatorMock, 'destroy');

    return [
      FormBuilder,
      provide(SkillService, { useValue: skillServiceMock }),
      provide(SkillExistsValidatorFactory, { useValue: skillExistsValidatorFactoryMock }),
      CreateSkillComponent
    ];
  });

  beforeEach(inject([CreateSkillComponent], (_component: CreateSkillComponent) => {
    component = _component;
  }));

  describe('initialize', () => {

    var updateTextFieldsSpy: SinonSpy;
    var skillNameControl: FormControl;

    beforeEach(fakeAsync(() => {
      component.ngOnInit();

      updateTextFieldsSpy = spy(Materialize, 'updateTextFields');

      skillNameControl =
        <FormControl>component.createSkillFormGroup.controls['skillName'];

      tick(0);
    }));

    afterEach(() => {
      updateTextFieldsSpy.restore();
    });

    it('when the component is destroyed should destroy the SkillExistsValidator', () => {
      component.ngOnDestroy();

      expect(destroySkillExistsValidatorSpy.callCount).to.be.equal(1);
    });

    it('createSkillError should be correct', () => {
      expect(component.createSkillError).to.be.undefined;
    });

    it('creatingSkill should be correct', () => {
      expect(component.creatingSkill).to.be.false;
    });

    it('isSkillCreated should be correct', () => {
      expect(component.isSkillCreated).to.be.false;
    });

    it('the skillName should be correct', () => {
      expect(component.skillName).to.be.equal('');
    });

    it('should initialize the createSkillFormGroup', () => {
      expect(component.createSkillFormGroup).to.exist;
    });

    it('should call Materialize.updateTextFields()', () => {
      expect(updateTextFieldsSpy.callCount).to.be.equal(1);
    });

    it('canCreateSkill should return false', () => {
      expect(component.canCreateSkill()).to.be.false;
    });

    describe('skill name', () => {

      it('value should be correct', () => {
        expect(skillNameControl.value).to.be.equal('');
      });

      it('should initialize the SkillExistsValidator correctly', () => {
        expect(createSkillExistsValidatorSpy.callCount).to.be.equal(1);
      });

      it('should bind the SkillExistsValidator to skill name control', () => {
        expect(skillExistsValidatorBindControlSpy.callCount).to.be.equal(1);
        expect(skillExistsValidatorBindControlSpy.args[0][0]).to.be.equal(skillNameControl);
      });

      describe('change the skill name', () => {

        describe('to empty', () => {

          beforeEach(() => {
            var value = '';
            FormFiller.fillFormControl(component.createSkillFormGroup, skillNameControl, value);
            component.skillName = value;
          });

          it('control should be invalid', () => {
            expect(skillNameControl.errors).to.exist;
          });

          it('canCreateSkill should return false', () => {
            expect(component.canCreateSkill()).to.be.false;
          });

        });

        describe('to some skill name', () => {

          beforeEach(() => {
            var value = 'some skill name';
            FormFiller.fillFormControl(component.createSkillFormGroup, skillNameControl, value);
            component.skillName = value;

            skillExistsResult.next(null);
            skillExistsResult.complete();
          });

          it('control should be valid', () => {
            expect(skillNameControl.errors).to.not.exist;
          });

          it('canCreateSkill should return true', () => {
            expect(component.canCreateSkill()).to.be.true;
          });

          describe('clear skill name', () => {

            beforeEach(() => {
              var value = '';
              FormFiller.fillFormControl(component.createSkillFormGroup, skillNameControl, value);
              component.skillName = value;
            });

            it('control should be valid', () => {
              expect(skillNameControl.errors).to.exist;
            });

            it('canCreateSkill should return false', () => {
              expect(component.canCreateSkill()).to.be.false;
            });

          });

        });

        describe('to existing skill name', () => {

          beforeEach(() => {
            var value = 'existing skill name';
            FormFiller.fillFormControl(component.createSkillFormGroup, skillNameControl, value);
            component.skillName = value;

            skillExistsResult.next({ 'someError': true });
            skillExistsResult.complete();
          });

          it('control should be invalid', () => {
            expect(skillNameControl.errors).to.exist;
          });

          it('canCreateSkill should return false', () => {
            expect(component.canCreateSkill()).to.be.false;
          });

        });

      });

    });

    describe('createSkill()', () => {

      var skillName: string;
      var createSkillResult: Subject<ISkillNameDetails>;
      var createSkillSpyStub: SinonSpy;

      beforeEach(() => {
        skillName = 'some skill name';

        var skillNameControl = <FormControl>component.createSkillFormGroup.controls['skillName'];

        FormFiller.fillFormControl(component.createSkillFormGroup, skillNameControl, skillName);
        component.skillName = skillName;
        skillExistsResult.next(null);
        skillExistsResult.complete();

        createSkillSpyStub =
          stub(skillServiceMock, 'createSkill', () => {
            createSkillResult = new Subject<ISkillNameDetails>();
            return createSkillResult;
          });

        component.createSkill();
      });

      afterEach(() => {
        createSkillSpyStub.restore();
      })

      it('should call skillService.createSkill() correctly', () => {
        expect(createSkillSpyStub.callCount).to.be.equal(1);
        expect(createSkillSpyStub.args[0]).to.be.deep.equal([skillName]);
      });

      it('should set creatingSkill to true', () => {
        expect(component.creatingSkill).to.be.true;
      });

      it('should set createSkillError to null', () => {
        expect(component.createSkillError).to.be.null;
      });

      it('isSkillCreated should be correct', () => {
        expect(component.isSkillCreated).to.be.false;
      });

      describe('updating fails', () => {

        var error: string;

        beforeEach(() => {
          error = 'create skill error';

          createSkillResult.error(error);
        });

        it('should set creatingSkill to false', () => {
          expect(component.creatingSkill).to.be.false;
        });

        it('should set createSkillError correctly', () => {
          expect(component.createSkillError).to.be.equal(error);
        });

        it('isSkillCreated should be correct', () => {
          expect(component.isSkillCreated).to.be.false;
        });

      });

      describe('updating succeeds', () => {

        var skillDetails: ISkillNameDetails;
        var emittedSkillDetails: ISkillNameDetails;

        beforeEach(() => {
          skillDetails = {
            skillName: 'some created skill name',
            id: 12345
          }

          component.skillCreatedEvent.subscribe((_actualDetails: ISkillNameDetails) => {
            emittedSkillDetails = _actualDetails;
          });

          createSkillResult.next(skillDetails);
          createSkillResult.complete();
        });

        it('should set creatingSkill to false', () => {
          expect(component.creatingSkill).to.be.false;
        });

        it('should set createSkillError to null', () => {
          expect(component.createSkillError).to.be.null;
        });

        it('canCreateSkill() should return false', () => {
          expect(component.canCreateSkill()).to.be.false;
        });

        it('isSkillCreated should be correct', () => {
          expect(component.isSkillCreated).to.be.true;
        });

        it('should raise skill created event correctly', () => {
          expect(emittedSkillDetails).to.be.deep.equal(skillDetails);
        });

        it('should clear skillName', () => {
          expect(component.skillName).to.be.empty;
        });

        it('should set the form controls as untouched', () => {
          expect(skillNameControl.touched).to.be.false;
        });

        it('should set the form controls as pristine', () => {
          expect(skillNameControl.pristine).to.be.true;
        });

        it('should call Materialize.updateTextFields()', () => {
          expect(updateTextFieldsSpy.callCount).to.be.equal(1);
        });

        describe('createSkill()', () => {

          beforeEach(() => {
            component.createSkill();
          });

          it('isSkillCreated should be correct', () => {
            expect(component.isSkillCreated).to.be.false;
          });

          it('should set creatingSkill to true', () => {
            expect(component.creatingSkill).to.be.true;
          });

        });

      });

    })

  });

});
