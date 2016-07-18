import {
  it,
  inject,
  describe,
  beforeEach,
  beforeEachProviders,
} from '@angular/core/testing';
import {provide} from '@angular/core';
import {SinonSpy, stub, spy} from 'sinon';
import {expect} from 'chai';
import {Router} from '@angular/router';
import { NavigationComponent } from './navigation.component';

describe('NavigationComponent', () => {

  var component: NavigationComponent;
  var routerMock: Router;
  var urlPrefix: string;

  beforeEachProviders(() => {
    urlPrefix = 'Some Url';

    routerMock = <any>{
      url: urlPrefix + 'suffix'
    };

    return [
      provide(Router, { useValue: routerMock }),
      NavigationComponent
    ];
  });

  beforeEach(inject([NavigationComponent], (_component: NavigationComponent) => {
    component = _component;
  }));


  describe('isActiveRoute', () => {

    it('on route that starts with same url should return true', () => {
      expect(component.isActiveRoute(urlPrefix)).to.be.true;
    });

    it('on route that starts with same url but lower case should return true', () => {
      expect(component.isActiveRoute(urlPrefix.toLowerCase())).to.be.true;
    });

    it('on route that starts with same url but upper case should return true', () => {
      expect(component.isActiveRoute(urlPrefix.toUpperCase())).to.be.true;
    });

    it('on route that does not start with same url should return false', () => {
      expect(component.isActiveRoute(urlPrefix + 'some other suffix')).to.be.false;
    });

  });

});
