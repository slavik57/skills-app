import {ExpressSkillsServer} from './expressSkillsServer';

ExpressSkillsServer.instance
  .initialize()
  .then((_expressServer: ExpressSkillsServer) => _expressServer.start());
