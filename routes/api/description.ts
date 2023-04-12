import {Handlers, HandlerContext} from "$fresh/server.ts";
import {App, openai} from 'https://cdn.skypack.dev/@hikae/gpt?dts'
import {config} from "https://deno.land/std/dotenv/mod.ts";

interface GPT3Choice {
  finish_reason: string,
  index: string,
  logprobs: number,
  text: string,
}

interface GPT3Usage {
  completion_tokens: number,
  prompt_tokens: number,
  total_tokens: number,
}

export interface GPT3Response {
  choices: GPT3Choice[]
  created: number,
  id: string,
  model: string,
  object: string,
  usage: GPT3Usage[],
}

const configData = await config();
const openAIKey = configData["OPENAI_KEY"]
if (!openAIKey) {
  throw new Error("[OPENAI_KEY] not found");
}
const app = openai.app(openAIKey);

export const handler = (_req: Request, ctx: HandlerContext, app: App): Response => {
  const {prompt} = ctx.params;
  const modelParams = {model: "text-davinci-002", prompt: "Say beans", temperature: 0.5, max_tokens: 300}
  const resp = openai.completion(modelParams);

  console.log(resp)
  if (resp.status === 404) {
    return new Response("NOPE");
  }
  return new Response(resp.json());
}


