module.exports = {
  OneTimeID: () => {
    let result = '';
    for (let i = 0; i < 6; i++) {
      const randomNumber = Math.floor(Math.random() * 10); // Generate a random number between 0 and 9
      result += randomNumber.toString(); // Convert the random number to a string and append to the result
    }
    return result;
  },
  clientID: () => {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let combination = '';
    for (let i = 0; i < 16; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      combination += characters[randomIndex];
    }

    return combination;
  }
};
