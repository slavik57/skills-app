import {
  it,
  inject,
  describe,
  beforeEach,
  beforeEachProviders,
} from '@angular/core/testing';
import {provide} from '@angular/core';
import {IUserService, UserService, IUserDetails} from "../../common/services/userService";
import {SinonSpy, spy} from 'sinon';
import {expect} from 'chai';
import { UserProfileComponent } from './userProfile.component';
import { Subject } from 'rxjs/Subject';

describe('UserProfileComponent', () => {

  var userServiceMock: IUserService;
  var userProfileComponent: UserProfileComponent;
  var getUserDetailsSpy: SinonSpy;
  var getUserDetailsResult: Subject<IUserDetails>;

  beforeEachProviders(() => {

    getUserDetailsResult = new Subject<IUserDetails>()

    userServiceMock = {
      signinUser: () => null,
      registerUser: () => null,
      isUsernameExists: () => null,
      getUserDetails: () => getUserDetailsResult
    };

    getUserDetailsSpy = spy(userServiceMock, 'getUserDetails');

    return [
      provide(UserService, { useValue: userServiceMock }),
      UserProfileComponent
    ];
  });

  beforeEach(inject([UserProfileComponent], (_userProfileComponent: UserProfileComponent) => {
    userProfileComponent = _userProfileComponent;
    userProfileComponent.ngOnInit();
  }));

  it('should initialize correctly', () => {
    expect(userProfileComponent.gettingUserDetails, 'gettingUserDetails should be correct').to.be.true;
    expect(userProfileComponent.editUserProfileModel, 'editUserProfileModel should be correct').to.be.undefined;
    expect(userProfileComponent.gettingUserDetailsError, 'gettingUserDetailsError should be correct').to.be.null;
  });

  it('canReloadUserDetals should return false', () => {
    expect(userProfileComponent.canReloadUserDetails()).to.be.false;
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
      expect(userProfileComponent.gettingUserDetails).to.be.false;
    });

    it('model should still be undefined', () => {
      expect(userProfileComponent.editUserProfileModel).to.be.undefined;
    });

    it('should set error correctly', () => {
      expect(userProfileComponent.gettingUserDetailsError).to.be.equal(error);
    });

    it('canReloadUserDetals should return true', () => {
      expect(userProfileComponent.canReloadUserDetails()).to.be.true;
    });

    describe('reload user details', () => {

      beforeEach(() => {
        getUserDetailsSpy.reset();
        getUserDetailsResult = new Subject<IUserDetails>();

        userProfileComponent.loadUserDetails();
      });

      it('should set properties correctly', () => {
        expect(userProfileComponent.gettingUserDetails, 'gettingUserDetails should be correct').to.be.true;
        expect(userProfileComponent.editUserProfileModel, 'editUserProfileModel should be correct').to.be.undefined;
        expect(userProfileComponent.gettingUserDetailsError, 'gettingUserDetailsError should be correct').to.be.null;
      });

      it('canReloadUserDetals should return false', () => {
        expect(userProfileComponent.canReloadUserDetails()).to.be.false;
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
        email: 'some email',
        firstName: 'some firstName',
        lastName: 'some lastName'
      };

      getUserDetailsResult.next(userDetails);
      getUserDetailsResult.complete();
    });

    it('should set gettingUserDetails to false', () => {
      expect(userProfileComponent.gettingUserDetails).to.be.false;
    });

    it('should set error correctly', () => {
      expect(userProfileComponent.gettingUserDetailsError).to.be.null
    });

    it('canReloadUserDetals should return false', () => {
      expect(userProfileComponent.canReloadUserDetails()).to.be.false;
    });

    it('the model should be correct', () => {
      expect(userProfileComponent.editUserProfileModel).to.be.deep.equal(userDetails);
    })

  });

});
