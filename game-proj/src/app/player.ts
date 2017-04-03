import { IPlayer } from './iplayer';

export class Player implements IPlayer {
    obj;
    id;
    private score = 0;
    private enabled = false;

    constructor(_obj: any) {
        this.obj = _obj;
    }

    setId (_id: string) {
        this.id = _id;
    }

    render() {
        this.obj.render();
    }

    scored() {
        this.score++;
    }

    isWinner(totalScore: any) {
        if (this.score >= totalScore) {
            return true;
        }
        return false;
    }

    getScore() {
        return this.score;
    }

    setEnabled(enb:boolean) {
        this.enabled = enb;
    }

    getEnabled() {
        return this.enabled;
    }
} 
