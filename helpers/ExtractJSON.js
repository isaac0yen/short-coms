function parseJsonArray(str) {
  // Find the index of the first "[" and the last "]"
  const startIndex = str.indexOf("[");
  const lastIndex = str.lastIndexOf("]");

  // Check if both "[" and "]" are found
  if (startIndex === -1 || lastIndex === -1) {
    throw new Error("Invalid input string. Couldn't find '[' and/or ']'");
  }

  // Extract the substring between "[" and "]"
  const jsonStr = str.substring(startIndex + 1, lastIndex);

  // Parse the extracted substring as JSON
  try {
    const jsonArray = JSON.parse("[" + jsonStr + "]");
    return jsonArray;
  } catch (error) {
    throw new Error("Error parsing JSON array: " + error.message);
  }
}

module.exports = parseJsonArray;