import { GameObject2D } from './game-object';

export class Paddle extends GameObject2D {
    private playerId;

    constructor(_x: Number, _y: Number, _width: Number, _height: Number, _context: CanvasRenderingContext2D) {
        super();
        this.xPos = _x; this.yPos = _y;
        this.width = _width; this.height = _height;
        this.context = _context;
    }

    setPlayerId(_id: String) {
        this.playerId = _id;
    }

    getPlayerId(_id: String) : String {
        return this.playerId;
    }

    render() {
        this.context.fillStyle = this.backgroundColor;
        this.context.fillRect(this.xPos, this.yPos, this.width, this.height);
    }
}
