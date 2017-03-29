export class GameObject2D {
    xPos;
    yPos;
    width;
    height;
    speedX = 0;
    speedY = 4;
    context : CanvasRenderingContext2D;
    backgroundColor = "#000000";

    getX() {
        return this.xPos;
    }

    getX2() {
        return this.xPos + this.width;
    }

    getY() {
        return this.yPos;
    }

    getY2() {
        return this.yPos + this.height;
    }

    getSpeedY() {
        return this.speedY; 
    }

    getSpeedX() {
        return this.speedX;
    }

    moveDown(boundY: number) {
        this.yPos += this.speedY;
        if (this.yPos + this.height > boundY) {
            this.yPos -= this.speedY;
        }
    }

    moveUp() {
        this.yPos -= this.speedY;
        if (this.yPos < 0) {
            this.yPos += this.speedY;
        }
    }
}
