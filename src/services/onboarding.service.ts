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
      return onBoardingInfo.step === 5;  // new user
    } else if (onBoardingInfo.type === 2) {
      return onBoardingInfo.step === 3; /// login 
    }
    return onBoardingInfo.step === 4; // recover
  };

  public static getOnBoardingTotalSteps = (session: ISessionItem) => {
    if (session.onBoardingInfo) {
      if (session.onBoardingInfo.type === 1) {
        return 5;
      } else if (session.onBoardingInfo.type === 2) {
        return 3;
      }
    }
    return 4;
  };

  public static async checkRecoverLogin(user: ISessionItem) {
    if (user.onBoardingInfo === undefined) {
      let newSessionItem = user;

      let userService: UserService = new UserService(
        await DidService.getInstance()
      );
      newSessionItem = await userService.updateSession(newSessionItem, false);

      return {
        canLogin: true,
        session: newSessionItem
      };
    }
    if (user.isEssentialUser) {
      return {
        canLogin: false,
        session: user
      };
    } else if(!user.isEssentialUser) {
      return {
        canLogin: true,
        session: user
      };
    }

    let newSessionItem = user;
    let userService: UserService = new UserService(
      await DidService.getInstance()
    );
    newSessionItem.onBoardingInfo = {
      type: 0,
      step: 0
    };
    newSessionItem = await userService.updateSession(newSessionItem, false);

    return {
      canLogin: true,
      session: user
    };
  }
}
