function generateUniqueCode(prefix) {
    const timestamp = Date.now(); // Get current timestamp
    const randomNumber = Math.floor(Math.random() * 10000); // Generate a random number
    return prefix + '-' + timestamp + '-' + randomNumber;
}

module.exports = {generateUniqueCode}