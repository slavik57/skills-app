"use strict";
var FormFiller = (function () {
    function FormFiller() {
    }
    FormFiller.fillFormControl = function (formGroup, control, value) {
        control.updateValue(value);
        control.updateValueAndValidity();
        formGroup.updateValueAndValidity();
    };
    return FormFiller;
}());
exports.FormFiller = FormFiller;
//# sourceMappingURL=formFiller.js.map