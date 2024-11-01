import variables from "./variable.js";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: variables.OPENAI_API_KEY,
});

export default openai;
