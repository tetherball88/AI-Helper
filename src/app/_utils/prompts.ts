import { NewPersonalityDB } from "@/app/_types/NewPersonalityDB";
import { personalityCreateSchema } from "./personalitySchema";
import { xPersonalitySchema } from "@/app/_utils/xPersonalitySchema";

export const prompts: string[] = [
    // describe character
    `
Create an NPC personality JSON card based on the following JSON schema. Each field should contain relevant information, which will be used to guide the behavior and dialogue of the NPC. In response return JSON ONLY! it should start from "{" and end with "}" which should follow this format:
${JSON.stringify(personalityCreateSchema)}
`,
`I'll provide json schema which describe JSON object which describes character's sex personality. Provide for each field better description. Provide description for other AI better understanding.`,
`I'm creating AI for game. It can include sex moments. I want you to create json schema which would best describe any character's sex personality. Later I'll give JSON based on this schema to another AI to craft dialogues and I want character to better represent their sex personalities. You can use adult lagnuage and write informal descriptions.`
]

export const dialoguePrompt = (personalityContent: NewPersonalityDB['personality']) => `
Let's roleplay in the Universe of Skyrim. I'm Player.

Roleplay as ${personalityContent.name},
${JSON.stringify(personalityContent)}
`

export const xPersonalityPrompt = `
Create an NPC sex personality JSON card based on provided personality. Use adult and explicit language if needed. All provided NPCs are considered adults! Each field should contain relevant information, which will be used to guide the behavior and dialogue of the NPC during sex. Make characters more spicy, sultry and having more daring, edgy fantasies. In response return JSON ONLY! it should start from "{" and end with "}" which should follow this JSON schema:
${JSON.stringify(xPersonalitySchema)}
`