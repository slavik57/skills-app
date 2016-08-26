"use strict";
var skillServiceMockFactory_1 = require("../../../testUtils/mockFactories/skillServiceMockFactory");
var testing_1 = require('@angular/core/testing');
var core_1 = require('@angular/core');
var chai_1 = require('chai');
var skillService_1 = require("../services/skillService");
var skillExistsValidator_1 = require("./skillExistsValidator");
var Subject_1 = require('rxjs/Subject');
var Observable_1 = require('rxjs/Observable');
var forms_1 = require('@angular/forms');
var sinon_1 = require('sinon');
testing_1.describe('SkillExistsValidatorFactory', function () {
    var skillServiceMock;
    var skillExistsValidatorFactory;
    testing_1.beforeEachProviders(function () {
        skillServiceMock = skillServiceMockFactory_1.SkillServiceMockFactory.createSkillServiceMock();
        return [
            core_1.provide(skillService_1.SkillService, { useValue: skillServiceMock }),
            skillExistsValidator_1.SkillExistsValidatorFactory
        ];
    });
    testing_1.beforeEach(testing_1.inject([skillExistsValidator_1.SkillExistsValidatorFactory], function (_skillExistsValidatorFactory) {
        skillExistsValidatorFactory = _skillExistsValidatorFactory;
    }));
    testing_1.describe('create', function () {
        testing_1.it('should create correct SkillExistsValidator', function () {
            var validator = skillExistsValidatorFactory.create();
            chai_1.expect(validator).to.be.instanceof(skillExistsValidator_1.SkillExistsValidator);
            chai_1.expect(validator['skillService']).to.be.equal(skillServiceMock);
            chai_1.expect(validator['allowedValues']).to.be.deep.equal([]);
        });
    });
    testing_1.describe('createWithAllowedSkills', function () {
        testing_1.it('should create correct SkillExistsValidator', function () {
            var skillNames = ['a', 'b', 'c'];
            var validator = skillExistsValidatorFactory.createWithAllowedSkills(skillNames);
            chai_1.expect(validator).to.be.instanceof(skillExistsValidator_1.SkillExistsValidator);
            chai_1.expect(validator['skillService']).to.be.equal(skillServiceMock);
            chai_1.expect(validator['allowedValues']).to.be.deep.equal(skillNames);
        });
    });
});
testing_1.describe('SkillExistsValidator', function () {
    var skillName;
    var isSkillExistsResult;
    var skillServiceMock;
    var control;
    var validator;
    var originalDebounce;
    var validSkillNames;
    var isSkillExistsSpy;
    testing_1.beforeEach(function () {
        originalDebounce = Observable_1.Observable.prototype.debounce;
        Observable_1.Observable.prototype.debounceTime = function () {
            return this;
        };
        isSkillExistsResult = new Subject_1.Subject();
        skillServiceMock = skillServiceMockFactory_1.SkillServiceMockFactory.createSkillServiceMock();
        skillServiceMock.isSkillExists = function () { return isSkillExistsResult; };
        control = new forms_1.FormControl();
        validSkillNames = ['valid skill name1', 'valid skill name2'];
        validator = new skillExistsValidator_1.SkillExistsValidator(validSkillNames, skillServiceMock);
        validator.bindControl(control);
        isSkillExistsSpy = sinon_1.spy(skillServiceMock, 'isSkillExists');
    });
    testing_1.afterEach(function () {
        Observable_1.Observable.prototype.debounce = originalDebounce;
    });
    testing_1.describe('isExists', function () {
        testing_1.it('isSkillExists returns true should return error', function () {
            var actualResult;
            validator.isExists(control).subscribe(function (_result) {
                actualResult = _result;
            });
            skillName = 'some name';
            control.updateValue(skillName);
            control.updateValueAndValidity();
            isSkillExistsResult.next(true);
            isSkillExistsResult.complete();
            chai_1.expect(actualResult).to.deep.equal({ 'skillNameTaken': true });
        });
        testing_1.it('isSkillExists returns false should be null', function () {
            var actualResult;
            validator.isExists(control).subscribe(function (_result) {
                actualResult = _result;
            });
            skillName = 'some name';
            control.updateValue(skillName);
            control.updateValueAndValidity();
            isSkillExistsResult.next(false);
            isSkillExistsResult.complete();
            chai_1.expect(actualResult).to.be.null;
        });
        testing_1.it('isSkillExists rejects should return skillNameTakenCheckFailed error', function () {
            var actualResult;
            validator.isExists(control).subscribe(function (_result) {
                actualResult = _result;
            });
            skillName = 'some name';
            control.updateValue(skillName);
            control.updateValueAndValidity();
            isSkillExistsResult.error('some error');
            chai_1.expect(actualResult).to.deep.equal({ 'skillNameTakenCheckFailed': true });
        });
        testing_1.it('value changes without subscriber should not fail', function () {
            skillName = 'some name';
            control.updateValue(skillName);
            control.updateValueAndValidity();
        });
        testing_1.it('null skill name should be null', function () {
            var actualResult;
            validator.isExists(control).subscribe(function (_result) {
                actualResult = _result;
            });
            skillName = null;
            control.updateValue(skillName);
            control.updateValueAndValidity();
            isSkillExistsResult.error('some error');
            chai_1.expect(actualResult).to.be.null;
        });
        testing_1.it('undefined skill name should be null', function () {
            var actualResult;
            validator.isExists(control).subscribe(function (_result) {
                actualResult = _result;
            });
            skillName = undefined;
            control.updateValue(skillName);
            control.updateValueAndValidity();
            isSkillExistsResult.error('some error');
            chai_1.expect(actualResult).to.be.null;
        });
        testing_1.it('empty skill name should be null', function () {
            validator.isExists(control).subscribe(function (_result) {
                chai_1.expect(_result).to.be.null;
            });
            skillName = '';
            control.updateValue(skillName);
            control.updateValueAndValidity();
            isSkillExistsResult.error('some error');
        });
        testing_1.it('on valid skill name should not use the skill service', function () {
            validator.isExists(control);
            control.updateValue(validSkillNames[0]);
            control.updateValueAndValidity();
            chai_1.expect(isSkillExistsSpy.callCount).to.be.equal(0);
        });
        testing_1.it('on another valid skill name should not use the skill service', function () {
            validator.isExists(control);
            control.updateValue(validSkillNames[1]);
            control.updateValueAndValidity();
            chai_1.expect(isSkillExistsSpy.callCount).to.be.equal(0);
        });
        testing_1.it('on valid skill name should return null', function () {
            control.updateValue(validSkillNames[0]);
            var actualResult;
            validator.isExists(control).subscribe(function (_result) {
                actualResult = _result;
            });
            control.updateValueAndValidity();
            chai_1.expect(actualResult).to.be.null;
        });
        testing_1.it('on another valid skill name should return null', function () {
            control.updateValue(validSkillNames[1]);
            var actualResult;
            validator.isExists(control).subscribe(function (_result) {
                actualResult = _result;
            });
            control.updateValueAndValidity();
            chai_1.expect(actualResult).to.be.null;
        });
    });
    testing_1.describe('destroy', function () {
        testing_1.beforeEach(function () {
            validator.destroy();
        });
        testing_1.it('calling destroy before binding to control should not fail', function () {
            new skillExistsValidator_1.SkillExistsValidator(validSkillNames, skillServiceMock).destroy();
        });
        testing_1.describe('skillExists', function () {
            testing_1.it('on subscribtion should not return anything', function () {
                var numberOfTimesCalled = 0;
                validator.isExists(control).subscribe(function (_result) {
                    numberOfTimesCalled++;
                });
                skillName = 'some name';
                control.updateValue(skillName);
                control.updateValueAndValidity();
                chai_1.expect(numberOfTimesCalled).to.equal(0);
            });
            testing_1.it('value changes should not fail', function () {
                skillName = 'some name';
                control.updateValue(skillName);
                control.updateValueAndValidity();
            });
            testing_1.it('on valid skill name should not use the skill service', function () {
                validator.isExists(control).subscribe(function (_result) {
                });
                skillName = 'some name';
                control.updateValue(skillName);
                control.updateValueAndValidity();
                chai_1.expect(isSkillExistsSpy.callCount).to.be.equal(0);
            });
        });
    });
});
//# sourceMappingURL=skillExistsValidator.test.js.map