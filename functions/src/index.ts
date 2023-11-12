import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import OpenAI from "openai";
import {defineString} from "firebase-functions/params";
const openaiKey = defineString("OPENAI_API_KEY");

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

const dalleRequest = async (openai: OpenAI, prompt: string) => {
  const response = await openai.images.generate({
    model: "dall-e-2",
    prompt: prompt,
    n: 1,
    size: "256x256",
  });
  return response;
};

export const generateImage = onRequest(
  {cors: true},
  async (request, response) => {
    const openai = new OpenAI({apiKey: openaiKey.value()});

    const prompt = request.body.data.prompt;
    logger.info(
      `Recieved ${request.body.data} Requesting dalle with prompt ${prompt}`,
      {structuredData: true});
    const dalleResponse = await dalleRequest(openai, prompt);
    response.send(dalleResponse);
  });
