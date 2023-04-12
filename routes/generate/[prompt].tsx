import {Head} from "$fresh/runtime.ts";
import {Handlers, HandlerContext, PageProps} from "$fresh/server.ts";
import {Completion, openai} from 'https://cdn.skypack.dev/@hikae/gpt?dts'
import {config} from "https://deno.land/std/dotenv/mod.ts";



interface GPT3Choice {
  finish_reason: string,
  index: string,
  logprobs: number,
  text: string
}

interface GPT3Usage {
  completion_tokens: number,
  prompt_tokens: number,
  total_tokens: number
}

export interface GPT3Response {
  choices: GPT3Choice[]
  created: number,
  id: string,
  model: string,
  object: string,
  usage: GPT3Usage[]
}

const configData = await config();
const openAIKey = configData["OPENAI_KEY"]
if (!openAIKey) {
  throw new Error("[OPENAI_KEY] not found");
}


export const handler: Handlers<Completion | null> = {
  async GET(_, ctx) {
    const app = openai.app(openAIKey);
    console.log(871263812);
    
    const {prompt} = ctx.params
    const modelParams = {model: "text-davinci-002", prompt: "Say beans", temperature: 0.5, max_tokens: 300}
    //const resp = openai.completion(modelParams)(app);
    const resp = openai.classification({
      examples: [
        ["幸せ", "Positive"],
        ["私は悲しい、、", "Negative"],
        ["最高の気分だ！", "Positive"],
      ],
      labels: ["Positive", "Negative", "Neutral"],
      query: "今日は晴れの日だ",
      search_model: "ada",
      model: "ada",
    })

    console.log(app)
    console.log(resp)
    if (resp.status === 404) {
      return ctx.render(null);
    }
    const data: GPT3Response = await resp.json();
    return ctx.render(data);
  },
};

export default function generate(data: PageProps<GPT3Response | null>) {
  console.log(data)
  if (!data) {
    return <h1>NOPE, not found</h1>;
  }
  return (
    <>
      <Head>
        <title>Fresh App</title>
      </Head>
      <main>
        <h1>{data.data}</h1>
      </main>
      <div class="p-4 flex h-screen w-screen place-content-center">
        <div class="self-center">
          <img
            src="/logo.svg"
            class="w-32 h-32 self-center"
            alt="the fresh logo: a sliced lemon dripping with juice"
          />
        </div>
        <div class="fixed bottom-0 right-0 m-8">

          <a href="https://fresh.deno.dev">
            <img width="197" height="37" src="https://fresh.deno.dev/fresh-badge-dark.svg" alt="Made with Fresh" />
          </a>
        </div>
      </div>
    </>
  );
}
