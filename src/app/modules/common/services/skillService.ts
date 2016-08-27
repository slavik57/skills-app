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

interface IServerSkillDependency {
  id: number;
  skillName: string;
}

export interface ISkillService {
  getSkillsDetails(): Observable<ISkillNameDetails[]>;
  isSkillExists(skillName: string): Observable<boolean>;
  deleteSkill(skillId: number): Observable<void>;
  createSkill(skillName: string): Observable<ISkillNameDetails>;
  getSkillDependencies(skillId: number): Observable<ISkillDependencyDetails[]>;
  removeSkillDependency(skillId: number, dependencyId: number): Observable<void>;
}

@Injectable()
export class SkillService extends HttpServiceBase implements ISkillService {
  private _skillsControllerUrl = '/api/skills/';
  private _skillExistsUrlSuffix = '/exists';
  private _skillDependenciesUrlSuffix = '/dependencies';

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

  public getSkillDependencies(skillId: number): Observable<ISkillDependencyDetails[]> {
    var url = this._skillsControllerUrl + skillId + this._skillDependenciesUrlSuffix;
    return this._get(url)
      .map((response: Response) => this._extractSkillDependencies(response))
      .catch((error: any) => this._throwOnUnauthorizedOrGenericError<ISkillDependencyDetails[]>(error));
  }

  public removeSkillDependency(skillId: number, dependencyId: number): Observable<void> {
    var url = this._skillsControllerUrl + skillId + this._skillDependenciesUrlSuffix;

    let body: string = JSON.stringify({
      dependencyId: dependencyId
    });

    return this._delete(url, body)
      .map((response: Response) => this._throwErrorIfStatusIsNotOk<void>(response))
      .catch((error: any) => this._handleServerError<void>(error));
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
}
