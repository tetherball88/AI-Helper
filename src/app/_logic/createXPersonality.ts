import { XPersonalityDB } from "@/app/_types/XPersonalityDB"

export const createXPersonality = async (xPersonality: XPersonalityDB): Promise<XPersonalityDB> => {
    const response = await fetch(`/api/personalities/x`, {
        method: 'post',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(xPersonality)
    })

    const json = await response.json()

    return json.data
}