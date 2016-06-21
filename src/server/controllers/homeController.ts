import { Express, Request, Response } from 'express';
import {PathHelper} from '../../common/pathHelper';
import {ExpressSkillsServer} from '../expressSkillsServer';

export = {
  get_index: function(request: Request, response: Response): void {
    var webpackMiddleware = ExpressSkillsServer.instance.webpackMiddleware;

    response.write(webpackMiddleware.fileSystem.readFileSync(PathHelper.getPathFromRoot('dist', 'home.html')));

    response.end();
  }
};
