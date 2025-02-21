import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { CoreMessage, Message, streamText } from "ai";

import { envServer } from "@/lib/env/env.server";

import { Utils } from "../lib/helpers/utils";

export interface IAIService extends Utils.AutoMappedClass<AIService> {}

export class AIServiceBuilder {
    private readonly ai;
    private basePrompt: CoreMessage | Omit<Message, "id">;
    private messages: (CoreMessage | Omit<Message, "id">)[] = [];

    constructor() {
        this.ai = createGoogleGenerativeAI({
            apiKey: envServer.GOOGLE_GENERATIVE_AI_API_KEY,
        });
        this.basePrompt = {
            role: "system",
            content: `You are a video title generator. The answer should be in one single line, and should be short and catchy. Limit 50 characters.`,
        };
    }

    public setBasePrompt(prompt: string): AIServiceBuilder {
        this.basePrompt = {
            role: "system",
            content: prompt,
        };
        return this;
    }

    public addMessage(
        message: CoreMessage | Omit<Message, "id">,
    ): AIServiceBuilder {
        this.messages.push(message);
        return this;
    }

    public addMessages(
        messages: (CoreMessage | Omit<Message, "id">)[],
    ): AIServiceBuilder {
        this.messages.push(...messages);
        return this;
    }

    public build(): IAIService {
        return new AIService(this.ai, this.basePrompt, this.messages);
    }
}

export class AIService implements IAIService {
    constructor(
        private readonly ai: ReturnType<typeof createGoogleGenerativeAI>,
        private readonly basePrompt: CoreMessage | Omit<Message, "id">,
        private readonly messages: (CoreMessage | Omit<Message, "id">)[],
    ) {}

    public getStreamText() {
        return streamText({
            model: this.ai("gemini-2.0-pro-exp-02-05"),
            messages: [this.basePrompt, ...this.messages] as
                | CoreMessage[]
                | Omit<Message, "id">[],
            onError(err) {
                console.error(err);
            },
            temperature: 1,
        });
    }
}
