import {app} from "./app";
import connectDB from "./db/index";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

const SERVER_PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(SERVER_PORT, () => {
      console.log(`server is running on port:${SERVER_PORT}`);
    });
  })
  .catch((dataConnectionError) => {
    console.log("Error connecting to mongoDB", dataConnectionError);
    process.exit(1);
  });
