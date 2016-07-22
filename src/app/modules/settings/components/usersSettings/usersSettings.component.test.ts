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

    component.userSettingsModal = {
      nativeElement: {}
    }

    component.ngOnInit();
  }));

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

  it('selectedUser should be null', () => {
    expect(component.selectedUser).to.be.null;
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

    it('selectedUser should be null', () => {
      expect(component.selectedUser).to.be.null;
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

      it('selectedUser should be null', () => {
        expect(component.selectedUser).to.be.null;
      });

    })

  });

  describe('getting users details succeeds', () => {

    var usersDetails: IUsernameDetails[];

    beforeEach(() => {
      usersDetails =
        _.map([1, 2, 3], (_id) => {
          return { id: _id, username: _id.toString() };
        });

      getUsersDetailsResult.next(usersDetails);
      getUsersDetailsResult.complete();

    });

    it('isLoadingUsers should be false', () => {
      expect(component.isLoadingUsers).to.be.false;
    });

    it('loadingUsersError should be null', () => {
      expect(component.loadingUsersError).to.be.null;
    });

    it('usersDetails should be correct', () => {
      expect(component.usersDetails).to.deep.equal(usersDetails);
    });

    it('selectedUser should be null', () => {
      expect(component.selectedUser).to.be.null;
    });

    describe('selectUser', () => {

      var userToSelect: IUsernameDetails;
      var jquerySpy: SinonSpy;
      var openModalSpy: SinonSpy;

      beforeEach(() => {
        userToSelect = usersDetails[1];

        var jqueryResult = {
          openModal: () => null
        }

        openModalSpy = spy(jqueryResult, 'openModal');

        jquerySpy = stub(window, '$', () => jqueryResult);

        component.selectUser(userToSelect);
      });

      afterEach(() => {
        jquerySpy.restore();
      });

      it('should update the selctedUser correctly', () => {
        expect(component.selectedUser).to.be.equal(userToSelect);
      });

      it('should open the modal', () => {
        expect(jquerySpy.callCount).to.be.equal(1);
        expect(jquerySpy.args[0].length).to.be.equal(1);
        expect(jquerySpy.args[0][0]).to.be.equal(component.userSettingsModal.nativeElement);
        expect(openModalSpy.callCount).to.be.equal(1);
      });

      describe('reloadUsersDetails', () => {

        beforeEach(() => {
          component.reloadUsersDetails();
        });

        it('should set selectedUser to null', () => {
          expect(component.selectedUser).to.be.null;
        });

      });

    });

  });

});
