import { deleteScenesConfig } from "@/app/_logic/deleteScenesConfig"
import { ScenesPathsConfigItem } from "@/app/_types/ScenesPathsConfig"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"

export const useDeleteScenesConfig = () => {
    const queryClient = useQueryClient()
    const result = useMutation({
        mutationFn: (name: string) => deleteScenesConfig(name)
    })

    useEffect(() => {
        if(!result.data) {
            return
        }

        queryClient.setQueryData(['scenesConfigs'], (oldData: ScenesPathsConfigItem[]) => {
            return oldData.filter(item => item.name !== result.data)
        })
    }, [result.data])

    return result
}