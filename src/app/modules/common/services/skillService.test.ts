import {ISkillPrerequisiteDetails} from "../interfaces/ISkillPrerequisiteDetails";
import {ISkillDependencyDetails} from "../interfaces/iSkillDependencyDetails";
import {ISkillNameDetails} from "../interfaces/iSkillNameDetails";
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
import {SkillService} from './skillService';

describe('SkillService', () => {

  var skillService: SkillService;
  var mockBackend: MockBackend;

  beforeEachProviders(() => [
    HTTP_PROVIDERS,
    MockBackend,
    provide(XHRBackend, { useExisting: MockBackend }),
    SkillService
  ]);

  beforeEach(inject([MockBackend, SkillService], (_mockBackend: MockBackend, _skillService: SkillService) => {
    skillService = _skillService;
    mockBackend = _mockBackend;
  }));

  it('getSkillsDetails should use correct url', () => {
    skillService.getSkillsDetails();

    expect(mockBackend.connectionsArray).to.be.length(1);
    expect(mockBackend.connectionsArray[0].request.method).to.be.equal(RequestMethod.Get);
    expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/skills/');
  });

  it('deleteSkill should use correct url', () => {
    var skillId = 123;
    skillService.deleteSkill(skillId);

    expect(mockBackend.connectionsArray).to.be.length(1);
    expect(mockBackend.connectionsArray[0].request.method).to.be.equal(RequestMethod.Delete);
    expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/skills/' + skillId);
  });

  it('isSkillExists should use correct url', () => {
    var skillName = 'some skill name'
    skillService.isSkillExists(skillName);

    expect(mockBackend.connectionsArray).to.be.length(1);
    expect(mockBackend.connectionsArray[0].request.method).to.be.equal(RequestMethod.Get);
    expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/skills/' + skillName + '/exists');
  });

  describe('createSkill', () => {

    var skillName: string;

    beforeEach(() => {
      skillName = 'some skill name';
      skillService.createSkill(skillName);
    });

    it('should use correct url', () => {
      expect(mockBackend.connectionsArray).to.be.length(1);
      expect(mockBackend.connectionsArray[0].request.method).to.be.equal(RequestMethod.Post);
      expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/skills/');
    });

    it('should use correct body', () => {
      var expectedBody = JSON.stringify({
        name: skillName
      });

      expect(mockBackend.connectionsArray[0].request.getBody()).to.be.equal(expectedBody);
    });

  });

  it('getSkillDependencies should use correct url', () => {
    var skillId = 123321;
    skillService.getSkillDependencies(skillId);

    expect(mockBackend.connectionsArray).to.be.length(1);
    expect(mockBackend.connectionsArray[0].request.method).to.be.equal(RequestMethod.Get);
    expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/skills/' + skillId + '/dependencies');
  });

  it('getSkillPrerequisites should use correct url', () => {
    var skillId = 123321;
    skillService.getSkillPrerequisites(skillId);

    expect(mockBackend.connectionsArray).to.be.length(1);
    expect(mockBackend.connectionsArray[0].request.method).to.be.equal(RequestMethod.Get);
    expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/skills/' + skillId + '/prerequisites');
  });

  describe('addSkillDependency', () => {

    var skillId: number;
    var skillName: string;

    beforeEach(() => {
      skillId = 789;
      skillName = 'some skill name';
      skillService.addSkillDependency(skillId, skillName);
    });

    it('should use correct url', () => {
      expect(mockBackend.connectionsArray).to.be.length(1);
      expect(mockBackend.connectionsArray[0].request.method).to.be.equal(RequestMethod.Post);
      expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/skills/' + skillId + '/dependencies');
    });

    it('should use correct body', () => {
      var expectedBody = JSON.stringify({
        skillName: skillName
      });

      expect(mockBackend.connectionsArray[0].request.getBody()).to.be.equal(expectedBody);
    });

  });

  describe('addSkillPrerequisite', () => {

    var skillId: number;
    var skillName: string;

    beforeEach(() => {
      skillId = 789;
      skillName = 'some skill name';
      skillService.addSkillPrerequisite(skillId, skillName);
    });

    it('should use correct url', () => {
      expect(mockBackend.connectionsArray).to.be.length(1);
      expect(mockBackend.connectionsArray[0].request.method).to.be.equal(RequestMethod.Post);
      expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/skills/' + skillId + '/prerequisites');
    });

    it('should use correct body', () => {
      var expectedBody = JSON.stringify({
        skillName: skillName
      });

      expect(mockBackend.connectionsArray[0].request.getBody()).to.be.equal(expectedBody);
    });

  });

  describe('removeSkillDependency', () => {

    var skillId: number;
    var dependencyId: number;

    beforeEach(() => {
      skillId = 789;
      dependencyId = 111222;
      skillService.removeSkillDependency(skillId, dependencyId);
    });

    it('should use correct url', () => {
      expect(mockBackend.connectionsArray).to.be.length(1);
      expect(mockBackend.connectionsArray[0].request.method).to.be.equal(RequestMethod.Delete);
      expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/skills/' + dependencyId + '/prerequisites');
    });

    it('should use correct body', () => {
      var expectedBody = JSON.stringify({
        prerequisiteId: skillId
      });

      expect(mockBackend.connectionsArray[0].request.getBody()).to.be.equal(expectedBody);
    });

  });

  describe('removeSkillPrerequisite', () => {

    var skillId: number;
    var prerequisiteId: number;

    beforeEach(() => {
      skillId = 789;
      prerequisiteId = 111222;
      skillService.removeSkillPrerequisite(skillId, prerequisiteId);
    });

    it('should use correct url', () => {
      expect(mockBackend.connectionsArray).to.be.length(1);
      expect(mockBackend.connectionsArray[0].request.method).to.be.equal(RequestMethod.Delete);
      expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/skills/' + skillId + '/prerequisites');
    });

    it('should use correct body', () => {
      var expectedBody = JSON.stringify({
        prerequisiteId: prerequisiteId
      });

      expect(mockBackend.connectionsArray[0].request.getBody()).to.be.equal(expectedBody);
    });

  });

  describe('getSkillsDetailsByPartialSkillName', () => {

    it('should use correct url', () => {
      var skillName = 'some skill name';
      var max = 3;
      skillService.getSkillsDetailsByPartialSkillName(skillName, max);

      expect(mockBackend.connectionsArray).to.be.length(1);
      expect(mockBackend.connectionsArray[0].request.method).to.be.equal(RequestMethod.Get);
      expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/skills/filtered/' + skillName + '?max=' + max);
    });

    it('without limit should use correct url', () => {
      var skillName = 'some skill name';
      skillService.getSkillsDetailsByPartialSkillName(skillName);

      expect(mockBackend.connectionsArray).to.be.length(1);
      expect(mockBackend.connectionsArray[0].request.method).to.be.equal(RequestMethod.Get);
      expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/skills/filtered/' + skillName);
    });

  });

  function shouldFailWithError(error: any, beforeEachFunc: () => void): any {

    return () => {

      beforeEach(beforeEachFunc);

      it('getSkillsDetails should fail correctly', () => {
        skillService.getSkillsDetails().subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal(error)
        );
      });

      it('deleteSkill should fail correctly', () => {
        skillService.deleteSkill(123).subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal(error)
        );
      });

      it('isSkillExists should fail correctly', () => {
        skillService.isSkillExists('some skill name').subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal(error)
        );
      });

      it('createSkill should fail correctly', () => {
        skillService.createSkill('').subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal(error)
        );
      });

      it('getSkillDependencies should fail correctly', () => {
        skillService.getSkillDependencies(123).subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal(error)
        );
      });

      it('getSkillPrerequisites should fail correctly', () => {
        skillService.getSkillPrerequisites(123).subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal(error)
        );
      });

      it('addSkillDependency should fail correctly', () => {
        skillService.addSkillDependency(1, '').subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal(error)
        );
      });

      it('removeSkillDependency should fail correctly', () => {
        skillService.removeSkillDependency(123, 456).subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal(error)
        );
      });

      it('getSkillsDetailsByPartialSkillName should fail correctly', () => {
        skillService.getSkillsDetailsByPartialSkillName('skill name', 1).subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal(error)
        );
      });

    };

  }

  describe('on UNAUTHORIZED error',
    shouldFailWithError('Unauthorized', () => {
      var error = new HttpError();
      error.status = StatusCode.UNAUTHORIZED;

      mockBackend.connections.subscribe(
        (connection: MockConnection) => connection.mockError(error));
    })
  );

  describe('on INTERNAL_SERVER_ERROR error',
    shouldFailWithError('Oops. Something went wrong. Please try again', () => {
      var error = new HttpError();
      error.status = StatusCode.INTERNAL_SERVER_ERROR;

      mockBackend.connections.subscribe(
        (connection: MockConnection) => connection.mockError(error));
    })
  );

  describe('on error with failing json method',
    shouldFailWithError('Oops. Something went wrong. Please try again', () => {
      var error = new HttpError();
      error.json = () => { throw 'fail to parse'; }
      error.status = StatusCode.NOT_FOUND;

      mockBackend.connections.subscribe(
        (connection: MockConnection) => connection.mockError(error));
    })
  );

  describe('on error with failing json method',
    shouldFailWithError('Oops. Something went wrong. Please try again', () => {
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

    it('createSkill should fail correctly', () => {
      skillService.createSkill('').subscribe(
        () => expect(true, 'should fail').to.be.false,
        (error) => expect(error).to.be.equal(reasonForError)
      );
    });

    it('addSkillDependency should fail correctly', () => {
      skillService.addSkillDependency(1, '').subscribe(
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

    describe('getSkillsDetails', () => {

      it('without the skills details result should fail correctly', () => {
        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(new Response(responseOptions)));

        skillService.getSkillsDetails().subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
        );
      });

      it('with partial skills details result should fail correctly', () => {
        var result: ISkillNameDetails = {
          id: 1,
          skillName: 'some skill name'
        };

        delete result.skillName;

        responseOptions = new ResponseOptions({
          status: StatusCode.OK,
          headers: new Headers(),
          body: [result]
        });

        var response = new Response(responseOptions);

        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        skillService.getSkillsDetails().subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
        );
      });

      it('with the skills details result and empty skillName should fail correctly', () => {
        var result: ISkillNameDetails = {
          id: 1,
          skillName: '',
        };

        responseOptions = new ResponseOptions({
          status: StatusCode.OK,
          headers: new Headers(),
          body: [result]
        });

        var response = new Response(responseOptions);

        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        skillService.getSkillsDetails().subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
        );
      });

      it('with the skills details result and null id should return fail correctly', () => {
        var result: ISkillNameDetails = {
          id: null,
          skillName: 'some skill name',
        };

        responseOptions = new ResponseOptions({
          status: StatusCode.OK,
          headers: new Headers(),
          body: [result]
        });

        var response = new Response(responseOptions);

        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        skillService.getSkillsDetails().subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
        );
      });

      it('with the skills details result should return correct value', () => {
        var result: ISkillNameDetails[] = [
          {
            id: 1,
            skillName: 'some skill name',
          },
          {
            id: 2,
            skillName: 'some other skill name',
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

        skillService.getSkillsDetails().subscribe(
          (_result: ISkillNameDetails[]) => expect(_result).to.be.deep.equal(result),
          () => expect(true, 'should succeed').to.be.false)
      });

    });

    describe('deleteSkill', () => {

      it('should succeed', () => {
        responseOptions = new ResponseOptions({
          status: StatusCode.OK,
          headers: new Headers(),
        });

        var response = new Response(responseOptions);

        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        var wasResolved = false;
        skillService.deleteSkill(1234).subscribe(
          () => wasResolved = true,
          () => expect(true, 'should succeed').to.be.false);

        expect(wasResolved).to.be.true;
      });

    });

    describe('isSkillExists', () => {

      it('without the skill existance result should fail correctly', () => {
        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(new Response(responseOptions)));

        skillService.isSkillExists('').subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
        );
      });

      it('with the skill existance result should return correct value', () => {
        var result = true;

        responseOptions = new ResponseOptions({
          status: StatusCode.OK,
          headers: new Headers(),
          body: { skillExists: result }
        });

        var response = new Response(responseOptions);

        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        skillService.isSkillExists('').subscribe(
          (_result: boolean) => expect(_result).to.be.equal(result),
          () => expect(true, 'should succeed').to.be.false)
      });

    });

    describe('createSkill', () => {

      describe('without skill details', () => {

        beforeEach(() => {
          mockBackend.connections.subscribe(
            (connection: MockConnection) => connection.mockRespond(new Response(responseOptions)));
        });

        it('createSkill should fail correctly', () => {
          skillService.createSkill('').subscribe(
            () => expect(true, 'should fail').to.be.false,
            (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
          );
        });

      });

      describe('with skill details', () => {

        var skillDetails: ISkillNameDetails;

        beforeEach(() => {
          skillDetails = {
            skillName: 'some skill name',
            id: 1234
          }

          responseOptions.body = skillDetails;

          var response = new Response(responseOptions);

          mockBackend.connections.subscribe(
            (connection: MockConnection) => connection.mockRespond(response));
        });

        it('createSkill should return correct skill details', () => {
          skillService.createSkill('').subscribe(
            (_details: ISkillNameDetails) => expect(_details).to.deep.equal(skillDetails),
            () => expect(true, 'should succeed').to.be.false)
        });

      });

    });

    describe('getSkillDependencies', () => {

      it('without the skill dependencies result should fail correctly', () => {
        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(new Response(responseOptions)));

        skillService.getSkillDependencies(123).subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
        );
      });

      it('without skill name should fail correctly', () => {
        var result: ISkillDependencyDetails = {
          id: 1,
          skillName: 'some skill name'
        };

        delete result.skillName;

        responseOptions = new ResponseOptions({
          status: StatusCode.OK,
          headers: new Headers(),
          body: [result]
        });

        var response = new Response(responseOptions);

        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        skillService.getSkillDependencies(12321).subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
        );
      });

      it('without id should fail correctly', () => {
        var result: ISkillDependencyDetails = {
          id: 1,
          skillName: 'some skill name'
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

        skillService.getSkillDependencies(12321).subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
        );
      });

      it('with the skill dependencies details result and empty skill name should fail correctly', () => {
        var result: ISkillDependencyDetails = {
          id: 1,
          skillName: ''
        };

        responseOptions = new ResponseOptions({
          status: StatusCode.OK,
          headers: new Headers(),
          body: [result]
        });

        var response = new Response(responseOptions);

        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        skillService.getSkillDependencies(12321).subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
        );
      });

      it('with the skill dependencies result and null id should return fail correctly', () => {
        var result: ISkillDependencyDetails = {
          id: null,
          skillName: 'some skill name'
        };


        responseOptions = new ResponseOptions({
          status: StatusCode.OK,
          headers: new Headers(),
          body: [result]
        });

        var response = new Response(responseOptions);

        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        skillService.getSkillDependencies(11).subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
        );
      });

      it('with the skill dependencies result should return correct value', () => {
        var result: ISkillDependencyDetails[] = [
          {
            id: 1,
            skillName: 'some skill name',
          },
          {
            id: 2,
            skillName: 'some other skill name',
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

        skillService.getSkillDependencies(111).subscribe(
          (_result: ISkillDependencyDetails[]) => expect(_result).to.be.deep.equal(result),
          () => expect(true, 'should succeed').to.be.false)
      });

    });

    describe('getSkillPrerequisites', () => {

      it('without the skill prerequisites result should fail correctly', () => {
        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(new Response(responseOptions)));

        skillService.getSkillPrerequisites(123).subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
        );
      });

      it('without skill name should fail correctly', () => {
        var result: ISkillPrerequisiteDetails = {
          id: 1,
          skillName: 'some skill name'
        };

        delete result.skillName;

        responseOptions = new ResponseOptions({
          status: StatusCode.OK,
          headers: new Headers(),
          body: [result]
        });

        var response = new Response(responseOptions);

        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        skillService.getSkillPrerequisites(12321).subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
        );
      });

      it('without id should fail correctly', () => {
        var result: ISkillPrerequisiteDetails = {
          id: 1,
          skillName: 'some skill name'
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

        skillService.getSkillPrerequisites(12321).subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
        );
      });

      it('with the skill prerequisites details result and empty skill name should fail correctly', () => {
        var result: ISkillPrerequisiteDetails = {
          id: 1,
          skillName: ''
        };

        responseOptions = new ResponseOptions({
          status: StatusCode.OK,
          headers: new Headers(),
          body: [result]
        });

        var response = new Response(responseOptions);

        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        skillService.getSkillPrerequisites(12321).subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
        );
      });

      it('with the skill prerequisites result and null id should return fail correctly', () => {
        var result: ISkillPrerequisiteDetails = {
          id: null,
          skillName: 'some skill name'
        };


        responseOptions = new ResponseOptions({
          status: StatusCode.OK,
          headers: new Headers(),
          body: [result]
        });

        var response = new Response(responseOptions);

        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        skillService.getSkillPrerequisites(11).subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
        );
      });

      it('with the skill prerequisites result should return correct value', () => {
        var result: ISkillPrerequisiteDetails[] = [
          {
            id: 1,
            skillName: 'some skill name',
          },
          {
            id: 2,
            skillName: 'some other skill name',
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

        skillService.getSkillPrerequisites(111).subscribe(
          (_result: ISkillDependencyDetails[]) => expect(_result).to.be.deep.equal(result),
          () => expect(true, 'should succeed').to.be.false)
      });

    });

    describe('addSkillDependency', () => {

      describe('without skill dependency details', () => {

        beforeEach(() => {
          mockBackend.connections.subscribe(
            (connection: MockConnection) => connection.mockRespond(new Response(responseOptions)));
        });

        it('should fail correctly', () => {
          skillService.addSkillDependency(1, '').subscribe(
            () => expect(true, 'should fail').to.be.false,
            (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
          );
        });

      });

      describe('with skill dependency details', () => {

        var skillDependencyDetails: ISkillDependencyDetails;

        beforeEach(() => {
          skillDependencyDetails = {
            id: 1234,
            skillName: 'some skill name'
          }

          responseOptions.body = skillDependencyDetails;

          var response = new Response(responseOptions);

          mockBackend.connections.subscribe(
            (connection: MockConnection) => connection.mockRespond(response));
        });

        it('should return correct skill dependency details', () => {
          skillService.addSkillDependency(1, '').subscribe(
            (_details: ISkillDependencyDetails) => expect(_details).to.deep.equal(skillDependencyDetails),
            () => expect(true, 'should succeed').to.be.false)
        });

      });

    });

    describe('removeSkillDependency', () => {

      it('should succeed', () => {
        responseOptions = new ResponseOptions({
          status: StatusCode.OK,
          headers: new Headers(),
        });

        var response = new Response(responseOptions);

        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        var wasResolved = false;
        skillService.removeSkillDependency(1234, 5678).subscribe(
          () => wasResolved = true,
          () => expect(true, 'should succeed').to.be.false);

        expect(wasResolved).to.be.true;
      });

    });

    describe('getSkillsDetailsByPartialSkillName', () => {

      it('without the skills details result should fail correctly', () => {
        responseOptions = new ResponseOptions({
          status: StatusCode.OK,
          headers: new Headers(),
        });

        var response = new Response(responseOptions);

        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        skillService.getSkillsDetailsByPartialSkillName('some skill name').subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
        );
      });

      it('with partial skill details result should fail correctly', () => {
        var result: ISkillNameDetails = {
          id: 1,
          skillName: 'some skill name'
        };

        delete result.skillName;

        responseOptions = new ResponseOptions({
          status: StatusCode.OK,
          headers: new Headers(),
          body: [result]
        });

        var response = new Response(responseOptions);

        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        skillService.getSkillsDetailsByPartialSkillName('some skill name').subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
        );
      });

      it('with the skill details result and empty skill name should fail correctly', () => {
        var result: ISkillNameDetails = {
          id: 1,
          skillName: '',
        };

        responseOptions = new ResponseOptions({
          status: StatusCode.OK,
          headers: new Headers(),
          body: [result]
        });

        var response = new Response(responseOptions);

        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        skillService.getSkillsDetailsByPartialSkillName('some skill name').subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
        );
      });

      it('with the skill details result and null id should fail correctly', () => {
        var result: ISkillNameDetails = {
          id: null,
          skillName: 'some skill name',
        };

        responseOptions = new ResponseOptions({
          status: StatusCode.OK,
          headers: new Headers(),
          body: [result]
        });

        var response = new Response(responseOptions);

        mockBackend.connections.subscribe(
          (connection: MockConnection) => connection.mockRespond(response));

        skillService.getSkillsDetailsByPartialSkillName('some skill name').subscribe(
          () => expect(true, 'should fail').to.be.false,
          (error) => expect(error).to.be.equal('Oops. Something went wrong. Please try again')
        );
      });

      it('with the skill details result should return correct value', () => {
        var result: ISkillNameDetails[] = [
          {
            id: 1,
            skillName: 'some skill name',
          },
          {
            id: 2,
            skillName: 'some other skill name',
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

        skillService.getSkillsDetailsByPartialSkillName('some skill ame').subscribe(
          (_result: ISkillNameDetails[]) => expect(_result).to.be.deep.equal(result),
          () => expect(true, 'should succeed').to.be.false)
      });

    });

  });

});
