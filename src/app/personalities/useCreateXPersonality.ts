import { getAnswer } from "@/app/_logic/connectors/openrouter/openrouter"
import { createXPersonality } from "@/app/_logic/createXPersonality"
import { Personality } from "@/app/_types/Personality"
import { XPersonality } from "@/app/_types/XPersonality"
import { XPersonalityDB } from "@/app/_types/XPersonalityDB"
import { xPersonalityPrompt } from "@/app/_utils/prompts"
import { extractJsonFromAnswer } from "@/app/personalities/extractJsonFromAnswer"
import { tryToSanitizeAnswerJson } from "@/app/personalities/tryToSanitizeAnswerJson"
import { updatePersonalitiesCache } from "@/app/personalities/updatePersonalitiesCache"
import { DefaultError, useMutation, useQueryClient } from "@tanstack/react-query"

export const useCreateXPersonality = (onSuccess: (name: string) => void) => {
    const queryClient = useQueryClient()

    return useMutation<XPersonalityDB | null, DefaultError, {id: string, personality: Personality}>({
        mutationFn: async ({ id, personality }) => {
            const answer = await getAnswer([
                { role: 'system', content: xPersonalityPrompt },
                { role: 'user', content: JSON.stringify(personality) }
            ])

            const { content } = answer.choices[0].message
            let json: XPersonality | null = null

            try {
                json = JSON.parse(content)
            }
            catch(err) {
                console.error('Answer isn\'t json!', err)

                json = extractJsonFromAnswer(content)
            }

            if(!json) {
                return null
            }

            try {
                json = tryToSanitizeAnswerJson(json) as XPersonality

                return await createXPersonality({ id, xPersonality: json })
            } catch (e) {
                console.log(e)
            }

            return null
        },
        onSuccess: (response) => {
            if (response?.id) {
                onSuccess(response.id)

                updatePersonalitiesCache(response, queryClient)
            }
        }

    })
}