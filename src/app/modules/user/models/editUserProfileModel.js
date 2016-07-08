"use strict";
var EditUserProfile = (function () {
    function EditUserProfile(id, username, email, firstName, lastName) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
    }
    EditUserProfile.fromUserDetails = function (userDetails) {
        return new EditUserProfile(userDetails.id, userDetails.username, userDetails.email, userDetails.firstName, userDetails.lastName);
    };
    return EditUserProfile;
}());
exports.EditUserProfile = EditUserProfile;
//# sourceMappingURL=editUserProfileModel.js.map