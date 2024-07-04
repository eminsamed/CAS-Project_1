import express from "express";
import bodyParser from "body-parser";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import todoRoutes from "./routes/todoRoutes.js";

const app = express();
const port = 3000;
const hostname = "127.0.0.1";

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, "../public")));

app.use("/api/v1/todos", todoRoutes);

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
