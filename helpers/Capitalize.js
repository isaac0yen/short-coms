function Capitalize(str) {
  // Check if the input string is empty
  if (!str) {
    return ''; // Return an empty string if the input is empty
  }

  // Capitalize the first letter of the string and concatenate it with the rest of the string
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = Capitalize;