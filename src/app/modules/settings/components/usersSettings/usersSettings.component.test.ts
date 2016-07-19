import {IUsernameDetails} from "../../../common/interfaces/iUsernameDetails";
import {UsersSettingsComponent} from "./usersSettings.component";
import {UserServiceMockFactory} from "../../../../testUtils/mockFactories/userServiceMockFactory";
import {
  it,
  inject,
  describe,
  beforeEach,
  afterEach,
  beforeEachProviders,
  tick,
  fakeAsync
} from '@angular/core/testing';
import {provide} from '@angular/core';
import {expect} from 'chai';
import {IUserService, UserService} from "../../../common/services/userService";
import {SinonSpy, spy, stub} from 'sinon';
import { Subject } from 'rxjs/Subject';
import * as _ from 'lodash';

describe('UsersSettingsComponent', () => {

  var userServiceMock: IUserService;
  var getUsersDetailsSpy: SinonSpy;
  var getUsersDetailsResult: Subject<IUsernameDetails[]>;

  var jquerySpy: SinonSpy;
  var jqueryResultCollapsibleSpy: SinonSpy;

  var component: UsersSettingsComponent;

  beforeEachProviders(() => {

    userServiceMock = UserServiceMockFactory.createUserServiceMock();

    getUsersDetailsSpy =
      stub(userServiceMock, 'getUsersDetails', () => {
        getUsersDetailsResult = new Subject<IUsernameDetails[]>();
        return getUsersDetailsResult;
      });

    return [
      provide(UserService, { useValue: userServiceMock }),
      UsersSettingsComponent
    ];
  });

  beforeEach(inject([UsersSettingsComponent], (_component: UsersSettingsComponent) => {
    component = _component;

    component.userDetailsList = {
      nativeElement: {}
    }

    var jqueryResult = {
      collapsible: () => null
    }

    jqueryResultCollapsibleSpy = spy(jqueryResult, 'collapsible');
    jquerySpy = stub(window, '$', () => {
      return jqueryResult;
    });

    component.ngOnInit();
  }));

  afterEach(() => {
    jquerySpy.restore();
  });

  it('isLoadingUsers should be true', () => {
    expect(component.isLoadingUsers).to.be.true;
  });

  it('loadingUsersError should be null', () => {
    expect(component.loadingUsersError).to.be.null;
  });

  it('should call userService.getUsersDetails()', () => {
    expect(getUsersDetailsSpy.callCount).to.be.equal(1);
  });

  it('usersDetails should be null', () => {
    expect(component.usersDetails).to.be.null;
  });

  describe('getting users details fails', () => {

    var error: string;

    beforeEach(() => {
      error = 'some error';
      getUsersDetailsResult.error(error);
    });

    it('isLoadingUsers should be false', () => {
      expect(component.isLoadingUsers).to.be.false;
    });

    it('loadingUsersError should be correct', () => {
      expect(component.loadingUsersError).to.be.equal(error);
    });

    it('usersDetails should be null', () => {
      expect(component.usersDetails).to.be.null;
    });

    describe('reloadUserDetails', () => {

      beforeEach(() => {
        getUsersDetailsSpy.reset();

        component.reloadUsersDetails();
      });

      it('isLoadingUsers should be true', () => {
        expect(component.isLoadingUsers).to.be.true;
      });

      it('loadingUsersError should be null', () => {
        expect(component.loadingUsersError).to.be.null;
      });

      it('should call userService.getUsersDetails()', () => {
        expect(getUsersDetailsSpy.callCount).to.be.equal(1);
      });

      it('usersDetails should be null', () => {
        expect(component.usersDetails).to.be.null;
      });

    })

  });

  describe('getting users details succeeds', () => {

    var usersDetails: IUsernameDetails[];

    beforeEach(fakeAsync(() => {
      usersDetails =
        _.map([1, 2, 3], (_id) => {
          return { id: _id, username: _id.toString() };
        });

      getUsersDetailsResult.next(usersDetails);
      getUsersDetailsResult.complete();

      tick(0);
    }));

    it('isLoadingUsers should be false', () => {
      expect(component.isLoadingUsers).to.be.false;
    });

    it('loadingUsersError should be null', () => {
      expect(component.loadingUsersError).to.be.null;
    });

    it('usersDetails should be correct', () => {
      expect(component.usersDetails).to.deep.equal(usersDetails);
    });

    it('should initialize collapsible', () => {
      expect(jquerySpy.callCount).to.be.equal(1);
      expect(jquerySpy.args[0]).to.be.length(1);
      expect(jquerySpy.args[0][0]).to.be.equal(component.userDetailsList.nativeElement);
      expect(jqueryResultCollapsibleSpy.callCount).to.be.equal(1);
    });

  });

});
