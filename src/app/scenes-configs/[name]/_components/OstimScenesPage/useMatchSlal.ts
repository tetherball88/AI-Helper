import { matchSlal } from "@/app/_logic/matchSlal"
import { SceneDB } from "@/app/_types/Scene"
import { DefaultError, useMutation, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"


export const useMatchSlal = () => {
    const queryClient = useQueryClient()

    const result = useMutation<{ostim_id: string, sexlab_id: string}, DefaultError, { ostimId: string, authorName?: string, slalPackPath: string }>({
        mutationFn: ({ ostimId, authorName, slalPackPath }) => {
            return matchSlal({ ostimId, authorName, slalPackPath })
        },
    })

    useEffect(() => {
        if (result.data?.ostim_id && result.data?.sexlab_id) {
            queryClient.setQueryData(['scenesDB'], (oldData: SceneDB[]) => {
                const index = oldData.findIndex(({ ostim_id }) => result.data.ostim_id === ostim_id)
                const item = oldData[index]
                if(!item)
                    return

                return [
                    ...oldData.slice(0, index),
                    {...item, sexlab_id: result.data.sexlab_id},
                    ...oldData.slice(index + 1)
                ]
            })
        }
    }, [result.data])

    return result
}