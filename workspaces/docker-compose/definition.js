import Blockly from 'node-blockly/browser';

Blockly.Blocks.DockerComposeDown = {
  init() {
    this.appendDummyInput()
      .appendField('Down');
      // .setCheck(null)
    // this.setInputsInline(true);
    // this.setPreviousStatement(true, null);
    // this.setNextStatement(true, null);
    this.setColour(230);
  },
};
