module.exports = {
  user: [{ id: "1", nickname: "John Doe", email: "user@domain.com" }],
  client: [
    {
      id: "client-id",
      redirectUri: "http://localhost:8080/callback.html",
      secret: "s3cr3t",
      name: "Example client",
    },
  ],
};
