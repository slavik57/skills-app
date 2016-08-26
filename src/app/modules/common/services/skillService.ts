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

export interface ISkillService {
  getSkillsDetails(): Observable<ISkillNameDetails[]>;
  isSkillExists(skillName: string): Observable<boolean>;
  deleteSkill(skillId: number): Observable<void>;
  createSkill(skillName: string): Observable<ISkillNameDetails>;
}

@Injectable()
export class SkillService extends HttpServiceBase implements ISkillService {
  private _skillsControllerUrl = '/api/skills/';
  private _skillExistsUrlSuffix = '/exists';

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
}
