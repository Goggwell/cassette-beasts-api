"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/config/config.ts
var config_exports = {};
__export(config_exports, {
  config: () => config
});
module.exports = __toCommonJS(config_exports);
var config = {
  development: {
    logger: {
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "yyyy-mm-dd HH:MM:ss:l"
        }
      },
      level: "debug"
    }
  },
  production: {
    logger: {
      serializers: {
        req(req) {
          return {
            method: req.method,
            url: req.url
          };
        }
      },
      level: "info",
      transport: {
        targets: [
          {
            target: "pino/file",
            level: "info",
            options: {
              destination: `./logs/production.log`,
              mkdir: true
            }
          }
        ]
      }
    }
  },
  testing: { logger: false }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  config
});
