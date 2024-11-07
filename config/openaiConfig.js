import OpenAI from "openai";
import variables from "./variable.js";

const openai = new OpenAI({
  apiKey: variables.OPENAI_API_KEY,
});

export default openai;
