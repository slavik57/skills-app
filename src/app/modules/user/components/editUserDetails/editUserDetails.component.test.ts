import {UserServiceMockFactory} from "../../../../testUtils/mockFactories/userServiceMockFactory";
import {IUserDetails} from "../../../common/interfaces/iUserDetails";
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
import {IUserService, UserService} from "../../../common/services/userService";
import {SinonSpy, stub, spy} from 'sinon';
import {expect} from 'chai';
import { EditUserDetailsComponent } from './editUserDetails.component';
import { Subject } from 'rxjs/Subject';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  IUsernameExistsValidator,
  UsernameExistsValidator,
  IUsernameExistsValidatorFactory,
  UsernameExistsValidatorFactory
} from "../../../common/validators/usernameExistsValidator";

describe('EditUserDetailsComponent', () => {

  var userDetails: IUserDetails;
  var userServiceMock: IUserService;
  var component: EditUserDetailsComponent;
  var usernameExistsResult: Subject<IValidationResult>;
  var usernameExistsValidatorMock: IUsernameExistsValidator;
  var usernameExistsValidatorFactoryMock: IUsernameExistsValidatorFactory;
  var usernameExistsValidatorBindControlSpy: SinonSpy;
  var createUsernameExistsValidatorSpy: SinonSpy;
  var destroyUsernameExistsValidatorSpy: SinonSpy;

  beforeEachProviders(() => {
    userDetails = {
      id: 1,
      username: 'some username',
      email: 'some@mail.com',
      firstName: 'some firstName',
      lastName: 'some lastName'
    };

    userServiceMock = UserServiceMockFactory.createUserServiceMock();

    usernameExistsValidatorMock = {
      bindControl: () => { },
      isExists: () => {
        usernameExistsResult = new Subject<IValidationResult>();

        return usernameExistsResult;
      },
      destroy: () => null
    }

    usernameExistsValidatorBindControlSpy =
      spy(usernameExistsValidatorMock, 'bindControl');

    usernameExistsValidatorFactoryMock = {
      create: () => null,
      createWithAllowedUsers: () => usernameExistsValidatorMock
    }

    createUsernameExistsValidatorSpy =
      spy(usernameExistsValidatorFactoryMock, 'createWithAllowedUsers');

    destroyUsernameExistsValidatorSpy =
      spy(usernameExistsValidatorMock, 'destroy');

    return [
      FormBuilder,
      provide(UserService, { useValue: userServiceMock }),
      provide(UsernameExistsValidatorFactory, { useValue: usernameExistsValidatorFactoryMock }),
      EditUserDetailsComponent
    ];
  });

  beforeEach(inject([EditUserDetailsComponent], (_component: EditUserDetailsComponent) => {
    component = _component;
  }));

  it('initializing without the user details should throw error', inject([EditUserDetailsComponent], (_component: EditUserDetailsComponent) => {
    _component.userDetails = null;
    expect(() => _component.ngOnInit()).to.throw('userDetails is not set');
  }));

  describe('full user', () => {

    var updateTextFieldsSpy: SinonSpy;

    beforeEach(fakeAsync(() => {
      component.userDetails = userDetails;
      component.ngOnInit();

      updateTextFieldsSpy = spy(Materialize, 'updateTextFields');

      tick(0);

      usernameExistsResult.next(null);
      usernameExistsResult.complete();
    }));

    afterEach(() => {
      updateTextFieldsSpy.restore();
    });

    it('when the component is destroyed should destroy the UsernameExistsValidator', () => {
      component.ngOnDestroy();

      expect(destroyUsernameExistsValidatorSpy.callCount).to.be.equal(1);
    });

    it('updatingUserDetailsError should be correct', () => {
      expect(component.updatingUserDetailsError).to.be.undefined;
    });

    it('updatingUserDetails should be correct', () => {
      expect(component.updatingUserDetails).to.be.false;
    });

    it('isUserDetailsUpdated should be correct', () => {
      expect(component.isUserDetailsUpdated).to.be.false;
    });

    it('the model should be correct', () => {
      expect(component.model).to.be.deep.equal(userDetails);
    });

    it('should initialize the userDetailsFormGroup', () => {
      expect(component.userDetailsFormGroup).to.exist;
    });

    it('should call Materialize.updateTextFields()', () => {
      expect(updateTextFieldsSpy.callCount).to.be.equal(1);
    });

    it('canUpdateUserDetails should return false', () => {
      expect(component.canUpdateUserDetails()).to.be.false;
    });

    describe('username', () => {

      var usernameControl: FormControl;

      beforeEach(() => {
        usernameControl =
          <FormControl>component.userDetailsFormGroup.controls['username'];
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
            FormFiller.fillFormControl(component.userDetailsFormGroup, usernameControl, value);
            component.model.username = value;
          });

          it('control should be invalid', () => {
            expect(usernameControl.errors).to.exist;
          });

          it('canUpdateUserDetails should return false', () => {
            expect(component.canUpdateUserDetails()).to.be.false;
          });

        });

        describe('to different user', () => {

          beforeEach(() => {
            var value = 'some other user';
            FormFiller.fillFormControl(component.userDetailsFormGroup, usernameControl, value);
            component.model.username = value;

            usernameExistsResult.next(null);
            usernameExistsResult.complete();
          });

          it('control should be valid', () => {
            expect(usernameControl.errors).to.not.exist;
          });

          it('canUpdateUserDetails should return true', () => {
            expect(component.canUpdateUserDetails()).to.be.true;
          });

          describe('restore username', () => {

            beforeEach(() => {
              var value = userDetails.username;
              FormFiller.fillFormControl(component.userDetailsFormGroup, usernameControl, value);
              component.model.username = value;

              usernameExistsResult.next(null);
              usernameExistsResult.complete();
            });

            it('control should be valid', () => {
              expect(usernameControl.errors).to.not.exist;
            });

            it('canUpdateUserDetails should return false', () => {
              expect(component.canUpdateUserDetails()).to.be.false;
            });

          });

        });

        describe('to existing username', () => {

          beforeEach(() => {
            var value = 'existing username';
            FormFiller.fillFormControl(component.userDetailsFormGroup, usernameControl, value);
            component.model.username = value;

            usernameExistsResult.next({ 'someError': true });
            usernameExistsResult.complete();
          });

          it('control should be invalid', () => {
            expect(usernameControl.errors).to.exist;
          });

          it('canUpdateUserDetails should return false', () => {
            expect(component.canUpdateUserDetails()).to.be.false;
          });

        });

      });

    });

    describe('email', () => {

      var emailControl: FormControl;

      beforeEach(() => {
        emailControl =
          <FormControl>component.userDetailsFormGroup.controls['email'];
      });

      it('value should be correct', () => {
        expect(emailControl.value).to.be.equal(userDetails.email);
      });

      describe('change the email', () => {

        describe('to empty', () => {

          beforeEach(() => {
            var value = '';
            FormFiller.fillFormControl(component.userDetailsFormGroup, emailControl, value);
            component.model.email = value;
          });

          it('control should be valid', () => {
            expect(emailControl.errors).to.not.exist;
          });

          it('canUpdateUserDetails should return true', () => {
            expect(component.canUpdateUserDetails()).to.be.true;
          });

        });

        describe('to different email', () => {

          beforeEach(() => {
            var value = 'someOther@email.com';
            FormFiller.fillFormControl(component.userDetailsFormGroup, emailControl, value);
            component.model.email = value;
          });

          it('control should be valid', () => {
            expect(emailControl.errors).to.not.exist;
          });

          it('canUpdateUserDetails should return true', () => {
            expect(component.canUpdateUserDetails()).to.be.true;
          });

          describe('restore email', () => {

            beforeEach(() => {
              var value = userDetails.email;
              FormFiller.fillFormControl(component.userDetailsFormGroup, emailControl, value);
              component.model.email = value;
            });

            it('control should be valid', () => {
              expect(emailControl.errors).to.not.exist;
            });

            it('canUpdateUserDetails should return false', () => {
              expect(component.canUpdateUserDetails()).to.be.false;
            });

          });

        });

        describe('to invalid email', () => {

          beforeEach(() => {
            var value = 'invlaid email';
            FormFiller.fillFormControl(component.userDetailsFormGroup, emailControl, value);
            component.model.email = value;
          });

          it('control should be invalid', () => {
            expect(emailControl.errors).to.exist;
          });

          it('canUpdateUserDetails should return false', () => {
            expect(component.canUpdateUserDetails()).to.be.false;
          });

        });

      });

    });

    describe('firstName', () => {

      var firstNameControl: FormControl;

      beforeEach(() => {
        firstNameControl =
          <FormControl>component.userDetailsFormGroup.controls['firstName'];
      });

      it('value should be correct', () => {
        expect(firstNameControl.value).to.be.equal(userDetails.firstName);
      });

      describe('change the firstName', () => {

        describe('to empty', () => {

          beforeEach(() => {
            var value = '';
            FormFiller.fillFormControl(component.userDetailsFormGroup, firstNameControl, value);
            component.model.firstName = value;
          });

          it('control should be invalid', () => {
            expect(firstNameControl.errors).to.exist;
          });

          it('canUpdateUserDetails should return false', () => {
            expect(component.canUpdateUserDetails()).to.be.false;
          });

        });

        describe('to different first name', () => {

          beforeEach(() => {
            var value = 'some other first name';
            FormFiller.fillFormControl(component.userDetailsFormGroup, firstNameControl, value);
            component.model.firstName = value;
          });

          it('control should be valid', () => {
            expect(firstNameControl.errors).to.not.exist;
          });

          it('canUpdateUserDetails should return true', () => {
            expect(component.canUpdateUserDetails()).to.be.true;
          });

          describe('restore first name', () => {

            beforeEach(() => {
              var value = userDetails.firstName;
              FormFiller.fillFormControl(component.userDetailsFormGroup, firstNameControl, value);
              component.model.firstName = value;
            });

            it('control should be valid', () => {
              expect(firstNameControl.errors).to.not.exist;
            });

            it('canUpdateUserDetails should return false', () => {
              expect(component.canUpdateUserDetails()).to.be.false;
            });

          });

        });

      });

    });

    describe('lastName', () => {

      var lastNameControl: FormControl;

      beforeEach(() => {
        lastNameControl =
          <FormControl>component.userDetailsFormGroup.controls['lastName'];
      });

      it('value should be correct', () => {
        expect(lastNameControl.value).to.be.equal(userDetails.lastName);
      });

      describe('change the lastName', () => {

        describe('to empty', () => {

          beforeEach(() => {
            var value = '';
            FormFiller.fillFormControl(component.userDetailsFormGroup, lastNameControl, value);
            component.model.lastName = value;
          });

          it('control should be invalid', () => {
            expect(lastNameControl.errors).to.exist;
          });

          it('canUpdateUserDetails should return false', () => {
            expect(component.canUpdateUserDetails()).to.be.false;
          });

        });

        describe('to different last name', () => {

          beforeEach(() => {
            var value = 'some other last name';
            FormFiller.fillFormControl(component.userDetailsFormGroup, lastNameControl, value);
            component.model.lastName = value;
          });

          it('control should be valid', () => {
            expect(lastNameControl.errors).to.not.exist;
          });

          it('canUpdateUserDetails should return true', () => {
            expect(component.canUpdateUserDetails()).to.be.true;
          });

          describe('restore last name', () => {

            beforeEach(() => {
              var value = userDetails.lastName;
              FormFiller.fillFormControl(component.userDetailsFormGroup, lastNameControl, value);
              component.model.lastName = value;
            });

            it('control should be valid', () => {
              expect(lastNameControl.errors).to.not.exist;
            });

            it('canUpdateUserDetails should return false', () => {
              expect(component.canUpdateUserDetails()).to.be.false;
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

        var usernameControl = <FormControl>component.userDetailsFormGroup.controls['username'];
        var emailControl = <FormControl>component.userDetailsFormGroup.controls['email'];
        var firstNameControl = <FormControl>component.userDetailsFormGroup.controls['firstName'];
        var lastNameControl = <FormControl>component.userDetailsFormGroup.controls['lastName'];

        FormFiller.fillFormControl(component.userDetailsFormGroup, usernameControl, newUserDetails.username);
        component.model.username = newUserDetails.username;
        usernameExistsResult.next(null);
        usernameExistsResult.complete();

        FormFiller.fillFormControl(component.userDetailsFormGroup, emailControl, newUserDetails.email);
        component.model.email = newUserDetails.email;

        FormFiller.fillFormControl(component.userDetailsFormGroup, firstNameControl, newUserDetails.firstName);
        component.model.firstName = newUserDetails.firstName;

        FormFiller.fillFormControl(component.userDetailsFormGroup, lastNameControl, newUserDetails.lastName);
        component.model.lastName = newUserDetails.lastName;

        updateUserDetailsStub =
          stub(userServiceMock, 'updateUserDetails', () => {
            updateUserDetailsResult = new Subject<void>();
            return updateUserDetailsResult;
          });

        component.updateUserDetails();
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
        expect(component.updatingUserDetails).to.be.true;
      });

      it('should set updatingUserDetailsError to null', () => {
        expect(component.updatingUserDetailsError).to.be.null;
      });

      it('isUserDetailsUpdated should be correct', () => {
        expect(component.isUserDetailsUpdated).to.be.false;
      });

      describe('updating fails', () => {

        var error: string;

        beforeEach(() => {
          error = 'updateUserDetails error';

          updateUserDetailsResult.error(error);
        });

        it('should set updatingUserDetails to false', () => {
          expect(component.updatingUserDetails).to.be.false;
        });

        it('should set updatingUserDetailsError correctly', () => {
          expect(component.updatingUserDetailsError).to.be.equal(error);
        });

        it('isUserDetailsUpdated should be correct', () => {
          expect(component.isUserDetailsUpdated).to.be.false;
        });

      });

      describe('updating succeeds', () => {

        beforeEach(() => {
          updateUserDetailsResult.next(null);
          updateUserDetailsResult.complete();
        });

        it('should set updatingUserDetails to false', () => {
          expect(component.updatingUserDetails).to.be.false;
        });

        it('should set updatingUserDetailsError to null', () => {
          expect(component.updatingUserDetailsError).to.be.null;
        });

        it('canUpdateUserDetails should return false', () => {
          expect(component.canUpdateUserDetails()).to.be.false;
        });

        it('should not change the userDetails reference', () => {
          expect(component.userDetails).to.be.equal(userDetails);
        });

        it('should update the userDetails', () => {
          expect(component.userDetails).to.be.deep.equal(newUserDetails);
        });

        it('isUserDetailsUpdated should be correct', () => {
          expect(component.isUserDetailsUpdated).to.be.true;
        });

        describe('updateUserDetails()', () => {

          beforeEach(() => {
            component.updateUserDetails();
          });

          it('isUserDetailsUpdated should be correct', () => {
            expect(component.isUserDetailsUpdated).to.be.false;
          });

          it('should set updatingUserDetails to true', () => {
            expect(component.updatingUserDetails).to.be.true;
          });

        });

      });

    })

  });

  describe('fetching user details succeeds with null email', () => {

    var updateTextFieldsSpy: SinonSpy;

    beforeEach(fakeAsync(() => {
      userDetails.email = null;
      component.userDetails = userDetails;
      component.ngOnInit();

      updateTextFieldsSpy = spy(Materialize, 'updateTextFields');

      tick(0);

      usernameExistsResult.next(null);
      usernameExistsResult.complete();
    }));

    afterEach(() => {
      updateTextFieldsSpy.restore();
    });

    it('when the component is destroyed should destroy the UsernameExistsValidator', () => {
      component.ngOnDestroy();

      expect(destroyUsernameExistsValidatorSpy.callCount).to.be.equal(1);
    });

    it('the model should be correct', () => {
      expect(component.model).to.be.deep.equal(userDetails);
    });

    it('should initialize the userDetailsFormGroup', () => {
      expect(component.userDetailsFormGroup).to.exist;
    });

    it('should call Materialize.updateTextFields()', () => {
      expect(updateTextFieldsSpy.callCount).to.be.equal(1);
    });

    it('canUpdateUserDetails should return false', () => {
      expect(component.canUpdateUserDetails()).to.be.false;
    });

    it('updatingUserDetailsError should be correct', () => {
      expect(component.updatingUserDetailsError).to.be.undefined;
    });

    it('updatingUserDetails should be correct', () => {
      expect(component.updatingUserDetails).to.be.false;
    });

    it('isUserDetailsUpdated should be correct', () => {
      expect(component.isUserDetailsUpdated).to.be.false;
    });

    describe('email', () => {

      var emailControl: FormControl;

      beforeEach(() => {
        emailControl =
          <FormControl>component.userDetailsFormGroup.controls['email'];
      });

      it('value should be correct', () => {
        expect(emailControl.value).to.be.equal(userDetails.email);
      });

      describe('change the email', () => {

        describe('to empty', () => {

          beforeEach(() => {
            var value = '';
            FormFiller.fillFormControl(component.userDetailsFormGroup, emailControl, value);
            component.model.email = value;
          });

          it('control should be valid', () => {
            expect(emailControl.errors).to.not.exist;
          });

          it('canUpdateUserDetails should return false', () => {
            expect(component.canUpdateUserDetails()).to.be.false;
          });

        });

        describe('to different email', () => {

          beforeEach(() => {
            var value = 'someOther@email.com';
            FormFiller.fillFormControl(component.userDetailsFormGroup, emailControl, value);
            component.model.email = value;
          });

          it('control should be valid', () => {
            expect(emailControl.errors).to.not.exist;
          });

          it('canUpdateUserDetails should return true', () => {
            expect(component.canUpdateUserDetails()).to.be.true;
          });

          describe('restore email', () => {

            beforeEach(() => {
              var value = userDetails.email;
              FormFiller.fillFormControl(component.userDetailsFormGroup, emailControl, value);
              component.model.email = value;
            });

            it('control should be valid', () => {
              expect(emailControl.errors).to.not.exist;
            });

            it('canUpdateUserDetails should return false', () => {
              expect(component.canUpdateUserDetails()).to.be.false;
            });

          });

        });

        describe('to invalid email', () => {

          beforeEach(() => {
            var value = 'invlaid email';
            FormFiller.fillFormControl(component.userDetailsFormGroup, emailControl, value);
            component.model.email = value;
          });

          it('control should be invalid', () => {
            expect(emailControl.errors).to.exist;
          });

          it('canUpdateUserDetails should return false', () => {
            expect(component.canUpdateUserDetails()).to.be.false;
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

        var usernameControl = <FormControl>component.userDetailsFormGroup.controls['username'];
        var emailControl = <FormControl>component.userDetailsFormGroup.controls['email'];
        var firstNameControl = <FormControl>component.userDetailsFormGroup.controls['firstName'];
        var lastNameControl = <FormControl>component.userDetailsFormGroup.controls['lastName'];

        FormFiller.fillFormControl(component.userDetailsFormGroup, usernameControl, newUserDetails.username);
        component.model.username = newUserDetails.username;
        usernameExistsResult.next(null);
        usernameExistsResult.complete();

        FormFiller.fillFormControl(component.userDetailsFormGroup, emailControl, newUserDetails.email);
        component.model.email = newUserDetails.email;

        FormFiller.fillFormControl(component.userDetailsFormGroup, firstNameControl, newUserDetails.firstName);
        component.model.firstName = newUserDetails.firstName;

        FormFiller.fillFormControl(component.userDetailsFormGroup, lastNameControl, newUserDetails.lastName);
        component.model.lastName = newUserDetails.lastName;

        updateUserDetailsStub =
          stub(userServiceMock, 'updateUserDetails', () => {
            updateUserDetailsResult = new Subject<void>();
            return updateUserDetailsResult;
          });

        component.updateUserDetails();
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
        expect(component.updatingUserDetails).to.be.true;
      });

      it('should set updatingUserDetailsError to null', () => {
        expect(component.updatingUserDetailsError).to.be.null;
      });

      it('isUserDetailsUpdated should be correct', () => {
        expect(component.isUserDetailsUpdated).to.be.false;
      });

      describe('updating fails', () => {

        var error: string;

        beforeEach(() => {
          error = 'updateUserDetails error';

          updateUserDetailsResult.error(error);
        });

        it('should set updatingUserDetails to false', () => {
          expect(component.updatingUserDetails).to.be.false;
        });

        it('should set updatingUserDetailsError correctly', () => {
          expect(component.updatingUserDetailsError).to.be.equal(error);
        });

        it('isUserDetailsUpdated should be correct', () => {
          expect(component.isUserDetailsUpdated).to.be.false;
        });

      });

      describe('updating succeeds', () => {

        beforeEach(() => {
          updateUserDetailsResult.next(null);
          updateUserDetailsResult.complete();
        });

        it('should set updatingUserDetails to false', () => {
          expect(component.updatingUserDetails).to.be.false;
        });

        it('should set updatingUserDetailsError to null', () => {
          expect(component.updatingUserDetailsError).to.be.null;
        });

        it('canUpdateUserDetails should return false', () => {
          expect(component.canUpdateUserDetails()).to.be.false;
        });

        it('should not change the userDetails reference', () => {
          expect(component.userDetails).to.be.equal(userDetails);
        });

        it('should update the userDetails', () => {
          expect(component.userDetails).to.be.deep.equal(newUserDetails);
        });

        it('isUserDetailsUpdated should be correct', () => {
          expect(component.isUserDetailsUpdated).to.be.true;
        });

        describe('updateUserDetails()', () => {

          beforeEach(() => {
            component.updateUserDetails();
          });

          it('isUserDetailsUpdated should be correct', () => {
            expect(component.isUserDetailsUpdated).to.be.false;
          });

          it('should set updatingUserDetails to true', () => {
            expect(component.updatingUserDetails).to.be.true;
          });

        });

      });

    });

  });

});
