const { login } = require("../src/auth");
function assert(condition, message) {
  if (!condition) {
    throw new Error(`FAILED: ${message}`);
  }
}

console.log("Starting Authentication Tests...");
const successResult = login("admin", "securePassword123");
assert(successResult.success === true, "Admin should login successfully with correct credentials");

const emptyInput = login("", "");
assert(emptyInput.message === "Invalid input", "Should reject empty strings with 'Invalid input'");

const shortPassword = login("admin", "1234567");
assert(shortPassword.message === "Invalid credentials", "Should reject passwords shorter than 8 characters");

const unknownUser = login("non_existent_user", "admin123456");
assert(unknownUser.message === "Invalid credentials", "Should not reveal if a username is missing");

const wrongPassword = login("admin", "wrong_password_long_enough");
assert(wrongPassword.message === "Invalid credentials", "Should return generic error for wrong password");

console.log("--------------------------");
console.log("SUCCESS: All tests passed!");
console.log("--------------------------");
