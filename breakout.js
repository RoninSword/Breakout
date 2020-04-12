let acc = document.getElementsByClassName("accordion");
let i;
let panel;
for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
        /* Toggle between adding and removing the "active" class,
        to highlight the button that controls the panel */
        this.classList.toggle("active");

        /* Toggle between hiding and showing the active panel */
        panel = this.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    });
}
//get canvas
let canvas = document.getElementById("myCanvas");
//make the canvas a 2d space we can draw on
let ctx = canvas.getContext("2d");
//ball size
let ballRadius = 10;
//ball starting position
let x = canvas.width / 2;
let y = canvas.height - 30;
//ball speed
let dx;
let dy;
//paddle size
let paddleHeight = 10;
let paddleWidth = 75;
//paddle starting position
let paddleX = (canvas.width - paddleWidth) / 2;
//left and right key press
let rightPressed = false;
let leftPressed = false;
//number of bricks
let brickRowCount = 3;
let brickColumnCount = 5;
//brick size
let brickWidth = 75;
let brickHeight = 20;
//brick positioning
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

//color change varialbes
let paddleColor = "red";
let ballColor = "#0095DD";
let brickColor = "#0095DD";
//score
let score = 0;
//lives
let lives;
//sounds
let pop = document.getElementById("pop");
//background image
let img = new Image();
img.src = 'brick_title.jpg'




//array that hold all position of bricks
let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = [];
        if (c % 2 == 0) {
            brickColor = "red";
        } else if (c % 3 == 0) {
            brickColor = "#0095DD";
        } else {
            brickColor = "green";
        }
        bricks[c][r] = {
            x: 0,
            y: 0,
            status: 1,
            color: brickColor
        };
    }
}

//listens for key press
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

//activates on keypress, only runs if left or right key press
function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

//activates on letting go of keypress. checks for left or right being no longer pressed
function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}



document.addEventListener("keydown", spaceHandler);

function spaceHandler(e) {
    if (e.key == "z" && paddleColor == "red") {
        paddleColor = "#0095DD";
    } else if (e.key == "z" && paddleColor == "#0095DD") {
        paddleColor = "green";
    } else if (e.key == 'z' && paddleColor == "green") {
        paddleColor = "red";
    }
}

function intersect(b){
    let distancex = Math.abs(x - b.x);
    let distancey = Math.abs(y - b.y);

    if(b.status == 0){
        return false;
    }

    if(distancex > (brickWidth + ballRadius)){
        return false;
    };
    if(distancey > (brickHeight + ballRadius)){
        return false;
    };
    if(distancex <= (brickWidth/2)){
        return 1;
    };
    if(distancey <= (brickHeight/2)){
        return 2;
    }
}


//collision detection
function collisionDetection() {
    //loop through brick array to check if the x and y position of the ball intersects with the position of a
    //brick
    //modified to collid on the radius of the ball
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            let intersection;
            intersection = intersect(b);
            if (b.status == 1) {
                if(intersection == 1 && ballColor == b.color){
                    b.status = 0;
                    dy = -dy;
                }else if(intersection == 2 && ballColor == b.color){
                    b.status = 0;
                    dx = -dx;
                }else if(intersection == 1 && ballColor != b.color){
                    b.status = 1;
                    dy = -dy;
                }else if(intersection == 2 && ballColor != b.color){
                    b.status = 1;
                    dx = -dx;
                }
            }else if(b.status == 0){
                dy = dy;
                dx = dx;
            }



            // if (x - ballRadius > b.x && x - ballRadius < b.x + brickWidth && y - ballRadius > b.y && y - ballRadius < b.y + brickHeight && ballColor == bricks[c][r].color) {
            //     pop.play();
            //     dy = -dy;
            //     b.status = 0;
            //     score++;
            //     if (score == brickRowCount * brickColumnCount) {
            //         document.getElementById("gameArea").innerHTML = `<h1>YOU WIN!</h1>`
            //         document.getElementById("score").innerText = "Score: " + score;
            //     }
            // } else if (x - ballRadius > b.x && x - ballRadius < b.x + brickWidth && y - ballRadius > b.y && y - ballRadius < b.y + brickHeight && ballColor != bricks[c][r].color) {
            //     pop.play();
            //     dy = -dy;
            //     b.status = 1;
            // }
        }
    }
}


//places score on the screen
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("Score: " + score, 8, 20);

}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

//draw ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
}

//draw paddle
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = paddleColor;
    ctx.fill();
    ctx.closePath();
}
//draw bricks on the screen
function drawBricks() {
    //loop through brick array for brick positions
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            //only draw the brick if status is 1. otherwise we hit it and no longer want it on the screen
            if (bricks[c][r].status == 1) {
                //brick positioning
                let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                //place brick on screen based on above formula
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                //draw brick using created variables
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = bricks[c][r].color;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}


//clear canvas and draw all elements
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

    //wall collission
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        pop.play();
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        pop.play();
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        //paddle collision
        if (x - ballRadius > paddleX && x - ballRadius < paddleX + paddleWidth) {
            if (y = y - paddleHeight) {
                if (ballColor != paddleColor) {
                    ballColor = paddleColor;
                }
                dy = -dy;
            }
        } else {


            lives--;
            if (!lives) {
                document.getElementById("gameArea").innerHTML = `<h1>Game Over!</h1>`
                document.getElementById("score").innerText = "Score: " + score;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    //move paddle
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    x += dx;
    y += dy;

    requestAnimationFrame(draw);
}

document.getElementById("startBreak").onclick = function () {
    if (panel.style.display === "block") {
        panel.style.display = "none";
    }
    lives = document.getElementById("lives").value;
    dx = document.getElementById("speed").value;
    dy = -dx

    //run daw function once every 10 milliseconds
    draw();
}