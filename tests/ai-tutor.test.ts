import { describe, it, expect, beforeAll } from "vitest";
import { GoogleGenerativeAI } from "@google/generative-ai";

describe("AI Tutor - Gemini Integration", () => {
  let client: GoogleGenerativeAI;

  beforeAll(() => {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_GENERATIVE_AI_KEY environment variable is not set");
    }
    client = new GoogleGenerativeAI(apiKey);
  });

  it("should respond to English questions", async () => {
    const model = client.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent("What is 2 + 2?");
    const response = result.response;
    const text = response.text();

    expect(text).toBeDefined();
    expect(text.length).toBeGreaterThan(0);
    expect(text.toLowerCase()).toContain("4");
  });

  it("should respond to Hindi questions", async () => {
    const model = client.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = "आप एक सहायक AI शिक्षक हैं। हिंदी में उत्तर दें।\n\nQuestion: 2 + 2 क्या है?";
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    expect(text).toBeDefined();
    expect(text.length).toBeGreaterThan(0);
  });

  it("should respond to Hinglish questions", async () => {
    const model = client.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = "Aap ek sahayak AI shikshak hain. Hinglish mein uttar den.\n\nQuestion: 2 + 2 kya hai?";
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    expect(text).toBeDefined();
    expect(text.length).toBeGreaterThan(0);
  });

  it("should handle complex questions", async () => {
    const model = client.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(
      "Explain the concept of photosynthesis in simple terms for a student"
    );
    const response = result.response;
    const text = response.text();

    expect(text).toBeDefined();
    expect(text.length).toBeGreaterThan(0);
    expect(text.toLowerCase()).toContain("photosynthesis");
  });
});
