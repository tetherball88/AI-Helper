import { CombinedPersonalityDB } from "@/app/_logic/getPersonalities"

export type PersonalitiesTableResponse = {
    data: CombinedPersonalityDB[],
    pagination: {
        currentPage: number
        perPage: number
        totalPages: number
        totalRecords: number
    },
}

export const getPersonalitiesTable = async (): Promise<PersonalitiesTableResponse> => {
    const response = await fetch(`/api/personalities?page=1&limit=2000`, {
        method: 'get',
        headers: {
            "Content-Type": "application/json"
        }
    })

    const json = await response.json()

    return json
}