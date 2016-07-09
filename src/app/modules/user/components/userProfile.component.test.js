"use strict";
var formFiller_1 = require("../../../testUtils/formFiller");
var testing_1 = require('@angular/core/testing');
var core_1 = require('@angular/core');
var userService_1 = require("../../common/services/userService");
var sinon_1 = require('sinon');
var chai_1 = require('chai');
var userProfile_component_1 = require('./userProfile.component');
var Subject_1 = require('rxjs/Subject');
var forms_1 = require('@angular/forms');
var usernameExistsValidator_1 = require("../../common/validators/usernameExistsValidator");
testing_1.describe('UserProfileComponent', function () {
    var userServiceMock;
    var userProfileComponent;
    var getUserDetailsSpy;
    var getUserDetailsResult;
    var usernameExistsResult;
    var usernameExistsValidatorMock;
    var usernameExistsValidatorFactoryMock;
    var usernameExistsValidatorBindControlSpy;
    var createUsernameExistsValidatorSpy;
    testing_1.beforeEachProviders(function () {
        getUserDetailsResult = new Subject_1.Subject();
        userServiceMock = {
            signinUser: function () { return null; },
            registerUser: function () { return null; },
            isUsernameExists: function () { return null; },
            getUserDetails: function () { return getUserDetailsResult; },
            updateUserDetails: function () { return null; }
        };
        getUserDetailsSpy = sinon_1.spy(userServiceMock, 'getUserDetails');
        usernameExistsValidatorMock = {
            bindControl: function () { },
            usernameExists: function () {
                usernameExistsResult = new Subject_1.Subject();
                return usernameExistsResult;
            }
        };
        usernameExistsValidatorBindControlSpy =
            sinon_1.spy(usernameExistsValidatorMock, 'bindControl');
        usernameExistsValidatorFactoryMock = {
            create: function () { return null; },
            createWithAllowedUsers: function () { return usernameExistsValidatorMock; }
        };
        createUsernameExistsValidatorSpy =
            sinon_1.spy(usernameExistsValidatorFactoryMock, 'createWithAllowedUsers');
        return [
            forms_1.FormBuilder,
            core_1.provide(userService_1.UserService, { useValue: userServiceMock }),
            core_1.provide(usernameExistsValidator_1.UsernameExistsValidatorFactory, { useValue: usernameExistsValidatorFactoryMock }),
            userProfile_component_1.UserProfileComponent
        ];
    });
    testing_1.beforeEach(testing_1.inject([userProfile_component_1.UserProfileComponent], function (_userProfileComponent) {
        userProfileComponent = _userProfileComponent;
        userProfileComponent.ngOnInit();
    }));
    testing_1.it('should initialize correctly', function () {
        chai_1.expect(userProfileComponent.gettingUserDetails, 'gettingUserDetails should be correct').to.be.true;
        chai_1.expect(userProfileComponent.model, 'editUserProfileModel should be correct').to.be.undefined;
        chai_1.expect(userProfileComponent.gettingUserDetailsError, 'gettingUserDetailsError should be correct').to.be.null;
        chai_1.expect(userProfileComponent.userDetailsFormGroup).to.be.undefined;
        chai_1.expect(userProfileComponent.updatingUserDetails, 'updatingUserDetails should be correct').to.be.false;
        chai_1.expect(userProfileComponent.updatingUserDetailsError, 'updatingUserDetailsError should be correct').to.be.undefined;
    });
    testing_1.it('should fetch userDetails', function () {
        chai_1.expect(getUserDetailsSpy.callCount).to.be.equal(1);
    });
    testing_1.describe('fetching user details failed', function () {
        var error;
        testing_1.beforeEach(function () {
            error = 'some error';
            getUserDetailsResult.error(error);
        });
        testing_1.it('should set gettingUserDetails to false', function () {
            chai_1.expect(userProfileComponent.gettingUserDetails).to.be.false;
        });
        testing_1.it('model should still be undefined', function () {
            chai_1.expect(userProfileComponent.model).to.be.undefined;
        });
        testing_1.it('userDetailsFormGroup should still be undefined', function () {
            chai_1.expect(userProfileComponent.userDetailsFormGroup).to.be.undefined;
        });
        testing_1.it('should set error correctly', function () {
            chai_1.expect(userProfileComponent.gettingUserDetailsError).to.be.equal(error);
        });
        testing_1.describe('reload user details', function () {
            testing_1.beforeEach(function () {
                getUserDetailsSpy.reset();
                getUserDetailsResult = new Subject_1.Subject();
                userProfileComponent.loadUserDetails();
            });
            testing_1.it('should set properties correctly', function () {
                chai_1.expect(userProfileComponent.gettingUserDetails, 'gettingUserDetails should be correct').to.be.true;
                chai_1.expect(userProfileComponent.model, 'editUserProfileModel should be correct').to.be.undefined;
                chai_1.expect(userProfileComponent.gettingUserDetailsError, 'gettingUserDetailsError should be correct').to.be.null;
                chai_1.expect(userProfileComponent.userDetailsFormGroup).to.be.undefined;
            });
            testing_1.it('should fetch userDetails', function () {
                chai_1.expect(getUserDetailsSpy.callCount).to.be.equal(1);
            });
        });
    });
    testing_1.describe('fetching user details succeeds', function () {
        var userDetails;
        var updateTextFieldsSpy;
        testing_1.beforeEach(testing_1.fakeAsync(function () {
            userDetails = {
                id: 1,
                username: 'some username',
                email: 'some@email.com',
                firstName: 'some firstName',
                lastName: 'some lastName'
            };
            updateTextFieldsSpy = sinon_1.spy(Materialize, 'updateTextFields');
            getUserDetailsResult.next(userDetails);
            getUserDetailsResult.complete();
            testing_1.tick(0);
            usernameExistsResult.next(null);
            usernameExistsResult.complete();
        }));
        testing_1.afterEach(function () {
            updateTextFieldsSpy.restore();
        });
        testing_1.it('should set gettingUserDetails to false', function () {
            chai_1.expect(userProfileComponent.gettingUserDetails).to.be.false;
        });
        testing_1.it('should set error correctly', function () {
            chai_1.expect(userProfileComponent.gettingUserDetailsError).to.be.null;
        });
        testing_1.it('the model should be correct', function () {
            chai_1.expect(userProfileComponent.model).to.be.deep.equal(userDetails);
        });
        testing_1.it('should initialize the userDetailsFormGroup', function () {
            chai_1.expect(userProfileComponent.userDetailsFormGroup).to.exist;
        });
        testing_1.it('should call Materialize.updateTextFields()', function () {
            chai_1.expect(updateTextFieldsSpy.callCount).to.be.equal(1);
        });
        testing_1.it('canUpdateUserDetails should return false', function () {
            chai_1.expect(userProfileComponent.canUpdateUserDetails()).to.be.false;
        });
        testing_1.describe('username', function () {
            var usernameControl;
            testing_1.beforeEach(function () {
                usernameControl =
                    userProfileComponent.userDetailsFormGroup.controls['username'];
            });
            testing_1.it('value should be correct', function () {
                chai_1.expect(usernameControl.value).to.be.equal(userDetails.username);
            });
            testing_1.it('should initialize the UsernameExistsValidator correctly', function () {
                chai_1.expect(createUsernameExistsValidatorSpy.callCount).to.be.equal(1);
                chai_1.expect(createUsernameExistsValidatorSpy.args[0][0]).to.be.deep.equal([userDetails.username]);
            });
            testing_1.it('should bind the UsernameExistsValidator to username control', function () {
                chai_1.expect(usernameExistsValidatorBindControlSpy.callCount).to.be.equal(1);
                chai_1.expect(usernameExistsValidatorBindControlSpy.args[0][0]).to.be.equal(usernameControl);
            });
            testing_1.describe('change the username', function () {
                testing_1.describe('to empty', function () {
                    testing_1.beforeEach(function () {
                        var value = '';
                        formFiller_1.FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, usernameControl, value);
                        userProfileComponent.model.username = value;
                    });
                    testing_1.it('control should be invalid', function () {
                        chai_1.expect(usernameControl.errors).to.exist;
                    });
                    testing_1.it('canUpdateUserDetails should return false', function () {
                        chai_1.expect(userProfileComponent.canUpdateUserDetails()).to.be.false;
                    });
                });
                testing_1.describe('to different user', function () {
                    testing_1.beforeEach(function () {
                        var value = 'some other user';
                        formFiller_1.FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, usernameControl, value);
                        userProfileComponent.model.username = value;
                        usernameExistsResult.next(null);
                        usernameExistsResult.complete();
                    });
                    testing_1.it('control should be valid', function () {
                        chai_1.expect(usernameControl.errors).to.not.exist;
                    });
                    testing_1.it('canUpdateUserDetails should return true', function () {
                        chai_1.expect(userProfileComponent.canUpdateUserDetails()).to.be.true;
                    });
                    testing_1.describe('restore username', function () {
                        testing_1.beforeEach(function () {
                            var value = userDetails.username;
                            formFiller_1.FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, usernameControl, value);
                            userProfileComponent.model.username = value;
                            usernameExistsResult.next(null);
                            usernameExistsResult.complete();
                        });
                        testing_1.it('control should be valid', function () {
                            chai_1.expect(usernameControl.errors).to.not.exist;
                        });
                        testing_1.it('canUpdateUserDetails should return false', function () {
                            chai_1.expect(userProfileComponent.canUpdateUserDetails()).to.be.false;
                        });
                    });
                });
                testing_1.describe('to existing username', function () {
                    testing_1.beforeEach(function () {
                        var value = 'existing username';
                        formFiller_1.FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, usernameControl, value);
                        userProfileComponent.model.username = value;
                        usernameExistsResult.next({ 'someError': true });
                        usernameExistsResult.complete();
                    });
                    testing_1.it('control should be invalid', function () {
                        chai_1.expect(usernameControl.errors).to.exist;
                    });
                    testing_1.it('canUpdateUserDetails should return false', function () {
                        chai_1.expect(userProfileComponent.canUpdateUserDetails()).to.be.false;
                    });
                });
            });
        });
        testing_1.describe('email', function () {
            var emailControl;
            testing_1.beforeEach(function () {
                emailControl =
                    userProfileComponent.userDetailsFormGroup.controls['email'];
            });
            testing_1.it('value should be correct', function () {
                chai_1.expect(emailControl.value).to.be.equal(userDetails.email);
            });
            testing_1.describe('change the email', function () {
                testing_1.describe('to empty', function () {
                    testing_1.beforeEach(function () {
                        var value = '';
                        formFiller_1.FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, emailControl, value);
                        userProfileComponent.model.email = value;
                    });
                    testing_1.it('control should be valid', function () {
                        chai_1.expect(emailControl.errors).to.not.exist;
                    });
                    testing_1.it('canUpdateUserDetails should return true', function () {
                        chai_1.expect(userProfileComponent.canUpdateUserDetails()).to.be.true;
                    });
                });
                testing_1.describe('to different email', function () {
                    testing_1.beforeEach(function () {
                        var value = 'someOther@email.com';
                        formFiller_1.FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, emailControl, value);
                        userProfileComponent.model.email = value;
                    });
                    testing_1.it('control should be valid', function () {
                        chai_1.expect(emailControl.errors).to.not.exist;
                    });
                    testing_1.it('canUpdateUserDetails should return true', function () {
                        chai_1.expect(userProfileComponent.canUpdateUserDetails()).to.be.true;
                    });
                    testing_1.describe('restore email', function () {
                        testing_1.beforeEach(function () {
                            var value = userDetails.email;
                            formFiller_1.FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, emailControl, value);
                            userProfileComponent.model.email = value;
                        });
                        testing_1.it('control should be valid', function () {
                            chai_1.expect(emailControl.errors).to.not.exist;
                        });
                        testing_1.it('canUpdateUserDetails should return false', function () {
                            chai_1.expect(userProfileComponent.canUpdateUserDetails()).to.be.false;
                        });
                    });
                });
                testing_1.describe('to invalid email', function () {
                    testing_1.beforeEach(function () {
                        var value = 'invlaid email';
                        formFiller_1.FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, emailControl, value);
                        userProfileComponent.model.email = value;
                    });
                    testing_1.it('control should be invalid', function () {
                        chai_1.expect(emailControl.errors).to.exist;
                    });
                    testing_1.it('canUpdateUserDetails should return false', function () {
                        chai_1.expect(userProfileComponent.canUpdateUserDetails()).to.be.false;
                    });
                });
            });
        });
        testing_1.describe('firstName', function () {
            var firstNameControl;
            testing_1.beforeEach(function () {
                firstNameControl =
                    userProfileComponent.userDetailsFormGroup.controls['firstName'];
            });
            testing_1.it('value should be correct', function () {
                chai_1.expect(firstNameControl.value).to.be.equal(userDetails.firstName);
            });
            testing_1.describe('change the firstName', function () {
                testing_1.describe('to empty', function () {
                    testing_1.beforeEach(function () {
                        var value = '';
                        formFiller_1.FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, firstNameControl, value);
                        userProfileComponent.model.firstName = value;
                    });
                    testing_1.it('control should be invalid', function () {
                        chai_1.expect(firstNameControl.errors).to.exist;
                    });
                    testing_1.it('canUpdateUserDetails should return false', function () {
                        chai_1.expect(userProfileComponent.canUpdateUserDetails()).to.be.false;
                    });
                });
                testing_1.describe('to different first name', function () {
                    testing_1.beforeEach(function () {
                        var value = 'some other first name';
                        formFiller_1.FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, firstNameControl, value);
                        userProfileComponent.model.firstName = value;
                    });
                    testing_1.it('control should be valid', function () {
                        chai_1.expect(firstNameControl.errors).to.not.exist;
                    });
                    testing_1.it('canUpdateUserDetails should return true', function () {
                        chai_1.expect(userProfileComponent.canUpdateUserDetails()).to.be.true;
                    });
                    testing_1.describe('restore first name', function () {
                        testing_1.beforeEach(function () {
                            var value = userDetails.firstName;
                            formFiller_1.FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, firstNameControl, value);
                            userProfileComponent.model.firstName = value;
                        });
                        testing_1.it('control should be valid', function () {
                            chai_1.expect(firstNameControl.errors).to.not.exist;
                        });
                        testing_1.it('canUpdateUserDetails should return false', function () {
                            chai_1.expect(userProfileComponent.canUpdateUserDetails()).to.be.false;
                        });
                    });
                });
            });
        });
        testing_1.describe('lastName', function () {
            var lastNameControl;
            testing_1.beforeEach(function () {
                lastNameControl =
                    userProfileComponent.userDetailsFormGroup.controls['lastName'];
            });
            testing_1.it('value should be correct', function () {
                chai_1.expect(lastNameControl.value).to.be.equal(userDetails.lastName);
            });
            testing_1.describe('change the lastName', function () {
                testing_1.describe('to empty', function () {
                    testing_1.beforeEach(function () {
                        var value = '';
                        formFiller_1.FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, lastNameControl, value);
                        userProfileComponent.model.lastName = value;
                    });
                    testing_1.it('control should be invalid', function () {
                        chai_1.expect(lastNameControl.errors).to.exist;
                    });
                    testing_1.it('canUpdateUserDetails should return false', function () {
                        chai_1.expect(userProfileComponent.canUpdateUserDetails()).to.be.false;
                    });
                });
                testing_1.describe('to different last name', function () {
                    testing_1.beforeEach(function () {
                        var value = 'some other last name';
                        formFiller_1.FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, lastNameControl, value);
                        userProfileComponent.model.lastName = value;
                    });
                    testing_1.it('control should be valid', function () {
                        chai_1.expect(lastNameControl.errors).to.not.exist;
                    });
                    testing_1.it('canUpdateUserDetails should return true', function () {
                        chai_1.expect(userProfileComponent.canUpdateUserDetails()).to.be.true;
                    });
                    testing_1.describe('restore last name', function () {
                        testing_1.beforeEach(function () {
                            var value = userDetails.lastName;
                            formFiller_1.FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, lastNameControl, value);
                            userProfileComponent.model.lastName = value;
                        });
                        testing_1.it('control should be valid', function () {
                            chai_1.expect(lastNameControl.errors).to.not.exist;
                        });
                        testing_1.it('canUpdateUserDetails should return false', function () {
                            chai_1.expect(userProfileComponent.canUpdateUserDetails()).to.be.false;
                        });
                    });
                });
            });
        });
        testing_1.describe('updateUserDetails()', function () {
            var newUserDetails;
            var updateUserDetailsResult;
            var updateUserDetailsStub;
            testing_1.beforeEach(function () {
                newUserDetails = {
                    id: userDetails.id,
                    username: 'new username',
                    email: 'new@email.com',
                    firstName: 'new first name',
                    lastName: 'new last name'
                };
                var usernameControl = userProfileComponent.userDetailsFormGroup.controls['username'];
                var emailControl = userProfileComponent.userDetailsFormGroup.controls['email'];
                var firstNameControl = userProfileComponent.userDetailsFormGroup.controls['firstName'];
                var lastNameControl = userProfileComponent.userDetailsFormGroup.controls['lastName'];
                formFiller_1.FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, usernameControl, newUserDetails.username);
                userProfileComponent.model.username = newUserDetails.username;
                usernameExistsResult.next(null);
                usernameExistsResult.complete();
                formFiller_1.FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, emailControl, newUserDetails.email);
                userProfileComponent.model.email = newUserDetails.email;
                formFiller_1.FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, firstNameControl, newUserDetails.firstName);
                userProfileComponent.model.firstName = newUserDetails.firstName;
                formFiller_1.FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, lastNameControl, newUserDetails.lastName);
                userProfileComponent.model.lastName = newUserDetails.lastName;
                updateUserDetailsResult = new Subject_1.Subject();
                updateUserDetailsStub =
                    sinon_1.stub(userServiceMock, 'updateUserDetails', function () { return updateUserDetailsResult; });
                userProfileComponent.updateUserDetails();
            });
            testing_1.afterEach(function () {
                updateUserDetailsStub.restore();
            });
            testing_1.it('should call userService.updateUserDetails() correctly', function () {
                var expectedArgs = [
                    newUserDetails.id,
                    newUserDetails.username,
                    newUserDetails.email,
                    newUserDetails.firstName,
                    newUserDetails.lastName
                ];
                chai_1.expect(updateUserDetailsStub.callCount).to.be.equal(1);
                chai_1.expect(updateUserDetailsStub.args[0]).to.be.deep.equal(expectedArgs);
            });
            testing_1.it('should set updatingUserDetails to true', function () {
                chai_1.expect(userProfileComponent.updatingUserDetails).to.be.true;
            });
            testing_1.it('should set updatingUserDetailsError to null', function () {
                chai_1.expect(userProfileComponent.updatingUserDetailsError).to.be.null;
            });
            testing_1.describe('updating fails', function () {
                var error;
                testing_1.beforeEach(function () {
                    error = 'updateUserDetails error';
                    updateUserDetailsResult.error(error);
                });
                testing_1.it('should set updatingUserDetails to false', function () {
                    chai_1.expect(userProfileComponent.updatingUserDetails).to.be.false;
                });
                testing_1.it('should set updatingUserDetailsError correctly', function () {
                    chai_1.expect(userProfileComponent.updatingUserDetailsError).to.be.equal(error);
                });
            });
            testing_1.describe('updating succeeds', function () {
                testing_1.beforeEach(function () {
                    updateUserDetailsResult.next(null);
                    updateUserDetailsResult.complete();
                });
                testing_1.it('should set updatingUserDetails to false', function () {
                    chai_1.expect(userProfileComponent.updatingUserDetails).to.be.false;
                });
                testing_1.it('should set updatingUserDetailsError to null', function () {
                    chai_1.expect(userProfileComponent.updatingUserDetailsError).to.be.null;
                });
            });
        });
    });
    testing_1.describe('fetching user details succeeds with null email', function () {
        var userDetails;
        var updateTextFieldsSpy;
        testing_1.beforeEach(testing_1.fakeAsync(function () {
            userDetails = {
                id: 1,
                username: 'some username',
                email: null,
                firstName: 'some firstName',
                lastName: 'some lastName'
            };
            updateTextFieldsSpy = sinon_1.spy(Materialize, 'updateTextFields');
            getUserDetailsResult.next(userDetails);
            getUserDetailsResult.complete();
            testing_1.tick(0);
            usernameExistsResult.next(null);
            usernameExistsResult.complete();
        }));
        testing_1.afterEach(function () {
            updateTextFieldsSpy.restore();
        });
        testing_1.it('should set gettingUserDetails to false', function () {
            chai_1.expect(userProfileComponent.gettingUserDetails).to.be.false;
        });
        testing_1.it('should set error correctly', function () {
            chai_1.expect(userProfileComponent.gettingUserDetailsError).to.be.null;
        });
        testing_1.it('the model should be correct', function () {
            chai_1.expect(userProfileComponent.model).to.be.deep.equal(userDetails);
        });
        testing_1.it('should initialize the userDetailsFormGroup', function () {
            chai_1.expect(userProfileComponent.userDetailsFormGroup).to.exist;
        });
        testing_1.it('should call Materialize.updateTextFields()', function () {
            chai_1.expect(updateTextFieldsSpy.callCount).to.be.equal(1);
        });
        testing_1.it('canUpdateUserDetails should return false', function () {
            chai_1.expect(userProfileComponent.canUpdateUserDetails()).to.be.false;
        });
        testing_1.describe('email', function () {
            var emailControl;
            testing_1.beforeEach(function () {
                emailControl =
                    userProfileComponent.userDetailsFormGroup.controls['email'];
            });
            testing_1.it('value should be correct', function () {
                chai_1.expect(emailControl.value).to.be.equal(userDetails.email);
            });
            testing_1.describe('change the email', function () {
                testing_1.describe('to empty', function () {
                    testing_1.beforeEach(function () {
                        var value = '';
                        formFiller_1.FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, emailControl, value);
                        userProfileComponent.model.email = value;
                    });
                    testing_1.it('control should be valid', function () {
                        chai_1.expect(emailControl.errors).to.not.exist;
                    });
                    testing_1.it('canUpdateUserDetails should return false', function () {
                        chai_1.expect(userProfileComponent.canUpdateUserDetails()).to.be.false;
                    });
                });
                testing_1.describe('to different email', function () {
                    testing_1.beforeEach(function () {
                        var value = 'someOther@email.com';
                        formFiller_1.FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, emailControl, value);
                        userProfileComponent.model.email = value;
                    });
                    testing_1.it('control should be valid', function () {
                        chai_1.expect(emailControl.errors).to.not.exist;
                    });
                    testing_1.it('canUpdateUserDetails should return true', function () {
                        chai_1.expect(userProfileComponent.canUpdateUserDetails()).to.be.true;
                    });
                    testing_1.describe('restore email', function () {
                        testing_1.beforeEach(function () {
                            var value = userDetails.email;
                            formFiller_1.FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, emailControl, value);
                            userProfileComponent.model.email = value;
                        });
                        testing_1.it('control should be valid', function () {
                            chai_1.expect(emailControl.errors).to.not.exist;
                        });
                        testing_1.it('canUpdateUserDetails should return false', function () {
                            chai_1.expect(userProfileComponent.canUpdateUserDetails()).to.be.false;
                        });
                    });
                });
                testing_1.describe('to invalid email', function () {
                    testing_1.beforeEach(function () {
                        var value = 'invlaid email';
                        formFiller_1.FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, emailControl, value);
                        userProfileComponent.model.email = value;
                    });
                    testing_1.it('control should be invalid', function () {
                        chai_1.expect(emailControl.errors).to.exist;
                    });
                    testing_1.it('canUpdateUserDetails should return false', function () {
                        chai_1.expect(userProfileComponent.canUpdateUserDetails()).to.be.false;
                    });
                });
            });
        });
        testing_1.describe('updateUserDetails()', function () {
            var newUserDetails;
            var updateUserDetailsResult;
            var updateUserDetailsStub;
            testing_1.beforeEach(function () {
                newUserDetails = {
                    id: userDetails.id,
                    username: 'new username',
                    email: 'new@email.com',
                    firstName: 'new first name',
                    lastName: 'new last name'
                };
                var usernameControl = userProfileComponent.userDetailsFormGroup.controls['username'];
                var emailControl = userProfileComponent.userDetailsFormGroup.controls['email'];
                var firstNameControl = userProfileComponent.userDetailsFormGroup.controls['firstName'];
                var lastNameControl = userProfileComponent.userDetailsFormGroup.controls['lastName'];
                formFiller_1.FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, usernameControl, newUserDetails.username);
                userProfileComponent.model.username = newUserDetails.username;
                usernameExistsResult.next(null);
                usernameExistsResult.complete();
                formFiller_1.FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, emailControl, newUserDetails.email);
                userProfileComponent.model.email = newUserDetails.email;
                formFiller_1.FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, firstNameControl, newUserDetails.firstName);
                userProfileComponent.model.firstName = newUserDetails.firstName;
                formFiller_1.FormFiller.fillFormControl(userProfileComponent.userDetailsFormGroup, lastNameControl, newUserDetails.lastName);
                userProfileComponent.model.lastName = newUserDetails.lastName;
                updateUserDetailsResult = new Subject_1.Subject();
                updateUserDetailsStub =
                    sinon_1.stub(userServiceMock, 'updateUserDetails', function () { return updateUserDetailsResult; });
                userProfileComponent.updateUserDetails();
            });
            testing_1.afterEach(function () {
                updateUserDetailsStub.restore();
            });
            testing_1.it('should call userService.updateUserDetails() correctly', function () {
                var expectedArgs = [
                    newUserDetails.id,
                    newUserDetails.username,
                    newUserDetails.email,
                    newUserDetails.firstName,
                    newUserDetails.lastName
                ];
                chai_1.expect(updateUserDetailsStub.callCount).to.be.equal(1);
                chai_1.expect(updateUserDetailsStub.args[0]).to.be.deep.equal(expectedArgs);
            });
            testing_1.it('should set updatingUserDetails to true', function () {
                chai_1.expect(userProfileComponent.updatingUserDetails).to.be.true;
            });
            testing_1.it('should set updatingUserDetailsError to null', function () {
                chai_1.expect(userProfileComponent.updatingUserDetailsError).to.be.null;
            });
            testing_1.describe('updating fails', function () {
                var error;
                testing_1.beforeEach(function () {
                    error = 'updateUserDetails error';
                    updateUserDetailsResult.error(error);
                });
                testing_1.it('should set updatingUserDetails to false', function () {
                    chai_1.expect(userProfileComponent.updatingUserDetails).to.be.false;
                });
                testing_1.it('should set updatingUserDetailsError correctly', function () {
                    chai_1.expect(userProfileComponent.updatingUserDetailsError).to.be.equal(error);
                });
            });
            testing_1.describe('updating succeeds', function () {
                testing_1.beforeEach(function () {
                    updateUserDetailsResult.next(null);
                    updateUserDetailsResult.complete();
                });
                testing_1.it('should set updatingUserDetails to false', function () {
                    chai_1.expect(userProfileComponent.updatingUserDetails).to.be.false;
                });
                testing_1.it('should set updatingUserDetailsError to null', function () {
                    chai_1.expect(userProfileComponent.updatingUserDetailsError).to.be.null;
                });
            });
        });
    });
});
//# sourceMappingURL=userProfile.component.test.js.map