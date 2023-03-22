
    function Player(width, height, x, y, gameArea)
    {
        this.width = width ;
        this.height = height;
        this.x = x; 
        this.y = y; 
        this.stopMove = false; 
        this.score = 0; 
        this.update = () => {
            gameArea.context.fillStyle = "blue"; 
            gameArea.context.fillRect(this.x, this.y, width, height);
        }

        this.collisionDetection = (mapPieces) => {
            for (let piece = 0; piece < mapPieces.length; piece++)
            {
                let mapPiece = mapPieces[piece]; 
                if ((this.x >= mapPiece.x && this.x <= mapPiece.x + mapPiece.width)&&
                (this.y >= mapPiece.y && this.y <= mapPiece.y + mapPiece.height))
                {
                    console.log("Collision detected"); 
                    this.stopMove = true; 
                }
            }
        }

        this.move_left = async function () {
            const maps = gameArea.mapSetup(); 
            const barriers = maps.barriers; 
            const map = maps.map; 
           for (let i = 0; i <= 10; i++)
           {
                if (this.stopMove)
                {
                    this.reset(map); 
                    break;
                }
                gameArea.clear(); 
                gameArea.update(map); 
                this.collisionDetection(barriers); 
                this.x -= 5;
                this.update();
                await new Promise(r => setTimeout(r, 100)); 
           } 
        }

        this.move_right = async function () {
            const maps = gameArea.mapSetup(); 
            const barriers = maps.barriers; 
            const map = maps.map; 
           for (let i = 0; i <= 10; i++)
           {
                if (this.stopMove)
                {
                    this.reset(map); 
                    break;
                }
                this.handleMove(map, barriers, "right"); 
                await new Promise(r => setTimeout(r, 100)); 
           } 
        }

        this.reset = (map) => {
            this.x = gameArea.startX;
            this.y = gameArea.startY; 
            gameArea.clear();
            gameArea.update(map); 
            this.update();
        }

        this.handleMove = (map, barriers, direction) => {
            gameArea.clear(); 
            gameArea.update(map); 
            this.collisionDetection(barriers); 

            if (direction == "left")
            {
                this.x -= 5; 
            }
            else if (direction == "right")
            {
                this.x += 5; 
            }
            else if (direction == "up")
            {
                this.y -= 5; 
            }
            else if (direction == "down")
            {
                this.y += 5; 
            }

            this.update(); 
        }
    }


    function Component(width, height, x, y, context)
    {
        this.width = width; 
        this.height = height; 
        this.x = x; 
        this.y = y; 
        this.color = "black"; 

        this.update = () => {
            context.fillStyle = this.color; 
            context.fillRect(this.x, this.y, width, height); 
        }
    }


    function GameArea(width, height, rowCount, colCount) 
    {
        this.canvas = document.getElementById("gameArea"); 
        this.context = this.canvas.getContext("2d"); 
        this.rowCount = rowCount; 
        this.colCount = colCount; 
        this.startX = 0; 
        this.startY = 0; 
        this.map; 

        this.start = () => {
            this.canvas.height = height; 
            this.canvas.width = width; 
            this.canvas.style = "border: 2px solid black;"; 
        }

        this.clear = () => {
            this.context.clearRect(0, 0, width, height);
        }

        this.mapSetup = () => {
            // Add a start and end tile 
            this.map = [
                [1, 1, 1, 0, 2, 1, 0, 0, 1, 1, 1, 1, 1], 
                [1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1], 
                [1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1], 
                [1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1], 
                [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1], 
                [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
                [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
                [1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1], 
                [1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1], 
                [1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
                [1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1], 
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1], 
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1], 
                [1, 1, 1, 1, 1, 1 ,1 ,1, 1, 1, 1, 3, 1]
            ]; 

    
            const pieceWidth = width/colCount;
            const pieceHeight = height/rowCount;
            let mapPieces = []; 
            let barrierPieces = []; 
            let mapPiece; 
            for (let row = 0; row < rowCount; row++)
            {
                for (let col = 0; col < colCount; col++)
                {
                    const tile = this.map[row][col]; 
                    if (tile == 1) 
                    {
                        mapPiece = new Component(pieceWidth, pieceHeight, 
                            pieceWidth*col, pieceHeight*row, this.context);
                        mapPieces.push(mapPiece); 
                        barrierPieces.push(mapPiece)
                    }
                    else if (tile == 2)
                    {
                        mapPiece = new Component(pieceWidth, pieceHeight,
                            pieceWidth*col, pieceHeight*row, this.context); 
                        this.startX = pieceWidth*col; 
                        this.startY = pieceHeight*row; 
                        mapPiece.color = "green"; 
                        mapPieces.push(mapPiece); 
                    }
                    else if (tile == 3)
                    {
                        mapPiece = new Component(pieceWidth, pieceHeight,
                            pieceWidth*col, pieceHeight*row, this.context); 
                        mapPiece.color = "red"; 
                        mapPieces.push(mapPiece); 
                    }
                }
            }
            return {
                map: mapPieces,
                barriers: barrierPieces
            }; 
        }

        this.update = (map) => {
            for (let piece = 0; piece < map.length; piece++)
            {
                const mapPiece = map[piece]; 
                mapPiece.update(); 
            }
        }
    }

    // Implement as linked list
    moves_queue = []; 