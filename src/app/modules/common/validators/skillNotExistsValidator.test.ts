import {SkillServiceMockFactory} from "../../../testUtils/mockFactories/skillServiceMockFactory";
import {
  it,
  inject,
  describe,
  beforeEach,
  afterEach,
  beforeEachProviders,
} from '@angular/core/testing';
import {provide} from '@angular/core';
import {expect} from 'chai';
import {ISkillService, SkillService} from "../services/skillService";
import {SkillNotExistsValidator, SkillNotExistsValidatorFactory} from "./skillNotExistsValidator";
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import {FormControl} from '@angular/forms';
import {spy, SinonSpy} from 'sinon';

describe('SkillNotExistsValidatorFactory', () => {

  var skillServiceMock: ISkillService;
  var skillNotExistsValidatorFactory: SkillNotExistsValidatorFactory;

  beforeEachProviders(() => {
    skillServiceMock = SkillServiceMockFactory.createSkillServiceMock();

    return [
      provide(SkillService, { useValue: skillServiceMock }),
      SkillNotExistsValidatorFactory
    ];
  });

  beforeEach(inject([SkillNotExistsValidatorFactory], (_factory: SkillNotExistsValidatorFactory) => {
    skillNotExistsValidatorFactory = _factory;
  }));

  describe('create', () => {

    it('should create correct SkillNotExistsValidator', () => {
      var validator = skillNotExistsValidatorFactory.create();

      expect(validator).to.be.instanceof(SkillNotExistsValidator);
      expect(validator['skillService']).to.be.equal(skillServiceMock);
      expect(validator['allowedValues']).to.be.deep.equal([]);
    });

  });

});

describe('SkillNotExistsValidator', () => {

  var skillName: string;
  var isSkillNameExistsResult: Subject<boolean>;
  var skillServiceMock: ISkillService;
  var control: FormControl;
  var validator: SkillNotExistsValidator;
  var originalDebounce: any;
  var isSkillNameExistsSpy: SinonSpy;

  beforeEach(() => {
    originalDebounce = Observable.prototype.debounce;
    Observable.prototype.debounceTime = function() {
      return this;
    }

    isSkillNameExistsResult = new Subject<boolean>();

    skillServiceMock = SkillServiceMockFactory.createSkillServiceMock();

    skillServiceMock.isSkillExists = () => isSkillNameExistsResult;

    control = new FormControl();

    validator = new SkillNotExistsValidator(skillServiceMock);

    validator.bindControl(control);

    isSkillNameExistsSpy = spy(skillServiceMock, 'isSkillExists');
  });

  afterEach(() => {
    Observable.prototype.debounce = originalDebounce;
  });

  describe('skillExists', () => {

    it('isSkillExists returns false should return error', () => {
      var actualResult;
      validator.isExists(control).subscribe(
        (_result) => {
          actualResult = _result;
        }
      )

      skillName = 'some skill name';
      control.updateValue(skillName);
      control.updateValueAndValidity();

      isSkillNameExistsResult.next(false);
      isSkillNameExistsResult.complete();

      expect(actualResult).to.deep.equal({ 'skillDoesNotExist': true });
    });

    it('isSkillExists returns true should be null', () => {
      var actualResult;
      validator.isExists(control).subscribe(
        (_result) => {
          actualResult = _result;
        }
      )

      skillName = 'some skill name';
      control.updateValue(skillName);
      control.updateValueAndValidity();

      isSkillNameExistsResult.next(true);
      isSkillNameExistsResult.complete();

      expect(actualResult).to.be.null;
    });

    it('iSkillExists rejects should return skillDoesNotExistCheckFailed error', () => {
      var actualResult;
      validator.isExists(control).subscribe(
        (_result) => {
          actualResult = _result;
        }
      )

      skillName = 'some skill name';
      control.updateValue(skillName);
      control.updateValueAndValidity();

      isSkillNameExistsResult.error('some error');

      expect(actualResult).to.deep.equal({ 'skillDoesNotExistCheckFailed': true });
    });

    it('value changes without subscriber should not fail', () => {
      skillName = 'some skill name';
      control.updateValue(skillName);
      control.updateValueAndValidity();
    });

    it('null skill name should be null', () => {
      var actualResult;
      validator.isExists(control).subscribe(
        (_result) => {
          actualResult = _result;
        }
      )

      skillName = null;
      control.updateValue(skillName);
      control.updateValueAndValidity();

      isSkillNameExistsResult.error('some error');

      expect(actualResult).to.be.null;
    });

    it('undefined skill name should be null', () => {
      var actualResult;
      validator.isExists(control).subscribe(
        (_result) => {
          actualResult = _result;
        }
      )

      skillName = undefined;
      control.updateValue(skillName);
      control.updateValueAndValidity();

      isSkillNameExistsResult.error('some error');

      expect(actualResult).to.be.null;
    });

    it('empty skill name should be null', () => {
      validator.isExists(control).subscribe(
        (_result) => {
          expect(_result).to.be.null;
        }
      )

      skillName = '';
      control.updateValue(skillName);
      control.updateValueAndValidity();

      isSkillNameExistsResult.error('some error');
    });

  });

  describe('destroy', () => {

    beforeEach(() => {
      validator.destroy();
    });

    it('calling destroy before binding to control should not fail', () => {
      new SkillNotExistsValidator(skillServiceMock).destroy();
    });

    describe('skillExists', () => {

      it('on subscribtion should not return anything', () => {
        var numberOfTimesCalled = 0;
        validator.isExists(control).subscribe(
          (_result) => {
            numberOfTimesCalled++;
          }
        )

        skillName = 'some skill';
        control.updateValue(skillName);
        control.updateValueAndValidity();

        expect(numberOfTimesCalled).to.equal(0);
      });

      it('value changes should not fail', () => {
        skillName = 'some skill name';
        control.updateValue(skillName);
        control.updateValueAndValidity();
      });

      it('on valid skill name should not use the skill service', () => {
        validator.isExists(control).subscribe(
          (_result) => {
          }
        );

        skillName = 'some skill name';
        control.updateValue(skillName);
        control.updateValueAndValidity();

        expect(isSkillNameExistsSpy.callCount).to.be.equal(0);
      });

    });

  });

});
