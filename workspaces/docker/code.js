import Blockly from 'node-blockly/browser';

Blockly.Shell.Line = (block) => {
  const separator = block.getFieldValue('SEPARATOR');
  const statements = Blockly.Shell.statementToCode(block, 'LINES').trim();
  return `${statements.split('\n').map(s => s.trim()).join(separator)}\n`;
};

Blockly.Shell.DockerComposeDown = (block) => {
  const removeImage = block.getFieldValue('RemoveImage');
  const removeVolumes = block.getFieldValue('RemoveVolumes') === 'TRUE';
  const removeContainers = block.getFieldValue('RemoveContainers') === 'TRUE';

  let code = 'down';
  if (removeImage && removeImage !== '0') {
    code += ` --rmi ${removeImage}`
  }

  if (removeVolumes) {
    code += ' -v'
  }

  if (removeContainers) {
    code += ' --remove-orphans'
  }

  return `docker-compose ${code.trim()}\n`;
}

Blockly.Shell.DockerComposeRm = (block) => {
  const force = block.getFieldValue('FORCE') === 'TRUE';
  const stop = block.getFieldValue('STOP') === 'TRUE';
  const remove_volumes = block.getFieldValue('REMOVE_VOLUMES') === 'TRUE';
  const service = Blockly.JavaScript.valueToCode(block, 'SERVICE',
    Blockly.JavaScript.ORDER_ATOMIC) || '';

  let code = 'rm';
  if (force) {
    code += ' -f'
  }
  if (stop) {
    code += ' -s'
  }
  if (remove_volumes) {
    code += ' -v'
  }

  return `docker-compose ${code.trim()} ${service.trim()}\n`;
};

Blockly.Shell.math_number = (block) => {
  const val = parseInt(block.getFieldValue('NUM'), 10);
  return [val, Blockly.Shell.ORDER_ATOMIC];
};
Blockly.Shell.string_block = (block) => {
  return block.getFieldValue('content');
};

Blockly.Shell.variables = {};

Blockly.Shell.variables_get = function(block) {
  const code = Blockly.Shell.variableDB_
   .getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  return [`$${code.trim()}`, Blockly.Shell.ORDER_ATOMIC];
};

Blockly.Shell.variables_set = function(block) {
  const argument0 = Blockly.JavaScript.valueToCode(block, 'VALUE',
      Blockly.Shell.ORDER_ASSIGNMENT);

  if (argument0) {
    const varName = Blockly.Shell.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    return `set ${varName}=${argument0}\n`;
  }

  return '';

}