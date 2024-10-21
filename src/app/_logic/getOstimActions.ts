import { OstimAction } from "@/app/_types/OstimAction"

export const getOstimActions = async () => {
    const response = await fetch(`/api/actions`, {
        method: 'get',
        headers: {
            "Content-Type": "application/json"
        }
    })

    const json = await response.json() as { data: Record<string, OstimAction> }

    return json.data
}