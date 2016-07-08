import {PathHelper} from "../../common/pathHelper";
import {ExpressSkillsServer} from "../expressSkillsServer";

export class PageTextResolver {
  public static getSigninPage(expressServer: ExpressSkillsServer): string {
    return this.getFile(expressServer, 'signin.html');
  }

  public static getHomePage(expressServer: ExpressSkillsServer): string {
    return this.getFile(expressServer, 'home.html');
  }

  public static getFile(expressServer: ExpressSkillsServer, pageName: string): string {
    var webpackMiddleware = expressServer.webpackMiddleware;

    var buffer = webpackMiddleware.fileSystem.readFileSync(PathHelper.getPathFromRoot('dist', pageName));

    return new Buffer(buffer).toString();
  }
}
