import { OstimScene } from "@/app/_types/OstimScene"
import { SceneDB } from "@/app/_types/Scene"

export const getScenesDB = async (): Promise<SceneDB[]> => {
    const response = await fetch('/api/scenes-db', {
        method: 'get',
        headers: {
            "Content-Type": "application/json"
        }
    })

    const json = await response.json()

    return json.data
}