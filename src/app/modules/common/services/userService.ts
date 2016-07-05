import {StatusCode} from "../../../../common/statusCode";
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

interface ILoginInfo {
  username: string;
  password: string;
}

interface IRegistrationInfo {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface IRegisterError {
  error: string;
}

export interface IUserService {
  signinUser(username: string, password: string): Observable<string>;
  isUsernameExists(username: string): Observable<boolean>;
  registerUser(username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string): Observable<string>;
}

@Injectable()
export class UserService implements IUserService {
  private _loginUrl = '/api/login';
  private _registerUrl = '/api/register';
  private _userControllerUrlPrefix = '/api/user/';
  private _userExistsUrlSuffix = '/exists'

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
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let url = this._userControllerUrlPrefix + username + this._userExistsUrlSuffix;

    return this.http.get(url, options)
      .map((response: Response) => this._getIsUserExists(response))
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
    console.log(body);
    return this._post(this._registerUrl, body)
      .map((response: Response) => this._getRedirectionLocation(response))
      .catch((error: any) => this._failRegister(error));
  }

  private _post(url: string, body: string): Observable<Response> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(url, body, options);
  }

  private _getRedirectionLocation(response: Response): string {
    if (response.status === StatusCode.OK) {
      let redirectPath = response.headers.get('redirect-path');

      if (!redirectPath) {
        throw 'Unexpected result';
      }

      return redirectPath;
    };

    throw 'Invalid result';
  }

  private _failRegister(error: any): Observable<string> {
    console.log(error);

    if (typeof error === 'string') {
      return Observable.throw('Oops. Something went wrong. Please try again.');
    }

    var result: IRegisterError = error.json();
    if (!!result && !!result.error) {
      return Observable.throw(result.error);
    }

    return Observable.throw('Oops. Something went wrong. Please try again.');
  }

  private _failSignin(error: any): Observable<string> {
    console.log(error);

    if (error.status === StatusCode.UNAUTHORIZED) {
      return Observable.throw('Invalid credentials');
    } else {
      return Observable.throw('Oops. Something went wrong. Please try again.');
    }
  }

  private _getIsUserExists(response: Response): boolean {
    if (response.status === StatusCode.OK) {
      var result = response.json();

      if (!result || !('userExists' in result)) {
        throw 'Unexpected result';
      }

      return result.userExists;
    };

    throw 'Invalid result';
  }

  private _failUsernameExistanceCheck(error: any): Observable<boolean> {
    console.log(error);

    return Observable.throw('Oops. Something went wrong. Please try again.');
  }

}
