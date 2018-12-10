const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerInfo{
    nickName:string = ""
    avatar:string = ""
    coin:number = 0
    userID:number = 0
    sex:number = 0
}

module.export = PlayerInfo