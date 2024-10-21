import { CombinedPersonalityDB } from "@/app/_logic/getPersonalities"
import { updatePersonality } from "@/app/_logic/updatePersonality"
import { NewPersonalityDB } from "@/app/_types/NewPersonalityDB"
import { tryToSanitizeAnswerJson } from "@/app/personalities/tryToSanitizeAnswerJson"
import { updatePersonalitiesCache } from "@/app/personalities/updatePersonalitiesCache"
import { DefaultError, useMutation, useQueryClient } from "@tanstack/react-query"

export const useUpdatePersonality = (onSuccess: (personality: NewPersonalityDB) => void) => {
    const queryClient = useQueryClient()

    return useMutation<NewPersonalityDB | null, DefaultError, NewPersonalityDB>({
        mutationFn: async (personality) => {
            try {
                const json = tryToSanitizeAnswerJson(personality.personality)

                return await updatePersonality({ ...personality, personality: json })
            } catch (e) {
                console.log(e)
            }

            return null
        },
        onSuccess: (response) => {
            if (response?.id) {
                onSuccess(response)
                
                updatePersonalitiesCache(response, queryClient)
            }
        }

    })
}