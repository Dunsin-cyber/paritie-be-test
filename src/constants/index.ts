import dotenv from 'dotenv';
// import { CipherKey } from 'crypto';
dotenv.config();

//  MAKES SURE THAT ALL VARIABLES ARE IN ENV BEFPRE APP STARTS
// ? DATABASE_URL won't be exported because the new format has a "postgres" prifix which
// ? doesnt parse wellif imported through this format
const requiredEnvVars = ['NODE_ENV', 'JWT_REFRESH_SECRET', 'JWT_SECRET'];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(
    `❌ Missing required environment variables: ${missingEnvVars.join(', ')}`
  );
  process.exit(1);
}

// ? SYSTEM CREDENTIALS
const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT || 3000;

// ? JWT CREDENTIALS
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;
const STATUS_CODE = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
}

export const config = {
  NODE_ENV,
  PORT,
  JWT_REFRESH_SECRET,
  JWT_SECRET,
  STATUS_CODE
};
