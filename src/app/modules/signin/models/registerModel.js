"use strict";
var RegisterModel = (function () {
    function RegisterModel(username, password, repeatPassword, email, firstName, lastName) {
        this.username = username;
        this.password = password;
        this.repeatPassword = repeatPassword;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
    }
    return RegisterModel;
}());
exports.RegisterModel = RegisterModel;
//# sourceMappingURL=registerModel.js.map