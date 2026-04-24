import { describe, expect, it } from "vitest";
import { resolveChatGPTWebSessionKey } from "./chatgpt-web-stream.js";

describe("resolveChatGPTWebSessionKey", () => {
  it("prefers sessionKey over sessionId", () => {
    expect(
      resolveChatGPTWebSessionKey({
        sessionKey: "agent:main:openai:abc",
        sessionId: "sess-123",
      }),
    ).toBe("agent:main:openai:abc");
  });

  it("falls back to sessionId when sessionKey is absent", () => {
    expect(resolveChatGPTWebSessionKey({ sessionId: "sess-123" })).toBe("sess-123");
  });

  it("uses default when both identifiers are absent", () => {
    expect(resolveChatGPTWebSessionKey({})).toBe("default");
  });
});
