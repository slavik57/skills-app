import {IUserPermissionRule} from "../interfaces/iUserPermissionRule";
import {IUserPermission} from "../interfaces/iUserPermission";
import {IUsernameDetails} from "../interfaces/iUsernameDetails";
import {HttpError} from "../errors/httpError";
import {StatusCode} from "../../../../common/statusCode";
import {
  it,
  inject,
  describe,
  beforeEach,
  beforeEachProviders,
} from '@angular/core/testing';
import { HTTP_PROVIDERS, Http, XHRBackend, Headers, RequestMethod } from '@angular/http';

import {provide} from '@angular/core';
import {MockBackend, MockConnection} from '@angular/http/testing';
import {Response, ResponseOptions} from '@angular/http';
import {expect} from 'chai';
import {UserService} from './userService';
import {IUserDetails} from '../interfaces/iUserDetails';

describe('UserService', () => {

  var userService: UserService;
  var mockBackend: MockBackend;

  beforeEachProviders(() => [
    HTTP_PROVIDERS,
    MockBackend,
    provide(XHRBackend, { useExisting: MockBackend }),
    UserService
  ]);

  beforeEach(inject([MockBackend, UserService], (_mockBackend: MockBackend, _userService: UserService) => {
    userService = _userService;
    mockBackend = _mockBackend;
  }));

  it('signin should use correct url', () => {
    userService.signinUser('', '');

    expect(mockBackend.connectionsArray).to.be.length(1);
    expect(mockBackend.connectionsArray[0].request.method).to.be.equal(RequestMethod.Post);
    expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/login');
  });

  it('signin should use correct body', () => {
    var username = 'some username';
    var password = 'some password';
    userService.signinUser(username, password);

    var expectedBody = JSON.stringify({
      username: username,
      password: password
    });

    expect(mockBackend.connectionsArray[0].request.getBody()).to.be.equal(expectedBody);
  });

  it('register should use correct url', () => {
    userService.registerUser('', '', '', '', '');

    expect(mockBackend.connectionsArray).to.be.length(1);
    expect(mockBackend.connectionsArray[0].request.method).to.be.equal(RequestMethod.Post);
    expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/register');
  });

  it('retister should use correct body', () => {
    var username = 'some username';
    var password = 'some password';
    var email = 'some email';
    var firstName = 'some first name';
    var lastName = 'some last name';
    userService.registerUser(username, password, email, firstName, lastName);

    var expectedBody = JSON.stringify({
      username: username,
      password: password,
      email: email,
      firstName: firstName,
      lastName: lastName
    });

    expect(mockBackend.connectionsArray[0].request.getBody()).to.be.equal(expectedBody);
  });

  it('isUsernameExists should use correct url', () => {
    var username = 'some username'
    userService.isUsernameExists(username);

    expect(mockBackend.connectionsArray).to.be.length(1);
    expect(mockBackend.connectionsArray[0].request.method).to.be.equal(RequestMethod.Get);
    expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/users/' + username + '/exists');
  });

  it('canUserUpdatePassword should use correct url', () => {
    var userId = 123;
    userService.canUserUpdatePassword(userId);

    expect(mockBackend.connectionsArray).to.be.length(1);
    expect(mockBackend.connectionsArray[0].request.method).to.be.equal(RequestMethod.Get);
    expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/user/' + userId + '/can-update-password');
  });

  it('getUserDetails should use correct url', () => {
    var username = 'some username'
    userService.getUserDetails();

    expect(mockBackend.connectionsArray).to.be.length(1);
    expect(mockBackend.connectionsArray[0].request.method).to.be.equal(RequestMethod.Get);
    expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/user/');
  });

  it('updateUserDetails should use correct url', () => {
    var id = 123;
    userService.updateUserDetails(id, '', '', '', '');

    expect(mockBackend.connectionsArray).to.be.length(1);
    expect(mockBackend.connectionsArray[0].request.method).to.be.equal(RequestMethod.Put);
    expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/user/' + id);
  });

  it('retister should use correct body', () => {
    var id = 123;
    var username = 'some username';
    var email = 'some email';
    var firstName = 'some first name';
    var lastName = 'some last name';
    userService.updateUserDetails(id, username, email, firstName, lastName);

    var expectedBody = JSON.stringify({
      username: username,
      email: email,
      firstName: firstName,
      lastName: lastName
    });

    expect(mockBackend.connectionsArray[0].request.getBody()).to.be.equal(expectedBody);
  });

  it('updateUserPassword should use correct url', () => {
    var id = 123;
    userService.updateUserPassword(id, '', '');

    expect(mockBackend.connectionsArray).to.be.length(1);
    expect(mockBackend.connectionsArray[0].request.method).to.be.equal(RequestMethod.Put);
    expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/user/' + id + '/password');
  });

  it('getUsersDetails should use correct url', () => {
    userService.getUsersDetails();

    expect(mockBackend.connectionsArray).to.be.length(1);
    expect(mockBackend.connectionsArray[0].request.method).to.be.equal(RequestMethod.Get);
    expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/users/');
  });

  it('getUserPermissions should use correct url', () => {
    var userId = 1234321;
    userService.getUserPermissions(userId);

    expect(mockBackend.connectionsArray).to.be.length(1);
    expect(mockBackend.connectionsArray[0].request.method).to.be.equal(RequestMethod.Get);
    expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/users/' + userId + '/permissions');
  });

  it('getUserPermissionsModificationRules should use correct url', () => {
    userService.getUserPermissionsModificationRules();

    expect(mockBackend.connectionsArray).to.be.length(1);
    expect(mockBackend.connectionsArray[0].request.method).to.be.equal(RequestMethod.Get);
    expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/user/permissions-modification-rules');
  });

  it('updateUserPermissions should use correct url', () => {
    var id = 123;
    userService.updateUserPermissions(id, [], []);

    expect(mockBackend.connectionsArray).to.be.length(1);
    expect(mockBackend.connectionsArray[0].request.method).to.be.equal(RequestMethod.Put);
    expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/users/' + id + '/permissions');
  });

  it('updateUserPermissions should use correct body', () => {
    var id = 123;
    var permissionsToAdd: IUserPermission[] = [
      { value: 1, name: 'name1', description: 'description1' },
      { value: 2, name: 'name2', description: 'description2' }
    ];
    var permissionsToRemove: IUserPermission[] = [
      { value: 3, name: 'name3', description: 'description3' },
      { value: 4, name: 'name4', description: 'description4' }
    ];
    userService.updateUserPermissions(id, permissionsToAdd, permissionsToRemove);

    var expectedBody = JSON.stringify({
      permissionsToAdd: [1, 2],
      permissionsToRemove: [3, 4]
    });

    expect(mockBackend.connectionsArray[0].request.getBody()).to.be.equal(expectedBody);
  });

  describe('on UNAUTHORIZED error', () => {

    beforeEach(() => {
      var error = new HttpError();
      error.status = StatusCode.UNAUTHORIZED;

      mockBackend.connections.subscribe(
        (connection: MockConnection) => connection.mockError(error));
    });

    it('signin should fail correctly', () => {
      userService.signinUser('', '').subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Invalid credentials')
      );
    });

    it('register should fail correctly', () => {
      userService.registerUser('', '', '', '', '').subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Unauthorized')
      );
    });

    it('isUsernameExists should fail correctly', () => {
      userService.isUsernameExists('').subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
      );
    });

    it('canUserUpdatePassword should fail correctly', () => {
      userService.canUserUpdatePassword(1).subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
      );
    });

    it('getUserDetails should fail correctly', () => {
      userService.getUserDetails().subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Unauthorized')
      );
    });

    it('updateUserDetails should fail correctly', () => {
      userService.updateUserDetails(1, '', '', '', '').subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Unauthorized')
      );
    });

    it('updateUserPassword should fail correctly', () => {
      userService.updateUserPassword(1, '', '').subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Unauthorized')
      );
    });

    it('getUsersDetails should fail correctly', () => {
      userService.getUsersDetails().subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Unauthorized')
      );
    });

    it('getUserPermissions should fail correctly', () => {
      userService.getUserPermissions(1).subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Unauthorized')
      );
    });

    it('getUserPermissionsModificationRules should fail correctly', () => {
      userService.getUserPermissionsModificationRules().subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Unauthorized')
      );
    });

    it('updateUserPermissions should fail correctly', () => {
      userService.updateUserPermissions(1, [], []).subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Unauthorized')
      );
    });

  });

  describe('on INTERNAL_SERVER_ERROR error', () => {

    beforeEach(() => {
      var error = new HttpError();
      error.status = StatusCode.INTERNAL_SERVER_ERROR;

      mockBackend.connections.subscribe(
        (connection: MockConnection) => connection.mockError(error));
    });

    it('signin should fail correctly', () => {
      userService.signinUser('', '').subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
      );
    });

    it('register should fail correctly', () => {
      userService.registerUser('', '', '', '', '').subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
      );
    });

    it('isUsernameExists should fail correctly', () => {
      userService.isUsernameExists('').subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
      );
    });

    it('canUserUpdatePassword should fail correctly', () => {
      userService.canUserUpdatePassword(1).subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
      );
    });

    it('getUserDetails should fail correctly', () => {
      userService.getUserDetails().subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
      );
    });

    it('updateUserDetails should fail correctly', () => {
      userService.updateUserDetails(1, '', '', '', '').subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
      );
    });

    it('updateUserPassword should fail correctly', () => {
      userService.updateUserPassword(1, '', '').subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
      );
    });

    it('getUsersDetails should fail correctly', () => {
      userService.getUsersDetails().subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
      );
    });

    it('getUserPermissions should fail correctly', () => {
      userService.getUserPermissions(1).subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
      );
    });

    it('getUserPermissionsModificationRules should fail correctly', () => {
      userService.getUserPermissionsModificationRules().subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
      );
    });

    it('updateUserPermissions should fail correctly', () => {
      userService.updateUserPermissions(1, [], []).subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
      );
    });

  });

  describe('on error with failing json method', () => {

    beforeEach(() => {
      var error = new HttpError();
      error.json = () => { throw 'fail to parse'; }
      error.status = StatusCode.NOT_FOUND;

      mockBackend.connections.subscribe(
        (connection: MockConnection) => connection.mockError(error));
    });

    it('signin should fail correctly', () => {
      userService.signinUser('', '').subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
      );
    });

    it('register should fail correctly', () => {
      userService.registerUser('', '', '', '', '').subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
      );
    });

    it('isUsernameExists should fail correctly', () => {
      userService.isUsernameExists('').subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
      );
    });

    it('canUserUpdatePassword should fail correctly', () => {
      userService.canUserUpdatePassword(1).subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
      );
    });

    it('getUserDetails should fail correctly', () => {
      userService.getUserDetails().subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
      );
    });

    it('updateUserDetails should fail correctly', () => {
      userService.updateUserDetails(1, '', '', '', '').subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
      );
    });

    it('updateUserPassword should fail correctly', () => {
      userService.updateUserPassword(1, '', '').subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
      );
    });

    it('getUsersDetails should fail correctly', () => {
      userService.getUsersDetails().subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
      );
    });

    it('getUserPermissions should fail correctly', () => {
      userService.getUserPermissions(1).subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
      );
    });

    it('getUserPermissionsModificationRules should fail correctly', () => {
      userService.getUserPermissionsModificationRules().subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
      );
    });

    it('updateUserPermissions should fail correctly', () => {
      userService.updateUserPermissions(1, [], []).subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
      );
    });

  });

  describe('on success with UNAUTHORIZED', () => {

    beforeEach(() => {
      var responseOptions = new ResponseOptions({
        status: StatusCode.UNAUTHORIZED
      })

      var response = new Response(responseOptions);

      mockBackend.connections.subscribe(
        (connection: MockConnection) => connection.mockRespond(response));
    });

    it('signin should fail correctly', () => {
      userService.signinUser('', '').subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
      );
    });

    it('register should fail correctly', () => {
      userService.registerUser('', '', '', '', '').subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
      );
    });

    it('isUsernameExists should fail correctly', () => {
      userService.isUsernameExists('').subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
      );
    });

    it('canUserUpdatePassword should fail correctly', () => {
      userService.canUserUpdatePassword(1).subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
      );
    });

    it('getUserDetails should fail correctly', () => {
      userService.getUserDetails().subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
      );
    });

    it('updateUserDetails should fail correctly', () => {
      userService.updateUserDetails(1, '', '', '', '').subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
      );
    });

    it('updateUserPassword should fail correctly', () => {
      userService.updateUserPassword(1, '', '').subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
      );
    });

    it('getUsersDetails should fail correctly', () => {
      userService.getUsersDetails().subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
      );
    });

    it('getUserPermissions should fail correctly', () => {
      userService.getUserPermissions(1).subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
      );
    });

    it('getUserPermissionsModificationRules should fail correctly', () => {
      userService.getUserPermissionsModificationRules().subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
      );
    });

    it('updateUserPermissions should fail correctly', () => {
      userService.updateUserPermissions(1, [], []).subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
      );
    });

  });

  describe('on error with error description', () => {

    var reasonForError: string;

    beforeEach(() => {
      reasonForError = 'some reason';

      var error = new HttpError();
      error.body = { error: reasonForError };

      mockBackend.connections.subscribe(
        (connection: MockConnection) => connection.mockError(error));
    });

    it('register should fail correctly', () => {
      userService.registerUser('', '', '', '', '').subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal(reasonForError)
      );
    });

    it('updateUserDetails should fail correctly', () => {
      userService.updateUserDetails(1, '', '', '', '').subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal(reasonForError)
      );
    });

    it('updateUserPassword should fail correctly', () => {
      userService.updateUserDetails(1, '', '', '', '').subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal(reasonForError)
      );
    });

  });

  describe('on success with OK', () => {

    var responseOptions: ResponseOptions;
    var response: Response;

    beforeEach(() => {
      responseOptions = new ResponseOptions({
        status: StatusCode.OK,
        headers: new Headers()
      })

      response = new Response(responseOptions);
    });

    it('updateUserDetails should succeed', () => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => connection.mockRespond(response));

      var wasResolved = false;
      userService.updateUserDetails(1, '', '', '', '').subscribe(
        () => { wasResolved = true; },
        () => expect(true, 'should succeed').to.be.false);

      expect(wasResolved).to.be.true;
    });

    it('updateUserPassword should succeed', () => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => connection.mockRespond(response));

      var wasResolved = false;
      userService.updateUserPassword(1, '', '').subscribe(
        () => { wasResolved = true; },
        () => expect(true, 'should succeed').to.be.false);

      expect(wasResolved).to.be.true;
    });

    describe('signin/register', () => {

      describe('without redirect-path header', () => {

        beforeEach(() => {
          mockBackend.connections.subscribe(
            (connection: MockConnection) => connection.mockRespond(response));
        });

        it('sigin should fail correctly', () => {
          userService.signinUser('', '').subscribe(
            () => expect(true, 'should fail').to.be.false,
            (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
          );
        });

        it('register should fail correctly', () => {
          userService.registerUser('', '', '', '', '').subscribe(
            () => expect(true, 'should fail').to.be.false,
            (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
          );
        });

      });

      describe('with redirect-path header', () => {

        var redirectPath: string;

        beforeEach(() => {
          redirectPath = 'some redirect path';

          responseOptions.headers.append('redirect-path', redirectPath);
          mockBackend.connections.subscribe(
            (connection: MockConnection) => connection.mockRespond(response));
        });

        it('signin should return correct path', () => {
          userService.signinUser('', '').subscribe(
            (path: string) => expect(path).to.be.equal(redirectPath),
            () => expect(true, 'should succeed').to.be.false)
        });

        it('register should return correct path', () => {
          userService.registerUser('', '', '', '', '').subscribe(
            (path: string) => expect(path).to.be.equal(redirectPath),
            () => expect(true, 'should succeed').to.be.false)
        });

      });

    });

    describe('isUsernameExists', () => {

      it('without the user existance result isUsernameExists should fail correctly', () => {
        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        userService.isUsernameExists('').subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
        );
      });

      it('with the user existance result isUsernameExists should return correct value', () => {
        var result = true;

        responseOptions = new ResponseOptions({
          status: StatusCode.OK,
          headers: new Headers(),
          body: { userExists: result }
        });

        response = new Response(responseOptions);

        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        userService.isUsernameExists('').subscribe(
          (_result: boolean) => expect(_result).to.be.equal(result),
          () => expect(true, 'should succeed').to.be.false)
      });

    });

    describe('canUserUpdatePassword', () => {

      it('without the expected result canUserUpdatePassword should fail correctly', () => {
        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        userService.canUserUpdatePassword(1).subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
        );
      });

      it('with the expected result canUserUpdatePassword should return correct value', () => {
        var result = true;

        responseOptions = new ResponseOptions({
          status: StatusCode.OK,
          headers: new Headers(),
          body: { canUpdatePassword: result }
        });

        response = new Response(responseOptions);

        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        userService.canUserUpdatePassword(1).subscribe(
          (_result: boolean) => expect(_result).to.be.equal(result),
          () => expect(true, 'should succeed').to.be.false)
      });

    });

    describe('getUserDetails', () => {

      it('without the user details result getUserDetails should fail correctly', () => {
        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        userService.getUserDetails().subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
        );
      });

      it('with partial user details result getUserDetails should fail correctly', () => {
        var result: IUserDetails = {
          id: 1,
          username: 'some username',
          email: 'some email',
          firstName: 'some name',
          lastName: 'some last name'
        };

        delete result.lastName;

        responseOptions = new ResponseOptions({
          status: StatusCode.OK,
          headers: new Headers(),
          body: result
        });

        response = new Response(responseOptions);

        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        userService.getUserDetails().subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
        );
      });

      it('with the user details result and some fields empty getUserDetails should return correct value', () => {
        var result = {
          id: 1,
          username: 'some username',
          email: null,
          firstName: '',
          lastName: 'some last name'
        };

        responseOptions = new ResponseOptions({
          status: StatusCode.OK,
          headers: new Headers(),
          body: result
        });

        response = new Response(responseOptions);

        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        userService.getUserDetails().subscribe(
          (_result: IUserDetails) => expect(_result).to.be.deep.equal(result),
          () => expect(true, 'should succeed').to.be.false)
      });

      it('with the user details result getUserDetails should return correct value', () => {
        var result = {
          id: 1,
          username: 'some username',
          email: 'some email',
          firstName: 'some name',
          lastName: 'some last name'
        };

        responseOptions = new ResponseOptions({
          status: StatusCode.OK,
          headers: new Headers(),
          body: result
        });

        response = new Response(responseOptions);

        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        userService.getUserDetails().subscribe(
          (_result: IUserDetails) => expect(_result).to.be.deep.equal(result),
          () => expect(true, 'should succeed').to.be.false)
      });

      it('without email in the user details result getUserDetails should return correct user details', () => {
        var result = {
          id: 1,
          username: 'some username',
          email: 'some email',
          firstName: 'some name',
          lastName: 'some last name'
        };

        delete result.email;

        responseOptions = new ResponseOptions({
          status: StatusCode.OK,
          headers: new Headers(),
          body: result
        });

        response = new Response(responseOptions);

        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        userService.getUserDetails().subscribe(
          (_result: IUserDetails) => expect(_result).to.be.deep.equal(result),
          () => expect(true, 'should succeed').to.be.false);
      });

    });

    describe('getUsersDetails', () => {

      it('without the user details result getUsersDetails should fail correctly', () => {
        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        userService.getUsersDetails().subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
        );
      });

      it('with partial user details result getUsersDetails should fail correctly', () => {
        var result: IUsernameDetails = {
          id: 1,
          username: 'some username'
        };

        delete result.username;

        responseOptions = new ResponseOptions({
          status: StatusCode.OK,
          headers: new Headers(),
          body: [result]
        });

        response = new Response(responseOptions);

        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        userService.getUsersDetails().subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
        );
      });

      it('with the user details result and empty username getUsersDetails should return fail correctly', () => {
        var result: IUsernameDetails = {
          id: 1,
          username: '',
        };

        responseOptions = new ResponseOptions({
          status: StatusCode.OK,
          headers: new Headers(),
          body: [result]
        });

        response = new Response(responseOptions);

        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        userService.getUsersDetails().subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
        );
      });

      it('with the user details result and null id getUsersDetails should return fail correctly', () => {
        var result: IUsernameDetails = {
          id: null,
          username: 'some username',
        };

        responseOptions = new ResponseOptions({
          status: StatusCode.OK,
          headers: new Headers(),
          body: [result]
        });

        response = new Response(responseOptions);

        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        userService.getUsersDetails().subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
        );
      });

      it('with the user details result getUsersDetails should return correct value', () => {
        var result: IUsernameDetails[] = [
          {
            id: 1,
            username: 'some username',
          },
          {
            id: 2,
            username: 'some other username',
          }
        ];

        responseOptions = new ResponseOptions({
          status: StatusCode.OK,
          headers: new Headers(),
          body: result
        });

        response = new Response(responseOptions);

        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        userService.getUsersDetails().subscribe(
          (_result: IUsernameDetails[]) => expect(_result).to.be.deep.equal(result),
          () => expect(true, 'should succeed').to.be.false)
      });


    });

    describe('getUserPermissions', () => {

      it('without the permissions result getUserPermissions should fail correctly', () => {
        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        userService.getUserPermissions(1).subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
        );
      });

      it('with empty user permissions result getUserPermissions should return correct value', () => {
        var result = [];

        responseOptions = new ResponseOptions({
          status: StatusCode.OK,
          headers: new Headers(),
          body: result
        });

        response = new Response(responseOptions);

        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        userService.getUserPermissions(1).subscribe(
          (_result: IUserPermission[]) => expect(_result).to.be.deep.equal(result),
          () => expect(true, 'should succeed').to.be.false)
      });

      it('with the user permissions result getUserPermissions should return correct value', () => {
        var result: IUserPermission[] = [
          { value: 0, name: 'a', description: 'a description' },
          { value: 1, name: 'b', description: 'b description' },
          { value: 2, name: 'c', description: 'c description' }
        ];

        responseOptions = new ResponseOptions({
          status: StatusCode.OK,
          headers: new Headers(),
          body: result
        });

        response = new Response(responseOptions);

        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        userService.getUserPermissions(1).subscribe(
          (_result: IUserPermission[]) => expect(_result).to.be.deep.equal(result),
          () => expect(true, 'should succeed').to.be.false)
      });

    });

    describe('getUserPermissionsModificationRules', () => {

      it('without the permissions rules result getUserPermissionsModificationRules should fail correctly', () => {
        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        userService.getUserPermissionsModificationRules().subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
        );
      });

      it('with empty user permissions rules result getUserPermissionsModificationRules should return correct value', () => {
        var result = [];

        responseOptions = new ResponseOptions({
          status: StatusCode.OK,
          headers: new Headers(),
          body: result
        });

        response = new Response(responseOptions);

        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        userService.getUserPermissionsModificationRules().subscribe(
          (_result: IUserPermission[]) => expect(_result).to.be.deep.equal(result),
          () => expect(true, 'should succeed').to.be.false)
      });

      it('with the user permissions rules result getUserPermissionsModificationRules should return correct value', () => {
        var result: IUserPermissionRule[] = [
          { value: 0, name: 'a', description: 'a description', allowedToChange: true },
          { value: 1, name: 'b', description: 'b description', allowedToChange: false },
          { value: 2, name: 'c', description: 'c description', allowedToChange: true }
        ];

        responseOptions = new ResponseOptions({
          status: StatusCode.OK,
          headers: new Headers(),
          body: result
        });

        response = new Response(responseOptions);

        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        userService.getUserPermissionsModificationRules().subscribe(
          (_result: IUserPermissionRule[]) => expect(_result).to.be.deep.equal(result),
          () => expect(true, 'should succeed').to.be.false)
      });

    });

    it('updateUserPermissions should succeed', () => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => connection.mockRespond(response));

      var wasResolved = false;
      userService.updateUserPermissions(1, [], []).subscribe(
        () => { wasResolved = true; },
        () => expect(true, 'should succeed').to.be.false);

      expect(wasResolved).to.be.true;
    });

  });

});
