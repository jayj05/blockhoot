Blockly.common.defineBlocksWithJsonArray([
    {
        "type": "move_left",
        "message0": "LEFT",
        "previousStatement": null,
        "nextStatement": null,
        "colour": 180,
        "tooltip": "",
        "helpUrl": ""
    }
]); 

Blockly.JavaScript['move_left'] = function(block) {
    return 'player.queue.push("move_left");\n'; 
}


Blockly.common.defineBlocksWithJsonArray([
    {
        "type": "move_right", 
        "message0": "RIGHT", 
        "previousStatement": null, 
        "nextStatement": null, 
        "colour": 180
    }
]); 

Blockly.JavaScript['move_right'] = function(block) {
    return 'player.queue.push("move_right");\n';
}


Blockly.common.defineBlocksWithJsonArray([
    {
        "type": "move_down",
        "message0": "DOWN", 
        "previousStatement": null, 
        "nextStatement": null, 
        "colour": 180
    }
]);

Blockly.JavaScript['move_down'] = function(block) {
    return 'player.queue.push("move_down");\n'; 
}


Blockly.common.defineBlocksWithJsonArray([
    {
        "type": "move_up",
        "message0": "UP", 
        "previousStatement": null, 
        "nextStatement": null, 
        "colour": 180
    }
]);

Blockly.JavaScript['move_up'] = function(block) {
    return 'player.queue.push("move_up");\n'; 
}