import Blockly from 'node-blockly/browser';

/**
 * @see https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#t47qjh
 * @type {{init: (())}}
 */
Blockly.Blocks.DockerCompose = {
  init() {
    this.appendStatementInput("DockerCompose")
      .setCheck("String")
      .appendField("Docker Compose");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(10);
  },
};

/**
 * @see https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#r4efaw
 * @type {{init: (())}}
 */
Blockly.Blocks.DockerComposeDown = {
  init() {
    this.appendDummyInput()
      .appendField("down")
      .appendField("Remove Image?")
      .appendField(new Blockly.FieldDropdown([["No","0"], ["All","all"], ["Local","local"]]), "RemoveImage")
      .appendField("Remove volumes?")
      .appendField(new Blockly.FieldCheckbox("FALSE"), "RemoveVolumes")
      .appendField("Remove containers?")
      .appendField(new Blockly.FieldCheckbox("FALSE"), "RemoveContainers");
    this.setInputsInline(false);
    this.setPreviousStatement(true, ["String", "DockerCompose"]);
    this.setNextStatement(true, "String");
    this.setColour(220);
    this.setTooltip("Stops containers and removes containers, networks, volumes, and images created by up.");
    this.setHelpUrl("https://docs.docker.com/compose/reference/down/");
  }
}


Blockly.Blocks.DockerComposeRm = {
  init: function() {
    this.appendValueInput("DOCKER_COMPOSE_RM_SERVICE")
      .setCheck("String")
      .appendField("rm")
      .appendField("Force?")
      .appendField(new Blockly.FieldCheckbox("FALSE"), "FORCE")
      .appendField("Stop?")
      .appendField(new Blockly.FieldCheckbox("FALSE"), "STOP")
      .appendField("Remove Volumes?")
      .appendField(new Blockly.FieldCheckbox("FALSE"), "REMOVE_VOLUMES")
      .appendField("Service");
    this.setInputsInline(true);
    this.setPreviousStatement(true, ["DockerCompose", "String"]);
    this.setNextStatement(true, "String");
    this.setColour(230);
    this.setTooltip("Removes stopped service containers.");
    this.setHelpUrl("https://docs.docker.com/compose/reference/rm/");
  }
};