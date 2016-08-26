import {ITeamModificatioPermissions} from "../../../common/interfaces/iTeamModificationPermissions";
import {ITeamNameDetails} from "../../../common/interfaces/iTeamNameDetails";
import {UserServiceMockFactory} from "../../../../testUtils/mockFactories/userServiceMockFactory";
import {
  it,
  inject,
  describe,
  beforeEach,
  beforeEachProviders,
  fakeAsync,
  tick
} from '@angular/core/testing';
import {provide} from '@angular/core';
import {SinonSpy, stub, spy} from 'sinon';
import {expect} from 'chai';
import { TeamSettingsComponent } from './teamSettings.component';
import {IUserService, UserService} from "../../../common/services/userService";
import { Subject } from 'rxjs/Subject';

describe('TeamSettingsComponent', () => {

  var userServiceMock: IUserService;
  var teamDetails: ITeamNameDetails;
  var getTeamModificationPermissionsResult: Subject<ITeamModificatioPermissions>;
  var getTeamModificationPermissionsSpy: SinonSpy;

  var component: TeamSettingsComponent;

  beforeEachProviders(() => {

    userServiceMock = UserServiceMockFactory.createUserServiceMock();

    getTeamModificationPermissionsSpy =
      stub(userServiceMock, 'getTeamModificationPermissions', () => {
        getTeamModificationPermissionsResult = new Subject<ITeamModificatioPermissions>();

        return getTeamModificationPermissionsResult;
      });

    return [
      provide(UserService, { useValue: userServiceMock }),
      TeamSettingsComponent
    ];
  });

  beforeEach(inject([TeamSettingsComponent], (_component: TeamSettingsComponent) => {
    component = _component;

    teamDetails = {
      id: 12321,
      teamName: 'some team name'
    };

    component.teamDetails = teamDetails;

    component.availableTeamSettings = {
      nativeElement: {}
    };
  }));

  describe('ngOnInit', () => {

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

      component.ngOnInit();
    });

    afterEach(() => {
      jquerySpy.restore();
    });

    it('isLoadingPermissions should be true', () => {
      expect(component.isLoadingPermissions).to.be.true;
    });

    it('loadingPermissionsError should be null', () => {
      expect(component.loadingPermissionsError).to.be.null;
    });

    it('permissions should be null', () => {
      expect(component.permissions).to.be.null;
    });

    it('should not initialize tabs', () => {
      expect(jquerySpy.callCount).to.be.equal(0);
    });

    it('should call userService.getTeamModificationPermissions()', () => {
      expect(getTeamModificationPermissionsSpy.callCount).to.be.equal(1);
      expect(getTeamModificationPermissionsSpy.args[0]).to.deep.equal([teamDetails.id]);
    });

    describe('getting team modification permissions fails', () => {

      var error: any;

      beforeEach(fakeAsync(() => {
        error = 'some error';
        getTeamModificationPermissionsResult.error(error);

        tick(0);
      }));

      it('isLoadingPermissions should be false', () => {
        expect(component.isLoadingPermissions).to.be.false;
      });

      it('loadingPermissionsError should be correct', () => {
        expect(component.loadingPermissionsError).to.be.equal(error);
      });

      it('permissions should be null', () => {
        expect(component.permissions).to.be.null;
      });

      it('should not initialize tabs', () => {
        expect(jquerySpy.callCount).to.be.equal(0);
      });

      describe('reload', () => {

        beforeEach(() => {
          getTeamModificationPermissionsSpy.reset();

          component.reload();
        });

        it('isLoadingPermissions should be true', () => {
          expect(component.isLoadingPermissions).to.be.true;
        });

        it('loadingPermissionsError should be null', () => {
          expect(component.loadingPermissionsError).to.be.null;
        });

        it('permissions should be null', () => {
          expect(component.permissions).to.be.null;
        });

        it('should not initialize tabs', () => {
          expect(jquerySpy.callCount).to.be.equal(0);
        });

        it('should call userService.getTeamModificationPermissions()', () => {
          expect(getTeamModificationPermissionsSpy.callCount).to.be.equal(1);
          expect(getTeamModificationPermissionsSpy.args[0]).to.deep.equal([teamDetails.id]);
        });

      });

    });

    describe('getting team modification permissions succeeds', () => {

      var permissions: ITeamModificatioPermissions;

      beforeEach(fakeAsync(() => {
        permissions = {
          canModifyTeamName: true,
          canModifyTeamAdmins: false,
          canModifyTeamUsers: true
        };

        getTeamModificationPermissionsResult.next(permissions);
        getTeamModificationPermissionsResult.complete();

        tick(0);
      }));

      it('isLoadingPermissions should be false', () => {
        expect(component.isLoadingPermissions).to.be.false;
      });

      it('loadingPermissionsError should be null', () => {
        expect(component.loadingPermissionsError).to.be.null;
      });

      it('permissions should be correct', () => {
        expect(component.permissions).to.be.equal(permissions);
      });

      it('should initialize tabs', () => {
        expect(jquerySpy.callCount).to.be.equal(1);
        expect(jquerySpy.args[0]).to.be.length(1);
        expect(jquerySpy.args[0][0]).to.be.equal(component.availableTeamSettings.nativeElement);
        expect(jqueryResultTabsSpy.callCount).to.be.equal(1);
      });

    });

  });

});
