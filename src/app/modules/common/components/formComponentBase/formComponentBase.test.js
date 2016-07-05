"use strict";
var formComponentBase_1 = require("./formComponentBase");
var testing_1 = require('@angular/core/testing');
var chai_1 = require('chai');
var sinon_1 = require('sinon');
testing_1.describe('FormComponentBase', function () {
    var field;
    var component;
    testing_1.beforeEach(function () {
        field = {};
        component = new formComponentBase_1.FormComponentBase();
    });
    testing_1.describe('isFieldInvalid', function () {
        testing_1.it('check touched should call wasFieldEdited with correct parameters', function () {
            var wasFieldEditedSpy = sinon_1.spy(component, 'wasFieldEdited');
            var field = {};
            var checkTouched = true;
            component.isFieldInvalid(field, checkTouched);
            chai_1.expect(wasFieldEditedSpy.callCount).to.be.equal(1);
            chai_1.expect(wasFieldEditedSpy.args[0][0]).to.be.equal(field);
            chai_1.expect(wasFieldEditedSpy.args[0][1]).to.be.equal(checkTouched);
        });
        testing_1.it('do not check touched should call wasFieldEdited with correct parameters', function () {
            var wasFieldEditedSpy = sinon_1.spy(component, 'wasFieldEdited');
            var field = {};
            var checkTouched = false;
            component.isFieldInvalid(field, checkTouched);
            chai_1.expect(wasFieldEditedSpy.callCount).to.be.equal(1);
            chai_1.expect(wasFieldEditedSpy.args[0][0]).to.be.equal(field);
            chai_1.expect(wasFieldEditedSpy.args[0][1]).to.be.equal(checkTouched);
        });
        testing_1.describe('field was edited', function () {
            testing_1.beforeEach(function () {
                component.wasFieldEdited = function () { return true; };
            });
            testing_1.it('valid field should be valid', function () {
                field.valid = true;
                chai_1.expect(component.isFieldInvalid(field)).to.be.false;
            });
            testing_1.it('invalid field should be invalid', function () {
                field.valid = false;
                chai_1.expect(component.isFieldInvalid(field)).to.be.true;
            });
        });
        testing_1.describe('field was not edited', function () {
            testing_1.beforeEach(function () {
                component.wasFieldEdited = function () { return false; };
            });
            testing_1.it('valid field should be valid', function () {
                field.valid = true;
                chai_1.expect(component.isFieldInvalid(field)).to.be.false;
            });
            testing_1.it('invalid field should be valid', function () {
                field.valid = false;
                chai_1.expect(component.isFieldInvalid(field)).to.be.false;
            });
        });
    });
    testing_1.describe('wasFieldEdited', function () {
        testing_1.describe('pristine', function () {
            testing_1.beforeEach(function () {
                field.pristine = true;
            });
            testing_1.it('check for touched should be false', function () {
                chai_1.expect(component.wasFieldEdited(field, true)).to.be.false;
            });
            testing_1.it('do not check for touched should be false', function () {
                chai_1.expect(component.wasFieldEdited(field, true)).to.be.false;
            });
        });
        testing_1.describe('not pristine', function () {
            testing_1.beforeEach(function () {
                field.pristine = false;
            });
            testing_1.describe('touched', function () {
                testing_1.beforeEach(function () {
                    field.touched = true;
                });
                testing_1.it('checking touched should be edited', function () {
                    chai_1.expect(component.wasFieldEdited(field, true)).to.be.true;
                });
                testing_1.it('not checking touched should be edited', function () {
                    chai_1.expect(component.wasFieldEdited(field, false)).to.be.true;
                });
            });
            testing_1.describe('not touched', function () {
                testing_1.beforeEach(function () {
                    field.touched = false;
                });
                testing_1.it('checking touched should not be edited', function () {
                    chai_1.expect(component.wasFieldEdited(field, true)).to.be.false;
                });
                testing_1.it('not checking touched should be edited', function () {
                    chai_1.expect(component.wasFieldEdited(field, false)).to.be.true;
                });
            });
        });
    });
    testing_1.describe('isFieldHasError', function () {
        testing_1.it('check touched should call isFieldInvalid with correct parameters', function () {
            var isFieldInvalidSpy = sinon_1.spy(component, 'isFieldInvalid');
            var field = {};
            var errorName = 'errorName';
            var checkTouched = true;
            component.isFieldHasError(field, errorName, checkTouched);
            chai_1.expect(isFieldInvalidSpy.callCount).to.be.equal(1);
            chai_1.expect(isFieldInvalidSpy.args[0][0]).to.be.equal(field);
            chai_1.expect(isFieldInvalidSpy.args[0][1]).to.be.equal(checkTouched);
        });
        testing_1.it('do not check touched should call isFieldInvalid with correct parameters', function () {
            var isFieldInvalidSpy = sinon_1.spy(component, 'wasFieldEdited');
            var field = {};
            var errorName = 'errorName';
            var checkTouched = false;
            component.isFieldHasError(field, errorName, checkTouched);
            chai_1.expect(isFieldInvalidSpy.callCount).to.be.equal(1);
            chai_1.expect(isFieldInvalidSpy.args[0][0]).to.be.equal(field);
            chai_1.expect(isFieldInvalidSpy.args[0][1]).to.be.equal(checkTouched);
        });
        testing_1.describe('valid field', function () {
            testing_1.beforeEach(function () {
                component.isFieldInvalid = function () { return false; };
            });
            testing_1.it('should return false', function () {
                chai_1.expect(component.isFieldHasError(field, '')).to.be.false;
            });
        });
        testing_1.describe('invalid field', function () {
            testing_1.beforeEach(function () {
                component.isFieldInvalid = function () { return true; };
            });
            testing_1.it('no errors should return false', function () {
                field.errors = null;
                chai_1.expect(component.isFieldHasError(field, '')).to.be.false;
            });
            testing_1.it('has errors but not the specified error should return false', function () {
                field.errors = {
                    errorName: true
                };
                chai_1.expect(component.isFieldHasError(field, 'otherErrorName')).to.be.false;
            });
            testing_1.it('has specified error should return true', function () {
                field.errors = {
                    errorName: true
                };
                chai_1.expect(component.isFieldHasError(field, 'errorName')).to.be.true;
            });
        });
    });
});
//# sourceMappingURL=formComponentBase.test.js.map