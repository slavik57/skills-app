import {StatusCode} from "../../../../common/statusCode";
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

interface ILoginInfo {
  username: string;
  password: string;
}

export interface IUserService {
  signinUser(username: string, password: string): Observable<string>;
}

@Injectable()
export class UserService implements IUserService {
  private _loginUrl = '/api/login';

  constructor(private http: Http) {
  }

  public signinUser(username: string, password: string): Observable<string> {
    let body: string = JSON.stringify(<ILoginInfo>{
      username: username,
      password: password
    });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this._loginUrl, body, options)
      .map((response: Response) => this._getRedirectionLocation(response))
      .catch((error: any) => this._fail(error));;
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

  private _fail(error: any): Observable<string> {
    console.log(error);

    if (error.status === StatusCode.UNAUTHORIZED) {
      return Observable.throw('Invalid credentials');
    } else {
      return Observable.throw('Oops. Something went wrong. Please try again.');
    }
  }
}
