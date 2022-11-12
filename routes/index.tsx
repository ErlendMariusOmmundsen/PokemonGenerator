import {Head} from "$fresh/runtime.ts";
import Counter from "../islands/Counter.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>Fresh App</title>
      </Head>
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
