import { UserService } from './user.service';
import { DidService } from './did.service.new';

export class OnBoardingService {
  public static async syncOnBoardingWithOldUser(user: ISessionItem) {
    if (user.onBoardingInfo === undefined) {
      // this is just for users that are created before new onboarding system is integrated

      let newSessionItem = user;
      newSessionItem.onBoardingInfo = {
        type: 1,
        completed: false,
        step: 1
      };

      let userService: UserService = new UserService(
        await DidService.getInstance()
      );
      newSessionItem = await userService.updateSession(newSessionItem, false);

      return newSessionItem;
    }
    return user;
  }

  public static async checkRecoverLogin(user: ISessionItem) {
    if (user.onBoardingInfo === undefined) {
      let newSessionItem = user;
      newSessionItem.onBoardingInfo = {
        type: 2,
        completed: false,
        step: 1
      };

      let userService: UserService = new UserService(
        await DidService.getInstance()
      );
      newSessionItem = await userService.updateSession(newSessionItem, false);

      return {
        canLogin: true,
        session: newSessionItem
      };
    }
    if (user.onBoardingInfo.completed) {
      return {
        canLogin: false,
        session: user
      };
    }
    return {
      canLogin: true,
      session: user
    };
  }
}
