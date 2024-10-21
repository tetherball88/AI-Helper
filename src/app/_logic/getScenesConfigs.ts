import { ScenesPathsConfigItem } from './../_types/ScenesPathsConfig';

export const getScenesConfigs = async <T extends 'ostim' | 'sexlab'>(framework?: T) => {
    const response = await fetch('/api/scenes-configs?framework='+framework, {
        method: 'get',
        headers: {
            "Content-Type": "application/json"
        }
    })

    const json = await response.json()
 
    return json.data as ScenesPathsConfigItem[]
}

export const getSceneConfig = async (name: string) => {
    const response = await fetch('/api/scenes-configs', {
        method: 'get',
        headers: {
            "Content-Type": "application/json"
        }
    })

    const json = await response.json()
 
    const data = json.data as ScenesPathsConfigItem[]

    return data.find(item => item.name === name)
}