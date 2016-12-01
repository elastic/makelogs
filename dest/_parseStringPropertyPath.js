'use strict';

//
// From lodash-deep
//
// https://github.com/marklagendijk/lodash-deep/blob/master/lodash-deep.js#L419-L474
//
/**
 * Parses a string based propertyPath
 * @param {string} propertyPath
 * @returns {Array}
 */
module.exports = function parseStringPropertyPath(propertyPath) {
  var character = '';
  var parsedPropertyPath = [];
  var parsedPropertyPathPart = '';
  var escapeNextCharacter = false;
  var isSpecialCharacter = false;
  var insideBrackets = false;

  // Walk through the path and find backslashes that escape periods or other backslashes, and split on unescaped
  // periods and brackets.
  for (var i = 0; i < propertyPath.length; i += 1) {
    character = propertyPath[i];
    isSpecialCharacter = character === '\\' || character === '[' || character === ']' || character === '.';

    if (isSpecialCharacter && !escapeNextCharacter) {
      if (insideBrackets && character !== ']') {
        throw new SyntaxError('unexpected "' + character + '" within brackets at character ' + i + ' in property path ' + propertyPath);
      }

      switch (character) {
        case '\\':
          escapeNextCharacter = true;
          break;
        case ']':
          insideBrackets = false;
          break;
        case '[':
          insideBrackets = true;
        /* falls through */
        case '.':
          parsedPropertyPath.push(parsedPropertyPathPart);
          parsedPropertyPathPart = '';
          break;

        default:
          throw new TypeError('unexpected character "' + character + '" in omit path');
      }
    } else {
      parsedPropertyPathPart += character;
      escapeNextCharacter = false;
    }
  }

  if (parsedPropertyPath[0] === '') {
    // allow '[0]', or '.0'
    parsedPropertyPath.splice(0, 1);
  }

  // capture the final part
  parsedPropertyPath.push(parsedPropertyPathPart);
  return parsedPropertyPath;
};
//# sourceMappingURL=_parseStringPropertyPath.js.map