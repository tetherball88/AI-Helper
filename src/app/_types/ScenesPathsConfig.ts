export interface OstimPathsConfig {
    ostimPackPath: string
    authorName: string
    customPrefixes?: string[]
    slalPackPath?: string
}

export interface SexlabPathsConfig {
    slalPackPath?: string
}

export type ScenesPathsConfigItemOstim = {
    name: string
    framework: "ostim"
    config: OstimPathsConfig
}

export type ScenesPathsConfigItemSexlab = {
    name: string
    framework: "sexlab",
    config: SexlabPathsConfig
}

export type ScenesPathsConfigItem = ScenesPathsConfigItemOstim | ScenesPathsConfigItemSexlab

export interface ScenesPathsConfig {
    configs: ScenesPathsConfigItem[]
}