import {ISkillService} from '../../modules/common/services/skillService';

export class SkillServiceMockFactory {
  public static createSkillServiceMock(): ISkillService {
    return {
      getSkillsDetails: () => null,
      deleteSkill: () => null,
      createSkill: () => null,
      isSkillExists: () => null,
      getSkillDependencies: () => null,
      removeSkillDependency: () => null,
      addSkillDependency: () => null,
      getSkillsDetailsByPartialSkillName: () => null,
      getSkillPrerequisites: () => null,
      addSkillPrerequisite: () => null,
      removeSkillPrerequisite: () => null
    }
  }
}
