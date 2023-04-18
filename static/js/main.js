(function () {

    const gameArea = new GameArea(400, 300, 16, 13);
    let map = gameArea.mapSetup(maps.level_1); 
    let levelCount = 1; 
    const player = new Player(20, 20, gameArea.startX, gameArea.startY, gameArea);
    const moveDone = new Event("moveDone", {bubbles: true}); 
    const startMove = new Event("startMove", {bubbles: true}); 
    const nextLevel = new Event("nextLevel", {bubbles: true}); 
    const canvas = document.querySelector("canvas"); 


    function updateGameArea(player, gameArea, map)
    {
        gameArea.clear();
        gameArea.update(map.map);
        player.handleMove(moveDone, nextLevel, map.barriers); 
        player.update(); 
    }

    function startGame()
    {
        gameArea.start(); 
        setInterval(updateGameArea, 20, player, gameArea, map); 
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
            map = gameArea.mapSetup(maps.level_2); 
        }
        else if (levelCount == 3)
        {
            map = gameArea.mapSetup(maps.level_3); 
        }
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

    document.querySelector("#run-btn").addEventListener("click", handlePlay); 
    canvas.addEventListener("startMove", handleStartMove); 
    canvas.addEventListener("moveDone", player.play); 
    canvas.addEventListener("nextLevel", handleNextLevel); 

    startGame();
})();