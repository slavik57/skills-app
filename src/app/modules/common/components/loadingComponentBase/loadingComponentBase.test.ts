import {IUsernameDetails} from "../../../common/interfaces/iUsernameDetails";
import {LoadingComponentBase} from "./loadingComponentBase";
import {UserServiceMockFactory} from "../../../../testUtils/mockFactories/userServiceMockFactory";
import {
  it,
  inject,
  describe,
  beforeEach,
  afterEach,
  beforeEachProviders,
} from '@angular/core/testing';
import {provide} from '@angular/core';
import {expect} from 'chai';
import {IUserService, UserService} from "../../../common/services/userService";
import {SinonSpy, spy, stub} from 'sinon';
import { Subject } from 'rxjs/Subject';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';

class ConcreteComponent extends LoadingComponentBase<string> {
  protected setIsLoading(value: boolean): void {
  }

  protected setLoadingError(error: any): void {
  }

  protected setLoadingResult(result: string): void {
  }

  protected get(): Observable<string> {
    return null;
  }
}

describe('UsersSettingsComponent', () => {

  var component: ConcreteComponent;

  var setIsLoadingSpy: SinonSpy;
  var setLoadingErrorSpy: SinonSpy;
  var setLoadingResultSpy: SinonSpy;
  var getSpy: SinonSpy;
  var getResult: Subject<string>;

  beforeEach(() => {
    component = new ConcreteComponent();

    setIsLoadingSpy = spy(component, 'setIsLoading');
    setLoadingErrorSpy = spy(component, 'setLoadingError');
    setLoadingResultSpy = spy(component, 'setLoadingResult');

    getSpy = stub(component, 'get', () => {
      getResult = new Subject<string>();
      return getResult;
    });

    component.ngOnInit();
  });

  it('setIsLoading should be set called with true', () => {
    expect(setIsLoadingSpy.callCount).to.be.equal(1);
    expect(setIsLoadingSpy.args[0]).to.be.deep.equal([true]);
  });

  it('setLoadingError should be called with null', () => {
    expect(setLoadingErrorSpy.callCount).to.be.equal(1);
    expect(setLoadingErrorSpy.args[0]).to.be.deep.equal([null]);
  });

  it('should call get()', () => {
    expect(getSpy.callCount).to.be.equal(1);
  });

  it('setLoadingResult should be called with null', () => {
    expect(setLoadingResultSpy.callCount).to.be.equal(1);
    expect(setLoadingResultSpy.args[0]).to.be.deep.equal([null]);
  });

  describe('getting fails', () => {

    var error: string;

    beforeEach(() => {
      setIsLoadingSpy.reset();
      setLoadingErrorSpy.reset();
      setLoadingResultSpy.reset();
      getSpy.reset();

      error = 'some error';
      getResult.error(error);
    });

    it('setIsLoading should be called with false', () => {
      expect(setIsLoadingSpy.callCount).to.be.equal(1);
      expect(setIsLoadingSpy.args[0]).to.be.deep.equal([false]);
    });

    it('setLoadingError should be called with the error', () => {
      expect(setLoadingErrorSpy.callCount).to.be.equal(1);
      expect(setLoadingErrorSpy.args[0]).to.be.deep.equal([error]);
    });

    it('setLoadingResult should not be called', () => {
      expect(setLoadingResultSpy.callCount).to.be.equal(0);
    });

    describe('reload', () => {

      beforeEach(() => {
        setIsLoadingSpy.reset();
        setLoadingErrorSpy.reset();
        setLoadingResultSpy.reset();
        getSpy.reset();

        component.reload();
      });

      it('setIsLoading should be set called with true', () => {
        expect(setIsLoadingSpy.callCount).to.be.equal(1);
        expect(setIsLoadingSpy.args[0]).to.be.deep.equal([true]);
      });

      it('setLoadingError should be called with null', () => {
        expect(setLoadingErrorSpy.callCount).to.be.equal(1);
        expect(setLoadingErrorSpy.args[0]).to.be.deep.equal([null]);
      });

      it('should call get()', () => {
        expect(getSpy.callCount).to.be.equal(1);
      });

      it('setLoadingResult should be called with null', () => {
        expect(setLoadingResultSpy.callCount).to.be.equal(1);
        expect(setLoadingResultSpy.args[0]).to.be.deep.equal([null]);
      });

    })

  });

  describe('getting user permissions succeeds', () => {

    var result: string;

    beforeEach(() => {
      setIsLoadingSpy.reset();
      setLoadingErrorSpy.reset();
      setLoadingResultSpy.reset();
      getSpy.reset();

      result = 'some result';

      getResult.next(result);
      getResult.complete();
    });

    it('setIsLoading should be set called with false', () => {
      expect(setIsLoadingSpy.callCount).to.be.equal(1);
      expect(setIsLoadingSpy.args[0]).to.be.deep.equal([false]);
    });

    it('setLoadingError should not be called', () => {
      expect(setLoadingErrorSpy.callCount).to.be.equal(0);
    });

    it('setLoadingResult should be called with the result', () => {
      expect(setLoadingResultSpy.callCount).to.be.equal(1);
      expect(setLoadingResultSpy.args[0]).to.be.deep.equal([result]);
    });

  });

});
