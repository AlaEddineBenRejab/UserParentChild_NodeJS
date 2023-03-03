import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import * as dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import parentRoutes from "./routes/parentRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js"
import connectDb from "./config/db.js";

const app = express();
dotenv.config();
const hostname = process.env.DEVURL;
const port = process.env.PORT;

//Connexion lel base fi config/db.js
connectDb();

app.use(cors());
app.use("/media", express.static("media"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user", userRoutes);
app.use(bodyParser.json());
app.use("/parent",parentRoutes);
app.use("/application",applicationRoutes);

// npm run dev bech texecuti
app.listen(port, hostname, () => {
  console.log(`Server running on ${hostname}:${port}`);
});
