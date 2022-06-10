import winston from "winston";

winston.addColors({
  error: "bold red",
  warn: "bold yellow",
  info: "bold cyan",
  debug: "bold gray",
  verbose: "bold blue",
  silly: "bold magenta",
});

const colorizer = winston.format.colorize();
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.align(),
  winston.format.printf((info) => {
    return `${info.timestamp} :: [${colorizer.colorize(
      info.level,
      info.level.toUpperCase()
    )}] ${info.message}`;
  })
);

const logger = winston.createLogger({
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
    verbose: 4,
    silly: 5,
  },
  transports: [
    new winston.transports.Console({ level: "silly", format: customFormat }),
  ],
});

export default logger;
