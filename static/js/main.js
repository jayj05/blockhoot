(function () {
    const socketio = io(); 
    const gameArea = new GameArea(400, 300, 16, 13);

    gameArea.currMap = gameArea.mapSetup(maps.level_1); ; 

    let levelCount = 1; 
    const player = new Player(20, 20, gameArea.startX, gameArea.startY, gameArea);
    const moveDone = new Event("moveDone", {bubbles: true}); 
    const startMove = new Event("startMove", {bubbles: true}); 
    const nextLevel = new Event("nextLevel", {bubbles: true}); 
    const updateScore = new Event("updateScore", {bubble: true}); 
    const canvas = document.querySelector("canvas"); 


    function updateGameArea(player, gameArea)
    {
        gameArea.clear();
        gameArea.update(gameArea.currMap.map);
        player.handleMove(moveDone, nextLevel, updateScore, gameArea.currMap.barriers); 
        player.update(); 
    }

    function startGame()
    {
        gameArea.start(); 
        setInterval(updateGameArea, 20, player, gameArea); 
    }

    function handlePlay() 
    {
        // Grabbing users workspace
        const workspace = Blockly.common.getMainWorkspace(); 
        // Converting the blocks to javascript code
        let code = Blockly.JavaScript.workspaceToCode(workspace); 
        // Dispatching a starter event that gets the player moving 
        code += "canvas.dispatchEvent(startMove);"; 
        try 
        {
            eval(code)
        } 
        catch (error) {
            console.log(error); 
        }
    }

    function handleStartMove()
    {
        canvas.dispatchEvent(moveDone); 
    }

    function handleNextLevel()
    {
        console.log("next level"); 
        levelCount += 1; 

        if (levelCount == 2)
        {
            console.log("level 2"); 
            gameArea.currMap = gameArea.mapSetup(maps.level_2); 
            player.x = gameArea.startX; 
            player.y = gameArea.startY; 
        }
        else if (levelCount == 3)
        {
            gameArea.currMap = gameArea.mapSetup(maps.level_3);
            player.x = gameArea.startX; 
            player.y = gameArea.startY; 
        }
    }

    function handleUpdateScore ()
    {
        socketio.emit('updateScore', player.score); 
    }

    toolbox = {
        'kind':'flyoutToolbox',
        'contents': [
            {
                'kind': 'block', 
                'type': 'move_left'
            }, 
            {
                'kind': 'block', 
                'type': 'move_right'
            },
            {
                'kind': 'block',
                'type': 'move_down'
            }, 
            {
                'kind': 'block', 
                'type': 'move_up'
            }
        ] 
    };

    Blockly.inject('blocklyDiv', {
        toolbox: toolbox, 
        scrollbars: false
    })

    // params - list[obj]
    // Receiving sorted leaderboard
    socketio.on('updateLeaderboard', (data) => {
        console.log("[UPDATE LEADERBOARD]");
        // Take top 5 only and display the user's place below the top 5
        const leaderboard = document.getElementById("leaderboard"); 
        
        for (let i = 0; i < data.length; i++)
        {
            let playerDiv = document.createElement("div"); 
            let playerName = data[i]['name']; 
            let playerScore = data[i]['score']; 
            playerDiv.innerHTML = playerName + ': ' + playerScore; 
            playerDiv.style = "color: red;"
            leaderboard.appendChild(playerDiv); 
        }

    });

    document.querySelector("#run-btn").addEventListener("click", handlePlay); 
    canvas.addEventListener("startMove", handleStartMove); 
    canvas.addEventListener("moveDone", player.play); 
    canvas.addEventListener("nextLevel", handleNextLevel); 
    canvas.addEventListener("updateScore", handleUpdateScore); 
    startGame();
})();