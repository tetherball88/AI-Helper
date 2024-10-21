import { NewPersonalityDB } from "@/app/_types/NewPersonalityDB"

export const createNewPersonality = async (newPersonality: NewPersonalityDB): Promise<NewPersonalityDB> => {
    const response = await fetch(`/api/personalities/new`, {
        method: 'post',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newPersonality)
    })

    const json = await response.json()

    return json.data
}