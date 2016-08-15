import {ItemTemplateResolver} from "./itemTemplateResolver.directive";
import {
  it,
  inject,
  describe,
  beforeEach,
  beforeEachProviders,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import {TemplateRef, ViewContainerRef, provide} from '@angular/core';
import {expect} from 'chai';
import {SinonSpy, spy, stub} from 'sinon';

describe('ItemTemplateResolver', () => {

  var directive: ItemTemplateResolver;
  var createEmbeddedViewSpy: SinonSpy;

  beforeEachProviders(() => {
    var viewContainerRefMock = {
      createEmbeddedView: () => null
    };

    createEmbeddedViewSpy = spy(viewContainerRefMock, 'createEmbeddedView');

    return [
      provide(ViewContainerRef, { useValue: viewContainerRefMock }),
      ItemTemplateResolver
    ];
  });

  beforeEach(inject([ItemTemplateResolver], (_directive: ItemTemplateResolver) => {
    directive = _directive;
  }));

  describe('itemTemplate', () => {

    var template: TemplateRef<any>;
    var item: any;

    beforeEach(() => {
      template = <any>{};
      item = {};

      directive.item = item;
      directive.itemTemplate = template;
    });

    it('should create embedded view correctly', () => {
      expect(createEmbeddedViewSpy.callCount).to.be.equal(1);

      var expectedArgs = [
        template,
        {
          item: item
        }
      ];

      expect(createEmbeddedViewSpy.args[0]).to.deep.equal(expectedArgs);
    });
  });
});
