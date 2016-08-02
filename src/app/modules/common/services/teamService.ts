import {HttpServiceBase} from "./base/httpServiceBase";
import {ITeamNameDetails} from "../interfaces/iTeamNameDetails";
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';

interface IServerTeamNameDetails {
  id: number;
  teamName: string;
}

export interface ITeamService {
  getTeamsDetails(): Observable<ITeamNameDetails[]>;
  isTeamExists(teamName: string): Observable<boolean>;
  createTeam(teamName: string): Observable<ITeamNameDetails>;
}

@Injectable()
export class TeamService extends HttpServiceBase implements ITeamService {
  private _teamsControllerUrl = '/api/teams/';
  private _teamExistsUrlSuffix = '/exists';

  constructor(http: Http) {
    super(http)
  }

  public getTeamsDetails(): Observable<ITeamNameDetails[]> {
    return this._get(this._teamsControllerUrl)
      .map((response: Response) => this._extractTeamsDetails(response))
      .catch((error: any) => this._throwOnUnauthorizedOrGenericError<ITeamNameDetails[]>(error));
  }

  public isTeamExists(teamName: string): Observable<boolean> {
    let url = this._teamsControllerUrl + teamName + this._teamExistsUrlSuffix;

    return this._get(url)
      .map((response: Response) => this._extractPropertyFromBody<boolean>(response, 'teamExists'))
      .catch((error: any) => this._failWithGenericError<boolean>(error));
  }

  public createTeam(teamName: string): Observable<ITeamNameDetails> {
    let body: string = JSON.stringify({
      name: teamName
    });

    return this._post(this._teamsControllerUrl, body)
      .map((response: Response) => this._extractAllBody<ITeamNameDetails>(response))
      .catch((error: any) => this._handleServerError<ITeamNameDetails>(error));
  }

  private _extractTeamsDetails(response: Response): ITeamNameDetails[] {
    this._throwErrorIfStatusIsNotOk(response);

    var result = response.json();

    if (!result || !(result instanceof Array)) {
      throw 'Unexpected result';
    }

    var teamNameDetails: ITeamNameDetails[] =
      _.map(result, (_serverTeamNameDetails: IServerTeamNameDetails) => {
        this._validateServerTeamNameDetails(_serverTeamNameDetails);

        return {
          id: _serverTeamNameDetails.id,
          teamName: _serverTeamNameDetails.teamName
        }
      });

    return teamNameDetails;
  }

  private _validateServerTeamNameDetails(serverTeamNameDetails: IServerTeamNameDetails): void {
    if (serverTeamNameDetails.id === null ||
      serverTeamNameDetails.id === undefined) {
      throw 'Team id is missing';
    }

    if (!serverTeamNameDetails.teamName) {
      throw 'Team name is missing';
    }
  }

}
