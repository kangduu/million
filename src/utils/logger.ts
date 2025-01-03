import pino from "pino";

class PinoSingleton {
  private static instance: pino.Logger;

  public static getInstance(): pino.Logger {
    if (!PinoSingleton.instance) {
      PinoSingleton.instance = pino({
        transport: {
          target: "pino-pretty",
          options: { colorize: true },
        },
      });
    }
    return PinoSingleton.instance;
  }
}

export default PinoSingleton.getInstance();
