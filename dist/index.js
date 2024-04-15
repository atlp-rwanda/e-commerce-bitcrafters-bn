"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
dotenv_1.default.config();
const port = process.env.PORT || 3000;
exports.app = (0, express_1.default)();
exports.app.use(
  (0, cors_1.default)({
    credentials: true,
  }),
);
exports.app.use((0, compression_1.default)());
exports.app.use(body_parser_1.default.json());
const server = http_1.default.createServer(exports.app);
//Testing if the database is authenticated and listening the port
async function startServer() {
  try {
    await database_1.default.authenticate();
    console.log(
      "Connection to the database has been established successfully.",
    );
    await database_1.default.sync();
    console.log("All models were synchronized successfully.");
    server.listen(port, () => {
      console.log(`Server is listening on port http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Unable to start the server:", error);
  }
}
exports.app.get("/welcome", (req, res) => {
  res.status(200).send({ message: "Welcome to my API" });
});
startServer();
//# sourceMappingURL=index.js.map
