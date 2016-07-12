import {IValidationResult} from "../../../common/validators/iValidationResult";
import {FormFiller} from "../../../../testUtils/formFiller";
import {
  it,
  inject,
  describe,
  beforeEach,
  beforeEachProviders,
  tick,
  fakeAsync
} from '@angular/core/testing';
import {provide} from '@angular/core';
import {IUserDetails, IUserService, UserService} from "../../../common/services/userService";
import {SinonSpy, stub, spy} from 'sinon';
import {expect} from 'chai';
import { Subject } from 'rxjs/Subject';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ChangeUserPasswordComponent } from './changeUserPassword.component';

describe('ChangeUserPasswordComponent', () => {

  var userDetails: IUserDetails;

  var userServiceMock: IUserService;
  var updateUserPassrowdResult: Subject<void>;
  var updateUserPasswordSpy: SinonSpy;

  var userPasswordFormGroup: FormGroup;
  var newPasswordsGroup: FormGroup;

  var component: ChangeUserPasswordComponent;

  var passwordControl: FormControl;
  var newPasswordControl: FormControl;
  var newPasswordRepeatedControl: FormControl;

  beforeEachProviders(() => {

    userServiceMock = {
      signinUser: () => null,
      registerUser: () => null,
      isUsernameExists: () => null,
      getUserDetails: () => null,
      updateUserDetails: () => null,
      updateUserPassword: () => {
        updateUserPassrowdResult = new Subject<void>();

        return updateUserPassrowdResult;
      }
    };

    updateUserPasswordSpy = spy(userServiceMock, 'updateUserPassword');

    return [
      FormBuilder,
      provide(UserService, { useValue: userServiceMock }),
      ChangeUserPasswordComponent
    ];
  });

  beforeEach(inject([ChangeUserPasswordComponent], (_component: ChangeUserPasswordComponent) => {
    component = _component;

    userDetails = {
      id: 1234,
      username: 'some username',
      email: 'some@email.com',
      firstName: 'some name',
      lastName: 'some last name'
    }
    component.userDetails = userDetails;

    component.ngOnInit();

    userPasswordFormGroup = component.userPasswordFormGroup;
    newPasswordsGroup = component.newPasswordsGroup;
    passwordControl = <FormControl>userPasswordFormGroup.controls['password'];
    newPasswordControl = <FormControl>newPasswordsGroup.controls['newPassword'];
    newPasswordRepeatedControl = <FormControl>newPasswordsGroup.controls['newPasswordRepeated'];
  }));

  it('initializing without the user details should throw error', inject([ChangeUserPasswordComponent], (_component: ChangeUserPasswordComponent) => {
    _component.userDetails = null;
    expect(() => _component.ngOnInit()).to.throw('userDetails is not set');
  }));

  it('should initialize error correctly', () => {
    expect(component.updateUserPasswordError).to.be.undefined;
  });

  it('should initialize isPasswordUpdated correctly', () => {
    expect(component.isPasswordUpdated).to.be.false;
  });

  it('should initialize isUpdatingPassword correctly', () => {
    expect(component.isUpdatingPassword).to.be.false;
  });

  it('should initialize model correctly', () => {
    expect(component.model.password).to.be.null;
    expect(component.model.newPassword).to.be.null;
    expect(component.model.newPasswordRepeated).to.be.null;
  });

  it('should initialize the form group', () => {
    expect(component.userPasswordFormGroup).to.exist;
    expect(component.userPasswordFormGroup.controls['password'].value).to.be.empty;

    expect(component.userPasswordFormGroup.controls['newPasswordsGroup'].value).to.exist;
    expect(component.newPasswordsGroup.controls['newPassword'].value).to.be.empty;
    expect(component.newPasswordsGroup.controls['newPasswordRepeated'].value).to.be.empty;
  });

  it('password should be invalid', () => {
    expect(passwordControl.valid).to.be.false;
  });

  it('newPassword should be invalid', () => {
    expect(newPasswordControl.valid).to.be.false;
  });

  it('newPasswordRepeated should be invalid', () => {
    expect(newPasswordRepeatedControl.valid).to.be.false;
  });

  it('form should be invalid', () => {
    expect(userPasswordFormGroup.valid).to.be.false;
  });

  describe('set password', () => {

    beforeEach(() => {
      FormFiller.fillFormControl(userPasswordFormGroup, passwordControl, 'some password');
    });

    it('password should be valid', () => {
      expect(passwordControl.valid).to.be.true;
    });

  });

  describe('set newPassword', () => {

    beforeEach(() => {
      FormFiller.fillFormControl(userPasswordFormGroup, newPasswordControl, 'some new password');
    });

    it('newPassword should be valid', () => {
      expect(newPasswordControl.valid).to.be.true;
    });

    it('form should be invalid', () => {
      expect(userPasswordFormGroup.valid).to.be.false;
    });

  });

  describe('set newPasswordRepeated', () => {

    beforeEach(() => {
      FormFiller.fillFormControl(userPasswordFormGroup, newPasswordRepeatedControl, 'some newPasswordRepeated');
    });

    it('newPasswordRepeated should be valid', () => {
      expect(newPasswordRepeatedControl.valid).to.be.true;
    });

    it('form should be invalid', () => {
      expect(userPasswordFormGroup.valid).to.be.false;
    });

  });

  describe('set newPassword and newPasswordRepeated to same value', () => {

    beforeEach(() => {
      FormFiller.fillFormControl(userPasswordFormGroup, newPasswordControl, 'some new password');
      FormFiller.fillFormControl(userPasswordFormGroup, newPasswordRepeatedControl, 'some new password');
    });

    it('newPasswordRepeated should be valid', () => {
      expect(newPasswordControl.valid).to.be.true;
    });

    it('newPasswordRepeated should be valid', () => {
      expect(newPasswordRepeatedControl.valid).to.be.true;
    });

    it('form should be invalid', () => {
      expect(userPasswordFormGroup.valid).to.be.false;
    });

  });

  describe('set newPassword and newPasswordRepeated to different value', () => {

    beforeEach(() => {
      FormFiller.fillFormControl(userPasswordFormGroup, newPasswordControl, 'some new password');
      FormFiller.fillFormControl(userPasswordFormGroup, newPasswordRepeatedControl, 'some other new password');
    });

    it('newPasswordRepeated should be valid', () => {
      expect(newPasswordControl.valid).to.be.true;
    });

    it('newPasswordRepeated should be valid', () => {
      expect(newPasswordRepeatedControl.valid).to.be.true;
    });

    it('form should be invalid', () => {
      expect(userPasswordFormGroup.valid).to.be.false;
    });

  });

  describe('fill all fields but with different new passwords', () => {

    beforeEach(() => {
      FormFiller.fillFormControl(userPasswordFormGroup, passwordControl, 'some password');
      FormFiller.fillFormControl(userPasswordFormGroup, newPasswordControl, 'some new password');
      FormFiller.fillFormControl(userPasswordFormGroup, newPasswordRepeatedControl, 'some other new password');
    });

    it('password should be valid', () => {
      expect(passwordControl.valid).to.be.true;
    });

    it('newPasswordRepeated should be valid', () => {
      expect(newPasswordControl.valid).to.be.true;
    });

    it('newPasswordRepeated should be valid', () => {
      expect(newPasswordRepeatedControl.valid).to.be.true;
    });

    it('form should be invalid', () => {
      expect(userPasswordFormGroup.valid).to.be.false;
    });

  });

  describe('fill all fields correctly', () => {

    var password: string;
    var newPassword: string;

    beforeEach(() => {
      password = 'some password';
      newPassword = 'some new password';

      FormFiller.fillFormControl(userPasswordFormGroup, passwordControl, password);
      FormFiller.fillFormControl(userPasswordFormGroup, newPasswordControl, newPassword);
      FormFiller.fillFormControl(userPasswordFormGroup, newPasswordRepeatedControl, newPassword);

      component.model.password = password;
      component.model.newPassword = newPassword;
      component.model.newPasswordRepeated = newPassword;
    });

    it('password should be valid', () => {
      expect(passwordControl.valid).to.be.true;
    });

    it('newPasswordRepeated should be valid', () => {
      expect(newPasswordControl.valid).to.be.true;
    });

    it('newPasswordRepeated should be valid', () => {
      expect(newPasswordRepeatedControl.valid).to.be.true;
    });

    it('form should be valid', () => {
      expect(userPasswordFormGroup.valid).to.be.true;
    });

    describe('changeUserPassword', () => {

      beforeEach(() => {
        component.changeUserPassword();
      });

      it('should call the userService.updateUserPassword correclty', () => {
        expect(updateUserPasswordSpy.callCount).to.be.equal(1);
        expect(updateUserPasswordSpy.args[0]).to.be.deep.equal([userDetails.id, password, newPassword]);
      });

      it('should set error correctly', () => {
        expect(component.updateUserPasswordError).to.be.null;
      });

      it('should initialize isPasswordUpdated correctly', () => {
        expect(component.isPasswordUpdated).to.be.false;
      });

      it('should initialize isUpdatingPassword correctly', () => {
        expect(component.isUpdatingPassword).to.be.true;
      });

      describe('updating fails', () => {

        var error;

        beforeEach(() => {
          error = 'some error';
          updateUserPassrowdResult.error(error);
        });

        it('should set the error correctly', () => {
          expect(component.updateUserPasswordError).to.be.equal(error);
        });

        it('should initialize isPasswordUpdated correctly', () => {
          expect(component.isPasswordUpdated).to.be.false;
        });

        it('should initialize isUpdatingPassword correctly', () => {
          expect(component.isUpdatingPassword).to.be.false;
        });

        describe('change the password again', () => {

          beforeEach(() => {
            component.changeUserPassword();
          });

          it('should set the error correctly', () => {
            expect(component.updateUserPasswordError).to.be.null;
          });

          it('should initialize isPasswordUpdated correctly', () => {
            expect(component.isPasswordUpdated).to.be.false;
          });

          it('should initialize isUpdatingPassword correctly', () => {
            expect(component.isUpdatingPassword).to.be.true;
          });

        });

      });

      describe('updating succeeds', () => {

        var updateTextFieldsSpy: SinonSpy;

        beforeEach(fakeAsync(() => {
          updateTextFieldsSpy = spy(Materialize, 'updateTextFields');

          updateUserPassrowdResult.next(null);
          updateUserPassrowdResult.complete();

          tick(0);
        }));

        afterEach(() => {
          updateTextFieldsSpy.restore();
        })

        it('should set the error correctly', () => {
          expect(component.updateUserPasswordError).to.be.null;
        });

        it('should initialize isPasswordUpdated correctly', () => {
          expect(component.isPasswordUpdated).to.be.true;
        });

        it('should clear the model', () => {
          expect(component.model.password).to.be.empty;
          expect(component.model.newPassword).to.be.empty;
          expect(component.model.newPasswordRepeated).to.be.empty;
        });

        it('should set the form controls as untouched', () => {
          expect(passwordControl.touched).to.be.false;
          expect(newPasswordControl.touched).to.be.false;
          expect(newPasswordRepeatedControl.touched).to.be.false;
        });

        it('should set the form controls as pristine', () => {
          expect(passwordControl.pristine).to.be.true;
          expect(newPasswordControl.pristine).to.be.true;
          expect(newPasswordRepeatedControl.pristine).to.be.true;
        });

        it('should initialize isUpdatingPassword correctly', () => {
          expect(component.isUpdatingPassword).to.be.false;
        });

        it('should call Materialize.updateTextFields()', () => {
          expect(updateTextFieldsSpy.callCount).to.be.equal(1);
        });

        describe('change the password again', () => {

          beforeEach(() => {
            FormFiller.fillFormControl(userPasswordFormGroup, passwordControl, password);
            FormFiller.fillFormControl(userPasswordFormGroup, newPasswordControl, newPassword);
            FormFiller.fillFormControl(userPasswordFormGroup, newPasswordRepeatedControl, newPassword);

            component.model.password = password;
            component.model.newPassword = newPassword;
            component.model.newPasswordRepeated = newPassword;

            component.changeUserPassword();
          });

          it('should set the error correctly', () => {
            expect(component.updateUserPasswordError).to.be.null;
          });

          it('should initialize isPasswordUpdated correctly', () => {
            expect(component.isPasswordUpdated).to.be.false;
          });

          it('should initialize isUpdatingPassword correctly', () => {
            expect(component.isUpdatingPassword).to.be.true;
          });

        });

      });

    });

  });

});
