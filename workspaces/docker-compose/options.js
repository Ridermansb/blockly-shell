import Blockly from 'node-blockly/browser';
import toolbox from './toolbox.xml';

const options = {
  toolbox: Blockly.Xml.textToDom(toolbox),
  trashcan: true,
  scrollbars: false,
  sounds: false,
  grid: { spacing: 13, length: 1.6, snap: true },
  zoom: { controls: true, wheel: true },
};

export default options;
