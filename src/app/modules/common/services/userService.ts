import {ISkillModificatioPermissions} from "../interfaces/iSkillModificationPermissions";
import {ITeamModificatioPermissions} from "../interfaces/iTeamModificationPermissions";
import {HttpServiceBase} from "./base/httpServiceBase";
import {IUserPermissionRule} from "../interfaces/iUserPermissionRule";
import {IUserPermission} from "../interfaces/iUserPermission";
import {IUsernameDetails} from "../interfaces/iUsernameDetails";
import {IUserDetails} from "../interfaces/iUserDetails";
import {StatusCode} from "../../../../common/statusCode";
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

interface ILoginInfo {
  username: string;
  password: string;
}

interface IUpdateUserInfo {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface IUpdateUserPassword {
  password: string;
  newPassword: string;
}

interface IUpdateUserPermissions {
  permissionsToAdd: number[];
  permissionsToRemove: number[];
}

interface IRegistrationInfo {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface IServerUsernameDetails {
  id: number;
  username: string;
}

export interface IUserService {
  signinUser(username: string, password: string): Observable<string>;
  isUsernameExists(username: string): Observable<boolean>;
  canUserUpdatePassword(userIdToUpdatePasswordOf: number): Observable<boolean>;
  canUserModifyTeams(): Observable<boolean>;
  canUserModifySkills(): Observable<boolean>;
  registerUser(username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string): Observable<string>;
  getUserDetails(): Observable<IUserDetails>;
  getUsersDetails(): Observable<IUsernameDetails[]>;
  getUsersDetailsByPartialUsername(username: string, maxNumberOfUsers?: number): Observable<IUsernameDetails[]>;
  updateUserDetails(userId: number,
    username: string,
    email: string,
    firstName: string,
    lastName: string): Observable<void>;
  updateUserPassword(userId: number,
    currentPassword: string,
    newPassword: string): Observable<void>;
  getUserPermissions(userId: number): Observable<IUserPermission[]>;
  getUserPermissionsModificationRules(): Observable<IUserPermissionRule[]>;
  updateUserPermissions(userId: number,
    userPermissionsToAdd: IUserPermission[],
    userPermissionsToRemove: IUserPermission[]): Observable<void>;
  getTeamModificationPermissions(teamId: number): Observable<ITeamModificatioPermissions>;
  getSkillModificationPermissions(skillId: number): Observable<ISkillModificatioPermissions>;
}

@Injectable()
export class UserService extends HttpServiceBase implements IUserService {

  private _loginUrl = '/api/login';
  private _registerUrl = '/api/register';
  private _usersControllerUrl = '/api/users/';
  private _userControllerUrl = '/api/user/';
  private _userExistsUrlSuffix = '/exists'
  private _changePasswordUrlSuffix = '/password';
  private _userPermissionsUrlSuffix = '/permissions';
  private _userPermissionsModificationRulesUrlSuffix = 'permissions-modification-rules'
  private _canUserUpdatePasswordSuffix = '/can-update-password';
  private _canUserModifyTeamsListSuffix = 'can-modify-teams-list';
  private _canUserModifySkillsListSuffix = 'can-modify-skills-list';
  private _filteredUsersPrefix = 'filtered/';
  private _teamModificationRulesSuffix = 'team-modification-permissions/';
  private _skillModificationRulesSuffix = 'skill-modification-permissions/';

  constructor(http: Http) {
    super(http)
  }

  public signinUser(username: string, password: string): Observable<string> {
    let body: string = JSON.stringify(<ILoginInfo>{
      username: username,
      password: password
    });

    return this._post(this._loginUrl, body)
      .map((response: Response) => this._getRedirectionLocation(response))
      .catch((error: any) => this._failSignin(error));
  }

  public isUsernameExists(username: string): Observable<boolean> {
    let url = this._usersControllerUrl + username + this._userExistsUrlSuffix;

    return this._get(url)
      .map((response: Response) => this._extractPropertyFromBody<boolean>(response, 'userExists'))
      .catch((error: any) => this._failWithGenericError<boolean>(error));
  }

  public canUserUpdatePassword(userIdToUpdatePasswordOf: number): Observable<boolean> {
    let url =
      this._userControllerUrl + userIdToUpdatePasswordOf + this._canUserUpdatePasswordSuffix;

    return this._get(url)
      .map((response: Response) => this._extractPropertyFromBody<boolean>(response, 'canUpdatePassword'))
      .catch((error: any) => this._failWithGenericError<boolean>(error));
  }

  public canUserModifyTeams(): Observable<boolean> {
    let url =
      this._userControllerUrl + this._canUserModifyTeamsListSuffix;

    return this._get(url)
      .map((response: Response) => this._extractPropertyFromBody<boolean>(response, 'canModifyTeamsList'))
      .catch((error: any) => this._failWithGenericError<boolean>(error));
  }

  public canUserModifySkills(): Observable<boolean> {
    let url =
      this._userControllerUrl + this._canUserModifySkillsListSuffix;

    return this._get(url)
      .map((response: Response) => this._extractPropertyFromBody<boolean>(response, 'canModifySkillsList'))
      .catch((error: any) => this._failWithGenericError<boolean>(error));
  }

  public registerUser(username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string): Observable<string> {

    let body: string = JSON.stringify(<IRegistrationInfo>{
      username: username,
      password: password,
      email: email,
      firstName: firstName,
      lastName: lastName
    });

    return this._post(this._registerUrl, body)
      .map((response: Response) => this._getRedirectionLocation(response))
      .catch((error: any) => this._handleServerError<string>(error));
  }

  public getUserDetails(): Observable<IUserDetails> {
    return this._get(this._userControllerUrl)
      .map((response: Response) => this._extractUserDetails(response))
      .catch((error: any) => this._throwOnUnauthorizedOrGenericError<IUserDetails>(error));
  }

  public getUsersDetails(): Observable<IUsernameDetails[]> {
    return this._get(this._usersControllerUrl)
      .map((response: Response) => this._extractUsersDetails(response))
      .catch((error: any) => this._throwOnUnauthorizedOrGenericError<IUsernameDetails[]>(error));
  }

  public getUsersDetailsByPartialUsername(username: string, maxNumberOfUsers: number = null): Observable<IUsernameDetails[]> {
    var url = this._usersControllerUrl + this._filteredUsersPrefix + username;

    if (maxNumberOfUsers != null) {
      url += this._limitedQueryParameter + maxNumberOfUsers;
    }

    return this._get(url)
      .map((response: Response) => this._extractUsersDetails(response))
      .catch((error: any) => this._throwOnUnauthorizedOrGenericError<IUsernameDetails[]>(error));
  }

  public updateUserDetails(userId: number,
    username: string,
    email: string,
    firstName: string,
    lastName: string): Observable<void> {

    let url = this._userControllerUrl + userId;

    let body: string = JSON.stringify(<IUpdateUserInfo>{
      username: username,
      email: email,
      firstName: firstName,
      lastName: lastName
    });

    return this._put(url, body)
      .map((response: Response) => this._throwErrorIfStatusIsNotOk(response))
      .catch((error: any) => this._handleServerError<void>(error));
  }

  public updateUserPassword(userId: number,
    currentPassword: string,
    newPassword: string): Observable<void> {

    let url = this._userControllerUrl + userId + this._changePasswordUrlSuffix;

    let body: string = JSON.stringify(<IUpdateUserPassword>{
      password: currentPassword,
      newPassword: newPassword
    });

    return this._put(url, body)
      .map((response: Response) => this._throwErrorIfStatusIsNotOk(response))
      .catch((error: any) => this._handleServerError<void>(error));
  }

  public updateUserPermissions(userId: number,
    userPermissionsToAdd: IUserPermission[],
    userPermissionsToRemove: IUserPermission[]): Observable<void> {

    let url = this._usersControllerUrl + userId + this._userPermissionsUrlSuffix;

    let body: string = JSON.stringify(<IUpdateUserPermissions>{
      permissionsToAdd: _.map(userPermissionsToAdd, _ => _.value),
      permissionsToRemove: _.map(userPermissionsToRemove, _ => _.value)
    });

    return this._put(url, body)
      .map((response: Response) => this._throwErrorIfStatusIsNotOk(response))
      .catch((error: any) => this._handleServerError<void>(error));
  }

  public getUserPermissions(userId: number): Observable<IUserPermission[]> {
    let url = this._usersControllerUrl + userId + this._userPermissionsUrlSuffix;

    return this._get(url)
      .map((response: Response) => this._parseBodyAsArray<IUserPermission>(response))
      .catch((error: any) => this._handleServerError<IUserPermission[]>(error));
  }

  public getUserPermissionsModificationRules(): Observable<IUserPermissionRule[]> {
    let url = this._userControllerUrl + this._userPermissionsModificationRulesUrlSuffix;

    return this._get(url)
      .map((response: Response) => this._parseBodyAsArray<IUserPermissionRule[]>(response))
      .catch((error: any) => this._handleServerError<IUserPermissionRule[]>(error));
  }

  public getTeamModificationPermissions(teamId: number): Observable<ITeamModificatioPermissions> {
    var url = `${this._userControllerUrl}${this._teamModificationRulesSuffix}${teamId}`;

    return this._get(url)
      .map((response: Response) => this._extractTeamModificationPermissions(response))
      .catch((error: any) => this._handleServerError<ITeamModificatioPermissions>(error));
  }

  public getSkillModificationPermissions(skillId: number): Observable<ISkillModificatioPermissions> {
    var url = `${this._userControllerUrl}${this._skillModificationRulesSuffix}${skillId}`;

    return this._get(url)
      .map((response: Response) => this._extractSkillModificationPermissions(response))
      .catch((error: any) => this._handleServerError<ISkillModificatioPermissions>(error));
  }

  private _getRedirectionLocation(response: Response): string {
    this._throwErrorIfStatusIsNotOk(response);

    let redirectPath = response.headers.get('redirect-path');

    if (!redirectPath) {
      throw 'Unexpected result';
    }

    return redirectPath;
  }

  private _failSignin(error: any): Observable<string> {
    console.log(error);

    if (error.status === StatusCode.UNAUTHORIZED) {
      return Observable.throw('Invalid credentials');
    } else {
      return Observable.throw(UserService.GENERIC_ERROR);
    }
  }

  private _extractUserDetails(response: Response): IUserDetails {
    this._throwErrorIfStatusIsNotOk(response);

    var result = response.json();

    if (!result || !this._isResponseHasAllUserDetails(result)) {
      throw 'Unexpected result';
    }

    return result;
  }

  private _extractUsersDetails(response: Response): IUsernameDetails[] {
    this._throwErrorIfStatusIsNotOk(response);

    var result = response.json();

    if (!result || !(result instanceof Array)) {
      throw 'Unexpected result';
    }

    var usernameDetails: IUsernameDetails[] =
      _.map(result, (_serverUsernameDetails: IServerUsernameDetails) => {
        this._validateServerUsernameDetails(_serverUsernameDetails);

        return {
          id: _serverUsernameDetails.id,
          username: _serverUsernameDetails.username
        }
      });

    return usernameDetails;
  }

  private _isResponseHasAllUserDetails(response: any): boolean {
    return ('id' in response) &&
      ('username' in response) &&
      ('firstName' in response) &&
      ('lastName' in response);
  }

  private _validateServerUsernameDetails(serverUsernameDetails: IServerUsernameDetails): void {
    if (serverUsernameDetails.id === null || serverUsernameDetails.id === undefined) {
      throw 'User id is missing';
    }

    if (!serverUsernameDetails.username) {
      throw 'Username is missing';
    }
  }

  private _extractTeamModificationPermissions(response: Response): ITeamModificatioPermissions {
    this._throwErrorIfStatusIsNotOk(response);

    var result = response.json();

    if (!result || !this._isResponseHasAllTeamModificationPermissions(result)) {
      throw 'Unexpected result';
    }

    return result;
  }

  private _isResponseHasAllTeamModificationPermissions(response: any): boolean {
    return ('canModifyTeamName' in response) &&
      ('canModifyTeamAdmins' in response) &&
      ('canModifyTeamUsers' in response);
  }

  private _extractSkillModificationPermissions(response: Response): ISkillModificatioPermissions {
    this._throwErrorIfStatusIsNotOk(response);

    var result = response.json();

    if (!result || !this._isResponseHasAllSkillModificationPermissions(result)) {
      throw 'Unexpected result';
    }

    return result;
  }

  private _isResponseHasAllSkillModificationPermissions(response: any): boolean {
    return ('canAddPrerequisites' in response) &&
      ('canAddDependencies' in response);
  }

}
