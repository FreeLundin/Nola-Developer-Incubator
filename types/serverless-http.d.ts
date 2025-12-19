declare module 'serverless-http' {
  import type { Handler } from 'aws-lambda';
  export default function serverless(app: any): Handler;
}

