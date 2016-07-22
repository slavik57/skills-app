import {IUserDetails} from "../../../common/interfaces/iUserDetails";
import {UserServiceMockFactory} from "../../../../testUtils/mockFactories/userServiceMockFactory";
import {
  it,
  inject,
  describe,
  beforeEach,
  beforeEachProviders
} from '@angular/core/testing';
import {provide} from '@angular/core';
import {IUserService, UserService} from "../../../common/services/userService";
import {SinonSpy, stub, spy} from 'sinon';
import {expect} from 'chai';
import { UserProfileComponent } from './userProfile.component';
import { Subject } from 'rxjs/Subject';

describe('UserProfileComponent', () => {

  var userServiceMock: IUserService;
  var component: UserProfileComponent;
  var getUserDetailsSpy: SinonSpy;
  var getUserDetailsResult: Subject<IUserDetails>;

  beforeEachProviders(() => {

    getUserDetailsResult = new Subject<IUserDetails>()

    userServiceMock = UserServiceMockFactory.createUserServiceMock();

    userServiceMock.getUserDetails = () => getUserDetailsResult;

    getUserDetailsSpy = spy(userServiceMock, 'getUserDetails');

    return [
      provide(UserService, { useValue: userServiceMock }),
      UserProfileComponent
    ];
  });

  beforeEach(inject([UserProfileComponent], (_component: UserProfileComponent) => {
    component = _component;
    component.ngOnInit();
  }));

  it('should initialize correctly', () => {
    expect(component.gettingUserDetails, 'gettingUserDetails should be correct').to.be.true;
    expect(component.gettingUserDetailsError, 'gettingUserDetailsError should be correct').to.be.null;
    expect(component.userDetails, 'userDetails should be correct').to.be.null;
  });

  it('should fetch userDetails', () => {
    expect(getUserDetailsSpy.callCount).to.be.equal(1);
  });

  describe('fetching user details failed', () => {

    var error: any;

    beforeEach(() => {
      error = 'some error';
      getUserDetailsResult.error(error);
    });

    it('should set gettingUserDetails to false', () => {
      expect(component.gettingUserDetails).to.be.false;
    });

    it('userDetails should still be null', () => {
      expect(component.userDetails).to.be.null;
    });

    it('should set error correctly', () => {
      expect(component.gettingUserDetailsError).to.be.equal(error);
    });

    describe('reload user details', () => {

      beforeEach(() => {
        getUserDetailsSpy.reset();
        getUserDetailsResult = new Subject<IUserDetails>();

        component.reload();
      });

      it('should set properties correctly', () => {
        expect(component.gettingUserDetails, 'gettingUserDetails should be correct').to.be.true;
        expect(component.gettingUserDetailsError, 'gettingUserDetailsError should be correct').to.be.null;
        expect(component.userDetails, 'userDetails should be correct').to.be.null;
      });

      it('should fetch userDetails', () => {
        expect(getUserDetailsSpy.callCount).to.be.equal(1);
      });

    });

  });

  describe('fetching user details succeeds', () => {

    var userDetails: IUserDetails;

    beforeEach(() => {
      userDetails = {
        id: 1,
        username: 'some username',
        email: 'some@email.com',
        firstName: 'some firstName',
        lastName: 'some lastName'
      };

      getUserDetailsResult.next(userDetails);
      getUserDetailsResult.complete();
    });

    it('should set gettingUserDetails to false', () => {
      expect(component.gettingUserDetails).to.be.false;
    });

    it('should set error correctly', () => {
      expect(component.gettingUserDetailsError).to.be.null
    });

    it('the userDetails should be correct', () => {
      expect(component.userDetails).to.be.deep.equal(userDetails);
    });

  });

  describe('fetching user details succeeds with null email', () => {

    var userDetails: IUserDetails;

    beforeEach(() => {
      userDetails = {
        id: 1,
        username: 'some username',
        email: null,
        firstName: 'some firstName',
        lastName: 'some lastName'
      };

      getUserDetailsResult.next(userDetails);
      getUserDetailsResult.complete();
    });

    it('should set gettingUserDetails to false', () => {
      expect(component.gettingUserDetails).to.be.false;
    });

    it('should set error correctly', () => {
      expect(component.gettingUserDetailsError).to.be.null
    });

    it('the userDetails should be correct', () => {
      expect(component.userDetails).to.be.deep.equal(userDetails);
    });

  });

});
