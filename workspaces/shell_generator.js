import Blockly from 'node-blockly/browser'

Blockly.Shell = new Blockly.Generator('Shell');

Blockly.Shell.addReservedWords(
  'build,up,down'
);


Blockly.Shell.ORDER_ATOMIC = 0;         // 0 ""
Blockly.Shell.ORDER_MEMBER = 1;         // . []
Blockly.Shell.ORDER_NEW = 1;            // new
Blockly.Shell.ORDER_TYPEOF = 1;         // typeof
Blockly.Shell.ORDER_FUNCTION_CALL = 1;  // ()
Blockly.Shell.ORDER_INCREMENT = 1;      // ++
Blockly.Shell.ORDER_DECREMENT = 1;      // --
Blockly.Shell.ORDER_LOGICAL_NOT = 2;    // !
Blockly.Shell.ORDER_BITWISE_NOT = 2;    // ~
Blockly.Shell.ORDER_UNARY_PLUS = 2;     // +
Blockly.Shell.ORDER_UNARY_NEGATION = 2; // -
Blockly.Shell.ORDER_MULTIPLICATION = 3; // *
Blockly.Shell.ORDER_DIVISION = 3;       // /
Blockly.Shell.ORDER_MODULUS = 3;        // %
Blockly.Shell.ORDER_ADDITION = 4;       // +
Blockly.Shell.ORDER_SUBTRACTION = 4;    // -
Blockly.Shell.ORDER_BITWISE_SHIFT = 5;  // << >>
Blockly.Shell.ORDER_RELATIONAL = 6;     // < <= > >=
Blockly.Shell.ORDER_EQUALITY = 7;       // == !=
Blockly.Shell.ORDER_BITWISE_AND = 8;   // &
Blockly.Shell.ORDER_BITWISE_XOR = 9;   // ^
Blockly.Shell.ORDER_BITWISE_OR = 10;    // |
Blockly.Shell.ORDER_LOGICAL_AND = 11;   // &&
Blockly.Shell.ORDER_LOGICAL_OR = 12;    // ||
Blockly.Shell.ORDER_CONDITIONAL = 13;   // ?:
Blockly.Shell.ORDER_ASSIGNMENT = 14;    // = += -= *= /= %= <<= >>= ...
Blockly.Shell.ORDER_COMMA = 15;         // ,
Blockly.Shell.ORDER_NONE = 99;          // (...)

Blockly.Shell.INFINITE_LOOP_TRAP = null;

Blockly.Shell.init = function(workspace) {
  // Create a dictionary of definitions to be printed before the code.
  Blockly.Shell.definitions_ = Object.create(null);
  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions).
  Blockly.Shell.functionNames_ = Object.create(null);

  if (!Blockly.Shell.variableDB_) {
    Blockly.Shell.variableDB_ =
      new Blockly.Names(Blockly.Shell.RESERVED_WORDS_);
  } else {
    Blockly.Shell.variableDB_.reset();
  }

  const defvars = [];
  const variables = workspace.getAllVariables();
  if (variables.length) {
    for (let i = 0; i < variables.length; i++) {
      defvars[i] = Blockly.Shell.variableDB_.getName(variables[i].name,
        Blockly.Variables.NAME_TYPE);
    }
  }
};

Blockly.Shell.finish = function(code) {
  // Convert the definitions dictionary into a list.
  var definitions = [];
  for (var name in Blockly.Shell.definitions_) {
    definitions.push(Blockly.Shell.definitions_[name]);
  }
  // Clean up temporary data.
  delete Blockly.Shell.definitions_;
  delete Blockly.Shell.functionNames_;
  Blockly.Shell.variableDB_.reset();
  return definitions.join('\n\n') + '\n\n\n' + code;
};

Blockly.Shell.scrubNakedValue = function(line) {
  return line + ';\n';
};

Blockly.Shell.quote_ = function(string) {
  // Can't use goog.string.quote since Google's style guide recommends
  // JS string literals use single quotes.
  string = string.replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\\n')
    .replace(/'/g, '\\\'');
  return '\'' + string + '\'';
};

Blockly.Shell.scrub_ = function(block, code) {
  if (code === null) {
    // Block has handled code generation itself.
    return '';
  }
  let commentCode = '';
  // Only collect comments for blocks that aren't inline.
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    let comment = block.getCommentText();
    if (comment) {
      commentCode += this.prefixLines(comment, '# ') + '\n';
    }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
    for (let x = 0; x < block.inputList.length; x++) {
      if (block.inputList[x].type === Blockly.INPUT_VALUE) {
        const childBlock = block.inputList[x].connection.targetBlock();
        if (childBlock) {
          const comment = this.allNestedComments(childBlock);
          if (comment) {
            commentCode += this.prefixLines(comment, '# ');
          }
        }
      }
    }
  }
  const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  const nextCode = this.blockToCode(nextBlock);
  return commentCode + code + nextCode;
};

Blockly.Shell.getAdjusted = function(block, atId, opt_delta, opt_negate,
                                          opt_order) {
  var delta = opt_delta || 0;
  var order = opt_order || Blockly.Shell.ORDER_NONE;
  if (block.workspace.options.oneBasedIndex) {
    delta--;
  }
  var defaultAtIndex = block.workspace.options.oneBasedIndex ? '1' : '0';
  if (delta > 0) {
    var at = Blockly.Shell.valueToCode(block, atId,
        Blockly.Shell.ORDER_ADDITION) || defaultAtIndex;
  } else if (delta < 0) {
    var at = Blockly.Shell.valueToCode(block, atId,
        Blockly.Shell.ORDER_SUBTRACTION) || defaultAtIndex;
  } else if (opt_negate) {
    var at = Blockly.Shell.valueToCode(block, atId,
        Blockly.Shell.ORDER_UNARY_NEGATION) || defaultAtIndex;
  } else {
    var at = Blockly.Shell.valueToCode(block, atId, order) ||
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
      var innerOrder = Blockly.Shell.ORDER_ADDITION;
    } else if (delta < 0) {
      at = at + ' - ' + -delta;
      var innerOrder = Blockly.Shell.ORDER_SUBTRACTION;
    }
    if (opt_negate) {
      if (delta) {
        at = '-(' + at + ')';
      } else {
        at = '-' + at;
      }
      var innerOrder = Blockly.Shell.ORDER_UNARY_NEGATION;
    }
    innerOrder = Math.floor(innerOrder);
    order = Math.floor(order);
    if (innerOrder && order >= innerOrder) {
      at = '(' + at + ')';
    }
  }
  return at;
};