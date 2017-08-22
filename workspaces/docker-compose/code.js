import Blockly from 'node-blockly/browser';

Blockly.DockerCompose.DockerCompose = (block) => {
  const statements = Blockly.DockerCompose.statementToCode(block, 'DockerCompose');
  return `docker-compose ${statements}\n`;
};

Blockly.DockerCompose.DockerComposeDown = (block) => {
  const removeimage = block.getFieldValue('RemoveImage');
  const removevolumes = block.getFieldValue('RemoveVolumes') === 'TRUE';
  const removecontainers = block.getFieldValue('RemoveContainers') === 'TRUE';

  let code = 'down';
  if (removeimage && removeimage !== '0') {
    code += ` --rmi ${removeimage}`
  }

  if (removevolumes) {
    code += ' -v'
  }

  if (removecontainers) {
    code += ' --remove-orphans'
  }

  return code;
}