import { createOpenAI } from "@ai-sdk/openai";

import { envServer } from "@/lib/env/env.server";

import { Utils } from "../lib/helpers/utils";

export interface IOpenAIService extends Utils.AutoMappedClass<OpenAIService> {}
export class OpenAIService implements IOpenAIService {
    private readonly openai;
    constructor() {
        this.openai = createOpenAI({
            apiKey: envServer.OPENAI_API_KEY,
        });
    }
}
