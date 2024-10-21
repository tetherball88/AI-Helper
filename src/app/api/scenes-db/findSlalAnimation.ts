import fs from 'fs';
import { glob } from 'glob';

interface SlalStructure {
    animations: Array<{
        actors: Array<{
            stages: Array<{
                id: string
              }>,
          }>
        id: string
    }>
}

const matchFullSlalId = (name: string, stage: string, slalId: string) => {
    let result = slalId.split('_')
    const slalActor = result.pop()
    const slalStage = result.pop()
    const slalName = result.join('')
    return new RegExp(`.*${name}_A\\d+_S${stage}`, 'gi').test(`${slalName}_${slalStage}_${slalActor}`)
}

export const findSlalAnimation = async (ostimId: string, authorName: string, slalJsonFile: string) => {
    const slalFiles = await glob(`${slalJsonFile}/**/SLAnims/json/*.json`)
    const combinedSlalJson = slalFiles.reduce<SlalStructure>((acc, file) => {
        const newAnimations = (JSON.parse(fs.readFileSync(file, 'utf-8')) as SlalStructure).animations
        acc.animations = [...acc.animations, ...newAnimations]
        return acc;
    }, { animations: [] })
    // eslint-disable-next-line prefer-const
    let [ostimName, stageId] = ostimId.split('-');
    ostimName = ostimName.replace(/Adapted/gi, '')
    ostimName = ostimName.replace(/Af/gi, '')
    ostimName = ostimName.replace(authorName, '')

    for(const animation of combinedSlalJson.animations) {
        for(const actor of animation.actors) {
            for(const stage of actor.stages) {
                if(matchFullSlalId(ostimName, stageId, stage.id)) {
                    return stage.id.replace(/_A\d+/gi, '')
                }
            }
        }
    }

    return null
}