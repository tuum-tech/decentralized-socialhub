import { Guid } from 'guid-typescript';

export interface IEvent{
    [name: string] : IEventListener
}

export interface IEventListener{
    [id: string] : IEventCallback
}

export interface IEventCallback{
    callback<T>(data: T | null) : void 
}

export class EventsService {
    static events: IEvent = {}

    static addListener<T>(eventName: string, id: string, callback: IEventCallback){
        this.events[eventName][id] = callback
    }

    static removeListener(eventName: string, id: string) {
        delete this.events[eventName][id]
    }

    static trigger<T>(eventName: string, data: T | null = null){
        if (this.events[eventName]){
            let keys = Object.keys(this.events[eventName])
            keys.forEach(id => {
                this.events[eventName][id].callback(data);
            });
            
        }
    }
}
