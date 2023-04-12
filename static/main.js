(function () {

    const gameArea = new GameArea(400, 300, 16, 13);
    const map = gameArea.mapSetup().map;
    const player = new Player(20, 20, gameArea.startX, gameArea.startY, gameArea);

    function updateGameArea(player, gameArea, map)
    {
        gameArea.clear()
        gameArea.update(map);  
        player.update(); 
    }

    function startGame()
    {
        gameArea.start(); 
        update = updateGameArea(player, gameArea, map); 
        setInterval(update, 20); 
    }

    function play()
    {
        let next = moves_queue.shift(); 
        while(next)
        {
            if (next == "move_left")
            {
                player.move_left(); 
            } 
            else if (next == "move_right")
            {
                player.move_right(); 
            }
            next = moves_queue.shift();  
        }
    }

    function handlePlay() 
    {
        const workspace = Blockly.common.getMainWorkspace(); 
        let code = Blockly.JavaScript.workspaceToCode(workspace); 
        console.log(code); 
        try 
        {
            eval(code)
        } 
        catch (error) {
            console.log(error); 
        }
    }

    toolbox = {
        'kind':'flyoutToolbox',
        'contents': [
            {
                'kind': 'block',
                'type': 'controls_if'
            }, 
            {
                'kind': 'block', 
                'type': 'move_left'
            }, 
            {
                'kind': 'block', 
                'type': 'move_right'
            }
        ] 
    };

    Blockly.inject('blocklyDiv', {
        toolbox: toolbox, 
        scrollbars: false
    })

    document.querySelector("#run-btn").addEventListener("click", handlePlay); 
    startGame();
})();

// MAKE BLOCK MOVE!!!