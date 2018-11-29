import Network from "../Network"
import EventCustom from "../CustomEvents"
import GlobalConfig from "../config/GlobalConfig"

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoadingScene extends cc.Component {
    @property(cc.Label)
    lab_tips:cc.Label = null

    @property(cc.Label)
    lab_localVersion:cc.Label = null

    @property(cc.Label)
    lab_remoteVersion:cc.Label = null

    @property(cc.Animation)
    anim_tips:cc.Animation = null

    network:Network = null
    customevents:EventCustom = null

    clientVersion:string = ""

    // onLoad () {}

    start () {
        this.init()
    }

    // update (dt) {}

    init(){
        this.initInfo()

        this.network = Network.getInstacne()
        this.customevents = EventCustom.getInstacne()

        this.network.connect("ws://119.23.49.110:12121")
        this.customevents.listen('connected', this.onConnected, this)
        this.customevents.listen('message', this.onNetworkMessage, this)
    }

    initInfo(){
        this.clientVersion = GlobalConfig._clientVersion
        if(this.lab_localVersion){
            this.lab_localVersion.string = "当前版本：" + this.clientVersion
        }
    }

    onConnected(event_data){
        cc.log("连接服务器成功", event_data)
        if(this.lab_tips){
            this.lab_tips.string = "正在校验客户端版本......"
        }

        let send_data = {
            type:"C2SProtocol",
            data:{
                Version:this.clientVersion,
            },
        }
        this.network.send(send_data)
        
    }

    onNetworkMessage(data){
        if(!data || !data.type){
            return
        }
        if(data.data.Code > 0){
            cc.log("错误:", data.data.Msg)
            return
        }

        switch(data.type){
            case "S2CProtocol":{
                if(this.lab_tips){
                    this.lab_tips.string = "正在加载资源......"
                }
                if(this.lab_remoteVersion){
                    this.lab_remoteVersion.string = "远端版本：" + this.clientVersion
                }
                GlobalConfig._loginMode = data.data.Data
                cc.log("登陆模式:", GlobalConfig._loginMode)
                let delay = cc.delayTime(3)
                let self = this
                let callbak = cc.callFunc(function(){
                    self.anim_tips.stop()
                    self.lab_tips.node.active = false
                    
                    let fadeOut = cc.fadeOut(1)
                    let call = cc.callFunc(function(){
                        cc.director.loadScene('Login')
                    })
                    self.node.runAction(cc.sequence(fadeOut, call))
                    
                })
                this.node.runAction(cc.sequence(delay, callbak))

                break
            }
        }
    }


}
