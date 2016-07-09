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
import {IUserDetails, UserService} from './userService';

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
    expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/user/' + username + '/exists');
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
        (error) => expect(error).to.be.equal('Anauthorized performing the operation.')
      );
    });

    it('isUsernameExists should fail correctly', () => {
      userService.isUsernameExists('').subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again.')
      );
    });

    it('getUserDetails should fail correctly', () => {
      userService.getUserDetails().subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Unauthorized getting user details.')
      );
    });

    it('updateUserDetails should fail correctly', () => {
      userService.updateUserDetails(1, '', '', '', '').subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Anauthorized performing the operation.')
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
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again.')
      );
    });

    it('register should fail correctly', () => {
      userService.registerUser('', '', '', '', '').subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again.')
      );
    });

    it('isUsernameExists should fail correctly', () => {
      userService.isUsernameExists('').subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again.')
      );
    });

    it('getUserDetails should fail correctly', () => {
      userService.getUserDetails().subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again.')
      );
    });

    it('updateUserDetails should fail correctly', () => {
      userService.updateUserDetails(1, '', '', '', '').subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again.')
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
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again.')
      );
    });

    it('register should fail correctly', () => {
      userService.registerUser('', '', '', '', '').subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again.')
      );
    });

    it('isUsernameExists should fail correctly', () => {
      userService.isUsernameExists('').subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again.')
      );
    });

    it('getUserDetails should fail correctly', () => {
      userService.getUserDetails().subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again.')
      );
    });

    it('updateUserDetails should fail correctly', () => {
      userService.updateUserDetails(1, '', '', '', '').subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again.')
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

    describe('without redirect-path header', () => {

      beforeEach(() => {
        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));
      });

      it('sigin should fail correctly', () => {
        userService.signinUser('', '').subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again.')
        );
      });

      it('register should fail correctly', () => {
        userService.registerUser('', '', '', '', '').subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again.')
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

    describe('without the user existance result', () => {

      beforeEach(() => {
        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));
      });

      it('isUsernameExists should fail correctly', () => {
        userService.isUsernameExists('').subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again.')
        );
      });

    });

    describe('with the user existance result', () => {

      var result: boolean;

      beforeEach(() => {
        result = true;

        responseOptions = new ResponseOptions({
          status: StatusCode.OK,
          headers: new Headers(),
          body: { userExists: result }
        });

        response = new Response(responseOptions);

        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));
      });

      it('isUsernameExists should return correct value', () => {
        userService.isUsernameExists('').subscribe(
          (_result: boolean) => expect(_result).to.be.equal(result),
          () => expect(true, 'should succeed').to.be.false)
      });

    });

    describe('without the user details result', () => {

      beforeEach(() => {
        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));
      });

      it('getUserDetails should fail correctly', () => {
        userService.getUserDetails().subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again.')
        );
      });

    });

    describe('with partial user details result', () => {

      var result: IUserDetails;

      beforeEach(() => {
        result = {
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
      });

      it('getUserDetails should fail correctly', () => {
        userService.getUserDetails().subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again.')
        );
      });

    });

    describe('with the user details result and some fields empty', () => {

      var result: IUserDetails;

      beforeEach(() => {
        result = {
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
      });

      it('getUserDetails should return correct value', () => {
        userService.getUserDetails().subscribe(
          (_result: IUserDetails) => expect(_result).to.be.deep.equal(result),
          () => expect(true, 'should succeed').to.be.false)
      });

    });

    describe('with the user details result', () => {

      var result: IUserDetails;

      beforeEach(() => {
        result = {
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
      });

      it('getUserDetails should return correct value', () => {
        userService.getUserDetails().subscribe(
          (_result: IUserDetails) => expect(_result).to.be.deep.equal(result),
          () => expect(true, 'should succeed').to.be.false)
      });

    });

    describe('without email in the user details result', () => {

      var result: IUserDetails;

      beforeEach(() => {
        result = {
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
      });

      it('getUserDetails should return correct user details', () => {
        userService.getUserDetails().subscribe(
          (_result: IUserDetails) => expect(_result).to.be.deep.equal(result),
          () => expect(true, 'should succeed').to.be.false);
      });

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

  });

});
