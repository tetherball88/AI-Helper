import { orderPersonalityProperties } from './../personalities/orderPersonalityProperties';
import { NewPersonalityDB } from "@/app/_types/NewPersonalityDB"

export const updatePersonality = async (data: NewPersonalityDB): Promise<NewPersonalityDB> => {
    const response = await fetch(`/api/personalities/new`, {
        method: 'put',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    const json = await response.json()

    const personality = orderPersonalityProperties(json.data.personality)

    return {...json.data, personality }
}