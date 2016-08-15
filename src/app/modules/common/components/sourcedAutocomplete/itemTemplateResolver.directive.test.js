"use strict";
var itemTemplateResolver_directive_1 = require("./itemTemplateResolver.directive");
var testing_1 = require('@angular/core/testing');
var core_1 = require('@angular/core');
var chai_1 = require('chai');
var sinon_1 = require('sinon');
testing_1.describe('ItemTemplateResolver', function () {
    var directive;
    var createEmbeddedViewSpy;
    testing_1.beforeEachProviders(function () {
        var viewContainerRefMock = {
            createEmbeddedView: function () { return null; }
        };
        createEmbeddedViewSpy = sinon_1.spy(viewContainerRefMock, 'createEmbeddedView');
        return [
            core_1.provide(core_1.ViewContainerRef, { useValue: viewContainerRefMock }),
            itemTemplateResolver_directive_1.ItemTemplateResolver
        ];
    });
    testing_1.beforeEach(testing_1.inject([itemTemplateResolver_directive_1.ItemTemplateResolver], function (_directive) {
        directive = _directive;
    }));
    testing_1.describe('itemTemplate', function () {
        var template;
        var item;
        testing_1.beforeEach(function () {
            template = {};
            item = {};
            directive.item = item;
            directive.itemTemplate = template;
        });
        testing_1.it('should create embedded view correctly', function () {
            chai_1.expect(createEmbeddedViewSpy.callCount).to.be.equal(1);
            var expectedArgs = [
                template,
                {
                    item: item
                }
            ];
            chai_1.expect(createEmbeddedViewSpy.args[0]).to.deep.equal(expectedArgs);
        });
    });
});
//# sourceMappingURL=itemTemplateResolver.directive.test.js.map