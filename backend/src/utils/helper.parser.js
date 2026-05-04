const splitOnLastOccurence = (str, delimiter) => {
  const index = str.lastIndexOf(delimiter);
  if (index === -1) return ["", str];
  return [str.slice(0, index), str.slice(index + delimiter.length)];
};

const findBracket = (message) => {
  const openBracket = message.indexOf("(");
  const closeBracket = message.lastIndexOf(")");
  return [openBracket, closeBracket];
};

const isFunction = (message) => {
  const [openBracket, closeBracket] = findBracket(message);

  if (
    openBracket != -1 &&
    closeBracket != -1 &&
    message.slice(0, openBracket).trim()
  ) {
    return true;
  }
  return false;
};

const extractArgsAndFunction = (message) => {
  // repeat(hello,5)
  const [openBracket, closeBracket] = findBracket(message);
  const rawArgs = message.slice(openBracket + 1, closeBracket);
  const functionName = message.slice(0, openBracket).trim();

  return [rawArgs, functionName];
};

const parser = (message, senderId, recieverId, username) => {
  let incomingMessage = {};
  if (isFunction(message)) {
    let newMessage = message;
    const [rawArgs, functionName] = extractArgsAndFunction(message);

    if (functionName == "repeat") {
      const sub = splitOnLastOccurence(rawArgs, ",");
      const text = sub[0].trim();
      const num = sub[1].trim();
      if (isNaN(num)) {
        newMessage = "Error in Syntax";
      } else {
        newMessage = (text + " ").repeat(Number(num)).trimEnd();
      }
    }
    if (functionName == "print") {
      const text = rawArgs.trim();
      newMessage = text;
    }
    incomingMessage = {
      text: newMessage,
      senderId,
      recieverId,
      username: username,
      time: new Date(),
      status: "sent",
    };
  } else {
    incomingMessage = {
      text: message,
      senderId,
      recieverId,
      username: username,
      time: new Date(),
      status: "sent",
    };
  }
  return incomingMessage;
};

module.exports = parser;
