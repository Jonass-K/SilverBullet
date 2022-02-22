class Game {

    gameField: GameField;
    marbel: Marbel;
    orientationManager: OrientationManager =  OrientationManager.instance();

    isRunning: Boolean = false;

    lastOrientation = {ftb: 0, ltr: 0}
    lastWorked = true;

    constructor(gameField: GameField, marbel: Marbel) {
        this.gameField = gameField;
        this.marbel = marbel;
    };

    stopGame() {
        console.log("stop the game");
        this.isRunning = false;

        this.orientationManager.stopListening();
        //document.getElementById('button-text').innerHTML = "CLICK TO START";
        
        this.marbel.resetMarbel();
        this.gameField.draw();
    };

    startGame() {
        console.log("start the game");
        this.isRunning = true;

        this.orientationManager.askPermission( (callback: null | Error ) => {
            if (callback == null) {
                console.log("no permission granted");
                return
            }
            /* TODO: hier noch ein menu generell einzeln machen
            button.style.display = "none";

            this.gameField.setProp();
            */
            this.gameField.draw();
            this.orientationManager.startListening(this.moveMarbel);
        });
            // TODO: handle error
    };

    private moveMarbel(frontToBack: number, leftToRight: number, rotateDegrees: number) {
    //document.getElementById('gyro-data').innerHTML = "rotateDegrees: " + rotateDegrees + ", lefToRight: " + leftToRight + ", frontToBack: " + frontToBack;
        console.log("handle orientation event");
        console.log("leftToRight: " + leftToRight + ", frontToBack: " + frontToBack);
        leftToRight *= 1;
        frontToBack *= 1;

        let mx = this.marbel.x + leftToRight;
        let my = this.marbel.y + frontToBack;

        console.log("mx: " + mx + ", my: " + my);

        if (gameField.isInPath(mx, my, marbel.radius)
        && (this.lastWorked == true 
            || leftToRight/Math.abs(leftToRight) != this.lastOrientation.ltr 
            || frontToBack/Math.abs(frontToBack) != this.lastOrientation.ftb)
        ) { 
            marbel.x = mx;
            marbel.y = my;

        } else if (gameField.isInPath(marbel.x, my, marbel.radius) 
        && (this.lastWorked == true 
            || leftToRight/Math.abs(leftToRight) != this.lastOrientation.ltr 
            || frontToBack/Math.abs(frontToBack) != this.lastOrientation.ftb)
        ) {    
            marbel.y = my;

        } else if (gameField.isInPath(mx, marbel.y, marbel.radius) 
        && (this.lastWorked == true 
            || leftToRight/Math.abs(leftToRight) != this.lastOrientation.ltr 
            || frontToBack/Math.abs(frontToBack) != this.lastOrientation.ftb)
        ) {
            marbel.x = mx;
            
        } else {
            this.lastOrientation = {ftb: frontToBack/Math.abs(frontToBack), ltr: leftToRight/Math.abs(leftToRight)};
            this.lastWorked = false;

            console.log("not in path");

            return
        }

        this.lastWorked = true;
        gameField.drawForeground();
        marbel.draw();
        this.checkForLose();
        this.checkForWin();
    };

    private checkForLose() {
        console.log("holes: " + gameField.holes);
        for (var i = 0; i < gameField.holes.length; i++) {
            if (ctx.isPointInPath(gameField.holes[i], marbel.x, marbel.y)) {
                this.stopGame();
                break;
            }
        }
    };


    private checkForWin() {
        console.log("goal: " + gameField.goal);
        if (ctx.isPointInPath(gameField.goal, marbel.x, marbel.y)) {
            this.stopGame();
        }
    };
}