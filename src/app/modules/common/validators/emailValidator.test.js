"use strict";
var emailValidator_1 = require("./emailValidator");
var testing_1 = require('@angular/core/testing');
var chai_1 = require('chai');
testing_1.describe('EmailValidator', function () {
    var control;
    testing_1.beforeEach(function () {
        control = {};
    });
    testing_1.describe('mailFormat', function () {
        testing_1.it('null mail should return null', function () {
            control.value = null;
            chai_1.expect(emailValidator_1.EmailValidator.mailFormat(control)).to.be.null;
        });
        testing_1.it('undefined mail should return null', function () {
            control.value = undefined;
            chai_1.expect(emailValidator_1.EmailValidator.mailFormat(control)).to.be.null;
        });
        testing_1.it('empty mail should return null', function () {
            control.value = '';
            chai_1.expect(emailValidator_1.EmailValidator.mailFormat(control)).to.be.null;
        });
        testing_1.it('valid mail should return null', function () {
            control.value = 'valid@mail.com';
            chai_1.expect(emailValidator_1.EmailValidator.mailFormat(control)).to.be.null;
        });
        testing_1.it('invalid mail should return error', function () {
            control.value = 'invalidEmail';
            chai_1.expect(emailValidator_1.EmailValidator.mailFormat(control)).to.be.deep.equal({ 'format': false });
        });
    });
});
//# sourceMappingURL=emailValidator.test.js.map