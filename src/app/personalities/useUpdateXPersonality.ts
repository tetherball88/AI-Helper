import { updateXPersonality } from "@/app/_logic/updateXPersonality"
import { XPersonalityDB } from "@/app/_types/XPersonalityDB"
import { updatePersonalitiesCache } from "@/app/personalities/updatePersonalitiesCache"
import { DefaultError, useMutation, useQueryClient } from "@tanstack/react-query"

export const useUpdateXPersonality = (onSuccess: (personality: XPersonalityDB) => void) => {
    const queryClient = useQueryClient()

    return useMutation<XPersonalityDB | null, DefaultError, XPersonalityDB>({
        mutationFn: async (personality) => {
            try {
                return await updateXPersonality({ ...personality, xPersonality: personality.xPersonality })
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