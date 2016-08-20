import {ITeamMemberDetails} from "../interfaces/iTeamMemberDetails";
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

interface IServerTeamMember {
  id: number;
  username: string;
  isAdmin: boolean;
}

export interface ITeamService {
  getTeamsDetails(): Observable<ITeamNameDetails[]>;
  isTeamExists(teamName: string): Observable<boolean>;
  createTeam(teamName: string): Observable<ITeamNameDetails>;
  deleteTeam(teamId: number): Observable<void>;
  updateTeamName(teamId: number, newTeamName: string): Observable<ITeamNameDetails>;
  getTeamMembers(teamId: number): Observable<ITeamMemberDetails[]>;
  addTeamMember(teamId: number, username: string): Observable<ITeamMemberDetails>;
  removeTeamMember(teamId: number, userId: number): Observable<void>;
  changeTeamAdminRights(teamId: number, userId: number, isAdmin: boolean): Observable<void>;
}

@Injectable()
export class TeamService extends HttpServiceBase implements ITeamService {
  private _teamsControllerUrl = '/api/teams/';
  private _teamExistsUrlSuffix = '/exists';
  private _teamMembersUrlSuffix = '/members'

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

  public deleteTeam(teamId: number): Observable<void> {
    var url = this._teamsControllerUrl + teamId;

    return this._delete(url)
      .map((response: Response) => this._throwErrorIfStatusIsNotOk<void>(response))
      .catch((error: any) => this._handleServerError<void>(error));
  }

  public updateTeamName(teamId: number, newTeamName: string): Observable<ITeamNameDetails> {
    var url = this._teamsControllerUrl + teamId;

    let body: string = JSON.stringify({
      name: newTeamName
    });

    return this._put(url, body)
      .map((response: Response) => this._extractAllBody<ITeamNameDetails>(response))
      .catch((error: any) => this._handleServerError<ITeamNameDetails>(error));
  }

  public getTeamMembers(teamId: number): Observable<ITeamMemberDetails[]> {
    var url = this._teamsControllerUrl + teamId + this._teamMembersUrlSuffix;
    return this._get(url)
      .map((response: Response) => this._extractTeamMembers(response))
      .catch((error: any) => this._throwOnUnauthorizedOrGenericError<ITeamMemberDetails[]>(error));
  }

  public addTeamMember(teamId, username: string): Observable<ITeamMemberDetails> {
    var url = this._teamsControllerUrl + teamId + this._teamMembersUrlSuffix;

    let body: string = JSON.stringify({
      username: username
    });

    return this._post(url, body)
      .map((response: Response) => this._extractAllBody<ITeamMemberDetails>(response))
      .catch((error: any) => this._handleServerError<ITeamMemberDetails>(error));
  }

  public removeTeamMember(teamId: number, userId: number): Observable<void> {
    var url = this._teamsControllerUrl + teamId + this._teamMembersUrlSuffix;

    let body: string = JSON.stringify({
      userId: userId
    });

    return this._delete(url, body)
      .map((response: Response) => this._throwErrorIfStatusIsNotOk<void>(response))
      .catch((error: any) => this._handleServerError<void>(error));
  }

  public changeTeamAdminRights(teamId: number, userId: number, isAdmin: boolean): Observable<void> {
    var url = this._teamsControllerUrl + teamId + this._teamMembersUrlSuffix + '/' + userId;

    let body: string = JSON.stringify({
      isAdmin: isAdmin
    });

    return this._patch(url, body)
      .map((response: Response) => this._throwErrorIfStatusIsNotOk<void>(response))
      .catch((error: any) => this._handleServerError<void>(error));
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

  private _extractTeamMembers(response: Response): ITeamMemberDetails[] {
    this._throwErrorIfStatusIsNotOk(response);

    var result = response.json();

    if (!result || !(result instanceof Array)) {
      throw 'Unexpected result';
    }

    var teamMembers: ITeamMemberDetails[] =
      _.map(result, (_serverTeamMember: IServerTeamMember) => {
        this._validateServerTeamMember(_serverTeamMember);

        return <ITeamMemberDetails>{
          id: _serverTeamMember.id,
          username: _serverTeamMember.username,
          isAdmin: _serverTeamMember.isAdmin
        }
      });

    return teamMembers;
  }

  private _validateServerTeamMember(serverTeamMember: IServerTeamMember): void {
    if (serverTeamMember.id === null ||
      serverTeamMember.id === undefined) {
      throw 'User id is missing';
    }

    if (!serverTeamMember.username) {
      throw 'Username is missing';
    }

    if (serverTeamMember.isAdmin === null ||
      serverTeamMember.isAdmin === undefined) {
      throw 'User id is missing';
    }
  }
}
