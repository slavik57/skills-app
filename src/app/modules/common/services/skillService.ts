import {ISkillPrerequisiteDetails} from "../interfaces/ISkillPrerequisiteDetails";
import {ISkillDependencyDetails} from "../interfaces/iSkillDependencyDetails";
import {ISkillNameDetails} from "../interfaces/iSkillNameDetails";
import {HttpServiceBase} from "./base/httpServiceBase";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Response, Http } from '@angular/http';
import * as _ from 'lodash';

interface IServerSkillNameDetails {
  id: number;
  skillName: string;
}

interface IServerSkillPrerequisite {
  id: number;
  skillName: string;
}

interface IServerSkillDependency {
  id: number;
  skillName: string;
}

export interface ISkillService {
  getSkillsDetails(): Observable<ISkillNameDetails[]>;
  isSkillExists(skillName: string): Observable<boolean>;
  deleteSkill(skillId: number): Observable<void>;
  createSkill(skillName: string): Observable<ISkillNameDetails>;
  getSkillPrerequisites(skillId: number): Observable<ISkillPrerequisiteDetails[]>;
  getSkillDependencies(skillId: number): Observable<ISkillDependencyDetails[]>;
  addSkillDependency(skillId: number, skillName: string): Observable<ISkillDependencyDetails>;
  removeSkillDependency(skillId: number, dependencyId: number): Observable<void>;
  addSkillPrerequisite(skillId: number, skillName: string): Observable<ISkillDependencyDetails>;
  removeSkillPrerequisite(skillId: number, prerequisiteId: number): Observable<void>;
  getSkillsDetailsByPartialSkillName(skillName: string, maxNumberOfSkills?: number): Observable<ISkillNameDetails[]>;
}

@Injectable()
export class SkillService extends HttpServiceBase implements ISkillService {
  private _skillsControllerUrl = '/api/skills/';
  private _skillExistsUrlSuffix = '/exists';
  private _skillPrerequisitesUrlSuffix = '/prerequisites';
  private _skillDependenciesUrlSuffix = '/dependencies';
  private _filteredSkillsPrefix = 'filtered/';

  constructor(http: Http) {
    super(http)
  }

  public getSkillsDetails(): Observable<ISkillNameDetails[]> {
    return this._get(this._skillsControllerUrl)
      .map((response: Response) => this._extractSkillsDetails(response))
      .catch((error: any) => this._throwOnUnauthorizedOrGenericError<ISkillNameDetails[]>(error));
  }

  public isSkillExists(skillName: string): Observable<boolean> {
    let url = this._skillsControllerUrl + skillName + this._skillExistsUrlSuffix;

    return this._get(url)
      .map((response: Response) => this._extractPropertyFromBody<boolean>(response, 'skillExists'))
      .catch((error: any) => this._failWithGenericError<boolean>(error));
  }

  public deleteSkill(skillId: number): Observable<void> {
    var url = this._skillsControllerUrl + skillId;

    return this._delete(url)
      .map((response: Response) => this._throwErrorIfStatusIsNotOk<void>(response))
      .catch((error: any) => this._handleServerError<void>(error));
  }

  public createSkill(skillName: string): Observable<ISkillNameDetails> {
    let body: string = JSON.stringify({
      name: skillName
    });

    return this._post(this._skillsControllerUrl, body)
      .map((response: Response) => this._extractAllBody<ISkillNameDetails>(response))
      .catch((error: any) => this._handleServerError<ISkillNameDetails>(error));
  }

  public getSkillPrerequisites(skillId: number): Observable<ISkillPrerequisiteDetails[]> {
    var url = this._skillsControllerUrl + skillId + this._skillPrerequisitesUrlSuffix;
    return this._get(url)
      .map((response: Response) => this._extractSkillPrerequisites(response))
      .catch((error: any) => this._throwOnUnauthorizedOrGenericError<ISkillPrerequisiteDetails[]>(error));
  }

  public getSkillDependencies(skillId: number): Observable<ISkillDependencyDetails[]> {
    var url = this._skillsControllerUrl + skillId + this._skillDependenciesUrlSuffix;
    return this._get(url)
      .map((response: Response) => this._extractSkillDependencies(response))
      .catch((error: any) => this._throwOnUnauthorizedOrGenericError<ISkillDependencyDetails[]>(error));
  }

  public addSkillDependency(skillId: number, skillName: string): Observable<ISkillDependencyDetails> {
    var url = this._skillsControllerUrl + skillId + this._skillDependenciesUrlSuffix;

    let body: string = JSON.stringify({
      skillName: skillName
    });

    return this._post(url, body)
      .map((response: Response) => this._extractAllBody<ISkillDependencyDetails>(response))
      .catch((error: any) => this._handleServerError<ISkillDependencyDetails>(error));
  }

  public addSkillPrerequisite(skillId: number, skillName: string): Observable<ISkillDependencyDetails> {
    var url = this._skillsControllerUrl + skillId + this._skillPrerequisitesUrlSuffix;

    let body: string = JSON.stringify({
      skillName: skillName
    });

    return this._post(url, body)
      .map((response: Response) => this._extractAllBody<ISkillDependencyDetails>(response))
      .catch((error: any) => this._handleServerError<ISkillDependencyDetails>(error));
  }

  public removeSkillDependency(skillId: number, dependencyId: number): Observable<void> {
    var url = this._skillsControllerUrl + dependencyId + this._skillPrerequisitesUrlSuffix;

    let body: string = JSON.stringify({
      prerequisiteId: skillId
    });

    return this._delete(url, body)
      .map((response: Response) => this._throwErrorIfStatusIsNotOk<void>(response))
      .catch((error: any) => this._handleServerError<void>(error));
  }

  public removeSkillPrerequisite(skillId: number, prerequisiteId: number): Observable<void> {
    var url = this._skillsControllerUrl + skillId + this._skillPrerequisitesUrlSuffix;

    let body: string = JSON.stringify({
      prerequisiteId: prerequisiteId
    });

    return this._delete(url, body)
      .map((response: Response) => this._throwErrorIfStatusIsNotOk<void>(response))
      .catch((error: any) => this._handleServerError<void>(error));
  }

  public getSkillsDetailsByPartialSkillName(skillName: string, maxNumberOfSkills: number = null): Observable<ISkillNameDetails[]> {
    var url = this._skillsControllerUrl + this._filteredSkillsPrefix + skillName;

    if (maxNumberOfSkills != null) {
      url += this._limitedQueryParameter + maxNumberOfSkills;
    }

    return this._get(url)
      .map((response: Response) => this._extractSkillsDetails(response))
      .catch((error: any) => this._throwOnUnauthorizedOrGenericError<ISkillNameDetails[]>(error));
  }

  private _extractSkillsDetails(response: Response): ISkillNameDetails[] {
    this._throwErrorIfStatusIsNotOk(response);

    var result = response.json();

    if (!result || !(result instanceof Array)) {
      throw 'Unexpected result';
    }

    var skillNameDetails: ISkillNameDetails[] =
      _.map(result, (_serverSkillNameDetails: IServerSkillNameDetails) => {
        this._validateServerSkillNameDetails(_serverSkillNameDetails);

        return {
          id: _serverSkillNameDetails.id,
          skillName: _serverSkillNameDetails.skillName
        }
      });

    return skillNameDetails;
  }

  private _validateServerSkillNameDetails(serverSkillNameDetails: IServerSkillNameDetails): void {
    if (serverSkillNameDetails.id === null ||
      serverSkillNameDetails.id === undefined) {
      throw 'Skill id is missing';
    }

    if (!serverSkillNameDetails.skillName) {
      throw 'Skill name is missing';
    }
  }

  private _extractSkillDependencies(response: Response): ISkillDependencyDetails[] {
    this._throwErrorIfStatusIsNotOk(response);

    var result = response.json();

    if (!result || !(result instanceof Array)) {
      throw 'Unexpected result';
    }

    var skillDependencies: ISkillDependencyDetails[] =
      _.map(result, (_serverSkillDependency: IServerSkillDependency) => {
        this._validateServerSkillDependency(_serverSkillDependency);

        return <ISkillDependencyDetails>{
          id: _serverSkillDependency.id,
          skillName: _serverSkillDependency.skillName,
        }
      });

    return skillDependencies;
  }

  private _validateServerSkillDependency(serverSkillDependency: IServerSkillDependency): void {
    if (serverSkillDependency.id === null ||
      serverSkillDependency.id === undefined) {
      throw 'Skill id is missing';
    }

    if (!serverSkillDependency.skillName) {
      throw 'skillName is missing';
    }
  }

  private _extractSkillPrerequisites(response: Response): ISkillPrerequisiteDetails[] {
    this._throwErrorIfStatusIsNotOk(response);

    var result = response.json();

    if (!result || !(result instanceof Array)) {
      throw 'Unexpected result';
    }

    var skillPrerequisites: ISkillPrerequisiteDetails[] =
      _.map(result, (_serverSkillPrerequisite: IServerSkillPrerequisite) => {
        this._validateServerSkillPrerequisite(_serverSkillPrerequisite);

        return <ISkillPrerequisiteDetails>{
          id: _serverSkillPrerequisite.id,
          skillName: _serverSkillPrerequisite.skillName,
        }
      });

    return skillPrerequisites;
  }

  private _validateServerSkillPrerequisite(serverSkillPrerequisite: IServerSkillPrerequisite): void {
    if (serverSkillPrerequisite.id === null ||
      serverSkillPrerequisite.id === undefined) {
      throw 'Skill id is missing';
    }

    if (!serverSkillPrerequisite.skillName) {
      throw 'skillName is missing';
    }
  }
}
