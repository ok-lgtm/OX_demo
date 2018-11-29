export default class CustomEvents{
    private static _instance = null
    private _events:Object[] = []

    constructor(){
    }

    /**
     * @method 获取实例对象
     * @returns 返回当前类
     */
     public static getInstacne():CustomEvents{
        if(CustomEvents._instance == null){
            CustomEvents._instance = new CustomEvents()
        }

        return CustomEvents._instance
    }

    /**
     * @method 派发事件
     * @param eventName 事件名字
     * @param data 传递的数据
     */
    public dispatch(eventName:string, data:any){
        console.log("派发事件:", eventName)

        data._eventName = eventName
        for(let event in this._events){
            if(event == eventName){
                for(let i = 0; i < this._events[eventName].length; ++i){
                    this._events[eventName][i](data)
                }
            }
        }
    }

    /**
     * @method 监听事件
     * @param eventName 监听事件的名字 
     * @param callback 响应事件
     * @param target 目标对象
     */
    public listen(eventName:string, callback:Function, target:any){
        console.log("监听事件:", eventName)

        this._events[eventName] = this._events[eventName] || []
        this._events[eventName].push(callback.bind(target))
    }

    /**
     * @method 取消监听的事件
     * @param eventName 
     */
    public unListen(eventName:string){
        console.log("取消监听事件:", eventName)

        for(let i = 0; i < this._events[eventName].length; ++i){
            this._events[eventName][i] = null
        }
    }

}