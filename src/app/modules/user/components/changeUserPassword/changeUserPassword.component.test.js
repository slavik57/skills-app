"use strict";
var formFiller_1 = require("../../../../testUtils/formFiller");
var testing_1 = require('@angular/core/testing');
var core_1 = require('@angular/core');
var userService_1 = require("../../../common/services/userService");
var sinon_1 = require('sinon');
var chai_1 = require('chai');
var Subject_1 = require('rxjs/Subject');
var forms_1 = require('@angular/forms');
var changeUserPassword_component_1 = require('./changeUserPassword.component');
testing_1.describe('ChangeUserPasswordComponent', function () {
    var userDetails;
    var userServiceMock;
    var updateUserPassrowdResult;
    var updateUserPasswordSpy;
    var userPasswordFormGroup;
    var newPasswordsGroup;
    var component;
    var passwordControl;
    var newPasswordControl;
    var newPasswordRepeatedControl;
    testing_1.beforeEachProviders(function () {
        userServiceMock = {
            signinUser: function () { return null; },
            registerUser: function () { return null; },
            isUsernameExists: function () { return null; },
            getUserDetails: function () { return null; },
            updateUserDetails: function () { return null; },
            updateUserPassword: function () {
                updateUserPassrowdResult = new Subject_1.Subject();
                return updateUserPassrowdResult;
            }
        };
        updateUserPasswordSpy = sinon_1.spy(userServiceMock, 'updateUserPassword');
        return [
            forms_1.FormBuilder,
            core_1.provide(userService_1.UserService, { useValue: userServiceMock }),
            changeUserPassword_component_1.ChangeUserPasswordComponent
        ];
    });
    testing_1.beforeEach(testing_1.inject([changeUserPassword_component_1.ChangeUserPasswordComponent], function (_component) {
        component = _component;
        userDetails = {
            id: 1234,
            username: 'some username',
            email: 'some@email.com',
            firstName: 'some name',
            lastName: 'some last name'
        };
        component.userDetails = userDetails;
        component.ngOnInit();
        userPasswordFormGroup = component.userPasswordFormGroup;
        newPasswordsGroup = component.newPasswordsGroup;
        passwordControl = userPasswordFormGroup.controls['password'];
        newPasswordControl = newPasswordsGroup.controls['newPassword'];
        newPasswordRepeatedControl = newPasswordsGroup.controls['newPasswordRepeated'];
    }));
    testing_1.it('initializing without the user details should throw error', testing_1.inject([changeUserPassword_component_1.ChangeUserPasswordComponent], function (_component) {
        _component.userDetails = null;
        chai_1.expect(function () { return _component.ngOnInit(); }).to.throw('userDetails is not set');
    }));
    testing_1.it('should initialize error correctly', function () {
        chai_1.expect(component.updateUserPasswordError).to.be.undefined;
    });
    testing_1.it('should initialize isPasswordUpdated correctly', function () {
        chai_1.expect(component.isPasswordUpdated).to.be.false;
    });
    testing_1.it('should initialize isUpdatingPassword correctly', function () {
        chai_1.expect(component.isUpdatingPassword).to.be.false;
    });
    testing_1.it('should initialize model correctly', function () {
        chai_1.expect(component.model.password).to.be.null;
        chai_1.expect(component.model.newPassword).to.be.null;
        chai_1.expect(component.model.newPasswordRepeated).to.be.null;
    });
    testing_1.it('should initialize the form group', function () {
        chai_1.expect(component.userPasswordFormGroup).to.exist;
        chai_1.expect(component.userPasswordFormGroup.controls['password'].value).to.be.empty;
        chai_1.expect(component.userPasswordFormGroup.controls['newPasswordsGroup'].value).to.exist;
        chai_1.expect(component.newPasswordsGroup.controls['newPassword'].value).to.be.empty;
        chai_1.expect(component.newPasswordsGroup.controls['newPasswordRepeated'].value).to.be.empty;
    });
    testing_1.it('password should be invalid', function () {
        chai_1.expect(passwordControl.valid).to.be.false;
    });
    testing_1.it('newPassword should be invalid', function () {
        chai_1.expect(newPasswordControl.valid).to.be.false;
    });
    testing_1.it('newPasswordRepeated should be invalid', function () {
        chai_1.expect(newPasswordRepeatedControl.valid).to.be.false;
    });
    testing_1.it('form should be invalid', function () {
        chai_1.expect(userPasswordFormGroup.valid).to.be.false;
    });
    testing_1.describe('set password', function () {
        testing_1.beforeEach(function () {
            formFiller_1.FormFiller.fillFormControl(userPasswordFormGroup, passwordControl, 'some password');
        });
        testing_1.it('password should be valid', function () {
            chai_1.expect(passwordControl.valid).to.be.true;
        });
    });
    testing_1.describe('set newPassword', function () {
        testing_1.beforeEach(function () {
            formFiller_1.FormFiller.fillFormControl(userPasswordFormGroup, newPasswordControl, 'some new password');
        });
        testing_1.it('newPassword should be valid', function () {
            chai_1.expect(newPasswordControl.valid).to.be.true;
        });
        testing_1.it('form should be invalid', function () {
            chai_1.expect(userPasswordFormGroup.valid).to.be.false;
        });
    });
    testing_1.describe('set newPasswordRepeated', function () {
        testing_1.beforeEach(function () {
            formFiller_1.FormFiller.fillFormControl(userPasswordFormGroup, newPasswordRepeatedControl, 'some newPasswordRepeated');
        });
        testing_1.it('newPasswordRepeated should be valid', function () {
            chai_1.expect(newPasswordRepeatedControl.valid).to.be.true;
        });
        testing_1.it('form should be invalid', function () {
            chai_1.expect(userPasswordFormGroup.valid).to.be.false;
        });
    });
    testing_1.describe('set newPassword and newPasswordRepeated to same value', function () {
        testing_1.beforeEach(function () {
            formFiller_1.FormFiller.fillFormControl(userPasswordFormGroup, newPasswordControl, 'some new password');
            formFiller_1.FormFiller.fillFormControl(userPasswordFormGroup, newPasswordRepeatedControl, 'some new password');
        });
        testing_1.it('newPasswordRepeated should be valid', function () {
            chai_1.expect(newPasswordControl.valid).to.be.true;
        });
        testing_1.it('newPasswordRepeated should be valid', function () {
            chai_1.expect(newPasswordRepeatedControl.valid).to.be.true;
        });
        testing_1.it('form should be invalid', function () {
            chai_1.expect(userPasswordFormGroup.valid).to.be.false;
        });
    });
    testing_1.describe('set newPassword and newPasswordRepeated to different value', function () {
        testing_1.beforeEach(function () {
            formFiller_1.FormFiller.fillFormControl(userPasswordFormGroup, newPasswordControl, 'some new password');
            formFiller_1.FormFiller.fillFormControl(userPasswordFormGroup, newPasswordRepeatedControl, 'some other new password');
        });
        testing_1.it('newPasswordRepeated should be valid', function () {
            chai_1.expect(newPasswordControl.valid).to.be.true;
        });
        testing_1.it('newPasswordRepeated should be valid', function () {
            chai_1.expect(newPasswordRepeatedControl.valid).to.be.true;
        });
        testing_1.it('form should be invalid', function () {
            chai_1.expect(userPasswordFormGroup.valid).to.be.false;
        });
    });
    testing_1.describe('fill all fields but with different new passwords', function () {
        testing_1.beforeEach(function () {
            formFiller_1.FormFiller.fillFormControl(userPasswordFormGroup, passwordControl, 'some password');
            formFiller_1.FormFiller.fillFormControl(userPasswordFormGroup, newPasswordControl, 'some new password');
            formFiller_1.FormFiller.fillFormControl(userPasswordFormGroup, newPasswordRepeatedControl, 'some other new password');
        });
        testing_1.it('password should be valid', function () {
            chai_1.expect(passwordControl.valid).to.be.true;
        });
        testing_1.it('newPasswordRepeated should be valid', function () {
            chai_1.expect(newPasswordControl.valid).to.be.true;
        });
        testing_1.it('newPasswordRepeated should be valid', function () {
            chai_1.expect(newPasswordRepeatedControl.valid).to.be.true;
        });
        testing_1.it('form should be invalid', function () {
            chai_1.expect(userPasswordFormGroup.valid).to.be.false;
        });
    });
    testing_1.describe('fill all fields correctly', function () {
        var password;
        var newPassword;
        testing_1.beforeEach(function () {
            password = 'some password';
            newPassword = 'some new password';
            formFiller_1.FormFiller.fillFormControl(userPasswordFormGroup, passwordControl, password);
            formFiller_1.FormFiller.fillFormControl(userPasswordFormGroup, newPasswordControl, newPassword);
            formFiller_1.FormFiller.fillFormControl(userPasswordFormGroup, newPasswordRepeatedControl, newPassword);
            component.model.password = password;
            component.model.newPassword = newPassword;
            component.model.newPasswordRepeated = newPassword;
        });
        testing_1.it('password should be valid', function () {
            chai_1.expect(passwordControl.valid).to.be.true;
        });
        testing_1.it('newPasswordRepeated should be valid', function () {
            chai_1.expect(newPasswordControl.valid).to.be.true;
        });
        testing_1.it('newPasswordRepeated should be valid', function () {
            chai_1.expect(newPasswordRepeatedControl.valid).to.be.true;
        });
        testing_1.it('form should be valid', function () {
            chai_1.expect(userPasswordFormGroup.valid).to.be.true;
        });
        testing_1.describe('changeUserPassword', function () {
            testing_1.beforeEach(function () {
                component.changeUserPassword();
            });
            testing_1.it('should call the userService.updateUserPassword correclty', function () {
                chai_1.expect(updateUserPasswordSpy.callCount).to.be.equal(1);
                chai_1.expect(updateUserPasswordSpy.args[0]).to.be.deep.equal([userDetails.id, password, newPassword]);
            });
            testing_1.it('should set error correctly', function () {
                chai_1.expect(component.updateUserPasswordError).to.be.null;
            });
            testing_1.it('should initialize isPasswordUpdated correctly', function () {
                chai_1.expect(component.isPasswordUpdated).to.be.false;
            });
            testing_1.it('should initialize isUpdatingPassword correctly', function () {
                chai_1.expect(component.isUpdatingPassword).to.be.true;
            });
            testing_1.describe('updating fails', function () {
                var error;
                testing_1.beforeEach(function () {
                    error = 'some error';
                    updateUserPassrowdResult.error(error);
                });
                testing_1.it('should set the error correctly', function () {
                    chai_1.expect(component.updateUserPasswordError).to.be.equal(error);
                });
                testing_1.it('should initialize isPasswordUpdated correctly', function () {
                    chai_1.expect(component.isPasswordUpdated).to.be.false;
                });
                testing_1.it('should initialize isUpdatingPassword correctly', function () {
                    chai_1.expect(component.isUpdatingPassword).to.be.false;
                });
                testing_1.describe('change the password again', function () {
                    testing_1.beforeEach(function () {
                        component.changeUserPassword();
                    });
                    testing_1.it('should set the error correctly', function () {
                        chai_1.expect(component.updateUserPasswordError).to.be.null;
                    });
                    testing_1.it('should initialize isPasswordUpdated correctly', function () {
                        chai_1.expect(component.isPasswordUpdated).to.be.false;
                    });
                    testing_1.it('should initialize isUpdatingPassword correctly', function () {
                        chai_1.expect(component.isUpdatingPassword).to.be.true;
                    });
                });
            });
            testing_1.describe('updating succeeds', function () {
                var updateTextFieldsSpy;
                testing_1.beforeEach(testing_1.fakeAsync(function () {
                    updateTextFieldsSpy = sinon_1.spy(Materialize, 'updateTextFields');
                    updateUserPassrowdResult.next(null);
                    updateUserPassrowdResult.complete();
                    testing_1.tick(0);
                }));
                afterEach(function () {
                    updateTextFieldsSpy.restore();
                });
                testing_1.it('should set the error correctly', function () {
                    chai_1.expect(component.updateUserPasswordError).to.be.null;
                });
                testing_1.it('should initialize isPasswordUpdated correctly', function () {
                    chai_1.expect(component.isPasswordUpdated).to.be.true;
                });
                testing_1.it('should clear the model', function () {
                    chai_1.expect(component.model.password).to.be.empty;
                    chai_1.expect(component.model.newPassword).to.be.empty;
                    chai_1.expect(component.model.newPasswordRepeated).to.be.empty;
                });
                testing_1.it('should set the form controls as untouched', function () {
                    chai_1.expect(passwordControl.touched).to.be.false;
                    chai_1.expect(newPasswordControl.touched).to.be.false;
                    chai_1.expect(newPasswordRepeatedControl.touched).to.be.false;
                });
                testing_1.it('should set the form controls as pristine', function () {
                    chai_1.expect(passwordControl.pristine).to.be.true;
                    chai_1.expect(newPasswordControl.pristine).to.be.true;
                    chai_1.expect(newPasswordRepeatedControl.pristine).to.be.true;
                });
                testing_1.it('should initialize isUpdatingPassword correctly', function () {
                    chai_1.expect(component.isUpdatingPassword).to.be.false;
                });
                testing_1.it('should call Materialize.updateTextFields()', function () {
                    chai_1.expect(updateTextFieldsSpy.callCount).to.be.equal(1);
                });
                testing_1.describe('change the password again', function () {
                    testing_1.beforeEach(function () {
                        formFiller_1.FormFiller.fillFormControl(userPasswordFormGroup, passwordControl, password);
                        formFiller_1.FormFiller.fillFormControl(userPasswordFormGroup, newPasswordControl, newPassword);
                        formFiller_1.FormFiller.fillFormControl(userPasswordFormGroup, newPasswordRepeatedControl, newPassword);
                        component.model.password = password;
                        component.model.newPassword = newPassword;
                        component.model.newPasswordRepeated = newPassword;
                        component.changeUserPassword();
                    });
                    testing_1.it('should set the error correctly', function () {
                        chai_1.expect(component.updateUserPasswordError).to.be.null;
                    });
                    testing_1.it('should initialize isPasswordUpdated correctly', function () {
                        chai_1.expect(component.isPasswordUpdated).to.be.false;
                    });
                    testing_1.it('should initialize isUpdatingPassword correctly', function () {
                        chai_1.expect(component.isUpdatingPassword).to.be.true;
                    });
                });
            });
        });
    });
});
//# sourceMappingURL=changeUserPassword.component.test.js.map