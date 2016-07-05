"use strict";
var equalFieldsValidator_1 = require("./equalFieldsValidator");
var testing_1 = require('@angular/core/testing');
var chai_1 = require('chai');
var forms_1 = require('@angular/forms');
testing_1.describe('EqualFieldsValidator', function () {
    var formGroup;
    var control1;
    var control2;
    var control3;
    testing_1.beforeEach(function () {
        control1 = new forms_1.FormControl();
        control2 = new forms_1.FormControl();
        control3 = new forms_1.FormControl();
        formGroup = new forms_1.FormGroup({
            control1: control1,
            control2: control2,
            control3: control3
        });
    });
    testing_1.describe('allFieldsEqual', function () {
        testing_1.it('empty form group should return null', function () {
            formGroup = new forms_1.FormGroup({});
            chai_1.expect(equalFieldsValidator_1.EqualFieldsValidator.allFieldsEqual(formGroup)).to.be.null;
        });
        testing_1.it('all values are equal should return null', function () {
            var value = 'some value';
            control1.updateValue(value);
            control1.updateValueAndValidity();
            control2.updateValue(value);
            control2.updateValueAndValidity();
            control3.updateValue(value);
            control3.updateValueAndValidity();
            chai_1.expect(equalFieldsValidator_1.EqualFieldsValidator.allFieldsEqual(formGroup)).to.be.null;
        });
        testing_1.it('one value is different should return error', function () {
            var value = 'some value';
            control1.updateValue(value);
            control1.updateValueAndValidity();
            control2.updateValue(value + 1);
            control2.updateValueAndValidity();
            control3.updateValue(value);
            control3.updateValueAndValidity();
            chai_1.expect(equalFieldsValidator_1.EqualFieldsValidator.allFieldsEqual(formGroup)).to.be.deep.equal({ allFieldsEqual: false });
        });
    });
});
//# sourceMappingURL=equalFieldsValidator.test.js.map