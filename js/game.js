"use strict";

let gameStart = null,
  gameArea = null,
  gameAreaContext = null,
  gameAreaWidth = 0,
  gameAreaHeight = 0,
  halfWidth = 0,
  halfHeight = 0,
  radius = 0,
  gameColours = [
    "red",
    "green",
    "blue",
    "yellow"
  ],
  offsetCheat = [
    0,
    25,
    33.3,
    38
  ],
  finalCount = 0;


function initialize() {
  gameStart = document.querySelector("#gameStart");
  gameArea = document.querySelector("#gameArea");
  gameAreaContext = gameArea.getContext("2d");
  gameAreaWidth = 400;
  gameAreaHeight = 400;

  shuffleArray(gameColours);

  halfWidth = gameAreaWidth/2;
  halfHeight = gameAreaHeight/2;
  radius = gameAreaHeight/20; // determines dot size based on canvas size
  
  gameArea.width = gameAreaWidth;
  gameArea.height = gameAreaHeight;
  // gameStart.onclick = function () {
  //   this.disabled = true;
  //   startGame();
  // };
  startGame();
}

function startGame() {
  // TODO implement timer

  countdown(5);

  drawCentralSquare();
  setupDots(3, "top", gameColours[0]);
  setupDots(3, "right", gameColours[1]);
  setupDots(2, "bottom", gameColours[2]);
  setupDots(3, "left", gameColours[3]);

  if (finalCount == 0) {
    initialize();
  }
}

function finishGame() {
  alert("finished");
  location.reload();
}

function countdown(seconds) {
  let timeLeft = seconds;
  let timerDisplay = document.getElementById("countdownTimer");

  function updateTimer() {
    console.log(timeLeft);
    timerDisplay.innerHTML = timeLeft;

    if (timeLeft > 0) {
      // Continue counting down
      timeLeft--;
      setTimeout(updateTimer, 1000); // Call updateTimer after 1000 milliseconds (1 second)
    } else {
      // Countdown is complete
      finishGame()
    }
  }

  // Start the countdown
  updateTimer();
}

function generateRandomDotColoursArrays(elementCount) {
  let outputArray = [];
  for (let index = 0; index < elementCount; index++) {
    let randomNumber = Math.floor(Math.random() * (elementCount + 1));
    outputArray.push(gameColours[randomNumber]);
  }
  // TODO ensure there is at least one element that's playable
  return outputArray;
}

function setupDots(elementCount, position, lineColour) {
  let posX, posY;

  let positionDeterminer = (gameAreaWidth)/ elementCount;
  let offset = positionDeterminer / 2;

  let randomDotColours = generateRandomDotColoursArrays(elementCount);

  if (position == "top") {
    posX = 0;
    posY = radius*2;

    for (let index = 0; index < elementCount; index++) {
      posX += positionDeterminer;
      let dotColour = randomDotColours[index];
      drawDot(dotColour, lineColour, posX - offset, posY, radius);
    }
  } else if (position == "right") {
    posX = gameAreaWidth - radius*2;
    posY = 0;

    for (let index = 0; index < elementCount; index++) {
      posY += positionDeterminer;
      let dotColour = randomDotColours[index];
      drawDot(dotColour, lineColour, posX, posY - offset, radius); 
    }
  } else if (position == "bottom") {
    posX = 0;
    posY = gameAreaHeight - radius*2;

    for (let index = 0; index < elementCount; index++) {
      posX += positionDeterminer;
      let dotColour = randomDotColours[index];
      drawDot(dotColour, lineColour, posX - offset, posY, radius);
    }
  } else if (position == "left") {
    posX = radius*2;
    posY = 0;

    for (let index = 0; index < elementCount; index++) {
      posY += positionDeterminer;
      let dotColour = randomDotColours[index];
      drawDot(dotColour, lineColour, posX, posY - offset, radius); 
    }
  }
}

function checkFinalCount() {
  if (finalCount == 0 ) {
    finishGame();
  }
}

function drawDot(dotColour, lineColour, posX, posY, radius) {
  let circle = new Path2D();
  gameAreaContext.beginPath();
  circle.arc(
    posX, // pos x
    posY, // pos y
    radius, // radius
    0, // start angle
    2 * Math.PI // amount of circle
  );
  gameAreaContext.fillStyle = dotColour;
  gameAreaContext.fill(circle);
  gameAreaContext.closePath();

  if (lineColour == dotColour) {
    finalCount++;
    addClick(true, lineColour, posX, posY, radius, circle);
    console.log(finalCount);
  } else {
    addClick(false, lineColour, posX, posY, radius, circle);
  }
}

function addClick(isCorrect, lineColour, posX, posY, radius, circle) {
  ['click','ontouchstart'].forEach( evt => 
    gameArea.addEventListener(evt, function(event) {
      if (gameAreaContext.isPointInPath(circle, event.offsetX, event.offsetY)) {
        drawDot("white", lineColour, posX, posY, radius);
        if (isCorrect) {
          finalCount--;
          console.log(finalCount);
          checkFinalCount();
        }
        // need to remove the click event
      }
    }));
}

function drawCentralSquare() {

  // Add a rainbowRect function to the context prototype
  // This method is used alone like context.fillRect
  // This method is not used within a context.beginPath
  // NOTE: this addition must always be run before it is used in code
  CanvasRenderingContext2D.prototype.rainbowRect = function (x,y,w,h,fillColor,tColor,rColor,bColor,lColor){

    // use existing fillStyle if fillStyle is not supplied
    fillColor=fillColor||this.fillStyle;

    // use existing strokeStyle if any strokeStyle is not supplied
    var ss=this.strokeStyle;
    tColor=tColor||ss;
    rColor=rColor||ss;
    bColor=bColor||ss;
    lColor=lColor||ss;


    // context will be modified, so save it
    this.save();

    // miter the lines
    this.lineJoin="miter";

    // helper function: draws one side's trapezoidal "stroke"
    function trapezoid(gameAreaContext,color,x1,y1,x2,y2,x3,y3,x4,y4){
        gameAreaContext.beginPath();
        gameAreaContext.moveTo(x1,y1);
        gameAreaContext.lineTo(x2,y2);
        gameAreaContext.lineTo(x3,y3);
        gameAreaContext.lineTo(x4,y4);
        gameAreaContext.closePath();
        gameAreaContext.fillStyle=color;
        gameAreaContext.fill();
    }

    // context lines are always drawn half-in/half-out
    // so context.lineWidth/2 is used a lot
    var lw=this.lineWidth*8;

    // shortcut vars for boundaries
    var L=x-lw;
    var R=x+lw;
    var T=y-lw;
    var B=y+lw;

    // top
    trapezoid(this,tColor,  L,T,  R+w,T,  L+w,B,  R,B );

    // right
    trapezoid(this,rColor,  R+w,T,  R+w,B+h,  L+w,T+h,  L+w,B );

    // bottom
    trapezoid(this,bColor,  R+w,B+h,  L,B+h,  R,T+h,  L+w,T+h );

    // left
    trapezoid(this,lColor,  L,B+h,  L,T,  R,B,  R,T+h );

    // fill
    this.fillStyle=fillColor;
    this.fillRect(x,y,w,h);

    // be kind -- always rewind (old vhs reference!)
    this.restore();
    // don't let this path leak
    this.beginPath();
    // chain
    return(this);
  };

  gameAreaContext.rainbowRect(
    halfWidth/2, // pos x
    halfHeight/2, // pos y
    halfWidth, // width
    halfHeight, // height
    "white",
    gameColours[0],
    gameColours[1],
    gameColours[2],
    gameColours[3]
  )

}

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
}

window.onload = initialize;