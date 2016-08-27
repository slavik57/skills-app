"use strict";
var skillServiceMockFactory_1 = require("../../../testUtils/mockFactories/skillServiceMockFactory");
var testing_1 = require('@angular/core/testing');
var core_1 = require('@angular/core');
var chai_1 = require('chai');
var skillService_1 = require("../services/skillService");
var skillNotExistsValidator_1 = require("./skillNotExistsValidator");
var Subject_1 = require('rxjs/Subject');
var Observable_1 = require('rxjs/Observable');
var forms_1 = require('@angular/forms');
var sinon_1 = require('sinon');
testing_1.describe('SkillNotExistsValidatorFactory', function () {
    var skillServiceMock;
    var skillNotExistsValidatorFactory;
    testing_1.beforeEachProviders(function () {
        skillServiceMock = skillServiceMockFactory_1.SkillServiceMockFactory.createSkillServiceMock();
        return [
            core_1.provide(skillService_1.SkillService, { useValue: skillServiceMock }),
            skillNotExistsValidator_1.SkillNotExistsValidatorFactory
        ];
    });
    testing_1.beforeEach(testing_1.inject([skillNotExistsValidator_1.SkillNotExistsValidatorFactory], function (_factory) {
        skillNotExistsValidatorFactory = _factory;
    }));
    testing_1.describe('create', function () {
        testing_1.it('should create correct SkillNotExistsValidator', function () {
            var validator = skillNotExistsValidatorFactory.create();
            chai_1.expect(validator).to.be.instanceof(skillNotExistsValidator_1.SkillNotExistsValidator);
            chai_1.expect(validator['skillService']).to.be.equal(skillServiceMock);
            chai_1.expect(validator['allowedValues']).to.be.deep.equal([]);
        });
    });
});
testing_1.describe('SkillNotExistsValidator', function () {
    var skillName;
    var isSkillNameExistsResult;
    var skillServiceMock;
    var control;
    var validator;
    var originalDebounce;
    var isSkillNameExistsSpy;
    testing_1.beforeEach(function () {
        originalDebounce = Observable_1.Observable.prototype.debounce;
        Observable_1.Observable.prototype.debounceTime = function () {
            return this;
        };
        isSkillNameExistsResult = new Subject_1.Subject();
        skillServiceMock = skillServiceMockFactory_1.SkillServiceMockFactory.createSkillServiceMock();
        skillServiceMock.isSkillExists = function () { return isSkillNameExistsResult; };
        control = new forms_1.FormControl();
        validator = new skillNotExistsValidator_1.SkillNotExistsValidator(skillServiceMock);
        validator.bindControl(control);
        isSkillNameExistsSpy = sinon_1.spy(skillServiceMock, 'isSkillExists');
    });
    testing_1.afterEach(function () {
        Observable_1.Observable.prototype.debounce = originalDebounce;
    });
    testing_1.describe('skillExists', function () {
        testing_1.it('isSkillExists returns false should return error', function () {
            var actualResult;
            validator.isExists(control).subscribe(function (_result) {
                actualResult = _result;
            });
            skillName = 'some skill name';
            control.updateValue(skillName);
            control.updateValueAndValidity();
            isSkillNameExistsResult.next(false);
            isSkillNameExistsResult.complete();
            chai_1.expect(actualResult).to.deep.equal({ 'skillDoesNotExist': true });
        });
        testing_1.it('isSkillExists returns true should be null', function () {
            var actualResult;
            validator.isExists(control).subscribe(function (_result) {
                actualResult = _result;
            });
            skillName = 'some skill name';
            control.updateValue(skillName);
            control.updateValueAndValidity();
            isSkillNameExistsResult.next(true);
            isSkillNameExistsResult.complete();
            chai_1.expect(actualResult).to.be.null;
        });
        testing_1.it('iSkillExists rejects should return skillDoesNotExistCheckFailed error', function () {
            var actualResult;
            validator.isExists(control).subscribe(function (_result) {
                actualResult = _result;
            });
            skillName = 'some skill name';
            control.updateValue(skillName);
            control.updateValueAndValidity();
            isSkillNameExistsResult.error('some error');
            chai_1.expect(actualResult).to.deep.equal({ 'skillDoesNotExistCheckFailed': true });
        });
        testing_1.it('value changes without subscriber should not fail', function () {
            skillName = 'some skill name';
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
            isSkillNameExistsResult.error('some error');
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
            isSkillNameExistsResult.error('some error');
            chai_1.expect(actualResult).to.be.null;
        });
        testing_1.it('empty skill name should be null', function () {
            validator.isExists(control).subscribe(function (_result) {
                chai_1.expect(_result).to.be.null;
            });
            skillName = '';
            control.updateValue(skillName);
            control.updateValueAndValidity();
            isSkillNameExistsResult.error('some error');
        });
    });
    testing_1.describe('destroy', function () {
        testing_1.beforeEach(function () {
            validator.destroy();
        });
        testing_1.it('calling destroy before binding to control should not fail', function () {
            new skillNotExistsValidator_1.SkillNotExistsValidator(skillServiceMock).destroy();
        });
        testing_1.describe('skillExists', function () {
            testing_1.it('on subscribtion should not return anything', function () {
                var numberOfTimesCalled = 0;
                validator.isExists(control).subscribe(function (_result) {
                    numberOfTimesCalled++;
                });
                skillName = 'some skill';
                control.updateValue(skillName);
                control.updateValueAndValidity();
                chai_1.expect(numberOfTimesCalled).to.equal(0);
            });
            testing_1.it('value changes should not fail', function () {
                skillName = 'some skill name';
                control.updateValue(skillName);
                control.updateValueAndValidity();
            });
            testing_1.it('on valid skill name should not use the skill service', function () {
                validator.isExists(control).subscribe(function (_result) {
                });
                skillName = 'some skill name';
                control.updateValue(skillName);
                control.updateValueAndValidity();
                chai_1.expect(isSkillNameExistsSpy.callCount).to.be.equal(0);
            });
        });
    });
});
//# sourceMappingURL=skillNotExistsValidator.test.js.map