import {ITeamService} from '../../modules/common/services/teamService';

export class TeamServiceMockFactory {
  public static createTeamServiceMock(): ITeamService {
    return {
      getTeamsDetails: () => null
    }
  }
}
