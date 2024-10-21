import { updateScenesConfig } from "@/app/_logic/updateScenesConfig"
import { ScenesPathsConfigItem } from "@/app/_types/ScenesPathsConfig"
import { DefaultError, useMutation, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"

export const useUpdateScenesConfig = () => {
    const queryClient = useQueryClient()

    const result = useMutation<ScenesPathsConfigItem, DefaultError, ScenesPathsConfigItem>({
        mutationFn: (scenesConfig) => updateScenesConfig(scenesConfig),
    })

    useEffect(() => {
        if (!result.data) {
            return
        }
        queryClient.setQueryData(['scenesConfigs'], (oldData: ScenesPathsConfigItem[]) => {
            const indexToUpdate = oldData.findIndex(item => item.name === result.data.name)
            const itemToUpdate = oldData[indexToUpdate]
            return [
                ...oldData.slice(0, indexToUpdate),
                {
                    ...itemToUpdate,
                    ...result.data,
                },
                ...oldData.slice(indexToUpdate + 1),
            ]
        })

    }, [result.data])

    return result
}