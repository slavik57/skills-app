import {ITeamNameDetails} from "../interfaces/iTeamNameDetails";
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
import {TeamService} from './teamService';

describe('TeamService', () => {

  var teamService: TeamService;
  var mockBackend: MockBackend;

  beforeEachProviders(() => [
    HTTP_PROVIDERS,
    MockBackend,
    provide(XHRBackend, { useExisting: MockBackend }),
    TeamService
  ]);

  beforeEach(inject([MockBackend, TeamService], (_mockBackend: MockBackend, _teamService: TeamService) => {
    teamService = _teamService;
    mockBackend = _mockBackend;
  }));

  it('getTeamsDetails should use correct url', () => {
    teamService.getTeamsDetails();

    expect(mockBackend.connectionsArray).to.be.length(1);
    expect(mockBackend.connectionsArray[0].request.method).to.be.equal(RequestMethod.Get);
    expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/teams/');
  });

  function shouldFaildWithError(error: any, beforeEachFunc: () => void): any {

    return () => {

      beforeEach(beforeEachFunc);

      it('getTeamsDetails should fail correctly', () => {
        teamService.getTeamsDetails().subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal(error)
        );
      });

    };
  }

  describe('on UNAUTHORIZED error',
    shouldFaildWithError('Unauthorized', () => {
      var error = new HttpError();
      error.status = StatusCode.UNAUTHORIZED;

      mockBackend.connections.subscribe(
        (connection: MockConnection) => connection.mockError(error));
    })
  );

  describe('on INTERNAL_SERVER_ERROR error',
    shouldFaildWithError('Oops. Something went wrong. Please try again', () => {
      var error = new HttpError();
      error.status = StatusCode.INTERNAL_SERVER_ERROR;

      mockBackend.connections.subscribe(
        (connection: MockConnection) => connection.mockError(error));
    })
  );

  describe('on error with failing json method',
    shouldFaildWithError('Oops. Something went wrong. Please try again', () => {
      var error = new HttpError();
      error.json = () => { throw 'fail to parse'; }
      error.status = StatusCode.NOT_FOUND;

      mockBackend.connections.subscribe(
        (connection: MockConnection) => connection.mockError(error));
    })
  );

  describe('on error with failing json method',
    shouldFaildWithError('Oops. Something went wrong. Please try again', () => {
      var responseOptions = new ResponseOptions({
        status: StatusCode.UNAUTHORIZED
      })

      var response = new Response(responseOptions);

      mockBackend.connections.subscribe(
        (connection: MockConnection) => connection.mockRespond(response));
    })
  );

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

    describe('getTeamsDetails', () => {

      it('without the teams details result getTeamsDetails should fail correctly', () => {
        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        teamService.getTeamsDetails().subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
        );
      });

      it('with partial teams details result getTeamsDetails should fail correctly', () => {
        var result: ITeamNameDetails = {
          id: 1,
          teamName: 'some username'
        };

        delete result.teamName;

        responseOptions = new ResponseOptions({
          status: StatusCode.OK,
          headers: new Headers(),
          body: [result]
        });

        response = new Response(responseOptions);

        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        teamService.getTeamsDetails().subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
        );
      });

      it('with the teams details result and empty teamName getTeamsDetails should fail correctly', () => {
        var result: ITeamNameDetails = {
          id: 1,
          teamName: '',
        };

        responseOptions = new ResponseOptions({
          status: StatusCode.OK,
          headers: new Headers(),
          body: [result]
        });

        response = new Response(responseOptions);

        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        teamService.getTeamsDetails().subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
        );
      });

      it('with the teams details result and null id getTeamsDetails should return fail correctly', () => {
        var result: ITeamNameDetails = {
          id: null,
          teamName: 'some team name',
        };

        responseOptions = new ResponseOptions({
          status: StatusCode.OK,
          headers: new Headers(),
          body: [result]
        });

        response = new Response(responseOptions);

        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        teamService.getTeamsDetails().subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
        );
      });

      it('with the teams details result getTeamsDetails should return correct value', () => {
        var result: ITeamNameDetails[] = [
          {
            id: 1,
            teamName: 'some team name',
          },
          {
            id: 2,
            teamName: 'some other team name',
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

        teamService.getTeamsDetails().subscribe(
          (_result: ITeamNameDetails[]) => expect(_result).to.be.deep.equal(result),
          () => expect(true, 'should succeed').to.be.false)
      });

    });

  });

});
