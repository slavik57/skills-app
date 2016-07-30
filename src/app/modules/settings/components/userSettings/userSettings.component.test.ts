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
import { UserSettingsComponent } from './userSettings.component';

describe('UserSettingsComponent', () => {

  var component: UserSettingsComponent;

  beforeEachProviders(() => {
    return [
      UserSettingsComponent
    ];
  });

  beforeEach(inject([UserSettingsComponent], (_component: UserSettingsComponent) => {
    component = _component;

    component.availableUserSettings = {
      nativeElement: {}
    };
  }));


  describe('ngAfterViewInit', () => {

    var jquerySpy: SinonSpy;
    var jqueryResultTabsSpy: SinonSpy;

    beforeEach(() => {
      var jqueryResult = {
        tabs: () => null
      }

      jqueryResultTabsSpy = spy(jqueryResult, 'tabs');

      jquerySpy = stub(window, '$', () => {
        return jqueryResult;
      });

      component.ngAfterViewInit();
    });

    afterEach(() => {
      jquerySpy.restore();
    });

    it('should initialize tabs', () => {
      expect(jquerySpy.callCount).to.be.equal(1);
      expect(jquerySpy.args[0]).to.be.length(1);
      expect(jquerySpy.args[0][0]).to.be.equal(component.availableUserSettings.nativeElement);
      expect(jqueryResultTabsSpy.callCount).to.be.equal(1);
    });

  });

});
