import { Personality } from "@/app/_types/Personality";
import { XPersonality } from "@/app/_types/XPersonality";

export const personalityFieldsOrder: (keyof Personality)[] = ['name', 'nameAliases', 'gender', 'race', 'beastfolk', 'origin', 'age', 'occupation', 'corePersonalityTraits', 'coreValuesBeliefs', 'backgroundSummary', 'relationships', 'communicationStyle', 'desires', 'needsRequests']
export const xPersonalityFieldsOrder: (keyof XPersonality)[] = ['orientation', 'relationshipStyle', 'preferredSexPositions', 'speakStyleDuringSex', 'sexualBehavior', 'sexFantasies', 'sexPersonalityTraits']

export const orderPersonalityProperties = <T extends Record<string, unknown>>(json: T, order: string[] = personalityFieldsOrder) => {
    return order.reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = json[key]
        return acc;
    }, {}) as T
}