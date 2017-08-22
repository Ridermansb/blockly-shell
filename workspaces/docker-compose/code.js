import Blockly from 'node-blockly/browser';

Blockly.DockerCompose.DockerCompose = (block) => {
  const statements = Blockly.DockerCompose.statementToCode(block, 'DockerCompose');
  return `${statements.trim().split('\n').join(';')}\n`;
};

Blockly.DockerCompose.DockerComposeDown = (block) => {
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

Blockly.DockerCompose.DockerComposeRm = (block) => {
  const force = block.getFieldValue('FORCE') === 'TRUE';
  const stop = block.getFieldValue('STOP') === 'TRUE';
  const remove_volumes = block.getFieldValue('REMOVE_VOLUMES') === 'TRUE';
  const service = Blockly.DockerCompose.valueToCode(block, 'DOCKER_COMPOSE_RM_SERVICE',
    Blockly.DockerCompose.ORDER_ATOMIC) || '';

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