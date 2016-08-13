import {StatusCode} from "../../../../../common/statusCode";
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

interface IServerError {
  error: string;
}

export class HttpServiceBase {
  protected static UNAUTHORIZED_ERROR = 'Unauthorized';
  protected static GENERIC_ERROR = 'Oops. Something went wrong. Please try again';
  protected _limitedQueryParameter = '?max=';

  constructor(private http: Http) {
  }

  protected _get(url): Observable<Response> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(url, options);
  }

  protected _post(url: string, body: string): Observable<Response> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(url, body, options);
  }

  protected _put(url: string, body: string): Observable<Response> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.put(url, body, options);
  }

  protected _delete(url: string): Observable<Response> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.delete(url, options);
  }

  protected _handleServerError<T>(error: any): Observable<T> {
    console.log(error);

    if (error.status === StatusCode.UNAUTHORIZED) {
      return Observable.throw(HttpServiceBase.UNAUTHORIZED_ERROR);
    }

    if (typeof error === 'string') {
      return Observable.throw(HttpServiceBase.GENERIC_ERROR);
    }

    try {
      var result: IServerError = error.json();
      if (!!result && !!result.error) {
        return Observable.throw(result.error);
      }
    } catch (e) {
    }

    return Observable.throw(HttpServiceBase.GENERIC_ERROR);
  }

  protected _extractAllBody<T>(response: Response): T {
    this._throwErrorIfStatusIsNotOk(response);

    var result = response.json();
    if (!result) {
      throw 'Unexpected result';
    }

    return result;
  }

  protected _extractPropertyFromBody<T>(response: Response, propertyName: string): T {
    this._throwErrorIfStatusIsNotOk(response);

    var result = response.json();

    if (!result || !(propertyName in result)) {
      throw 'Unexpected result';
    }

    return result[propertyName];
  }

  protected _parseBodyAsArray<T>(response: Response): T[] {
    this._throwErrorIfStatusIsNotOk(response);

    var result = response.json();

    if (!result || !(result instanceof Array)) {
      throw 'Unexpected result';
    }

    return result;
  }

  protected _failWithGenericError<T>(error: any): Observable<T> {
    console.log(error);

    return Observable.throw(HttpServiceBase.GENERIC_ERROR);
  }

  protected _throwOnUnauthorizedOrGenericError<T>(error: any): Observable<T> {
    if (error.status === StatusCode.UNAUTHORIZED) {
      return Observable.throw(HttpServiceBase.UNAUTHORIZED_ERROR);
    } else {
      return Observable.throw(HttpServiceBase.GENERIC_ERROR);
    }
  }

  protected _throwErrorIfStatusIsNotOk<T>(response: Response): void {
    if (response.status !== StatusCode.OK) {
      throw 'Invalid result';
    }
  }

}
