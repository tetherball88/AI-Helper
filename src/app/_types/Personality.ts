export interface PersonalityRelationship {
    name: string
    description: string
    level: string
    connection?: string
}

export interface PersonalityCommunicationStyle {
    tone: string,
    mannerism: string
}

export interface Personality {
    name: string
    nameAliases?: string[]
    gender: string
    race: string
    beastfolk?: string
    origin: string
    age: string
    occupation: string
    corePersonalityTraits: string[]
    coreValuesBeliefs: string[]
    backgroundSummary: string
    relationships: PersonalityRelationship[]
    communicationStyle: PersonalityCommunicationStyle
    desires: string[]
    needsRequests: string[]
}