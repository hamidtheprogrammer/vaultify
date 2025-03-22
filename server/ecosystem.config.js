module.exports = {
  apps: [
    {
      name: "vaultify",
      script: "npm",
      args: "run dev",
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
