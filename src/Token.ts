  import AuthService from "./services/AuthService";
  const token = AuthService.signToken({_id: "5b3b4eaf0ae8822a58c9e057", name: "Hello Admin"});
  console.log("\n");
  console.log(token);
  console.log("\n");
