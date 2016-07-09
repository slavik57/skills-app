import {IValidationResult} from "../../common/validators/iValidationResult";
import {FormFiller} from "../../../testUtils/formFiller";
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
import {IUserService, UserService, IUserDetails} from "../../common/services/userService";
import {SinonSpy, stub, spy} from 'sinon';
import {expect} from 'chai';
import { UserProfileComponent } from './userProfile.component';
import { Subject } from 'rxjs/Subject';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  IUsernameExistsValidator,
  UsernameExistsValidator,
  IUsernameExistsValidatorFactory,
  UsernameExistsValidatorFactory
} from "../../common/validators/usernameExistsValidator";

describe('UserProfileComponent', () => {

  var userServiceMock: IUserService;
  var userProfileComponent: UserProfileComponent;
  var getUserDetailsSpy: SinonSpy;
  var getUserDetailsResult: Subject<IUserDetails>;
  var usernameExistsResult: Subject<IValidationResult>;
  var usernameExistsValidatorMock: IUsernameExistsValidator;
  var usernameExistsValidatorFactoryMock: IUsernameExistsValidatorFactory;
  var usernameExistsValidatorBindControlSpy: SinonSpy;
  var createUsernameExistsValidatorSpy: SinonSpy;

  beforeEachProviders(() => {

    getUserDetailsResult = new Subject<IUserDetails>()

    userServiceMock = {
      signinUser: () => null,
      registerUser: () => null,
      isUsernameExists: () => null,
      getUserDetails: () => getUserDetailsResult,
      updateUserDetails: () => null
    };

    getUserDetailsSpy = spy(userServiceMock, 'getUserDetails');

    usernameExistsValidatorMock = {
      bindControl: () => { },
      usernameExists: () => {
        usernameExistsResult = new Subject<IValidationResult>();

        return usernameExistsResult;
      }
    }

    usernameExistsValidatorBindControlSpy =
      spy(usernameExistsValidatorMock, 'bindControl');

    usernameExistsValidatorFactoryMock = {
      create: () => null,
      createWithAllowedUsers: () => usernameExistsValidatorMock
    }

    createUsernameExistsValidatorSpy =
      spy(usernameExistsValidatorFactoryMock, 'createWithAllowedUsers');

    return [
      FormBuilder,
      provide(UserService, { useValue: userServiceMock }),
      provide(UsernameExistsValidatorFactory, { useValue: usernameExistsValidatorFactoryMock }),
      UserProfileComponent
    ];
  });

  beforeEach(inject([UserProfileComponent], (_userProfileComponent: UserProfileComponent) => {
    userProfileComponent = _userProfileComponent;
    userProfileComponent.ngOnInit();
  }));

  it('should initialize correctly', () => {
    expect(userProfileComponent.gettingUserDetails, 'gettingUserDetails should be correct').to.be.true;
    expect(userProfileComponent.model, 'editUserProfileModel should be correct').to.be.undefined;
    expect(userProfileComponent.gettingUserDetailsError, 'gettingUserDetailsError should be correct').to.be.null;
    expect(userProfileComponent.userDetailsFormGroup).to.be.undefined;
    expect(userProfileComponent.updatingUserDetails, 'updatingUserDetails should be correct').to.be.false;
    expect(userProfileComponent.updatingUserDetailsError, 'updatingUserDetailsError should be correct').to.be.undefined;
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
      expect(userProfileComponent.model).to.be.undefined;
    });

    it('userDetailsFormGroup should still be undefined', () => {
      expect(userProfileComponent.userDetailsFormGroup).to.be.undefined;
    })

    it('should set error correctly', () => {
      expect(userProfileComponent.gettingUserDetailsError).to.be.equal(error);
    });

    describe('reload user details', () => {

      beforeEach(() => {
        getUserDetailsSpy.reset();
        getUserDetailsResult = new Subject<IUserDetails>();

        userProfileComponent.loadUserDetails();
      });

      it('should set properties correctly', () => {
        expect(userProfileComponent.gettingUserDetails, 'gettingUserDetails should be correct').to.be.true;
        expect(userProfileComponent.model, 'editUserProfileModel should be correct').to.be.undefined;
        expect(userProfileComponent.gettingUserDetailsError, 'gettingUserDetailsError should be correct').to.be.null;
        expect(userProfileComponent.userDetailsFormGroup).to.be.undefined;
      });

      it('should fetch userDetails', () => {
        expect(getUserDetailsSpy.callCount).to.be.equal(1);
      });

    });

  });

  describe('fetching user details succeeds', () => {

    var userDetails: IUserDetails;
    var updateTextFieldsSpy: SinonSpy;

    beforeEach(fakeAsync(() => {
      userDetails = {
        id: 1,
        username: 'some username',
        email: 'some@email.com',
        firstName: 'some firstName',
        lastName: 'some lastName'
      };

      updateTextFieldsSpy = spy(Materialize, 'updateTextFields');

      getUserDetailsResult.next(userDetails);
      getUserDetailsResult.complete();

      tick(0);

      usernameExistsResult.next(null);
      usernameExistsResult.complete();
    }));

    afterEach(() => {
      updateTextFieldsSpy.restore();
    });

    it('should set gettingUserDetails to false', () => {
      expect(userProfileComponent.gettingUserDetails).to.be.false;
    });

    it('should set error correctly', () => {
      expect(userProfileComponent.gettingUserDetailsError).to.be.null
    });

    it('the model should be correct', () => {
      expect(userProfileComponent.model).to.be.deep.equal(userDetails);
    });

    it('should initialize the userDetailsFormGroup', () => {
      expect(userProfileComponent.userDetailsFormGroup).to.exist;
    });

    it('should call Materialize.updateTextFields()', () => {
      expect(updateTextFieldsSpy.callCount).to.be.equal(1);
    });

    it('canUpdateUserDetails should return false', () => {
      expect(userProfileComponent.canUpdateUserDetails()).to.be.false;
    });

    describe('username', () => {

      var usernameControl: FormControl;

      beforeEach(() => {
        usernameControl =
          <FormControl>userProfileComponent.userDetailsFormGroup.controls['username'];
      });

      it('value should be correct', () => {
        expect(usernameControl.value).to.be.equal(userDetails.username);
      });

      it('should initialize the UsernameExistsValidator correctly', () => {
        expect(createUsernameExistsValidatorSpy.callCount).to.be.equal(1);
        expect(createUsernameExistsValidatorSpy.args[0][0]).to.be.deep.equal([userDetails.username]);
      });

      it('should bind the UsernameExistsValidator to username control', () => {
        expect(usernameExistsValidatorBindControlSpy.callCount).to.be.equal(1);
        expect(usernameExistsValidatorBindControlSpy.args[0][0]).to.be.equal(usernameControl);
      });

      describe('change the username', () => {

        describe('to empty', () => {

          beforeEach(() => {
            var value = '';
            FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, usernameControl, value);
            userProfileComponent.model.username = value;
          });

          it('control should be invalid', () => {
            expect(usernameControl.errors).to.exist;
          });

          it('canUpdateUserDetails should return false', () => {
            expect(userProfileComponent.canUpdateUserDetails()).to.be.false;
          });

        });

        describe('to different user', () => {

          beforeEach(() => {
            var value = 'some other user';
            FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, usernameControl, value);
            userProfileComponent.model.username = value;

            usernameExistsResult.next(null);
            usernameExistsResult.complete();
          });

          it('control should be valid', () => {
            expect(usernameControl.errors).to.not.exist;
          });

          it('canUpdateUserDetails should return true', () => {
            expect(userProfileComponent.canUpdateUserDetails()).to.be.true;
          });

          describe('restore username', () => {

            beforeEach(() => {
              var value = userDetails.username;
              FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, usernameControl, value);
              userProfileComponent.model.username = value;

              usernameExistsResult.next(null);
              usernameExistsResult.complete();
            });

            it('control should be valid', () => {
              expect(usernameControl.errors).to.not.exist;
            });

            it('canUpdateUserDetails should return false', () => {
              expect(userProfileComponent.canUpdateUserDetails()).to.be.false;
            });

          });

        });

        describe('to existing username', () => {

          beforeEach(() => {
            var value = 'existing username';
            FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, usernameControl, value);
            userProfileComponent.model.username = value;

            usernameExistsResult.next({ 'someError': true });
            usernameExistsResult.complete();
          });

          it('control should be invalid', () => {
            expect(usernameControl.errors).to.exist;
          });

          it('canUpdateUserDetails should return false', () => {
            expect(userProfileComponent.canUpdateUserDetails()).to.be.false;
          });

        });

      });

    });

    describe('email', () => {

      var emailControl: FormControl;

      beforeEach(() => {
        emailControl =
          <FormControl>userProfileComponent.userDetailsFormGroup.controls['email'];
      });

      it('value should be correct', () => {
        expect(emailControl.value).to.be.equal(userDetails.email);
      });

      describe('change the email', () => {

        describe('to empty', () => {

          beforeEach(() => {
            var value = '';
            FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, emailControl, value);
            userProfileComponent.model.email = value;
          });

          it('control should be valid', () => {
            expect(emailControl.errors).to.not.exist;
          });

          it('canUpdateUserDetails should return true', () => {
            expect(userProfileComponent.canUpdateUserDetails()).to.be.true;
          });

        });

        describe('to different email', () => {

          beforeEach(() => {
            var value = 'someOther@email.com';
            FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, emailControl, value);
            userProfileComponent.model.email = value;
          });

          it('control should be valid', () => {
            expect(emailControl.errors).to.not.exist;
          });

          it('canUpdateUserDetails should return true', () => {
            expect(userProfileComponent.canUpdateUserDetails()).to.be.true;
          });

          describe('restore email', () => {

            beforeEach(() => {
              var value = userDetails.email;
              FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, emailControl, value);
              userProfileComponent.model.email = value;
            });

            it('control should be valid', () => {
              expect(emailControl.errors).to.not.exist;
            });

            it('canUpdateUserDetails should return false', () => {
              expect(userProfileComponent.canUpdateUserDetails()).to.be.false;
            });

          });

        });

        describe('to invalid email', () => {

          beforeEach(() => {
            var value = 'invlaid email';
            FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, emailControl, value);
            userProfileComponent.model.email = value;
          });

          it('control should be invalid', () => {
            expect(emailControl.errors).to.exist;
          });

          it('canUpdateUserDetails should return false', () => {
            expect(userProfileComponent.canUpdateUserDetails()).to.be.false;
          });

        });

      });

    });

    describe('firstName', () => {

      var firstNameControl: FormControl;

      beforeEach(() => {
        firstNameControl =
          <FormControl>userProfileComponent.userDetailsFormGroup.controls['firstName'];
      });

      it('value should be correct', () => {
        expect(firstNameControl.value).to.be.equal(userDetails.firstName);
      });

      describe('change the firstName', () => {

        describe('to empty', () => {

          beforeEach(() => {
            var value = '';
            FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, firstNameControl, value);
            userProfileComponent.model.firstName = value;
          });

          it('control should be invalid', () => {
            expect(firstNameControl.errors).to.exist;
          });

          it('canUpdateUserDetails should return false', () => {
            expect(userProfileComponent.canUpdateUserDetails()).to.be.false;
          });

        });

        describe('to different first name', () => {

          beforeEach(() => {
            var value = 'some other first name';
            FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, firstNameControl, value);
            userProfileComponent.model.firstName = value;
          });

          it('control should be valid', () => {
            expect(firstNameControl.errors).to.not.exist;
          });

          it('canUpdateUserDetails should return true', () => {
            expect(userProfileComponent.canUpdateUserDetails()).to.be.true;
          });

          describe('restore first name', () => {

            beforeEach(() => {
              var value = userDetails.firstName;
              FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, firstNameControl, value);
              userProfileComponent.model.firstName = value;
            });

            it('control should be valid', () => {
              expect(firstNameControl.errors).to.not.exist;
            });

            it('canUpdateUserDetails should return false', () => {
              expect(userProfileComponent.canUpdateUserDetails()).to.be.false;
            });

          });

        });

      });

    });

    describe('lastName', () => {

      var lastNameControl: FormControl;

      beforeEach(() => {
        lastNameControl =
          <FormControl>userProfileComponent.userDetailsFormGroup.controls['lastName'];
      });

      it('value should be correct', () => {
        expect(lastNameControl.value).to.be.equal(userDetails.lastName);
      });

      describe('change the lastName', () => {

        describe('to empty', () => {

          beforeEach(() => {
            var value = '';
            FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, lastNameControl, value);
            userProfileComponent.model.lastName = value;
          });

          it('control should be invalid', () => {
            expect(lastNameControl.errors).to.exist;
          });

          it('canUpdateUserDetails should return false', () => {
            expect(userProfileComponent.canUpdateUserDetails()).to.be.false;
          });

        });

        describe('to different last name', () => {

          beforeEach(() => {
            var value = 'some other last name';
            FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, lastNameControl, value);
            userProfileComponent.model.lastName = value;
          });

          it('control should be valid', () => {
            expect(lastNameControl.errors).to.not.exist;
          });

          it('canUpdateUserDetails should return true', () => {
            expect(userProfileComponent.canUpdateUserDetails()).to.be.true;
          });

          describe('restore last name', () => {

            beforeEach(() => {
              var value = userDetails.lastName;
              FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, lastNameControl, value);
              userProfileComponent.model.lastName = value;
            });

            it('control should be valid', () => {
              expect(lastNameControl.errors).to.not.exist;
            });

            it('canUpdateUserDetails should return false', () => {
              expect(userProfileComponent.canUpdateUserDetails()).to.be.false;
            });

          });

        });

      });
    });

    describe('updateUserDetails()', () => {

      var newUserDetails: IUserDetails;
      var updateUserDetailsResult: Subject<void>;
      var updateUserDetailsStub: SinonSpy;

      beforeEach(() => {
        newUserDetails = {
          id: userDetails.id,
          username: 'new username',
          email: 'new@email.com',
          firstName: 'new first name',
          lastName: 'new last name'
        }

        var usernameControl = <FormControl>userProfileComponent.userDetailsFormGroup.controls['username'];
        var emailControl = <FormControl>userProfileComponent.userDetailsFormGroup.controls['email'];
        var firstNameControl = <FormControl>userProfileComponent.userDetailsFormGroup.controls['firstName'];
        var lastNameControl = <FormControl>userProfileComponent.userDetailsFormGroup.controls['lastName'];

        FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, usernameControl, newUserDetails.username);
        userProfileComponent.model.username = newUserDetails.username;
        usernameExistsResult.next(null);
        usernameExistsResult.complete();

        FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, emailControl, newUserDetails.email);
        userProfileComponent.model.email = newUserDetails.email;

        FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, firstNameControl, newUserDetails.firstName);
        userProfileComponent.model.firstName = newUserDetails.firstName;

        FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, lastNameControl, newUserDetails.lastName);
        userProfileComponent.model.lastName = newUserDetails.lastName;

        updateUserDetailsResult = new Subject<void>();

        updateUserDetailsStub =
          stub(userServiceMock, 'updateUserDetails', () => updateUserDetailsResult);

        userProfileComponent.updateUserDetails();
      });

      afterEach(() => {
        updateUserDetailsStub.restore();
      })

      it('should call userService.updateUserDetails() correctly', () => {
        var expectedArgs = [
          newUserDetails.id,
          newUserDetails.username,
          newUserDetails.email,
          newUserDetails.firstName,
          newUserDetails.lastName
        ];

        expect(updateUserDetailsStub.callCount).to.be.equal(1);
        expect(updateUserDetailsStub.args[0]).to.be.deep.equal(expectedArgs);
      });

      it('should set updatingUserDetails to true', () => {
        expect(userProfileComponent.updatingUserDetails).to.be.true;
      });

      it('should set updatingUserDetailsError to null', () => {
        expect(userProfileComponent.updatingUserDetailsError).to.be.null;
      });

      describe('updating fails', () => {

        var error: string;

        beforeEach(() => {
          error = 'updateUserDetails error';

          updateUserDetailsResult.error(error);
        });

        it('should set updatingUserDetails to false', () => {
          expect(userProfileComponent.updatingUserDetails).to.be.false;
        });

        it('should set updatingUserDetailsError correctly', () => {
          expect(userProfileComponent.updatingUserDetailsError).to.be.equal(error);
        });

      });

      describe('updating succeeds', () => {

        beforeEach(() => {
          updateUserDetailsResult.next(null);
          updateUserDetailsResult.complete();
        });

        it('should set updatingUserDetails to false', () => {
          expect(userProfileComponent.updatingUserDetails).to.be.false;
        });

        it('should set updatingUserDetailsError to null', () => {
          expect(userProfileComponent.updatingUserDetailsError).to.be.null;
        });

      });

    })

  });

  describe('fetching user details succeeds with null email', () => {

    var userDetails: IUserDetails;
    var updateTextFieldsSpy: SinonSpy;

    beforeEach(fakeAsync(() => {
      userDetails = {
        id: 1,
        username: 'some username',
        email: null,
        firstName: 'some firstName',
        lastName: 'some lastName'
      };

      updateTextFieldsSpy = spy(Materialize, 'updateTextFields');

      getUserDetailsResult.next(userDetails);
      getUserDetailsResult.complete();

      tick(0);

      usernameExistsResult.next(null);
      usernameExistsResult.complete();
    }));

    afterEach(() => {
      updateTextFieldsSpy.restore();
    });

    it('should set gettingUserDetails to false', () => {
      expect(userProfileComponent.gettingUserDetails).to.be.false;
    });

    it('should set error correctly', () => {
      expect(userProfileComponent.gettingUserDetailsError).to.be.null
    });

    it('the model should be correct', () => {
      expect(userProfileComponent.model).to.be.deep.equal(userDetails);
    });

    it('should initialize the userDetailsFormGroup', () => {
      expect(userProfileComponent.userDetailsFormGroup).to.exist;
    });

    it('should call Materialize.updateTextFields()', () => {
      expect(updateTextFieldsSpy.callCount).to.be.equal(1);
    });

    it('canUpdateUserDetails should return false', () => {
      expect(userProfileComponent.canUpdateUserDetails()).to.be.false;
    });

    describe('email', () => {

      var emailControl: FormControl;

      beforeEach(() => {
        emailControl =
          <FormControl>userProfileComponent.userDetailsFormGroup.controls['email'];
      });

      it('value should be correct', () => {
        expect(emailControl.value).to.be.equal(userDetails.email);
      });

      describe('change the email', () => {

        describe('to empty', () => {

          beforeEach(() => {
            var value = '';
            FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, emailControl, value);
            userProfileComponent.model.email = value;
          });

          it('control should be valid', () => {
            expect(emailControl.errors).to.not.exist;
          });

          it('canUpdateUserDetails should return false', () => {
            expect(userProfileComponent.canUpdateUserDetails()).to.be.false;
          });

        });

        describe('to different email', () => {

          beforeEach(() => {
            var value = 'someOther@email.com';
            FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, emailControl, value);
            userProfileComponent.model.email = value;
          });

          it('control should be valid', () => {
            expect(emailControl.errors).to.not.exist;
          });

          it('canUpdateUserDetails should return true', () => {
            expect(userProfileComponent.canUpdateUserDetails()).to.be.true;
          });

          describe('restore email', () => {

            beforeEach(() => {
              var value = userDetails.email;
              FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, emailControl, value);
              userProfileComponent.model.email = value;
            });

            it('control should be valid', () => {
              expect(emailControl.errors).to.not.exist;
            });

            it('canUpdateUserDetails should return false', () => {
              expect(userProfileComponent.canUpdateUserDetails()).to.be.false;
            });

          });

        });

        describe('to invalid email', () => {

          beforeEach(() => {
            var value = 'invlaid email';
            FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, emailControl, value);
            userProfileComponent.model.email = value;
          });

          it('control should be invalid', () => {
            expect(emailControl.errors).to.exist;
          });

          it('canUpdateUserDetails should return false', () => {
            expect(userProfileComponent.canUpdateUserDetails()).to.be.false;
          });

        });

      });

    });

    describe('updateUserDetails()', () => {

      var newUserDetails: IUserDetails;
      var updateUserDetailsResult: Subject<void>;
      var updateUserDetailsStub: SinonSpy;

      beforeEach(() => {
        newUserDetails = {
          id: userDetails.id,
          username: 'new username',
          email: 'new@email.com',
          firstName: 'new first name',
          lastName: 'new last name'
        }

        var usernameControl = <FormControl>userProfileComponent.userDetailsFormGroup.controls['username'];
        var emailControl = <FormControl>userProfileComponent.userDetailsFormGroup.controls['email'];
        var firstNameControl = <FormControl>userProfileComponent.userDetailsFormGroup.controls['firstName'];
        var lastNameControl = <FormControl>userProfileComponent.userDetailsFormGroup.controls['lastName'];

        FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, usernameControl, newUserDetails.username);
        userProfileComponent.model.username = newUserDetails.username;
        usernameExistsResult.next(null);
        usernameExistsResult.complete();

        FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, emailControl, newUserDetails.email);
        userProfileComponent.model.email = newUserDetails.email;

        FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, firstNameControl, newUserDetails.firstName);
        userProfileComponent.model.firstName = newUserDetails.firstName;

        FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, lastNameControl, newUserDetails.lastName);
        userProfileComponent.model.lastName = newUserDetails.lastName;

        updateUserDetailsResult = new Subject<void>();

        updateUserDetailsStub =
          stub(userServiceMock, 'updateUserDetails', () => updateUserDetailsResult);

        userProfileComponent.updateUserDetails();
      });

      afterEach(() => {
        updateUserDetailsStub.restore();
      })

      it('should call userService.updateUserDetails() correctly', () => {
        var expectedArgs = [
          newUserDetails.id,
          newUserDetails.username,
          newUserDetails.email,
          newUserDetails.firstName,
          newUserDetails.lastName
        ];

        expect(updateUserDetailsStub.callCount).to.be.equal(1);
        expect(updateUserDetailsStub.args[0]).to.be.deep.equal(expectedArgs);
      });

      it('should set updatingUserDetails to true', () => {
        expect(userProfileComponent.updatingUserDetails).to.be.true;
      });

      it('should set updatingUserDetailsError to null', () => {
        expect(userProfileComponent.updatingUserDetailsError).to.be.null;
      });

      describe('updating fails', () => {

        var error: string;

        beforeEach(() => {
          error = 'updateUserDetails error';

          updateUserDetailsResult.error(error);
        });

        it('should set updatingUserDetails to false', () => {
          expect(userProfileComponent.updatingUserDetails).to.be.false;
        });

        it('should set updatingUserDetailsError correctly', () => {
          expect(userProfileComponent.updatingUserDetailsError).to.be.equal(error);
        });

      });

      describe('updating succeeds', () => {

        beforeEach(() => {
          updateUserDetailsResult.next(null);
          updateUserDetailsResult.complete();
        });

        it('should set updatingUserDetails to false', () => {
          expect(userProfileComponent.updatingUserDetails).to.be.false;
        });

        it('should set updatingUserDetailsError to null', () => {
          expect(userProfileComponent.updatingUserDetailsError).to.be.null;
        });

      });

    });

  });

});
