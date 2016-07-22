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

interface IRegistrationInfo {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface IServerError {
  error: string;
}

interface IServerUsernameDetails {
  id: number;
  username: string;
}

export interface IUserService {
  signinUser(username: string, password: string): Observable<string>;
  isUsernameExists(username: string): Observable<boolean>;
  registerUser(username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string): Observable<string>;
  getUserDetails(): Observable<IUserDetails>;
  getUsersDetails(): Observable<IUsernameDetails[]>;
  updateUserDetails(userId: number,
    username: string,
    email: string,
    firstName: string,
    lastName: string): Observable<void>;
  updateUserPassword(userId: number,
    currentPassword: string,
    newPassword: string): Observable<void>;
  getUserPermissions(userId: number): Observable<string[]>;
}

@Injectable()
export class UserService implements IUserService {
  private static UNAUTHORIZED_ERROR = 'Unauthorized';
  private static GENERIC_ERROR = 'Oops. Something went wrong. Please try again';

  private _loginUrl = '/api/login';
  private _registerUrl = '/api/register';
  private _usersControllerUrl = '/api/users/';
  private _userControllerUrl = '/api/user/';
  private _userExistsUrlSuffix = '/exists'
  private _changePasswordUrlSuffix = '/password';
  private _userPermissionsUrlSuffix = '/permissions';

  constructor(private http: Http) {
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
    let url = this._userControllerUrl + username + this._userExistsUrlSuffix;

    return this._get(url)
      .map((response: Response) => this._extractIsUserExists(response))
      .catch((error: any) => this._failUsernameExistanceCheck(error));
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

  public getUserPermissions(userId: number): Observable<string[]> {
    let url = this._userControllerUrl + userId + this._userPermissionsUrlSuffix;

    return this._get(url)
      .map((response: Response) => this._extractUserPermissions(response))
      .catch((error: any) => this._handleServerError<string[]>(error));
  }

  private _get(url): Observable<Response> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(url, options);
  }

  private _post(url: string, body: string): Observable<Response> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(url, body, options);
  }

  private _put(url: string, body: string): Observable<Response> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.put(url, body, options);
  }

  private _getRedirectionLocation(response: Response): string {
    this._throwErrorIfStatusIsNotOk(response);

    let redirectPath = response.headers.get('redirect-path');

    if (!redirectPath) {
      throw 'Unexpected result';
    }

    return redirectPath;
  }

  private _handleServerError<T>(error: any): Observable<T> {
    console.log(error);

    if (error.status === StatusCode.UNAUTHORIZED) {
      return Observable.throw(UserService.UNAUTHORIZED_ERROR);
    }

    if (typeof error === 'string') {
      return Observable.throw(UserService.GENERIC_ERROR);
    }

    var result: IServerError = error.json();
    if (!!result && !!result.error) {
      return Observable.throw(result.error);
    }

    return Observable.throw(UserService.GENERIC_ERROR);
  }

  private _failSignin(error: any): Observable<string> {
    console.log(error);

    if (error.status === StatusCode.UNAUTHORIZED) {
      return Observable.throw('Invalid credentials');
    } else {
      return Observable.throw(UserService.GENERIC_ERROR);
    }
  }

  private _extractIsUserExists(response: Response): boolean {
    this._throwErrorIfStatusIsNotOk(response);

    var result = response.json();

    if (!result || !('userExists' in result)) {
      throw 'Unexpected result';
    }

    return result.userExists;
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

  private _extractUserPermissions(response: Response): string[] {
    this._throwErrorIfStatusIsNotOk(response);

    var result = response.json();

    if (!result || !(result instanceof Array)) {
      throw 'Unexpected result';
    }

    return result;
  }

  private _failUsernameExistanceCheck(error: any): Observable<boolean> {
    console.log(error);

    return Observable.throw(UserService.GENERIC_ERROR);
  }

  private _throwOnUnauthorizedOrGenericError<T>(error: any): Observable<T> {
    if (error.status === StatusCode.UNAUTHORIZED) {
      return Observable.throw(UserService.UNAUTHORIZED_ERROR);
    } else {
      return Observable.throw(UserService.GENERIC_ERROR);
    }
  }

  private _isResponseHasAllUserDetails(response: any): boolean {
    return ('id' in response) &&
      ('username' in response) &&
      ('firstName' in response) &&
      ('lastName' in response);
  }

  private _throwErrorIfStatusIsNotOk<T>(response: Response): void {
    if (response.status !== StatusCode.OK) {
      throw 'Invalid result';
    }
  }

  private _validateServerUsernameDetails(serverUsernameDetails: IServerUsernameDetails): void {
    if (serverUsernameDetails.id === null || serverUsernameDetails.id === undefined) {
      throw 'User id is missing';
    }

    if (!serverUsernameDetails.username) {
      throw 'Username is missing';
    }
  }

}
