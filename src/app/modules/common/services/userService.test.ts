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
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again.')
      );
    });

    it('isUsernameExists should fail correctly', () => {
      userService.isUsernameExists('').subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again.')
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

    describe('without the user existsnce result', () => {

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

    describe('with the user existsnce result', () => {

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

  });

});
