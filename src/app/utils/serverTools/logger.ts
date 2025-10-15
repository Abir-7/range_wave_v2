import chalk from "chalk";
import { appConfig } from "../../config/appConfig";

type LogLevel = "info" | "warn" | "error" | "debug";

const formatMessage = (level: LogLevel, message: string) => {
  const timestamp = new Date().toISOString();

  const colors = {
    info: chalk.cyan.bold(`[INFO]`),
    warn: chalk.yellow.bold(`[WARN]`),
    error: chalk.red.bold(`[ERROR]`),
    debug: chalk.magenta.bold(`[DEBUG]`),
  };

  return `${chalk.gray(`[${timestamp}]`)} ${colors[level]} ${message}`;
};

export const logger = {
  info: (msg: string) => console.log(formatMessage("info", msg)),
  warn: (msg: string) => console.warn(formatMessage("warn", msg)),
  error: (msg: string, err?: unknown) => {
    console.error(formatMessage("error", msg));
    if (err instanceof Error && appConfig.server.node_env === "development") {
      console.error(chalk.gray(err.stack));
    }
  },
  debug: (msg: string) => {
    if (appConfig.server.node_env === "development") {
      console.log(formatMessage("debug", msg));
    }
  },
};
