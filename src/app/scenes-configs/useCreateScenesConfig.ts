import { createScenesConfig } from "@/app/_logic/createScenesConfig"
import { ScenesPathsConfigItem } from "@/app/_types/ScenesPathsConfig"
import { DefaultError, useMutation, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"

export const useCreateScenesConfig = () => {
    const queryClient = useQueryClient()

    const result = useMutation<ScenesPathsConfigItem, DefaultError, ScenesPathsConfigItem>({
        mutationFn: (scenesConfig) => createScenesConfig(scenesConfig)
    })

    useEffect(() => {
        if(!result.data) {
            return
        }
        
        queryClient.setQueryData(['scenesConfigs'], (oldData: ScenesPathsConfigItem[]) => {
            return [
                ...oldData, 
                result.data,
            ]
        })
    }, [result.data])

    return result
}