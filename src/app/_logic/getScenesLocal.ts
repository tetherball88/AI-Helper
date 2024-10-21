import { OstimScene } from "@/app/_types/OstimScene"

export const getScenesLocal: (scenesConfigName: string) => Promise<OstimScene[]> = async (scenesConfigName) => {
    const params = new URLSearchParams()
    params.set('scenesConfigName ', scenesConfigName)
    const response = await fetch('/api/scenes-local?scenesConfigName='+scenesConfigName.toString(), {
        method: 'get',
        headers: {
            "Content-Type": "application/json"
        }
    })

    const json = await response.json()

    console.log(json)

    return json.data
}