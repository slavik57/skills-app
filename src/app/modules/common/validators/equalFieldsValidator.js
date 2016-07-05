"use strict";
var _ = require('lodash');
var EqualFieldsValidator = (function () {
    function EqualFieldsValidator() {
    }
    EqualFieldsValidator.allFieldsEqual = function (group) {
        var values = [];
        for (var controlName in group.controls) {
            var control = group.controls[controlName];
            var value = control.value;
            values.push(value);
        }
        var valid = EqualFieldsValidator._areAllValuseEqual(values);
        if (valid) {
            return null;
        }
        return {
            'allFieldsEqual': false
        };
    };
    EqualFieldsValidator._areAllValuseEqual = function (values) {
        if (values.length < 1) {
            return true;
        }
        var firstValue = values[0];
        return _.every(values, function (_value) { return _value === firstValue; });
    };
    return EqualFieldsValidator;
}());
exports.EqualFieldsValidator = EqualFieldsValidator;
//# sourceMappingURL=equalFieldsValidator.js.map