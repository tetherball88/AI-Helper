import { GenerateSceneRequestParams } from "@/app/_types/Scene"

export const matchSlal = async (data: Pick<GenerateSceneRequestParams, 'ostimId' | 'authorName' | 'slalPackPath'>): Promise<{ostim_id: string, sexlab_id: string}> => {
    const response = await fetch(`/api/matchSlal`, {
        method: 'post',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    const json = await response.json()

    return json
}