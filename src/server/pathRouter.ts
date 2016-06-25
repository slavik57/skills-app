import {Request, Response, NextFunction} from 'express';

export class PathRouter {
  private _allowedNotAuthenticatedPaths = ['/dist/', '/fonts/'];
  private _homePath = '/';
  private _signinPath = '/signin';

  constructor(private request: Request, private response: Response, private nextFunction: NextFunction) {
  }

  public routeRequest(): void {
    if (this.request.isAuthenticated()) {
      this._routeAuthenticatedRequest();
    } else {
      this._routeNotAuthenticatedRequest();
    }
  }

  private _routeAuthenticatedRequest() {
    if (this._isSigninPath()) {
      this.response.redirect(this._homePath);
    } else {
      this.request.url = this._homePath;
      this.nextFunction();
    }
  }

  private _routeNotAuthenticatedRequest(){
    if (this._isAllowedNotAuthenticatedPath()) {
      this.nextFunction();
      return;
    }

    if (this._isSigninPath()) {
      this.request.url = this._signinPath;
      this.nextFunction();
      return;
    }

    this.response.redirect(this._signinPath);
  }

  private _isSigninPath(): boolean {
    return this.request.path.indexOf(this._signinPath) === 0;
  }

  private _isAllowedNotAuthenticatedPath(): boolean {
    for (var i = 0; i < this._allowedNotAuthenticatedPaths.length; i++) {
      var allowedNotAuthenticatedPath: string = this._allowedNotAuthenticatedPaths[i];
      if (this.request.path.indexOf(allowedNotAuthenticatedPath) === 0) {
        return true;
      }
    }

    return false;
  }
}
