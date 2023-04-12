(function () {

    const gameArea = new GameArea(400, 300, 16, 13);
    const map = gameArea.mapSetup().map;
    const player = new Player(20, 20, gameArea.startX, gameArea.startY, gameArea);
    const moveDone = new Event("moveDone", {bubbles: true}); 
    const startMove = new Event("startMove", {bubbles: true}); 
    const canvas = document.querySelector("canvas"); 

    function updateGameArea(player, gameArea, map)
    {
        gameArea.clear();
        gameArea.update(map);
        player.handleMove(canvas, moveDone, gameArea.mapSetup().barriers); 
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

    startGame();
})();