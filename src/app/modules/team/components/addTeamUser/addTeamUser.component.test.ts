import {ITeamMemberDetails} from "../../../common/interfaces/iTeamMemberDetails";
import {ITeamNameDetails} from "../../../common/interfaces/iTeamNameDetails";
import {IUsernameDetails} from "../../../common/interfaces/iUsernameDetails";
import {UserServiceMockFactory} from "../../../../testUtils/mockFactories/userServiceMockFactory";
import {TeamServiceMockFactory} from "../../../../testUtils/mockFactories/teamServiceMockFactory";
import {IValidationResult} from "../../../common/validators/iValidationResult";
import {FormFiller} from "../../../../testUtils/formFiller";
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
import {ITeamService, TeamService} from "../../../common/services/teamService";
import {IUserService, UserService} from "../../../common/services/userService";
import {SinonSpy, spy, stub} from 'sinon';
import {expect} from 'chai';
import {AddTeamUserComponent} from "./addTeamUser.component";
import { Subject } from 'rxjs/Subject';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  IUsernameNotExistsValidator,
  UsernameNotExistsValidator,
  IUsernameNotExistsValidatorFactory,
  UsernameNotExistsValidatorFactory
} from "../../../common/validators/usernameNotExistsValidator";

describe('TeamUsersComponent', () => {

  var teamDetails: ITeamNameDetails;
  var userServiceMock: IUserService;
  var teamServiceMock: ITeamService;
  var component: AddTeamUserComponent;
  var getUsersDetailsByPartialUsernameSpy: SinonSpy;
  var getUsersDetailsByPartialUsernameResult: Subject<IUsernameDetails[]>;
  var usernameNotExistsResult: Subject<IValidationResult>;
  var usernameNotExistsValidatorMock: IUsernameNotExistsValidator;
  var usernameNotExistsValidatorFactoryMock: IUsernameNotExistsValidatorFactory;
  var usernameNotExistsValidatorBindControlSpy: SinonSpy;
  var createUsernameNotExistsValidatorSpy: SinonSpy;
  var destroyUsernameNotExistsValidatorSpy: SinonSpy;

  beforeEachProviders(() => {

    userServiceMock = UserServiceMockFactory.createUserServiceMock();
    teamServiceMock = TeamServiceMockFactory.createTeamServiceMock();

    getUsersDetailsByPartialUsernameSpy =
      stub(userServiceMock, 'getUsersDetailsByPartialUsername', () => {
        getUsersDetailsByPartialUsernameResult = new Subject<IUsernameDetails[]>();
        return getUsersDetailsByPartialUsernameResult;
      });

    usernameNotExistsValidatorMock = {
      bindControl: () => { },
      isExists: () => {
        usernameNotExistsResult = new Subject<IValidationResult>();

        return usernameNotExistsResult;
      },
      destroy: () => null
    }

    usernameNotExistsValidatorBindControlSpy =
      spy(usernameNotExistsValidatorMock, 'bindControl');

    usernameNotExistsValidatorFactoryMock = {
      create: () => usernameNotExistsValidatorMock,
    }

    createUsernameNotExistsValidatorSpy =
      spy(usernameNotExistsValidatorFactoryMock, 'create');

    destroyUsernameNotExistsValidatorSpy =
      spy(usernameNotExistsValidatorMock, 'destroy');

    return [
      FormBuilder,
      provide(TeamService, { useValue: teamServiceMock }),
      provide(UserService, { useValue: userServiceMock }),
      provide(UsernameNotExistsValidatorFactory, { useValue: usernameNotExistsValidatorFactoryMock }),
      AddTeamUserComponent
    ];
  });

  beforeEach(inject([AddTeamUserComponent], (_component: AddTeamUserComponent) => {
    component = _component;

    teamDetails = {
      id: 12334,
      teamName: 'some team name'
    };

    component.teamDetails = teamDetails;
  }));

  describe('initialize', () => {

    beforeEach(() => {
      component.ngOnInit();
    });

    describe('usersByPartialUsernameSource.getItems', () => {

      var partialUsername: string;
      var actualUsers: IUsernameDetails[];
      var actualError: any;

      beforeEach(() => {
        partialUsername = 'partialUsername';

        component.usersByPartialUsernameSource.getItems(partialUsername)
          .subscribe((_users: IUsernameDetails[]) => {
            actualUsers = _users;
          },
          (_error: any) => {
            actualError = _error;
          });
      });

      it('should call teamService.getUsersByPartialUsername', () => {
        expect(getUsersDetailsByPartialUsernameSpy.callCount).to.be.equal(1);
        expect(getUsersDetailsByPartialUsernameSpy.args[0]).to.deep.equal([partialUsername, AddTeamUserComponent.MAX_NUMBER_OF_SUGGESTED_USERS])
      });

      describe('service fails', () => {

        var error: any;

        beforeEach(() => {
          error = 'some error';
          getUsersDetailsByPartialUsernameResult.error(error);
        });

        it('should fail correctly', () => {
          expect(actualError).to.be.equal(error);
        });

      });

      describe('service succeeds', () => {

        var users: IUsernameDetails[];

        beforeEach(() => {
          users = [
            {
              id: 1,
              username: 'username1'
            },
            {
              id: 2,
              username: 'username2'
            }]

          getUsersDetailsByPartialUsernameResult.next(users);
          getUsersDetailsByPartialUsernameResult.complete();
        });

        it('should return correct result', () => {
          expect(actualUsers).to.be.equal(users);
        });

      });

    });

    it('when the component is destroyed should destroy the TeamExistsValidator', () => {
      component.ngOnDestroy();

      expect(destroyUsernameNotExistsValidatorSpy.callCount).to.be.equal(1);
    });

    it('addTeamUserError should be correct', () => {
      expect(component.addTeamUserError).to.be.undefined;
    });

    it('isAddingTeamUser should be correct', () => {
      expect(component.isAddingTeamUser).to.be.false;
    });

    it('should initialize the addTeamUserFormGroup', () => {
      expect(component.addTeamUserFormGroup).to.exist;
    });

    it('canAddUserToTeam should return false', () => {
      expect(component.canAddUserToTeam()).to.be.false;
    });

    describe('usernameControl', () => {

      it('value should be correct', () => {
        expect(component.usernameControl.value).to.be.equal('');
      });

      it('should initialize the UsernameNotExistsValidator correctly', () => {
        expect(createUsernameNotExistsValidatorSpy.callCount).to.be.equal(1);
      });

      it('should bind the UsernameNotExistsValidator to usernameControl', () => {
        expect(usernameNotExistsValidatorBindControlSpy.callCount).to.be.equal(1);
        expect(usernameNotExistsValidatorBindControlSpy.args[0][0]).to.be.equal(component.usernameControl);
      });

      describe('change the username', () => {

        describe('to empty', () => {

          beforeEach(() => {
            var value = '';
            FormFiller.fillFormControl(component.addTeamUserFormGroup, component.usernameControl, value);
          });

          it('control should be invalid', () => {
            expect(component.usernameControl.errors).to.exist;
          });

          it('canAddUserToTeam should return false', () => {
            expect(component.canAddUserToTeam()).to.be.false;
          });

        });

        describe('to some username', () => {

          beforeEach(() => {
            var value = 'some username';
            FormFiller.fillFormControl(component.addTeamUserFormGroup, component.usernameControl, value);

            usernameNotExistsResult.next(null);
            usernameNotExistsResult.complete();
          });

          it('control should be valid', () => {
            expect(component.usernameControl.errors).to.not.exist;
          });

          it('canAddUserToTeam should return true', () => {
            expect(component.canAddUserToTeam()).to.be.true;
          });

          describe('clear username', () => {

            beforeEach(() => {
              var value = '';
              FormFiller.fillFormControl(component.addTeamUserFormGroup, component.usernameControl, value);
            });

            it('control should be valid', () => {
              expect(component.usernameControl.errors).to.exist;
            });

            it('canAddUserToTeam should return false', () => {
              expect(component.canAddUserToTeam()).to.be.false;
            });

          });

        });

        describe('to not existing username', () => {

          beforeEach(() => {
            var value = 'existing team name';
            FormFiller.fillFormControl(component.addTeamUserFormGroup, component.usernameControl, value);

            usernameNotExistsResult.next({ 'someError': true });
            usernameNotExistsResult.complete();
          });

          it('control should be invalid', () => {
            expect(component.usernameControl.errors).to.exist;
          });

          it('canAddUserToTeam should return false', () => {
            expect(component.canAddUserToTeam()).to.be.false;
          });

        });

      });

    });

    describe('addTeamUser()', () => {

      var username: string;
      var addTeamMemberResult: Subject<ITeamMemberDetails>;
      var addTeamMemberStub: SinonSpy;
      var emittedTeamMembers: ITeamMemberDetails[];

      beforeEach(() => {
        username = 'some username';

        FormFiller.fillFormControl(component.addTeamUserFormGroup, component.usernameControl, username);
        usernameNotExistsResult.next(null);
        usernameNotExistsResult.complete();

        addTeamMemberStub =
          stub(teamServiceMock, 'addTeamMember', () => {
            addTeamMemberResult = new Subject<ITeamMemberDetails>();
            return addTeamMemberResult;
          });

        emittedTeamMembers = [];
        component.teamMemberAddedEvent.subscribe(
          (_teamMember: ITeamMemberDetails) => {
            emittedTeamMembers.push(_teamMember);
          }
        )

        component.addTeamUser();
      });

      afterEach(() => {
        addTeamMemberStub.restore();
      })

      it('should call teamService.addTeamMember() correctly', () => {
        expect(addTeamMemberStub.callCount).to.be.equal(1);
        expect(addTeamMemberStub.args[0]).to.be.deep.equal([teamDetails.id, username]);
      });

      it('should set isAddingTeamUser to true', () => {
        expect(component.isAddingTeamUser).to.be.true;
      });

      it('should set addTeamUserError to null', () => {
        expect(component.addTeamUserError).to.be.null;
      });

      it('teamMemberAddedEvent should not be emitted', () => {
        expect(emittedTeamMembers).to.deep.equal([]);
      });

      describe('updating fails', () => {

        var error: string;

        beforeEach(() => {
          error = 'create team error';

          addTeamMemberResult.error(error);
        });

        it('should set isAddingTeamUser to false', () => {
          expect(component.isAddingTeamUser).to.be.false;
        });

        it('should set addTeamUserError correctly', () => {
          expect(component.addTeamUserError).to.be.equal(error);
        });

        it('teamMemberAddedEvent should not be emitted', () => {
          expect(emittedTeamMembers).to.deep.equal([]);
        });

      });

      describe('updating succeeds', () => {

        var addedTeamMember: ITeamMemberDetails;
        var updateTextFieldsSpy: SinonSpy;

        beforeEach(fakeAsync(() => {
          addedTeamMember = {
            id: 12345,
            username: 'some username',
            isAdmin: true
          };

          updateTextFieldsSpy = spy(Materialize, 'updateTextFields');

          addTeamMemberResult.next(addedTeamMember);
          addTeamMemberResult.complete();

          tick(0);
        }));

        afterEach(() => {
          updateTextFieldsSpy.restore();
        });

        it('should set isAddingTeamUser to false', () => {
          expect(component.isAddingTeamUser).to.be.false;
        });

        it('should set addTeamUserError to null', () => {
          expect(component.addTeamUserError).to.be.null;
        });

        it('canAddUserToTeam() should return false', () => {
          expect(component.canAddUserToTeam()).to.be.false;
        });

        it('should raise team created event correctly', () => {
          expect(emittedTeamMembers).to.be.deep.equal([addedTeamMember]);
        });

        it('should clear the usernameControl', () => {
          expect(component.usernameControl.value).to.be.empty;
        });

        it('should set the usernameControl as untouched', () => {
          expect(component.usernameControl.touched).to.be.false;
        });

        it('should set the usernameControl as pristine', () => {
          expect(component.usernameControl.pristine).to.be.true;
        });

        it('should call Materialize.updateTextFields()', () => {
          expect(updateTextFieldsSpy.callCount).to.be.equal(1);
        });

        describe('addTeamUser()', () => {

          beforeEach(() => {
            component.addTeamUser();
          });

          it('should set isAddingTeamUser to true', () => {
            expect(component.isAddingTeamUser).to.be.true;
          });

        });

      });

    })

  });

});
