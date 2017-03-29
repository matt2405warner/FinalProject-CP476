import { IPlayer } from './iplayer';

export class Player implements IPlayer {
    obj;
    id;

    constructor(_obj: any) {
        this.obj = _obj;
    }

    setId (_id: string) {
        this.id = _id;
    }

    render() {
        this.obj.render();
    }
} 
