import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import articleRouter from "./routes/articles.js"
import adminRouter from "./routes/admin.js"
import { basicAuth } from "./middleware/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));

app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.send("Personal Blogging Application");
});

app.use("/admin", basicAuth, adminRouter)

app.use(articleRouter)


export default app;