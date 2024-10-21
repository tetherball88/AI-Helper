import { OldPersonalityDB } from '@/app/_types/OldPersonalityDB';
import { NewPersonalityDB } from "@/app/_types/NewPersonalityDB"
import { XPersonalityDB } from '@/app/_types/XPersonalityDB';

export type CombinedPersonalityDB = Partial<NewPersonalityDB> & OldPersonalityDB & Partial<XPersonalityDB>

export const getAllPersonalities: () => Promise<CombinedPersonalityDB[]> = async () => {
    const response = await fetch('/api/personalities', {
        method: 'get',
        headers: {
            "Content-Type": "application/json"
        }
    })

    const json = await response.json()

    return json.personalities
}

export const getPersonalityByName: (persName: string) => Promise<NewPersonalityDB> = async (persName) => {
    const response = await fetch(`/api/personalities/new/${persName}`, {
        method: 'get',
        headers: {
            "Content-Type": "application/json"
        }
    })

    const json = await response.json()

    return json.data[0]
}

export const getPersonalitiesByNames: (persName: string[]) => Promise<CombinedPersonalityDB[]> = async (persName) => {
    const response = await fetch(`/api/personalities?type=byNames&characters=${persName.join(',')}`, {
        method: 'get',
        headers: {
            "Content-Type": "application/json"
        }
    })

    const json = await response.json()

    return json.data
}