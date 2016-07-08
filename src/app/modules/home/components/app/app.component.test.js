"use strict";
var testing_1 = require('@angular/core/testing');
var chai_1 = require('chai');
var app_component_1 = require('./app.component');
testing_1.describe('AppComponent', function () {
    testing_1.beforeEachProviders(function () { return [
        app_component_1.AppComponent
    ]; });
    testing_1.it('should work', testing_1.inject([app_component_1.AppComponent], function (app) {
        chai_1.expect(true).to.be.true;
    }));
});
//# sourceMappingURL=app.component.test.js.map