import { XPersonalityDB } from '@/app/_types/XPersonalityDB';
import { orderPersonalityProperties, xPersonalityFieldsOrder } from '../personalities/orderPersonalityProperties';

export const updateXPersonality = async (data: XPersonalityDB): Promise<XPersonalityDB> => {
    const response = await fetch(`/api/personalities/x`, {
        method: 'put',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    const json = await response.json()

    const personality = orderPersonalityProperties(json.data.personality, xPersonalityFieldsOrder)

    return {...json.data, personality }
}