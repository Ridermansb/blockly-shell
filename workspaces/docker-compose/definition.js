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
      .appendField(new Blockly.FieldCheckbox("TRUE"), "RemoveVolumes")
      .appendField("Remove containers?")
      .appendField(new Blockly.FieldCheckbox("TRUE"), "RemoveContainers");
    this.setInputsInline(false);
    this.setPreviousStatement(true, ["String", "DockerCompose"]);
    this.setNextStatement(true, "String");
    this.setColour(220);
    this.setTooltip("Stops containers and removes containers, networks, volumes, and images created by up.");
  }
}
