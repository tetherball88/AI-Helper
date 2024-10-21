import { GenerateSceneRequestParams, SceneDB } from "@/app/_types/Scene"

export const createSceneDescription = async (data: GenerateSceneRequestParams): Promise<SceneDB> => {
    const response = await fetch(`/api/scenes-db`, {
        method: 'post',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    const json = await response.json()

    return json.data
}