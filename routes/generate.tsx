import {Head} from "$fresh/runtime.ts";
import {Handlers, HandlerContext, PageProps} from "$fresh/server.ts";
import {openai, App, CompletionOpts, Completion} from 'https://cdn.skypack.dev/@hikae/gpt?dts'
import {config} from "https://deno.land/std/dotenv/mod.ts";

interface Data {
  response: Completion,
  parameters: CompletionOpts
}



export const handler: Handlers<Completion | null> = {
  async GET(req: Request, ctx: HandlerContext) {
    const configData = await config();
    const openAIKey = configData["OPENAI_KEY"]
    if (!openAIKey) {
      throw new Error("[OPENAI_KEY] not found");
    }
    const app: App = openai.app(openAIKey, "text-davinci-002");
    const url = new URL(req.url);

    const prompt = url.searchParams.get("prompt") || "";
    if (prompt === "") {
      return ctx.render(null);
    }


    const parameters: CompletionOpts = {
      prompt: prompt,
      max_tokens: 200,
      temperature: 1,
      top_p: 1,
      n: 1,
      stream: false,
      logprobs: null,
      // stop: "\n",
    }

    const response: Completion = await openai.completion(parameters)(app)

    if (!response) {
      return ctx.render(null);
    }

    const data: Data = {response, parameters}

    return ctx.render(data);
  },
};

export default function generate({data}: PageProps<Data>) {
  const {response, parameters} = data ? data : {response: null, parameters: null};
  console.log(response);
  console.log(parameters);


  return (
    <>
      <Head>
        <title>Fresh App</title>
      </Head>
      <div class="p-4 flex flex-col columns-1 justify-center h-screen w-screen place-content-center content-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        <div class="self-center">
          <img
            src="/pokelogo.svg"
            class="w-72 self-center m-20"
            alt="pokemon logo"
          />
          <form>
            <label class="block">
              <span class="block text-sm font-medium text-slate-700">Prompt</span>
              <input type="text" name="prompt" value={parameters?.prompt} class="mt-1 block w-full px-3 py-2 bg-white max-w-prose border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
      focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
      disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
      invalid:border-pink-500 invalid:text-pink-600
      focus:invalid:border-pink-500 focus:invalid:ring-pink-500
    "  />
            </label>
          </form>

        </div>
        <div class="m-8 max-w-prose self-center text-white bg-slate space-y-4">
          <h1>
            {parameters ?
              <>
                <em>Prompt: </em> {parameters.prompt}
              </>
              : ""}
          </h1>
          <h2>
            {response ?
              <>
                <em>Generated description : </em> {response.choices[0].text}
              </>
              : ""}
          </h2>
        </div>

      </div>
      <div class="fixed bottom-0 right-0 m-8">
        <a href="https://fresh.deno.dev">
          <img width="197" height="37" src="https://fresh.deno.dev/fresh-badge-dark.svg" alt="Made with Fresh" />
        </a>
      </div>

    </>
  );
}
