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
import { SettingsComponent } from './settings.component';

describe('SettingsComponent', () => {

  var component: SettingsComponent;

  beforeEachProviders(() => {
    return [
      SettingsComponent
    ];
  });

  beforeEach(inject([SettingsComponent], (_component: SettingsComponent) => {
    component = _component;

    component.availableSettings = <any>{
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
      expect(jquerySpy.args[0][0]).to.be.equal(component.availableSettings.nativeElement);
      expect(jqueryResultTabsSpy.callCount).to.be.equal(1);
    });

  });

});
