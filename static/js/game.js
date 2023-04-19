function Player(width, height, x, y, gameArea)
{
    this.width = width ;
    this.height = height;

    this.startX = x; 
    this.startY = y; 

    this.x = x; 
    this.y = y; 
    this.score = 0; 

    this.stepTrack = 0; 
    
    this.stopMove = false; 
    this.isMovingLeft = false; 
    this.isMovingRight = false;
    this.isMovingDown = false; 
    this.isMovingUp = false;  

    this.isTouchingEndTile = false; 

    this.queue = [];
    
    this.img = new Image(); 

    this.update = () => {
        
        gameArea.context.drawImage(this.img, this.x, this.y, this.width, this.height);
        this.img.src = 'static/assets/shrek.png';
    }

    this.collisionDetection = (barriers, nextLevel, updateScore) => {
  
        for (let piece = 0; piece < barriers.length; piece++)
        {
            let barrier = barriers[piece]; 
            if (((this.x <= barrier.x + barrier.width && this.x >= barrier.x) || 
                 (this.x + this.width >= barrier.x && this.x + this.width <= barrier.x + barrier.width)) &&
                ((this.y + this.height >= barrier.y && this.y + this.height <= barrier.y + barrier.height)||
                 (this.y <= barrier.y + barrier.height && this.y >= barrier.y)))
            {
                if (barrier.isEndTile)
                {
                    console.log("hit end tile"); 
                    this.score += 500; 
                    this.isTouchingEndTile = true
                    gameArea.canvas.dispatchEvent(updateScore)
                    gameArea.canvas.dispatchEvent(nextLevel); 
                }
                console.log('collision'); 
                this.stopMove = true; 
                this.x = this.startX; 
                this.y = this.startY; 
                this.queue = []
            }
        }
    }

    this.move_left = function () {
        this.isMovingLeft = true; 
    }

    this.move_right = function () {
        this.isMovingRight = true;
    }

    this.move_down = function () {
        this.isMovingDown = true; 
    }

    this.move_up = function () {
        this.isMovingUp = true; 
    }

    this.play = () => {
        // Retrieves the next code block to execute 
        let next = this.queue.shift(); 
        if (next)
        {
            if (next == "move_left")
            {
                this.move_left(); 
            }
            else if (next == "move_right")
            {
                this.move_right(); 
            }
            else if (next == "move_down")
            {
                this.move_down(); 
            }
            else if (next == "move_up")
            {
                this.move_up(); 
            }
        }
    }

    this.handleMove = (moveEvent, nextLevelEvent, updateScoreEvent, barriers) => {
        if (this.stepTrack <= gameArea.moveDistance && !this.stopMove)
        {
            if (this.isMovingLeft)
            {
                this.collisionDetection(barriers, nextLevelEvent, updateScoreEvent);
                this.x -= 1; 
                this.stepTrack += 1; 
            }
            else if (this.isMovingRight)
            {
                this.collisionDetection(barriers, nextLevelEvent, updateScoreEvent); 
                this.x += 1; 
                this.stepTrack += 1; 
            }
            else if (this.isMovingDown)
            {
                this.collisionDetection(barriers, nextLevelEvent, updateScoreEvent); 
                this.y += 1; 
                this.stepTrack += 1; 
            }
            else if (this.isMovingUp)
            {
                this.collisionDetection(barriers, nextLevelEvent, updateScoreEvent); 
                this.y -= 1; 
                this.stepTrack += 1; 
            }
        }
        else 
        {
            this.isMovingLeft = false; 
            this.isMovingRight = false; 
            this.isMovingDown = false; 
            this.isMovingUp = false; 
            this.stopMove = false; 
            this.stepTrack = 0; 
            gameArea.canvas.dispatchEvent(moveEvent); 
        }
    }
}


function Component(width, height, x, y, context, isEndTile, img_source)
{
    this.width = width; 
    this.height = height; 
    this.x = x; 
    this.y = y; 
    this.isEndTile = isEndTile; 
    this.img = new Image(); 

    this.update = () => {
        // Redrawing object every frame of the game
        context.drawImage(this.img, this.x, this.y, this.width, this.height);
        this.img.src = img_source; 
    }
}


function GameArea(width, height, rowCount, colCount) 
{
    this.canvas = document.getElementById("gameArea"); 
    this.context = this.canvas.getContext("2d"); 

    this.rowCount = rowCount; 
    this.colCount = colCount; 
    this.moveDistance = width/rowCount;
    // X and Y position for start tile 
    this.startX = 0; 
    this.startY = 0;

    this.currMap = null; 

    this.start = () => {
        // Initialize settings for canvas element 
        this.canvas.height = height; 
        this.canvas.width = width; 
        this.canvas.style = "border: 2px solid black;"; 
    }

    this.clear = () => {
        // refreshing screen before the redraw
        this.context.clearRect(0, 0, width, height);
    }

    this.mapSetup = (map, path_img, barrier_img, endtile_img) => {
        // Map Layout
        const pieceWidth = width/colCount;
        const pieceHeight = height/rowCount;
        let mapPieces = []; 
        let barrierPieces = []; 
        let mapPiece; 

        // Storing components objects in arrays for iteration in
        // collision and redrawing them to the screen using update
        for (let row = 0; row < rowCount; row++)
        {
            for (let col = 0; col < colCount; col++)
            {
                const tile = map[row][col]; 

                if (tile == 0)
                {
                    mapPiece = new Component(pieceWidth, pieceHeight, 
                        pieceWidth*col, pieceHeight*row, this.context, false, barrier_img);
                    mapPieces.push(mapPiece); 
                    barrierPieces.push(mapPiece); 
                }
                else if (tile == 1) 
                {
                    mapPiece = new Component(pieceWidth, pieceHeight, 
                        pieceWidth*col, pieceHeight*row, this.context, false, path_img);
                    mapPieces.push(mapPiece); 
                }
                // Start tile 
                else if (tile == 2)
                {
                    mapPiece = new Component(pieceWidth, pieceHeight,
                        pieceWidth*col, pieceHeight*row, this.context, false, path_img); 
                    this.startX = pieceWidth*col; 
                    this.startY = pieceHeight*row; 
                    mapPieces.push(mapPiece); 
                }
                // End tile 
                else if (tile == 3)
                {
                    mapPiece = new Component(pieceWidth, pieceHeight,
                        pieceWidth*col, pieceHeight*row, this.context, true, endtile_img); 
                    mapPiece.isEndTile = true; 
                    mapPieces.push(mapPiece); 
                    barrierPieces.push(mapPiece); 
                }
            }
        }
        // Returning object containing all tiles in the map and barriers
        return {
            map: mapPieces,
            barriers: barrierPieces
        }; 
    }

    this.update = (map) => {
        // Redrawing all tiles on the screen
        for (let piece = 0; piece < map.length; piece++)
        {
            const mapPiece = map[piece]; 
            mapPiece.update(); 
        }
    }
}