import { UserService } from './user.service';
import { DidService } from './did.service.new';

export class OnBoardingService {
  public static async syncOnBoardingWithOldUser(user: ISessionItem) {
    if (user.onBoardingInfo === undefined) {
      // this is just for users that are created before new onboarding system is integrated

      let newSessionItem = user;
      newSessionItem.onBoardingInfo = {
        type: 1,
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

  public static isOnBoardingCompleted = (
    onBoardingInfo: IOnboardingInfo | undefined
  ) => {
    if (onBoardingInfo === undefined) {
      return false;
    }
    if (onBoardingInfo.type === 1) {
      return onBoardingInfo.step === 5;
    } else if (onBoardingInfo.type === 2) {
      return onBoardingInfo.step === 4;
    }
    return onBoardingInfo.step === 6;
  };

  public static getOnBoardingTotalSteps = (session: ISessionItem) => {
    if (session.onBoardingInfo) {
      if (session.onBoardingInfo.type === 1) {
        return 5;
      } else if (session.onBoardingInfo.type === 2) {
        return 4;
      }
    }
    return 6;
  };

  public static async checkRecoverLogin(user: ISessionItem) {
    if (user.onBoardingInfo === undefined) {
      let newSessionItem = user;
      newSessionItem.onBoardingInfo = {
        type: 2,
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
    if (this.isOnBoardingCompleted(user.onBoardingInfo)) {
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
