"use strict";
var globalPermissionsNamePipe_1 = require("./globalPermissionsNamePipe");
var testing_1 = require('@angular/core/testing');
var chai_1 = require('chai');
testing_1.describe('GlobalPermissionsNamePipe', function () {
    var pipe;
    testing_1.beforeEach(function () {
        pipe = new globalPermissionsNamePipe_1.GlobalPermissionsNamePipe();
    });
    testing_1.describe('transform', function () {
        testing_1.it('should return correct string', function () {
            var userPermission = {
                value: 0,
                name: 'name',
                description: 'description'
            };
            chai_1.expect(pipe.transform(userPermission)).to.be.equal('name - description');
        });
    });
});
//# sourceMappingURL=globalPermissionsNamePipe.test.js.map