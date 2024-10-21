import { ScenesPathsConfigItem } from "@/app/_types/ScenesPathsConfig"

export const createScenesConfig = async <T extends ScenesPathsConfigItem>(scenesConfig: T): Promise<T> => {
    const response = await fetch(`/api/scenes-configs`, {
        method: 'post',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(scenesConfig)
    })

    const json = await response.json()

    return json.data
}