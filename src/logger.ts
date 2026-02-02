import pino from "pino";

export const logger = pino({
  transport: {
    target: "pino-loki",
    options: {
      host: "http://loki:3100",
      // Optional labels to make filtering easy in Grafana
      labels: { app: "kalli-store", service: "kalli-store" },
      batching: true,
      interval: 2000,
    },
  },
});
