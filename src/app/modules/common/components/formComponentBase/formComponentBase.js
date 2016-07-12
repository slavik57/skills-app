"use strict";
var FormComponentBase = (function () {
    function FormComponentBase() {
    }
    FormComponentBase.prototype.isFieldInvalid = function (field, checkTouched) {
        if (checkTouched === void 0) { checkTouched = true; }
        return this.wasFieldEdited(field, checkTouched) && !field.valid;
    };
    FormComponentBase.prototype.wasFieldEdited = function (field, checkTouched) {
        if (checkTouched === void 0) { checkTouched = true; }
        if (field.pristine) {
            return false;
        }
        if (checkTouched) {
            return field.touched;
        }
        else {
            return true;
        }
    };
    FormComponentBase.prototype.isFieldHasError = function (field, errorName, checkTouched) {
        if (checkTouched === void 0) { checkTouched = true; }
        return this.isFieldInvalid(field, checkTouched) &&
            !!field.errors &&
            errorName in field.errors;
    };
    FormComponentBase.prototype.resetControlAsUntouchedAndNotDirty = function (control) {
        control['_touched'] = false;
        control['_pristine'] = true;
    };
    return FormComponentBase;
}());
exports.FormComponentBase = FormComponentBase;
//# sourceMappingURL=formComponentBase.js.map