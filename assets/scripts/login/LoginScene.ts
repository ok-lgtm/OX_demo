import GlobalConfig from "../config/GlobalConfig"
import Network from "../Network"
import EventCustom from "../CustomEvents"
import DataManager from "../DataManager"
import PlayerInfo from "../PlayerInfo";

enum Btn_Tag{
    BTN_WX_TAG = 100,
    BTN_VISITOR_TAG
}

const {ccclass, property} = cc._decorator;
@ccclass
export default class LoginScene extends cc.Component {
    @property(cc.Node)
    nodeBase:cc.Node = null

    @property(cc.Button)
    btn_wx:cc.Button = null

    @property(cc.Button)
    btn_visitor:cc.Button = null

    network:Network = null

    customEvent:EventCustom = null

    dataMgr:DataManager = null


    onLoad () {
        this.onSceneLoadFinish()
    }

    start () {
        this.btn_wx.node.on(cc.Node.EventType.TOUCH_END, this.onButtonClicked.bind(this), this)
        this.btn_wx.node.tag = Btn_Tag.BTN_WX_TAG

        this.btn_visitor.node.on(cc.Node.EventType.TOUCH_END, this.onButtonClicked.bind(this), this)
        this.btn_visitor.node.tag = Btn_Tag.BTN_VISITOR_TAG
    }

    // update (dt) {}

    onSceneLoadFinish(){
        this.init()

        this.node.opacity = 0
        let fadeIn = cc.fadeIn(1)
        this.node.runAction(fadeIn)
    }

    init(){
        this.btn_wx.node.active = GlobalConfig._loginMode == 0
        this.btn_visitor.node.active = GlobalConfig._loginMode == 1

        this.network = Network.getInstacne()
        this.customEvent = EventCustom.getInstacne()
        this.dataMgr = DataManager.getInstance()
        this.customEvent.listen('message', this.onNetworkMessage.bind(this), this)
    }

    onButtonClicked(event){
        let tag = event.currentTarget.tag
        if(GlobalConfig._bDevMode){
            let data = {
                type:"C2SLogin",
                data:{
                    Code:GlobalConfig._testUserCode,
                },
            }
            cc.log("登录:", data)
            this.network.send(data)
        }else{
            switch(tag){
                case Btn_Tag.BTN_WX_TAG:{
                    break
                }
                case Btn_Tag.BTN_VISITOR_TAG:{
                    break
                }
            }
        }
        
    }

    onNetworkMessage(event){
        cc.log(event)
        let data = event.data
        if(data && data.Code != 0){
            cc.log("LoginScene onNetworkMessage error:", event.Code)
            return
        }

        if(data.Data && data.Data.Info){
            let info = data.Data.Info
            let playerInfo:PlayerInfo = new PlayerInfo()
            playerInfo.userID = info.ID
            playerInfo.nickName = info.Nickname
            playerInfo.avatar = info.Avatar
            playerInfo.coin = info.Coin
            playerInfo.sex = info.Sex
            GlobalConfig._meUserID = info.ID
            
            this.dataMgr.setPlayerInfoNotUserID(playerInfo)

            cc.director.preloadScene('Hall', function(){
                cc.log("Hall 加载完成 playerInfo:", playerInfo)
                cc.director.loadScene('Hall')
            })
        }
    }
}
