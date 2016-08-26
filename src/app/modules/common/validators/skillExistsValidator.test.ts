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
import {SkillExistsValidator, SkillExistsValidatorFactory} from "./skillExistsValidator";
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import {FormControl} from '@angular/forms';
import {spy, SinonSpy} from 'sinon';

describe('SkillExistsValidatorFactory', () => {

  var skillServiceMock: ISkillService;
  var skillExistsValidatorFactory: SkillExistsValidatorFactory;

  beforeEachProviders(() => {
    skillServiceMock = SkillServiceMockFactory.createSkillServiceMock();

    return [
      provide(SkillService, { useValue: skillServiceMock }),
      SkillExistsValidatorFactory
    ];
  });

  beforeEach(inject([SkillExistsValidatorFactory], (_skillExistsValidatorFactory: SkillExistsValidatorFactory) => {
    skillExistsValidatorFactory = _skillExistsValidatorFactory;
  }));

  describe('create', () => {

    it('should create correct SkillExistsValidator', () => {
      var validator = skillExistsValidatorFactory.create();

      expect(validator).to.be.instanceof(SkillExistsValidator);
      expect(validator['skillService']).to.be.equal(skillServiceMock);
      expect(validator['allowedValues']).to.be.deep.equal([]);
    });

  });

  describe('createWithAllowedSkills', () => {

    it('should create correct SkillExistsValidator', () => {
      var skillNames = ['a', 'b', 'c'];
      var validator = skillExistsValidatorFactory.createWithAllowedSkills(skillNames);

      expect(validator).to.be.instanceof(SkillExistsValidator);
      expect(validator['skillService']).to.be.equal(skillServiceMock);
      expect(validator['allowedValues']).to.be.deep.equal(skillNames);
    });

  });

});

describe('SkillExistsValidator', () => {

  var skillName: string;
  var isSkillExistsResult: Subject<boolean>;
  var skillServiceMock: ISkillService;
  var control: FormControl;
  var validator: SkillExistsValidator;
  var originalDebounce: any;
  var validSkillNames: string[];
  var isSkillExistsSpy: SinonSpy;

  beforeEach(() => {
    originalDebounce = Observable.prototype.debounce;
    Observable.prototype.debounceTime = function() {
      return this;
    }

    isSkillExistsResult = new Subject<boolean>();

    skillServiceMock = SkillServiceMockFactory.createSkillServiceMock();

    skillServiceMock.isSkillExists = () => isSkillExistsResult;

    control = new FormControl();

    validSkillNames = ['valid skill name1', 'valid skill name2'];
    validator = new SkillExistsValidator(validSkillNames, skillServiceMock);

    validator.bindControl(control);

    isSkillExistsSpy = spy(skillServiceMock, 'isSkillExists');
  });

  afterEach(() => {
    Observable.prototype.debounce = originalDebounce;
  });

  describe('isExists', () => {

    it('isSkillExists returns true should return error', () => {
      var actualResult;
      validator.isExists(control).subscribe(
        (_result) => {
          actualResult = _result;
        }
      )

      skillName = 'some name';
      control.updateValue(skillName);
      control.updateValueAndValidity();

      isSkillExistsResult.next(true);
      isSkillExistsResult.complete();

      expect(actualResult).to.deep.equal({ 'skillNameTaken': true });
    });

    it('isSkillExists returns false should be null', () => {
      var actualResult;
      validator.isExists(control).subscribe(
        (_result) => {
          actualResult = _result;
        }
      )

      skillName = 'some name';
      control.updateValue(skillName);
      control.updateValueAndValidity();

      isSkillExistsResult.next(false);
      isSkillExistsResult.complete();

      expect(actualResult).to.be.null;
    });

    it('isSkillExists rejects should return skillNameTakenCheckFailed error', () => {
      var actualResult;
      validator.isExists(control).subscribe(
        (_result) => {
          actualResult = _result;
        }
      )

      skillName = 'some name';
      control.updateValue(skillName);
      control.updateValueAndValidity();

      isSkillExistsResult.error('some error');

      expect(actualResult).to.deep.equal({ 'skillNameTakenCheckFailed': true });
    });

    it('value changes without subscriber should not fail', () => {
      skillName = 'some name';
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

      isSkillExistsResult.error('some error');

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

      isSkillExistsResult.error('some error');

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

      isSkillExistsResult.error('some error');
    });

    it('on valid skill name should not use the skill service', () => {
      validator.isExists(control);

      control.updateValue(validSkillNames[0]);
      control.updateValueAndValidity();

      expect(isSkillExistsSpy.callCount).to.be.equal(0);
    });

    it('on another valid skill name should not use the skill service', () => {
      validator.isExists(control);

      control.updateValue(validSkillNames[1]);
      control.updateValueAndValidity();

      expect(isSkillExistsSpy.callCount).to.be.equal(0);
    });

    it('on valid skill name should return null', () => {
      control.updateValue(validSkillNames[0]);

      var actualResult;
      validator.isExists(control).subscribe(
        (_result) => {
          actualResult = _result;
        }
      );

      control.updateValueAndValidity();

      expect(actualResult).to.be.null;
    });

    it('on another valid skill name should return null', () => {
      control.updateValue(validSkillNames[1]);

      var actualResult;
      validator.isExists(control).subscribe(
        (_result) => {
          actualResult = _result;
        }
      )

      control.updateValueAndValidity();

      expect(actualResult).to.be.null;
    });

  });

  describe('destroy', () => {

    beforeEach(() => {
      validator.destroy();
    });

    it('calling destroy before binding to control should not fail', () => {
      new SkillExistsValidator(validSkillNames, skillServiceMock).destroy();
    });

    describe('skillExists', () => {

      it('on subscribtion should not return anything', () => {
        var numberOfTimesCalled = 0;
        validator.isExists(control).subscribe(
          (_result) => {
            numberOfTimesCalled++;
          }
        )

        skillName = 'some name';
        control.updateValue(skillName);
        control.updateValueAndValidity();

        expect(numberOfTimesCalled).to.equal(0);
      });

      it('value changes should not fail', () => {
        skillName = 'some name';
        control.updateValue(skillName);
        control.updateValueAndValidity();
      });

      it('on valid skill name should not use the skill service', () => {
        validator.isExists(control).subscribe(
          (_result) => {
          }
        );

        skillName = 'some name';
        control.updateValue(skillName);
        control.updateValueAndValidity();

        expect(isSkillExistsSpy.callCount).to.be.equal(0);
      });

    });

  });

});
