import { ScriptService } from "./script.service"
import { ISessionItem, UserService } from "./user.service"

export class OnBoardService {
    
    static setOnboardStage(stage:number) {
        window.localStorage.setItem("onboarding-stage", stage.toString())
    }

    static dropOnboardStage() {
        window.localStorage.removeItem("onboarding-stage")
    }

    static getOnboardStage() : number{
        let item = window.localStorage.getItem("onboarding-stage")
        if (item){
            return Number(item) || 1
        }
        return 1
    }

    static async completeOnboardStage(){

    }

}