import { Player } from './player';

export class GameBall {

    private xPos; 
    private yPos;
    private radius;
    private context;
    private backgroundColor = "#000000";

    private origSpeedX = 3;
    private origSpeedY = 2;
    private speedX = this.origSpeedX;
    private speedY = this.origSpeedY;

    constructor(_x: Number, _y: Number, _context: any) {
        this.xPos = _x;
        this.yPos = _y;
        this.context = _context;
    }

    setRadius(_radius: Number) {
        this.radius = _radius;
    }

    render() {
        this.context.beginPath();
        this.context.fillStyle = this.backgroundColor;
        this.context.arc(this.xPos, this.yPos, this.radius, 2 * Math.PI, false);
        this.context.fill();
    }

    getSpeedX() {
        return this.speedX;
    }

    getSpeedY() {
        return this.speedY;
    }

    setSpeedX(_speedX: number) {
        this.speedX = _speedX;
    }

    setSpeedY(_speedY: number) {
        this.speedY = _speedY;
    }

    getRadius() {
        return this.radius;
    }

    getYPos() {
        return this.yPos;
    }

    getXPos() {
        return this.xPos;
    }

    playerScored(bound_w: number, bound_h: number) {
        this.speedX = this.origSpeedX;
        this.speedY = this.origSpeedY;
        this.speedY = 2;
        this.xPos = bound_w / 2;
        this.yPos = bound_h / 2;
    }

    update(bound_w: number, bound_h: number, player1: Player, player2: Player) {
        this.xPos += this.speedX;
        this.yPos += this.speedY;

        if (this.xPos <= 0 || this.xPos + this.radius > bound_w) {
            return true;
        }

        if (this.yPos + this.radius > bound_h) {
            this.yPos = bound_h - this.radius;
            this.speedY = -this.speedY;
        } else if (this.yPos < 0) {
            this.yPos = 0;
            this.speedY = -this.speedY;
        }

        // split area into 2 for paddle checks
        /* use AABB boxes for collision */
        if (this.xPos < bound_w / 2) {
            if (this.xPos < player1.obj.getX2() && this.yPos > player1.obj.getY() && this.yPos + this.radius < player1.obj.getY2()) {
                this.speedX = this.origSpeedX;
                this.xPos += this.speedX;
            }
        } else {
            if (this.xPos + this.radius > player2.obj.getX() && this.yPos > player2.obj.getY() && this.yPos + this.radius < player2.obj.getY2()) {
                this.speedX = -this.origSpeedX;
                this.xPos += this.speedX;
            }
        }

        return false;
    }
}
