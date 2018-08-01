import * as Dotenv from 'dotenv';
Dotenv.config();

import AuthService from "./services/AuthService";
const token = AuthService.signToken({_id: "5b069cfaefcb4510ac51fa17", name: 'Olga'});
console.log("\n");

const url = `http://localhost:3000/messages?access_token=${token}`;
console.log(url);

console.log("\n");