"use strict";
var testing_1 = require('@angular/core/testing');
var sinon_1 = require('sinon');
var chai_1 = require('chai');
var settings_component_1 = require('./settings.component');
testing_1.describe('SettingsComponent', function () {
    var component;
    testing_1.beforeEachProviders(function () {
        return [
            settings_component_1.SettingsComponent
        ];
    });
    testing_1.beforeEach(testing_1.inject([settings_component_1.SettingsComponent], function (_component) {
        component = _component;
        component.availableSettings = {
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
            chai_1.expect(jquerySpy.args[0][0]).to.be.equal(component.availableSettings.nativeElement);
            chai_1.expect(jqueryResultTabsSpy.callCount).to.be.equal(1);
        });
    });
});
//# sourceMappingURL=settings.component.test.js.map