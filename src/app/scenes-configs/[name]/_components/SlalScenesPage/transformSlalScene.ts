import { OstimAction, OstimActionActor } from "@/app/_types/OstimAction";
import { OstimScene } from "@/app/_types/OstimScene";
import { SlalScene, SlalSceneTypeActor } from "@/app/_types/SlalScene";

const sortSlalActorsToOstimOrder = (actors: SlalSceneTypeActor[]) => {
    const femaleActors = actors.filter(actor => actor.type.toLowerCase().includes('female'))
    const maleActors = actors.filter(actor => !actor.type.toLowerCase().includes('female'))

    return [...maleActors, ...femaleActors]
}

const buildSceneActionActorPrompt = (actorIndex: number, actionActor?: OstimActionActor) => {
    if(!actionActor) {
        return ''
    }

    return ` {actor${actorIndex}}${actionActor.info ? `(${actionActor.info})` : ''}.`
}

const getActorTypeAndGender = (type: string) => {
    return {
        gender: type.toLowerCase().includes('female') ? 'female' : 'male',
        type: type.toLowerCase().includes('creature') ? 'creature' : 'human'
    }
}

export const transformSlalScene = (scene: SlalScene) => {
    scene = {...scene, actors: sortSlalActorsToOstimOrder(scene.actors)}
    let prompt = ''
    let actors = ''

    scene.actors?.forEach((actor, index) => {
        if(index !== 0) {
            actors += ', '
        }
        actors += `{actor${index}}`
    })

    prompt += actors

    prompt += ` participate in scene.${scene.tags ? ` Scene is described by #TAGS. #TAGS will describe type of sex(actions), if sex is on furniture and which furniture type, if it's agreesive/dom or not. #TAGS: ${scene.tags}`: ''}\n`

    scene.actors?.forEach((actor, index) => {
        const {gender, type} = getActorTypeAndGender(actor.type)
        prompt += `\n{actor${index}} is ${gender} ${type}).`
    })

    return prompt
}