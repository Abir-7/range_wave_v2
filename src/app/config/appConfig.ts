import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export const appConfig = {
  database: { dataBase_uri: process.env.DATABASE_URI },
  server: {
    port: process.env.PORT,
    node_env: process.env.NODE_ENV,
    ip: process.env.IP_ADDRESS,
    base_url: process.env.BASE_URI,
  },

  jwt: {
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_access_exprire: process.env.JWT_ACCESS_EXPIRE,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_refresh_exprire: process.env.JWT_REFRESH_EXPIRE,
  },
  bcrypt: {
    salt_round: process.env.SALT_ROUND,
  },
  email: {
    from: process.env.EMAIL_FROM,
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT as string),
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  multer: {
    file_size_limit: process.env.MAX_FILE_SIZE,
    max_file_number: process.env.MAX_COUNT_FILE,
  },
  admin: {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  },
  stripe: {
    secret_key: process.env.STRIPE_SECRET_KEY,
    webhook: process.env.STRIPE_WEBHOOK_SECRET,
  },
  encrypt: {
    s_key: process.env.ENCRYPTION_SECRET_KEY,
  },

  rabbitMq: {
    url: process.env.RABBITMQ_URL,
  },
};
