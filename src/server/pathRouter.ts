import {Request, Response, NextFunction} from 'express';

export class PathRouter {
  private _resourcePaths = ['/dist/', '/fonts/'];
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
    } else if (this._isResourcePath()) {
      this.nextFunction();
    } else {
      this.request.url = this._homePath;
      this.nextFunction();
    }
  }

  private _routeNotAuthenticatedRequest() {
    if (this._isResourcePath()) {
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

  private _isResourcePath(): boolean {
    for (var i = 0; i < this._resourcePaths.length; i++) {
      var resourcePath: string = this._resourcePaths[i];
      if (this.request.path.indexOf(resourcePath) === 0) {
        return true;
      }
    }

    return false;
  }
}
