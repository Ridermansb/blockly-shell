import Blockly from 'node-blockly/browser';

/**
 * @see https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#5mdw7b
 * @type {{init: (())}}
 */
Blockly.Blocks.Line = {
  init() {
    this.appendStatementInput("LINES")
      .setCheck("String")
      .setAlign(Blockly.ALIGN_CENTRE)
      .appendField("Split by")
      .appendField(new Blockly.FieldDropdown([["&&"," && "], ["||"," || "], [";","; "]]), "SEPARATOR");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(225);
    this.setHelpUrl("https://stackoverflow.com/a/5130889/491181");
  },
};

/**
 * @see https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#b86mu3
 * @type {{init: (())}}
 */
Blockly.Blocks.DockerComposeDown = {
  init() {
    this.appendDummyInput()
      .appendField("docker-compose down");
    this.appendDummyInput()
      .appendField("Remove Image?")
      .appendField(new Blockly.FieldDropdown([["No","0"], ["All","all"], ["Local","local"]]), "RemoveImage")
      .appendField("Remove volumes?")
      .appendField(new Blockly.FieldCheckbox("FALSE"), "RemoveVolumes")
      .appendField("Remove containers?")
      .appendField(new Blockly.FieldCheckbox("FALSE"), "RemoveContainers");
    this.setInputsInline(false);
    this.setPreviousStatement(true, "String");
    this.setNextStatement(true, "String");
    this.setColour(225);
    this.setTooltip("Stops containers and removes containers, networks, volumes, and images created by up.");
    this.setHelpUrl("https://docs.docker.com/compose/reference/down/");
  }
}

/**
 * @see https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#ntergh
 * @type {{init: Blockly.Blocks.DockerComposeRm.init}}
 */
Blockly.Blocks.DockerComposeRm = {
  init: function() {
    this.appendDummyInput()
      .appendField("docker-compose rm");
    this.appendValueInput("SERVICE")
      .setCheck("String")
      .appendField("Force?")
      .appendField(new Blockly.FieldCheckbox("FALSE"), "FORCE")
      .appendField("Stop?")
      .appendField(new Blockly.FieldCheckbox("FALSE"), "STOP")
      .appendField("Remove Volumes?")
      .appendField(new Blockly.FieldCheckbox("FALSE"), "REMOVE_VOLUMES")
      .appendField("Service");
    this.setPreviousStatement(true, "String");
    this.setNextStatement(true, "String");
    this.setColour(230);
    this.setTooltip("Removes stopped service containers.");
    this.setHelpUrl("https://docs.docker.com/compose/reference/rm/");
  }
};