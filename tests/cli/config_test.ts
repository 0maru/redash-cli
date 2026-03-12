import { assertEquals } from "@std/assert";
import { maskApiKey } from "../../src/cli/config.ts";

Deno.test("maskApiKey - masks all but last 4 chars", () => {
  assertEquals(maskApiKey("abcdefgh12345678"), "************5678");
});

Deno.test("maskApiKey - short key returns ****", () => {
  assertEquals(maskApiKey("ab"), "****");
});

Deno.test("maskApiKey - exactly 4 chars returns ****", () => {
  assertEquals(maskApiKey("abcd"), "****");
});
