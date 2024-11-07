import app from "./app.js";
import variables from "./config/variable.js";
import connectDB from "./config/db.js";

connectDB().then(() => {
  app.listen(variables.PORT, () => {
    console.log(`Server is running on port http://localhost:${variables.PORT}`);
  });
});
