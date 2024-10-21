import { SlalScene } from '@/app/_types/SlalScene';
import fs from 'fs';
import { glob } from 'glob';

const matchFullSlalId = (name: string, stage: string, slalId: string) => {
    return new RegExp(`.*${name}_A\\d+_S${stage}`, 'gi').test(slalId)
}

export const getAllSlalAnims = async (slalJsonFile: string) => {
    const slalFiles = await glob(`${slalJsonFile}/**/SLAnims/json/*.json`)
    return slalFiles.reduce<{ animations: SlalScene[] }>((acc, file) => {
        const newAnimations = (JSON.parse(fs.readFileSync(file, 'utf-8')) as { animations: SlalScene[] }).animations
        acc.animations = [...acc.animations, ...newAnimations]
        return acc;
    }, { animations: [] })
}

export const findSlalAnimation = async (ostimId: string, authorName: string, slalJsonFile: string) => {
    const combinedSlalJson = await getAllSlalAnims(slalJsonFile)
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

    return 'na'
}