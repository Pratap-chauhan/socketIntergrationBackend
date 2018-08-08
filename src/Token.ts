// import * as Dotenv from 'dotenv';
// Dotenv.config();

// import AuthService from "./services/AuthService";
// const token = AuthService.signToken({_id: "5b069cfaefcb4510ac51fa17", name: 'Olga'});
// console.log("\n");

// const url = `http://localhost:3000/messages?access_token=${token}`;
// console.log(url);

// console.log("\n");
  import AuthService from "./services/AuthService";
  const token = AuthService.signToken({_id: "5b3b4eaf0ae8822a58c9e057", name: "Hello Admin"});
  console.log("\n");
  console.log(token);
  console.log("\n");
