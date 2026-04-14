import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // AI Tutor router
  ai: router({
    ask: publicProcedure
      .input(
        z.object({
          question: z.string().min(1),
          language: z.enum(["english", "hindi", "hinglish"]).default("english"),
          detectedLanguage: z.enum(["english", "hindi", "hinglish"]).optional(),
          subject: z.enum(["general", "math", "science", "history", "english"]).default("general"),
          subjectPrompt: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const apiKey = process.env.GOOGLE_GENERATIVE_AI_KEY;
          if (!apiKey) {
            throw new Error("Google Generative AI API key not configured");
          }

          const client = new GoogleGenerativeAI(apiKey);
          const model = client.getGenerativeModel({ model: "gemini-2.0-flash" });

          // Use subject-specific prompt if provided, otherwise use default
          let systemPrompt = input.subjectPrompt || "You are a helpful AI tutor. Answer questions clearly and concisely.";

          const prompt = `${systemPrompt}\n\nQuestion: ${input.question}`;
          console.log(`[AI Tutor] Subject: ${input.subject}, Language: ${input.language}, Question: ${input.question.substring(0, 50)}...`);

          const result = await model.generateContent(prompt);
          const response = result.response;
          const answer = response.text();

          return {
            answer,
            language: input.language,
            success: true,
          };
        } catch (error) {
          console.error("AI Tutor error:", error);
          const errorMessage =
            input.language === "hindi"
              ? "क्षमा करें, मुझे आपके प्रश्न का उत्तर देने में समस्या हुई। कृपया पुनः प्रयास करें।"
              : input.language === "hinglish"
                ? "Sorry, mujhe aapke prashna ka uttar dene mein samasya hui. Kripya dubara koshish karein."
                : "Sorry, I encountered an error processing your question. Please try again.";

          return {
            answer: errorMessage,
            language: input.language,
            success: false,
          };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
