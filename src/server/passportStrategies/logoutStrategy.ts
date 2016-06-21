import * as passport from 'passport';
import { Express} from 'express';

export class LogoutStrategy {
  private static NAME = 'logout';

  public static initialize(app: Express): void {
    app.get('/logout', function(req, res: any) {
      req.logout();
      res.redirect('/');
    });
  }
}
