"use strict";
var UserServiceMockFactory = (function () {
    function UserServiceMockFactory() {
    }
    UserServiceMockFactory.createUserServiceMock = function () {
        return {
            signinUser: function () { return null; },
            isUsernameExists: function () { return null; },
            registerUser: function () { return null; },
            getUserDetails: function () { return null; },
            getUsersDetails: function () { return null; },
            updateUserDetails: function () { return null; },
            updateUserPassword: function () { return null; },
            getUserPermissions: function () { return null; },
            getUserPermissionsModificationRules: function () { return null; },
            updateUserPermissions: function () { return null; },
            canUserUpdatePassword: function () { return null; }
        };
    };
    return UserServiceMockFactory;
}());
exports.UserServiceMockFactory = UserServiceMockFactory;
//# sourceMappingURL=userServiceMockFactory.js.map