export const deleteScenesConfig = async (name: string): Promise<string> => {
    await fetch(`/api/scenes-configs`, {
        method: 'delete',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name })
    })

    return name
}