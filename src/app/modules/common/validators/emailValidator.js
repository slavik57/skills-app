"use strict";
var validator = require('validator');
var EmailValidator = (function () {
    function EmailValidator() {
    }
    EmailValidator.mailFormat = function (control) {
        var value = control.value;
        if (!value) {
            return null;
        }
        if (validator.isEmail(value)) {
            return null;
        }
        return { 'format': false };
    };
    return EmailValidator;
}());
exports.EmailValidator = EmailValidator;
//# sourceMappingURL=emailValidator.js.map