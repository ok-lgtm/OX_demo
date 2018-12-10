import DataManager from "../DataManager"
import GlobalConfig from "../config/GlobalConfig"
import PlayerInfo from "../PlayerInfo";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HallScene extends cc.Component {

    @property(cc.Label)
    labNickName:cc.Label = null

    @property(cc.Label)
    labUserID:cc.Label = null

    @property(cc.Label)
    labCoins:cc.Label = null

    dataMgr:DataManager = null

    // onLoad () {}

    start () {
        this.dataMgr = DataManager.getInstance()
        cc.log("HallScene start=====================>")
        let myInfo:PlayerInfo = this.dataMgr.getUserInfo(GlobalConfig._meUserID)

        this.labNickName.string = myInfo.nickName

        this.labUserID.string = ""+myInfo.userID

        this.labCoins.string = ""+myInfo.coin
    }

    // update (dt) {}
}
