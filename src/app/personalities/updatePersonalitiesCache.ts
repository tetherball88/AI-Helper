import { CombinedPersonalityDB } from "@/app/_logic/getPersonalities"
import { QueryClient } from "@tanstack/react-query"

export const updatePersonalitiesCache = <T extends { id: string }>(response: T, queryClient: QueryClient) => {
    queryClient.setQueryData(['personalitiesDB'], (oldData: { data: CombinedPersonalityDB[] }) => {
        const indexToUpdate = oldData.data.findIndex(item => item.npc_name === response.id)
        const itemToUpdate = oldData.data[indexToUpdate]

        return ({
            ...oldData, data: [
                ...oldData.data.slice(0, indexToUpdate),
                {
                    ...itemToUpdate,
                    ...response,
                },
                ...oldData.data.slice(indexToUpdate + 1),
            ]
        })
    })
}