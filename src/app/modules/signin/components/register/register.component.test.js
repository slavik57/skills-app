"use strict";
var register_component_1 = require("./register.component");
var testing_1 = require('@angular/core/testing');
var core_1 = require('@angular/core');
var chai_1 = require('chai');
var userService_1 = require("../../../common/services/userService");
var locationService_1 = require("../../../common/services/locationService");
var usernameExistsValidator_1 = require("../../../common/validators/usernameExistsValidator");
var Subject_1 = require('rxjs/Subject');
var forms_1 = require('@angular/forms');
var sinon_1 = require('sinon');
testing_1.describe('RegisterComponent', function () {
    var userServiceMock;
    var registerUserResult;
    var locationServiceMock;
    var usernameExistsResult;
    var usernameExistsValidatorMock;
    var usernameExistsValidatorFactoryMock;
    var usernameExistsValidatorBindControlSpy;
    var registerComponent;
    testing_1.beforeEachProviders(function () {
        registerUserResult = new Subject_1.Subject();
        userServiceMock = {
            signinUser: function () { return null; },
            registerUser: function () { return registerUserResult; },
            isUsernameExists: function () { return null; }
        };
        locationServiceMock = {
            goToUrl: function () { }
        };
        usernameExistsResult = new Subject_1.Subject();
        usernameExistsValidatorMock = {
            bindControl: function () { },
            usernameExists: function () { return usernameExistsResult; }
        };
        usernameExistsValidatorBindControlSpy =
            sinon_1.spy(usernameExistsValidatorMock, 'bindControl');
        usernameExistsValidatorFactoryMock = {
            create: function () { return usernameExistsValidatorMock; }
        };
        return [
            forms_1.FormBuilder,
            core_1.provide(userService_1.UserService, { useValue: userServiceMock }),
            core_1.provide(locationService_1.LocationService, { useValue: locationServiceMock }),
            core_1.provide(usernameExistsValidator_1.UsernameExistsValidatorFactory, { useValue: usernameExistsValidatorFactoryMock }),
            register_component_1.RegisterComponent
        ];
    });
    testing_1.beforeEach(testing_1.inject([register_component_1.RegisterComponent], function (_registerComponent) {
        registerComponent = _registerComponent;
        registerComponent.ngOnInit();
    }));
    testing_1.it('should be initialized correctly', function () {
        chai_1.expect(registerComponent.error).to.be.undefined;
        chai_1.expect(registerComponent.model.username).to.be.undefined;
        chai_1.expect(registerComponent.model.password).to.be.undefined;
        chai_1.expect(registerComponent.model.repeatPassword).to.be.undefined;
        chai_1.expect(registerComponent.model.email).to.be.undefined;
        chai_1.expect(registerComponent.model.firstName).to.be.undefined;
        chai_1.expect(registerComponent.model.lastName).to.be.undefined;
        chai_1.expect(registerComponent.submitting).to.be.false;
        chai_1.expect(registerComponent.registerFormGroup).to.not.equal(null);
        chai_1.expect(registerComponent.passwordsGroup).to.not.equal(null);
    });
    testing_1.it('should bind the username control to the usernameExistsValidator', function () {
        chai_1.expect(usernameExistsValidatorBindControlSpy.callCount).to.be.equal(1);
        chai_1.expect(usernameExistsValidatorBindControlSpy.args[0][0]).to.be.equal(registerComponent.registerFormGroup.controls['username']);
    });
    testing_1.describe('form validations', function () {
        var validEmail;
        var invalidEmail;
        var validFirstName;
        var invalidFirstName;
        var validLastName;
        var invalidLastName;
        var emailControl;
        var firstNameControl;
        var lastNameControl;
        testing_1.beforeEach(function () {
            validEmail = 'somevalid@Mail.com';
            invalidEmail = 'someInvalidMail';
            validFirstName = 'some name';
            invalidFirstName = '';
            validLastName = 'some last name';
            invalidLastName = '';
            emailControl =
                registerComponent.registerFormGroup.controls['email'];
            firstNameControl =
                registerComponent.registerFormGroup.controls['firstName'];
            lastNameControl =
                registerComponent.registerFormGroup.controls['lastName'];
        });
        testing_1.describe('username', function () {
            var validUsername;
            var invalidUsername;
            var usernameControl;
            testing_1.beforeEach(function () {
                validUsername = 'validUsername';
                invalidUsername = '';
                usernameControl =
                    registerComponent.registerFormGroup.controls['username'];
            });
            testing_1.describe('username does not exist', function () {
                testing_1.it('valid username should succeed validation', function () {
                    usernameControl.updateValue(validUsername);
                    usernameControl.updateValueAndValidity();
                    usernameExistsResult.next(null);
                    usernameExistsResult.complete();
                    chai_1.expect(usernameControl.errors).to.be.null;
                });
                testing_1.it('invalid username should fail validation', function () {
                    usernameControl.updateValue(invalidUsername);
                    usernameControl.updateValueAndValidity();
                    usernameExistsResult.next(null);
                    usernameExistsResult.complete();
                    chai_1.expect(usernameControl.errors).not.to.be.null;
                });
            });
            testing_1.describe('username exists', function () {
                testing_1.it('valid username should fail validation', function () {
                    usernameControl.updateValue(validUsername);
                    usernameControl.updateValueAndValidity();
                    usernameExistsResult.next({ 'someError': true });
                    usernameExistsResult.complete();
                    chai_1.expect(usernameControl.errors).not.to.be.null;
                });
                testing_1.it('invalid username should fail validation', function () {
                    usernameControl.updateValue(invalidUsername);
                    usernameControl.updateValueAndValidity();
                    usernameExistsResult.next({ 'someError': true });
                    usernameExistsResult.complete();
                    chai_1.expect(usernameControl.errors).not.to.be.null;
                });
            });
        });
        testing_1.describe('passwords', function () {
            var invalidPassword;
            var validPassword;
            var invalidRepeatPassword;
            var validRepeatPassword;
            var validButNotSamePassword;
            var passwordControl;
            var repeatPasswordControl;
            var passwordsGroup;
            testing_1.beforeEach(function () {
                validPassword = 'some password';
                invalidPassword = '';
                validRepeatPassword = validPassword;
                invalidRepeatPassword = '';
                validButNotSamePassword = 'some other password';
                passwordsGroup = registerComponent.passwordsGroup;
                passwordControl =
                    passwordsGroup.controls['password'];
                repeatPasswordControl =
                    passwordsGroup.controls['repeatPassword'];
            });
            testing_1.it('valid password should succeed validation', function () {
                passwordControl.updateValue(validPassword);
                passwordControl.updateValueAndValidity();
                chai_1.expect(passwordControl.errors).to.be.null;
            });
            testing_1.it('invalid password should fail validation', function () {
                passwordControl.updateValue(invalidPassword);
                passwordControl.updateValueAndValidity();
                chai_1.expect(passwordControl.errors).not.to.be.null;
            });
            testing_1.it('valid repeat password should succeed validation', function () {
                repeatPasswordControl.updateValue(validRepeatPassword);
                repeatPasswordControl.updateValueAndValidity();
                chai_1.expect(repeatPasswordControl.errors).to.be.null;
            });
            testing_1.it('invalid repeat password should fail validation', function () {
                repeatPasswordControl.updateValue(invalidRepeatPassword);
                repeatPasswordControl.updateValueAndValidity();
                chai_1.expect(repeatPasswordControl.errors).not.to.be.null;
            });
            testing_1.it('same empty password and repeat password, passwordsGroup should be valid', function () {
                passwordControl.updateValue('');
                passwordControl.updateValueAndValidity();
                repeatPasswordControl.updateValue('');
                repeatPasswordControl.updateValueAndValidity();
                chai_1.expect(passwordsGroup.errors).to.be.null;
            });
            testing_1.it('same valid password and repeat password, passwordsGroup should be valid', function () {
                passwordControl.updateValue(validPassword);
                passwordControl.updateValueAndValidity();
                repeatPasswordControl.updateValue(validRepeatPassword);
                repeatPasswordControl.updateValueAndValidity();
                chai_1.expect(passwordsGroup.errors).to.be.null;
            });
            testing_1.it('different valid password and repeat password, passwordsGroup should be invalid', function () {
                passwordControl.updateValue(validPassword);
                passwordControl.updateValueAndValidity();
                repeatPasswordControl.updateValue(validButNotSamePassword);
                repeatPasswordControl.updateValueAndValidity();
                chai_1.expect(passwordsGroup.errors).to.not.be.null;
            });
        });
        testing_1.it('valid mail should succeed validation', function () {
            emailControl.updateValue(validEmail);
            emailControl.updateValueAndValidity();
            chai_1.expect(emailControl.errors).to.be.null;
        });
        testing_1.it('invalid mail should fail validation', function () {
            emailControl.updateValue(invalidEmail);
            emailControl.updateValueAndValidity();
            chai_1.expect(emailControl.errors).not.to.be.null;
        });
        testing_1.it('valid firstName should succeed validation', function () {
            firstNameControl.updateValue(validFirstName);
            firstNameControl.updateValueAndValidity();
            chai_1.expect(firstNameControl.errors).to.be.null;
        });
        testing_1.it('invalid firstName should fail validation', function () {
            firstNameControl.updateValue(invalidFirstName);
            firstNameControl.updateValueAndValidity();
            chai_1.expect(firstNameControl.errors).not.to.be.null;
        });
        testing_1.it('valid lastName should succeed validation', function () {
            lastNameControl.updateValue(validLastName);
            lastNameControl.updateValueAndValidity();
            chai_1.expect(lastNameControl.errors).to.be.null;
        });
        testing_1.it('invalid lastName should fail validation', function () {
            lastNameControl.updateValue(invalidLastName);
            lastNameControl.updateValueAndValidity();
            chai_1.expect(lastNameControl.errors).not.to.be.null;
        });
    });
    testing_1.describe('onSubmit', function () {
        var username;
        var password;
        var repeatPassword;
        var email;
        var firstName;
        var lastName;
        var registerUserSpy;
        testing_1.beforeEach(function () {
            username = 'some username';
            password = 'some password';
            repeatPassword = 'some password';
            email = 'some email';
            firstName = 'some firstName';
            lastName = 'some lastName';
            registerComponent.model.username = username;
            registerComponent.model.password = password;
            registerComponent.model.repeatPassword = repeatPassword;
            registerComponent.model.email = email;
            registerComponent.model.firstName = firstName;
            registerComponent.model.lastName = lastName;
            registerUserSpy = sinon_1.spy(userServiceMock, 'registerUser');
            registerComponent.onSubmit();
        });
        testing_1.it('should set submitting to true', function () {
            chai_1.expect(registerComponent.submitting).to.be.true;
        });
        testing_1.it('should call the service correctly', function () {
            chai_1.expect(registerUserSpy.callCount).to.be.equal(1);
            chai_1.expect(registerUserSpy.args[0][0]).to.be.equal(username);
            chai_1.expect(registerUserSpy.args[0][1]).to.be.equal(password);
            chai_1.expect(registerUserSpy.args[0][2]).to.be.equal(email);
            chai_1.expect(registerUserSpy.args[0][3]).to.be.equal(firstName);
            chai_1.expect(registerUserSpy.args[0][4]).to.be.equal(lastName);
        });
        testing_1.describe('user service fails', function () {
            var error;
            testing_1.beforeEach(function () {
                error = 'some error';
                registerUserResult.error(error);
            });
            testing_1.it('should set submitting to false', function () {
                chai_1.expect(registerComponent.submitting).to.be.false;
            });
            testing_1.it('should set the error correctly', function () {
                chai_1.expect(registerComponent.error).to.be.equal(error);
            });
        });
        testing_1.describe('user service succeeds', function () {
            var redirectUrl;
            var goToUrlSpy;
            testing_1.beforeEach(function () {
                redirectUrl = 'some url';
                goToUrlSpy = sinon_1.spy(locationServiceMock, 'goToUrl');
                registerUserResult.next(redirectUrl);
                registerUserResult.complete();
            });
            testing_1.it('should set submitting to false', function () {
                chai_1.expect(registerComponent.submitting).to.be.false;
            });
            testing_1.it('should navigate to correct url', function () {
                chai_1.expect(goToUrlSpy.args[0][0]).to.be.equal(redirectUrl);
            });
        });
    });
});
//# sourceMappingURL=register.component.test.js.map