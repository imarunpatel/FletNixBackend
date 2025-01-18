import * as dotenv from "dotenv";
import type { AWS } from "@serverless/typescript";

import { healthCheck } from "@functions/system";
import { login, registerUser } from "@functions/auth";
import { verifyAuth } from "@functions/authorizer";
import { getMedia } from "@functions/media";

dotenv.config();

const serverlessConfiguration: AWS = {
  service: "fletnixbackend",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs20.x",
    region: "ap-south-1",
    stage: "v1",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      DB_CONN_URL: process.env.DB_CONN_URL,
      ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
      REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    },
  },
  // import the function via paths
  functions: { verifyAuth, healthCheck, registerUser, login, getMedia },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
