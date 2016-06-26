import {HttpError} from "../errors/httpError";
import {StatusCode} from "../../../../common/statusCode";
import {
  it,
  inject,
  describe,
  beforeEach,
  beforeEachProviders,
} from '@angular/core/testing';
import { HTTP_PROVIDERS, Http, XHRBackend, Headers } from '@angular/http';

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

  describe('on UNAUTHORIZED error', () => {

    beforeEach(() => {
      var error = new HttpError();
      error.status = StatusCode.UNAUTHORIZED;

      mockBackend.connections.subscribe(
        (connection: MockConnection) => connection.mockError(error));
    });

    it('should fail correctly', () => {
      userService.signinUser('', '').subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Invalid credentials')
      );
    })

  });

  describe('on INTERNAL_SERVER_ERROR error', () => {

    beforeEach(() => {
      var error = new HttpError();
      error.status = StatusCode.INTERNAL_SERVER_ERROR;

      mockBackend.connections.subscribe(
        (connection: MockConnection) => connection.mockError(error));
    });

    it('should fail correctly', () => {
      userService.signinUser('', '').subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again.')
      );
    })

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

    it('should fail correctly', () => {
      userService.signinUser('', '').subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again.')
      );
    })

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

      it('should fail correctly', () => {
        userService.signinUser('', '').subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again.')
        );
      })

    });

    describe('with redirect-path header', () => {

      var redirectPath: string;

      beforeEach(() => {
        redirectPath = 'some redirect path';

        responseOptions.headers.append('redirect-path', redirectPath);
        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));
      });

      it('should return correct path', () => {
        userService.signinUser('', '').subscribe(
          (path: string) => expect(path).to.be.equal(redirectPath),
          () => expect(true, 'should succeed').to.be.false)
      })

    });

  });

});
