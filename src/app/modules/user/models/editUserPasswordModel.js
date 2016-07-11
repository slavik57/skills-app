"use strict";
var EditUserPasswordModel = (function () {
    function EditUserPasswordModel(password, newPassword, newPasswordRepeated) {
        if (password === void 0) { password = null; }
        if (newPassword === void 0) { newPassword = null; }
        if (newPasswordRepeated === void 0) { newPasswordRepeated = null; }
        this.password = password;
        this.newPassword = newPassword;
        this.newPasswordRepeated = newPasswordRepeated;
    }
    return EditUserPasswordModel;
}());
exports.EditUserPasswordModel = EditUserPasswordModel;
//# sourceMappingURL=editUserPasswordModel.js.map