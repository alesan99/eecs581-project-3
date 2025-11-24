/*
	Name: hash-passwords.js
	Description: Demonstrate and debug process for uploading hashed passwords into DB for 
  authentication while minimzing any possible vulnerabilities
	
  Programmers: Pashia Vang, Liam Aga, Aiden Barnard
	Date: 10/26/2025
	Revisions: Built upon Liam's comments 11/23/2025
	Errors: N/A
*/

const bcrypt = require('bcryptjs');

// Sample users with plaintext passwords
const users = [
  { name: 'User', email: 'user@gmail.com', password: 'password' },
  { name: 'Test', email: 'test@test.com', password: 'test' },
  { name: 't', email: 't@', password: 't' }
];

console.log('SQL to insert users with hashed passwords:\n');
console.log('INSERT INTO users (name, email, password_hash) VALUES');

// Iterate over each user and generate hashed password for SQL
users.forEach((user, index) => {
  // Hash password using bcrypt with 10 salt rounds
  const hash = bcrypt.hashSync(user.password, 10);
  const isLast = index === users.length - 1;
  // Output SQL values
  console.log(`  ('${user.name}', '${user.email}', '${hash}')${isLast ? ';' : ','}`);
});
