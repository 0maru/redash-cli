import { run } from "./src/cli/mod.ts";

if (import.meta.main) {
  await run(Deno.args);
}
