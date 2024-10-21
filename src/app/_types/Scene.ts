export interface SceneDB {
    ostim_id: string
    sexlab_id: string
    description: string
}

export interface GenerateSceneRequestParams {
    ostimId?: string
    description: string
    slalPackPath?: string
    authorName?: string
    type?: 'sexlab'
    slalId?: string
}