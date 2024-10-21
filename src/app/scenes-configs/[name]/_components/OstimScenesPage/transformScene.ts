import { OstimAction, OstimActionActor } from "@/app/_types/OstimAction";
import { OstimScene } from "@/app/_types/OstimScene";

const buildSceneActionActorPrompt = (actorIndex: number, actionActor?: OstimActionActor) => {
    if(!actionActor) {
        return ''
    }

    return ` {actor${actorIndex}}${actionActor.info ? `(${actionActor.info})` : ''}.`
}

export const transformScene = (scene: OstimScene, actions: Record<string, OstimAction>) => {
    const notFoundActionDescriptions: string[] = []
    let prompt = ''
    let actors = ''
    scene.actors?.forEach((actor, index) => {
        if(index !== 0) {
            actors += ', '
        }
        actors += `{actor${index}}`
    })

    prompt += actors

    prompt += ` participate in scene.${scene.furniture ? `Scene is at ${scene.furniture}.` : ''}${scene.tags ? ` Scene can be described by this tags: ${scene.tags.join(', ')}`: ''}\n`

    scene.actors?.forEach((actor, index) => {
        prompt += `\n{actor${index}}(${actor.intendedSex}) -${actor.feetOnGround ? ' is with feet on ground,' : ''} their position can be described by these tags: ${actor.tags?.join(', ')}.`
    })

    if(!scene.actions?.length) {
        prompt += '\n\n No active actions happen at this moment.'
    } else {
        prompt += `\n\nList of actions in the scene(all actions happen at the same time):`
        scene.actions.forEach(action => {
            const {type, actor: currentActor, target: currentTarget, performer: currentPerformer} = action
            const ostimAction = actions[type]
            if(!ostimAction) {
                notFoundActionDescriptions.push(type)
                prompt += `\n- ${JSON.stringify(action)}`
                return
            }
            const { actor, info: actionInfo, target, performer, tags: actionTags} = ostimAction
            const performerInfo = performer?.info
            let actionPrompt = `${type}${actionInfo ? ` - ${actionInfo}` : ''}.${actionTags ? ` Action can be described by these tags: ${actionTags.join(', ')}.` : ''}`
    
            actionPrompt += buildSceneActionActorPrompt(currentActor, actor)
    
            if(typeof currentTarget !== 'undefined') {
                actionPrompt += buildSceneActionActorPrompt(currentTarget, target)
            }
    
            if(typeof currentPerformer !== 'undefined') {
                actionPrompt += ` {actor${currentPerformer}} is active performer of this action.${performerInfo ? ` {actor${currentPerformer}} ${performerInfo}` : ''}`
            }
    
            prompt += '\n- ' + actionPrompt
        })
    }

    if(scene.tags?.includes("idle") || scene.tags?.includes("intro")) {
        prompt += `${actors} are eagerly awaiting their next sex participation.`
    }

    if(notFoundActionDescriptions.length) {
        console.warn('Didn\'t find these actions: ', notFoundActionDescriptions)
    }

    return prompt
}