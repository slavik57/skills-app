"use strict";
var testing_1 = require('@angular/core/testing');
var chai_1 = require('chai');
var home_component_1 = require('./home.component');
testing_1.describe('HomeComponent', function () {
    testing_1.beforeEachProviders(function () { return [
        home_component_1.HomeComponent
    ]; });
    testing_1.it('should work', testing_1.inject([home_component_1.HomeComponent], function (home) {
        chai_1.expect(true).to.be.true;
    }));
});
//# sourceMappingURL=home.component.test.js.map