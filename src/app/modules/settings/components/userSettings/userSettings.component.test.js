"use strict";
var testing_1 = require('@angular/core/testing');
var sinon_1 = require('sinon');
var chai_1 = require('chai');
var userSettings_component_1 = require('./userSettings.component');
testing_1.describe('UserSettingsComponent', function () {
    var component;
    testing_1.beforeEachProviders(function () {
        return [
            userSettings_component_1.UserSettingsComponent
        ];
    });
    testing_1.beforeEach(testing_1.inject([userSettings_component_1.UserSettingsComponent], function (_component) {
        component = _component;
        component.availableUserSettings = {
            nativeElement: {}
        };
    }));
    testing_1.describe('ngAfterViewInit', function () {
        var jquerySpy;
        var jqueryResultTabsSpy;
        testing_1.beforeEach(function () {
            var jqueryResult = {
                tabs: function () { return null; }
            };
            jqueryResultTabsSpy = sinon_1.spy(jqueryResult, 'tabs');
            jquerySpy = sinon_1.stub(window, '$', function () {
                return jqueryResult;
            });
            component.ngAfterViewInit();
        });
        afterEach(function () {
            jquerySpy.restore();
        });
        testing_1.it('should initialize tabs', function () {
            chai_1.expect(jquerySpy.callCount).to.be.equal(1);
            chai_1.expect(jquerySpy.args[0]).to.be.length(1);
            chai_1.expect(jquerySpy.args[0][0]).to.be.equal(component.availableUserSettings.nativeElement);
            chai_1.expect(jqueryResultTabsSpy.callCount).to.be.equal(1);
        });
    });
});
//# sourceMappingURL=userSettings.component.test.js.map