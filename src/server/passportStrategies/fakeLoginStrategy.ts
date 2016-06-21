import * as passport from 'passport';
import {Strategy, IVerifyOptions, IStrategyOptionsWithRequest} from 'passport-local'
import {Request, Response, NextFunction, Express} from 'express';

export class FakeLoginStrategy {
  private static NAME = 'fakeLogin';

  public static initialize(app: Express): void {
    app.post('/login', passport.authenticate(FakeLoginStrategy.NAME, {
      successRedirect: '/'
    }));

    var options: IStrategyOptionsWithRequest = {
      passReqToCallback: true
    }

    passport.use(FakeLoginStrategy.NAME, new Strategy(options, this._loginUser));
  }

  private static _loginUser(req: Request, username: string, password: string, done: (error: any, user?: any, options?: IVerifyOptions) => void) {
    console.log('aaaa');
    done(null, {
      username: "some username",
    });
  }
}
