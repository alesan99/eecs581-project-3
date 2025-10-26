const bcrypt = require('bcryptjs');

const users = [
  { name: 'User', email: 'user@gmail.com', password: 'password' },
  { name: 'Test', email: 'test@test.com', password: 'test' },
  { name: 't', email: 't@', password: 't' }
];

console.log('SQL to insert users with hashed passwords:\n');
console.log('INSERT INTO users (name, email, password_hash) VALUES');

users.forEach((user, index) => {
  const hash = bcrypt.hashSync(user.password, 10);
  const isLast = index === users.length - 1;
  console.log(`  ('${user.name}', '${user.email}', '${hash}')${isLast ? ';' : ','}`);
});
