import PlayerInfo from "./PlayerInfo"

export default class DataManager {
    private static _instance:DataManager = null
    private _playerInfos:Object = {}
    private _roomPlayerInfos:Object[] = []

    public static getInstance():DataManager{
        if(DataManager._instance == null){
            DataManager._instance = new DataManager()
        }

        return DataManager._instance
    }

    public setPlayerInfo(userID:number, playerInfo:PlayerInfo){
        if(userID <= 0){
            cc.log("userID 错误无法保存玩家信息")
            return
        }

        this._playerInfos[userID] = playerInfo
    }

    public setPlayerInfoNotUserID(playerInfo:PlayerInfo){
        if(playerInfo && playerInfo.userID){
            this.setPlayerInfo(playerInfo.userID, playerInfo)
        }
    }

    public getUserInfo(userID:number):PlayerInfo{
        return this._playerInfos[userID]
    }

    public setRoomPlayerInfo(roomID:string, playerInfo:PlayerInfo){
        if(roomID && roomID.length === 6){
            this._roomPlayerInfos[roomID] = this._roomPlayerInfos[roomID] || []
            this._roomPlayerInfos[roomID].push(playerInfo)

        }else{
            cc.log("roomID 不存在无法保存玩家信息!")
        }
    }

    public getRoomPlayerInfoByUserID(roomID:string, userID:number):PlayerInfo{
        let playerInfo = null
        if(roomID && roomID.length === 6){
            for (const key in this._roomPlayerInfos) {
                if(key === roomID){
                    for(let i = 0; i < this._roomPlayerInfos[roomID].length; ++i){
                        let player:PlayerInfo = this._roomPlayerInfos[roomID][i]
                        if(player.userID === userID){
                            playerInfo = player
                            break
                        }
                    }
                    if(playerInfo){
                        break
                    }
                }
            }
        }

        return playerInfo
    }

    public getRoomAllPlayerInfo(roomID:string):PlayerInfo[]{
        let playerInfo = null
        if(roomID && roomID.length === 6){
            for (const key in this._roomPlayerInfos){
                if(key === roomID){
                    playerInfo = this._roomPlayerInfos[roomID]
                    break
                }
            }
        }

        return playerInfo
    }
}
