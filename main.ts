/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import {start} from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";

import "https://deno.land/std@0.145.0/dotenv/load.ts"; // We just need to add this
import twindPlugin from "$fresh/plugins/twind.ts";
import twindConfig from "./twind.config.ts";

await start(manifest, {plugins: [twindPlugin(twindConfig)]});
