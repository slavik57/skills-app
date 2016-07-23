"use strict";
var userPermissionsSettings_component_1 = require("./userPermissionsSettings.component");
var testing_1 = require('@angular/core/testing');
var chai_1 = require('chai');
testing_1.describe('UsersSettingsComponent', function () {
    var userDetails;
    var component;
    testing_1.beforeEachProviders(function () {
        return [
            userPermissionsSettings_component_1.UserPermissionsSettingsComponent
        ];
    });
    testing_1.beforeEach(testing_1.inject([userPermissionsSettings_component_1.UserPermissionsSettingsComponent], function (_component) {
        component = _component;
        userDetails = {
            id: 12321,
            username: 'some username'
        };
        component.userDetails = userDetails;
        component.ngOnInit();
    }));
    testing_1.it('UserPermissionsSettingsState should be initialized correctly', function () {
        chai_1.expect(component.UserPermissionsSettingsState).to.be.equal(userPermissionsSettings_component_1.UserPermissionsSettingsState);
    });
    testing_1.it('state should be correct', function () {
        chai_1.expect(component.state).to.be.equal(userPermissionsSettings_component_1.UserPermissionsSettingsState.READONLY);
    });
});
//# sourceMappingURL=userPermissionsSettings.component.test.js.map