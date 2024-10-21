export interface SlalSceneTypeActorStage {
    id: string,
    silent?: boolean,
    sos?: number
    strap_on?: boolean
    open_mouth?: boolean
    up?: number
    forward?: number
    side?: number
    rotate?: number
    add_cum?: number
}
export interface SlalSceneTypeActor {
    add_cum?: number,
    stages: SlalSceneTypeActorStage[],
    race?: string
    type: 'Female' | 'Male' | 'CreatureMale' | 'CreatureFemale'
}

export interface SlalSceneTypeStage {
    number: number
    sound?: string
    sos?: number
    timer?: number
}

export interface SlalScene {
    actors: SlalSceneTypeActor[],
    id: string,
    name: string,
    sound: string,
    tags: string
    stages?: SlalSceneTypeStage[]
    creature_race?: string
}