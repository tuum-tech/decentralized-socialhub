export class TutorialService {
  private static TUTORIAL_STORAGE_KEY: string = 'tutorial-stage';
  static setTutorialStage(stage: number) {
    window.localStorage.setItem(this.TUTORIAL_STORAGE_KEY, stage.toString());
  }

  static dropTutorialStage() {
    window.localStorage.removeItem(this.TUTORIAL_STORAGE_KEY);
  }

  static getTutorialStage(): number {
    let item = window.localStorage.getItem(this.TUTORIAL_STORAGE_KEY);
    if (item) {
      return Number(item) || 1;
    }
    return 1;
  }

  static async completeOnboardStage() {}
}
