const typeDefRegex = /\S\s*(:\s*\w+)/gm;

export const makeSignature = (funcName: string, funcArgs: string) => {
  return `function ${funcName}${funcArgs}`;
};

const clearTypesFunctionString = (funcString: string): string => {
  let result = funcString;
  let matching;
  while ((matching = typeDefRegex.exec(funcString)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (matching.index === typeDefRegex.lastIndex) {
      typeDefRegex.lastIndex++;
    }

    if (matching[1]) {
      result = result.replace(matching[1], '');
    }
  }
  return result;
};

const makeFunctionHaveSignature = (funcSignature: string, funcString: string): string => {
  const openBracketsPos = funcString.indexOf('{');
  if (openBracketsPos < 0) {
    return `${funcSignature} {\n  \n}`;
  }
  return `${funcSignature} ${funcString.substr(openBracketsPos).trim()}`;
};

const clearArrowFunctionString = (funcSignature: string, funcString: string): string => {
  const arrowIndex = funcString.indexOf('=>');
  if (arrowIndex < 0) {
    return makeFunctionHaveSignature(funcSignature, funcString);
  }
  const clearString = funcString.substr(arrowIndex + 2).trim();
  return makeFunctionHaveSignature(funcSignature, clearString);
};

export const functionToString = (funcSignature: string, func?: Function): string => {
  let funcString = func
    ? clearArrowFunctionString(funcSignature, func.toString())
    : `${funcSignature} {\n  \n}`;
  return funcString.trim();
};

export const stringToFunction = (funcSignature: string, funcString: string): Function | undefined => {
  if (funcString.trim().length === 0) {
    return undefined;
  }
  if (!funcString.includes(funcSignature)) {
    console.warn(funcString, funcSignature);
    throw new Error('Missing function signature!');
  }
  let func: Function | undefined = undefined;
  try {
    func = eval(`(${clearTypesFunctionString(funcString)})`);
  } catch (error) {
    console.error(error);
  }
  return func;
};
