import Blockly from 'node-blockly/browser'

Blockly.DockerCompose = new Blockly.Generator('DockerCompose');

Blockly.DockerCompose.addReservedWords(
  'build,up,down'
);

Blockly.DockerCompose.init = function(workspace) {
  // Create a dictionary of definitions to be printed before the code.
  Blockly.DockerCompose.definitions_ = Object.create(null);
  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions).
  Blockly.DockerCompose.functionNames_ = Object.create(null);

  if (!Blockly.DockerCompose.variableDB_) {
    Blockly.DockerCompose.variableDB_ =
      new Blockly.Names(Blockly.DockerCompose.RESERVED_WORDS_);
  } else {
    Blockly.DockerCompose.variableDB_.reset();
  }

  var defvars = [];
  var variables = workspace.getAllVariables();
  if (variables.length) {
    for (var i = 0; i < variables.length; i++) {
      defvars[i] = Blockly.DockerCompose.variableDB_.getName(variables[i].name,
        Blockly.Variables.NAME_TYPE);
    }
    Blockly.DockerCompose.definitions_['variables'] =
      'var ' + defvars.join(', ') + ';';
  }
};

Blockly.DockerCompose.finish = function(code) {
  // Convert the definitions dictionary into a list.
  var definitions = [];
  for (var name in Blockly.DockerCompose.definitions_) {
    definitions.push(Blockly.DockerCompose.definitions_[name]);
  }
  // Clean up temporary data.
  delete Blockly.DockerCompose.definitions_;
  delete Blockly.DockerCompose.functionNames_;
  Blockly.DockerCompose.variableDB_.reset();
  return definitions.join('\n\n') + '\n\n\n' + code;
};

Blockly.DockerCompose.scrubNakedValue = function(line) {
  return line + ';\n';
};

Blockly.DockerCompose.quote_ = function(string) {
  // Can't use goog.string.quote since Google's style guide recommends
  // JS string literals use single quotes.
  string = string.replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\\n')
    .replace(/'/g, '\\\'');
  return '\'' + string + '\'';
};

Blockly.DockerCompose.scrub_ = function(block, code) {
  var commentCode = '';
  // Only collect comments for blocks that aren't inline.
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    var comment = block.getCommentText();
    comment = Blockly.utils.wrap(comment, Blockly.DockerCompose.COMMENT_WRAP - 3);
    if (comment) {
      if (block.getProcedureDef) {
        // Use a comment block for function comments.
        commentCode += '/**\n' +
          Blockly.DockerCompose.prefixLines(comment + '\n', ' * ') +
          ' */\n';
      } else {
        commentCode += Blockly.DockerCompose.prefixLines(comment + '\n', '// ');
      }
    }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
    for (var i = 0; i < block.inputList.length; i++) {
      if (block.inputList[i].type == Blockly.INPUT_VALUE) {
        var childBlock = block.inputList[i].connection.targetBlock();
        if (childBlock) {
          var comment = Blockly.DockerCompose.allNestedComments(childBlock);
          if (comment) {
            commentCode += Blockly.DockerCompose.prefixLines(comment, '// ');
          }
        }
      }
    }
  }
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  var nextCode = Blockly.DockerCompose.blockToCode(nextBlock);
  return commentCode + code + nextCode;
};

Blockly.DockerCompose.getAdjusted = function(block, atId, opt_delta, opt_negate,
                                          opt_order) {
  var delta = opt_delta || 0;
  var order = opt_order || Blockly.DockerCompose.ORDER_NONE;
  if (block.workspace.options.oneBasedIndex) {
    delta--;
  }
  var defaultAtIndex = block.workspace.options.oneBasedIndex ? '1' : '0';
  if (delta > 0) {
    var at = Blockly.DockerCompose.valueToCode(block, atId,
        Blockly.DockerCompose.ORDER_ADDITION) || defaultAtIndex;
  } else if (delta < 0) {
    var at = Blockly.DockerCompose.valueToCode(block, atId,
        Blockly.DockerCompose.ORDER_SUBTRACTION) || defaultAtIndex;
  } else if (opt_negate) {
    var at = Blockly.DockerCompose.valueToCode(block, atId,
        Blockly.DockerCompose.ORDER_UNARY_NEGATION) || defaultAtIndex;
  } else {
    var at = Blockly.DockerCompose.valueToCode(block, atId, order) ||
      defaultAtIndex;
  }

  if (Blockly.isNumber(at)) {
    // If the index is a naked number, adjust it right now.
    at = parseFloat(at) + delta;
    if (opt_negate) {
      at = -at;
    }
  } else {
    // If the index is dynamic, adjust it in code.
    if (delta > 0) {
      at = at + ' + ' + delta;
      var innerOrder = Blockly.DockerCompose.ORDER_ADDITION;
    } else if (delta < 0) {
      at = at + ' - ' + -delta;
      var innerOrder = Blockly.DockerCompose.ORDER_SUBTRACTION;
    }
    if (opt_negate) {
      if (delta) {
        at = '-(' + at + ')';
      } else {
        at = '-' + at;
      }
      var innerOrder = Blockly.DockerCompose.ORDER_UNARY_NEGATION;
    }
    innerOrder = Math.floor(innerOrder);
    order = Math.floor(order);
    if (innerOrder && order >= innerOrder) {
      at = '(' + at + ')';
    }
  }
  return at;
};