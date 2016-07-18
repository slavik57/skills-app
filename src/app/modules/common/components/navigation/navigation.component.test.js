"use strict";
var testing_1 = require('@angular/core/testing');
var core_1 = require('@angular/core');
var chai_1 = require('chai');
var router_1 = require('@angular/router');
var navigation_component_1 = require('./navigation.component');
testing_1.describe('NavigationComponent', function () {
    var component;
    var routerMock;
    var urlPrefix;
    testing_1.beforeEachProviders(function () {
        urlPrefix = 'Some Url';
        routerMock = {
            url: urlPrefix + 'suffix'
        };
        return [
            core_1.provide(router_1.Router, { useValue: routerMock }),
            navigation_component_1.NavigationComponent
        ];
    });
    testing_1.beforeEach(testing_1.inject([navigation_component_1.NavigationComponent], function (_component) {
        component = _component;
    }));
    testing_1.describe('isActiveRoute', function () {
        testing_1.it('on route that starts with same url should return true', function () {
            chai_1.expect(component.isActiveRoute(urlPrefix)).to.be.true;
        });
        testing_1.it('on route that starts with same url but lower case should return true', function () {
            chai_1.expect(component.isActiveRoute(urlPrefix.toLowerCase())).to.be.true;
        });
        testing_1.it('on route that starts with same url but upper case should return true', function () {
            chai_1.expect(component.isActiveRoute(urlPrefix.toUpperCase())).to.be.true;
        });
        testing_1.it('on route that does not start with same url should return false', function () {
            chai_1.expect(component.isActiveRoute(urlPrefix + 'some other suffix')).to.be.false;
        });
    });
});
//# sourceMappingURL=navigation.component.test.js.map