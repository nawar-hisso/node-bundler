import express from "express";
import router from "./src/routes";
import { nodeEnv, port, version } from "./src/configs/constants";

const app = express();

app.use(express.json());

app.use(`/${version}`, router);

if (nodeEnv !== "test") {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

export default app;
