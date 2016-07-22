"use strict";
var enumUtils_1 = require("../enums/enumUtils");
var globalPermissions_1 = require("../enums/globalPermissions");
var globalPermissionsNamePipe_1 = require("./globalPermissionsNamePipe");
var testing_1 = require('@angular/core/testing');
var chai_1 = require('chai');
testing_1.describe('GlobalPermissionsNamePipe', function () {
    var pipe;
    testing_1.beforeEach(function () {
        pipe = new globalPermissionsNamePipe_1.GlobalPermissionsNamePipe();
    });
    testing_1.describe('transform', function () {
        testing_1.it('transforming all permissions should have a known value', function () {
            var permissionStrings = enumUtils_1.EnumUtils.getNames(globalPermissions_1.GlobalPermission);
            permissionStrings.forEach(function (_permissionString) {
                var message = 'The permission ' + _permissionString + ' has no transformation';
                chai_1.expect(pipe.transform(_permissionString), message).to.not.contain('Unknown permission');
            });
        });
    });
});
//# sourceMappingURL=globalPermissionsNamePipe.test.js.map