import {ISkillModificatioPermissions} from "../../../common/interfaces/iSkillModificationPermissions";
import {ISkillNameDetails} from "../../../common/interfaces/iSkillNameDetails";
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
import { SkillSettingsComponent } from './skillSettings.component';
import {IUserService, UserService} from "../../../common/services/userService";
import { Subject } from 'rxjs/Subject';

describe('SkillSettingsComponent', () => {

  var userServiceMock: IUserService;
  var skillDetails: ISkillNameDetails;
  var getSkillModificationPermissionsResult: Subject<ISkillModificatioPermissions>;
  var getSkillModificationPermissionsSpy: SinonSpy;

  var component: SkillSettingsComponent;

  beforeEachProviders(() => {

    userServiceMock = UserServiceMockFactory.createUserServiceMock();

    getSkillModificationPermissionsSpy =
      stub(userServiceMock, 'getSkillModificationPermissions', () => {
        getSkillModificationPermissionsResult = new Subject<ISkillModificatioPermissions>();

        return getSkillModificationPermissionsResult;
      });

    return [
      provide(UserService, { useValue: userServiceMock }),
      SkillSettingsComponent
    ];
  });

  beforeEach(inject([SkillSettingsComponent], (_component: SkillSettingsComponent) => {
    component = _component;

    skillDetails = {
      id: 12321,
      skillName: 'some skill name'
    };

    component.skillDetails = skillDetails;

    component.availableSkillSettings = {
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

    it('should call userService.getSkillModificationPermissions()', () => {
      expect(getSkillModificationPermissionsSpy.callCount).to.be.equal(1);
      expect(getSkillModificationPermissionsSpy.args[0]).to.deep.equal([skillDetails.id]);
    });

    describe('getting skill modification permissions fails', () => {

      var error: any;

      beforeEach(fakeAsync(() => {
        error = 'some error';
        getSkillModificationPermissionsResult.error(error);

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
          getSkillModificationPermissionsSpy.reset();

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

        it('should call userService.getSkillModificationPermissions()', () => {
          expect(getSkillModificationPermissionsSpy.callCount).to.be.equal(1);
          expect(getSkillModificationPermissionsSpy.args[0]).to.deep.equal([skillDetails.id]);
        });

      });

    });

    describe('getting skill modification permissions succeeds', () => {

      var permissions: ISkillModificatioPermissions;

      beforeEach(fakeAsync(() => {
        permissions = {
          canAddPrerequisites: true,
          canAddDependencies: false
        };

        getSkillModificationPermissionsResult.next(permissions);
        getSkillModificationPermissionsResult.complete();

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
        expect(jquerySpy.args[0][0]).to.be.equal(component.availableSkillSettings.nativeElement);
        expect(jqueryResultTabsSpy.callCount).to.be.equal(1);
      });

    });

  });

});
