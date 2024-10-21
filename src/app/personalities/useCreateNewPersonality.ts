import { getAnswer } from "@/app/_logic/connectors/openrouter/openrouter"
import { createNewPersonality } from "@/app/_logic/createNewPersonality"
import { CombinedPersonalityDB } from "@/app/_logic/getPersonalities"
import { NewPersonalityDB } from "@/app/_types/NewPersonalityDB"
import { Personality } from "@/app/_types/Personality"
import { prompts } from "@/app/_utils/prompts"
import { extractJsonFromAnswer } from "@/app/personalities/extractJsonFromAnswer"
import { tryToSanitizeAnswerJson } from "@/app/personalities/tryToSanitizeAnswerJson"
import { updatePersonalitiesCache } from "@/app/personalities/updatePersonalitiesCache"
import { DefaultError, useMutation, useQueryClient } from "@tanstack/react-query"

export const useCreateNewPersonality = (onSuccess: (name: string) => void) => {
    const queryClient = useQueryClient()

    return useMutation<NewPersonalityDB | null, DefaultError, {id: string, oldContent: string}>({
        mutationFn: async ({ id, oldContent }) => {
            const answer = await getAnswer([
                { role: 'system', content: prompts[0] },
                { role: 'user', content: oldContent }
            ])

            const { content } = answer.choices[0].message
            let json: Personality | null = null

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
                json = tryToSanitizeAnswerJson(json) as Personality

                return await createNewPersonality({ id, personality: json })
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