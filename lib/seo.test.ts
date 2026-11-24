import { describe, expect, it } from "vitest";
import { serializeJsonLd } from "@/lib/seo";

describe("serializeJsonLd", () => {
  it("escapes markup that could close the script tag", () => {
    const serialized = serializeJsonLd({
      description: '</script><script>alert("x")</script>',
    });
    expect(serialized).not.toContain("</script>");
    expect(serialized).not.toContain("<script>");
    expect(serialized).toContain("\\u003c");
  });

  it("keeps normal values intact", () => {
    expect(serializeJsonLd({ name: "Safety helmet", price: 4500 })).toBe(
      '{"name":"Safety helmet","price":4500}'
    );
  });
});
