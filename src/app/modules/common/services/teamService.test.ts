import {ITeamMemberDetails} from "../interfaces/iTeamMemberDetails";
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

  it('isTeamExists should use correct url', () => {
    var teamName = 'some team name'
    teamService.isTeamExists(teamName);

    expect(mockBackend.connectionsArray).to.be.length(1);
    expect(mockBackend.connectionsArray[0].request.method).to.be.equal(RequestMethod.Get);
    expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/teams/' + teamName + '/exists');
  });

  describe('createTeam', () => {

    var teamName: string;

    beforeEach(() => {
      teamName = 'some team name';
      teamService.createTeam(teamName);
    });

    it('should use correct url', () => {
      expect(mockBackend.connectionsArray).to.be.length(1);
      expect(mockBackend.connectionsArray[0].request.method).to.be.equal(RequestMethod.Post);
      expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/teams/');
    });

    it('should use correct body', () => {
      var expectedBody = JSON.stringify({
        name: teamName
      });

      expect(mockBackend.connectionsArray[0].request.getBody()).to.be.equal(expectedBody);
    });

  });

  it('deleteTeam should use correct url', () => {
    var teamId = 123;
    teamService.deleteTeam(teamId);

    expect(mockBackend.connectionsArray).to.be.length(1);
    expect(mockBackend.connectionsArray[0].request.method).to.be.equal(RequestMethod.Delete);
    expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/teams/' + teamId);
  });

  describe('updateTeamName', () => {

    var teamId: number;
    var newTeamName: string;

    beforeEach(() => {
      teamId = 1234321;
      newTeamName = 'new team name';

      teamService.updateTeamName(teamId, newTeamName);
    });

    it('should use correct url', () => {
      expect(mockBackend.connectionsArray).to.be.length(1);
      expect(mockBackend.connectionsArray[0].request.method).to.be.equal(RequestMethod.Put);
      expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/teams/' + teamId);
    });

    it('should use correct body', () => {
      var expectedBody = JSON.stringify({
        name: newTeamName
      });

      expect(mockBackend.connectionsArray[0].request.getBody()).to.be.equal(expectedBody);
    });

  });

  it('getTeamMembers should use correct url', () => {
    var teamId = 123321;
    teamService.getTeamMembers(teamId);

    expect(mockBackend.connectionsArray).to.be.length(1);
    expect(mockBackend.connectionsArray[0].request.method).to.be.equal(RequestMethod.Get);
    expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/teams/' + teamId + '/members');
  });

  describe('addTeamMember', () => {

    var teamId: number;
    var username: string;

    beforeEach(() => {
      teamId = 789;
      username = 'some username';
      teamService.addTeamMember(teamId, username);
    });

    it('should use correct url', () => {
      expect(mockBackend.connectionsArray).to.be.length(1);
      expect(mockBackend.connectionsArray[0].request.method).to.be.equal(RequestMethod.Post);
      expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/teams/' + teamId + '/members');
    });

    it('should use correct body', () => {
      var expectedBody = JSON.stringify({
        username: username
      });

      expect(mockBackend.connectionsArray[0].request.getBody()).to.be.equal(expectedBody);
    });

  });

  describe('removeTeamMember', () => {

    var teamId: number;
    var userId: number;

    beforeEach(() => {
      teamId = 789;
      userId = 111222;
      teamService.removeTeamMember(teamId, userId);
    });

    it('should use correct url', () => {
      expect(mockBackend.connectionsArray).to.be.length(1);
      expect(mockBackend.connectionsArray[0].request.method).to.be.equal(RequestMethod.Delete);
      expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/teams/' + teamId + '/members');
    });

    it('should use correct body', () => {
      var expectedBody = JSON.stringify({
        userId: userId
      });

      expect(mockBackend.connectionsArray[0].request.getBody()).to.be.equal(expectedBody);
    });

  });

  describe('changeTeamAdminRights', () => {

    var teamId: number;
    var userId: number;
    var isAdmin: boolean;

    beforeEach(() => {
      teamId = 789;
      userId = 123456;
      isAdmin = true;
      teamService.changeTeamAdminRights(teamId, userId, isAdmin);
    });

    it('should use correct url', () => {
      expect(mockBackend.connectionsArray).to.be.length(1);
      expect(mockBackend.connectionsArray[0].request.method).to.be.equal(RequestMethod.Patch);
      expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/teams/' + teamId + '/members/' + userId + '/admin');
    });

    it('should use correct body', () => {
      var expectedBody = JSON.stringify({
        isAdmin: isAdmin
      });

      expect(mockBackend.connectionsArray[0].request.getBody()).to.be.equal(expectedBody);
    });

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

      it('isTeamExists should fail correctly', () => {
        teamService.isTeamExists('some team name').subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal(error)
        );
      });

      it('createTeam should fail correctly', () => {
        teamService.createTeam('').subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal(error)
        );
      });

      it('deleteTeam should fail correctly', () => {
        teamService.deleteTeam(123).subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal(error)
        );
      });

      it('updateTeamName should fail correctly', () => {
        teamService.updateTeamName(123, 'new team name').subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal(error)
        );
      });

      it('addTeamMember should fail correctly', () => {
        teamService.addTeamMember(1, '').subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal(error)
        );
      });

      it('removeTeamMember should fail correctly', () => {
        teamService.removeTeamMember(123, 456).subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal(error)
        );
      });

      it('changeTeamAdminRights should fail correctly', () => {
        teamService.changeTeamAdminRights(123, 456, true).subscribe(
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

  describe('on error with error description', () => {

    var reasonForError: string;

    beforeEach(() => {
      reasonForError = 'some reason';

      var error = new HttpError();
      error.body = { error: reasonForError };

      mockBackend.connections.subscribe(
        (connection: MockConnection) => connection.mockError(error));
    });

    it('createTeam should fail correctly', () => {
      teamService.createTeam('').subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal(reasonForError)
      );
    });

    it('addTeamMember should fail correctly', () => {
      teamService.addTeamMember(1, '').subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal(reasonForError)
      );
    });

  });

  describe('on success with OK', () => {

    var responseOptions: ResponseOptions;

    beforeEach(() => {
      responseOptions = new ResponseOptions({
        status: StatusCode.OK,
        headers: new Headers()
      })
    });

    describe('getTeamsDetails', () => {

      it('without the teams details result getTeamsDetails should fail correctly', () => {
        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(new Response(responseOptions)));

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

        var response = new Response(responseOptions);

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

        var response = new Response(responseOptions);

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

        var response = new Response(responseOptions);

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

        var response = new Response(responseOptions);

        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        teamService.getTeamsDetails().subscribe(
          (_result: ITeamNameDetails[]) => expect(_result).to.be.deep.equal(result),
          () => expect(true, 'should succeed').to.be.false)
      });

    });

    describe('isTeamExists', () => {

      it('without the team existance result isTeamExists should fail correctly', () => {
        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(new Response(responseOptions)));

        teamService.isTeamExists('').subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
        );
      });

      it('with the team existance result isTeamExists should return correct value', () => {
        var result = true;

        responseOptions = new ResponseOptions({
          status: StatusCode.OK,
          headers: new Headers(),
          body: { teamExists: result }
        });

        var response = new Response(responseOptions);

        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        teamService.isTeamExists('').subscribe(
          (_result: boolean) => expect(_result).to.be.equal(result),
          () => expect(true, 'should succeed').to.be.false)
      });

    });

    describe('createTeam', () => {

      describe('without team details', () => {

        beforeEach(() => {
          mockBackend.connections.subscribe(
            (connection: MockConnection) => connection.mockRespond(new Response(responseOptions)));
        });

        it('createTeam should fail correctly', () => {
          teamService.createTeam('').subscribe(
            () => expect(true, 'should fail').to.be.false,
            (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
          );
        });

      });

      describe('with team details', () => {

        var teamDetails: ITeamNameDetails;

        beforeEach(() => {
          teamDetails = {
            teamName: 'some team name',
            id: 1234
          }

          responseOptions.body = teamDetails;

          var response = new Response(responseOptions);

          mockBackend.connections.subscribe(
            (connection: MockConnection) => connection.mockRespond(response));
        });

        it('crateTeam should return correct team details', () => {
          teamService.createTeam('').subscribe(
            (_details: ITeamNameDetails) => expect(_details).to.deep.equal(teamDetails),
            () => expect(true, 'should succeed').to.be.false)
        });

      });

    });

    describe('deleteTeam', () => {

      it('should succeed', () => {
        responseOptions = new ResponseOptions({
          status: StatusCode.OK,
          headers: new Headers(),
        });

        var response = new Response(responseOptions);

        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        var wasResolved = false;
        teamService.deleteTeam(1234).subscribe(
          () => wasResolved = true,
          () => expect(true, 'should succeed').to.be.false);

        expect(wasResolved).to.be.true;
      });

    });

    describe('updateTeamName', () => {

      describe('without team details', () => {

        beforeEach(() => {
          mockBackend.connections.subscribe(
            (connection: MockConnection) => connection.mockRespond(new Response(responseOptions)));
        });

        it('should fail correctly', () => {
          teamService.updateTeamName(123, 'new team name').subscribe(
            () => expect(true, 'should fail').to.be.false,
            (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
          );
        });

      });

      describe('with team details', () => {

        var teamDetails: ITeamNameDetails;

        beforeEach(() => {
          teamDetails = {
            teamName: 'some team name',
            id: 1234
          }

          responseOptions.body = teamDetails;

          var response = new Response(responseOptions);

          mockBackend.connections.subscribe(
            (connection: MockConnection) => connection.mockRespond(response));
        });

        it('should return correct team details', () => {
          teamService.updateTeamName(teamDetails.id, teamDetails.teamName).subscribe(
            (_details: ITeamNameDetails) => expect(_details).to.deep.equal(teamDetails),
            () => expect(true, 'should succeed').to.be.false)
        });

      });

    });

    describe('getTeamMembers', () => {

      it('without the users details result should fail correctly', () => {
        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(new Response(responseOptions)));

        teamService.getTeamMembers(123).subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
        );
      });

      it('without username should fail correctly', () => {
        var result: ITeamMemberDetails = {
          id: 1,
          username: 'some username',
          isAdmin: true
        };

        delete result.username;

        responseOptions = new ResponseOptions({
          status: StatusCode.OK,
          headers: new Headers(),
          body: [result]
        });

        var response = new Response(responseOptions);

        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        teamService.getTeamMembers(12321).subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
        );
      });

      it('without id should fail correctly', () => {
        var result: ITeamMemberDetails = {
          id: 1,
          username: 'some username',
          isAdmin: true
        };

        delete result.id;

        responseOptions = new ResponseOptions({
          status: StatusCode.OK,
          headers: new Headers(),
          body: [result]
        });

        var response = new Response(responseOptions);

        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        teamService.getTeamMembers(12321).subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
        );
      });

      it('without isAdmin should fail correctly', () => {
        var result: ITeamMemberDetails = {
          id: 1,
          username: 'some username',
          isAdmin: true
        };

        delete result.isAdmin;

        responseOptions = new ResponseOptions({
          status: StatusCode.OK,
          headers: new Headers(),
          body: [result]
        });

        var response = new Response(responseOptions);

        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        teamService.getTeamMembers(12321).subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
        );
      });

      it('with the users details result and empty username should fail correctly', () => {
        var result: ITeamMemberDetails = {
          id: 1,
          username: '',
          isAdmin: true
        };

        responseOptions = new ResponseOptions({
          status: StatusCode.OK,
          headers: new Headers(),
          body: [result]
        });

        var response = new Response(responseOptions);

        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        teamService.getTeamMembers(12321).subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
        );
      });

      it('with the users details result and null id should return fail correctly', () => {
        var result: ITeamMemberDetails = {
          id: null,
          username: 'some username',
          isAdmin: true
        };

        responseOptions = new ResponseOptions({
          status: StatusCode.OK,
          headers: new Headers(),
          body: [result]
        });

        var response = new Response(responseOptions);

        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        teamService.getTeamMembers(11).subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
        );
      });

      it('with the users details result should return correct value', () => {
        var result: ITeamMemberDetails[] = [
          {
            id: 1,
            username: 'some username',
            isAdmin: true
          },
          {
            id: 2,
            username: 'some other username',
            isAdmin: false
          }
        ];

        responseOptions = new ResponseOptions({
          status: StatusCode.OK,
          headers: new Headers(),
          body: result
        });

        var response = new Response(responseOptions);

        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        teamService.getTeamMembers(111).subscribe(
          (_result: ITeamMemberDetails[]) => expect(_result).to.be.deep.equal(result),
          () => expect(true, 'should succeed').to.be.false)
      });

    });

    describe('addTeamMember', () => {

      describe('without team member details', () => {

        beforeEach(() => {
          mockBackend.connections.subscribe(
            (connection: MockConnection) => connection.mockRespond(new Response(responseOptions)));
        });

        it('should fail correctly', () => {
          teamService.addTeamMember(1, '').subscribe(
            () => expect(true, 'should fail').to.be.false,
            (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
          );
        });

      });

      describe('with team member details', () => {

        var teamMemberDetails: ITeamMemberDetails;

        beforeEach(() => {
          teamMemberDetails = {
            id: 1234,
            username: 'some username',
            isAdmin: true
          }

          responseOptions.body = teamMemberDetails;

          var response = new Response(responseOptions);

          mockBackend.connections.subscribe(
            (connection: MockConnection) => connection.mockRespond(response));
        });

        it('should return correct team details', () => {
          teamService.addTeamMember(1, '').subscribe(
            (_details: ITeamMemberDetails) => expect(_details).to.deep.equal(teamMemberDetails),
            () => expect(true, 'should succeed').to.be.false)
        });

      });

    });

    describe('removeTeamMember', () => {

      it('should succeed', () => {
        responseOptions = new ResponseOptions({
          status: StatusCode.OK,
          headers: new Headers(),
        });

        var response = new Response(responseOptions);

        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        var wasResolved = false;
        teamService.removeTeamMember(1234, 5678).subscribe(
          () => wasResolved = true,
          () => expect(true, 'should succeed').to.be.false);

        expect(wasResolved).to.be.true;
      });

    });

    describe('changeTeamAdminRights', () => {

      it('should succeed', () => {
        responseOptions = new ResponseOptions({
          status: StatusCode.OK,
          headers: new Headers(),
        });

        var response = new Response(responseOptions);

        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        var wasResolved = false;
        teamService.changeTeamAdminRights(1234, 5678, true).subscribe(
          () => wasResolved = true,
          () => expect(true, 'should succeed').to.be.false);

        expect(wasResolved).to.be.true;
      });

    });

  });

});
