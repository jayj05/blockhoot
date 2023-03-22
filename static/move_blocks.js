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
    return 'player.move_left();\n'; 
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
    return 'player.move_right();\n'
}