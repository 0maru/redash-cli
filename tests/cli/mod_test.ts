import { assertEquals } from "@std/assert";
import { parseArgs } from "@std/cli/parse-args";

Deno.test("parseArgs - extracts resource and action from positional args", () => {
  const parsed = parseArgs(["query", "list", "--page", "2"], {
    string: ["page"],
  });
  const [resource, action] = parsed._.map(String);
  assertEquals(resource, "query");
  assertEquals(action, "list");
  assertEquals(parsed.page, "2");
});

Deno.test("parseArgs - version flag", () => {
  const parsed = parseArgs(["--version"], {
    boolean: ["version"],
    alias: { v: "version" },
  });
  assertEquals(parsed.version, true);
});

Deno.test("parseArgs - --no-wait sets wait to false", () => {
  const parsed = parseArgs(["query", "execute", "1", "--no-wait"], {
    boolean: ["wait"],
    default: { wait: true },
    negatable: ["wait"],
  });
  assertEquals(parsed.wait, false);
});
