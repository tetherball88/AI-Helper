import { CombinedPersonalityDB } from "@/app/_logic/getPersonalities"
import { HistoryMessageItem } from "@/app/_types/HistoryMessageItem"
import { Personality } from "@/app/_types/Personality"
import { XPersonality } from "@/app/_types/XPersonality"
import pick from 'lodash.pick'

const CHANCE_TO_TRIGGER_X_DIAL = 100

const startDialLine = (name: string) => `write next dialogue line for ${name}`
const dialPromptFormat = (name: string) => `, using this format \"${name}: \" 
Use this JSON object to give your answer: {
    "character": "${name}",
    "listener": "specify who ${name} is talking to",
    "mood": "sassy,assertive,sexy,smug,kindly,lovely,seductive,sarcastic,sardonic,smirking,amused,default,assisting,irritated,playful,neutral,teasing,mocking",
    "message": "dialogues lines",
}
Return ONLY JSON. Start with { and end with }
`

const xDialLines = (commStyles: string[]) => {
    const style = commStyles[Math.floor(Math.random() * commStyles.length)]
    const styleTxt = style ? ` in ${style} style` : ''
    return [
        `, tells${styleTxt} about current sex scene and excitement, short sentences`,
        `, tells${styleTxt} about partner's cock size `,
        `, tells${styleTxt} about current sex position`,
        `, tells${styleTxt} pleasure words between moans`,
        `, tells${styleTxt} about her current pleasure`,
        `, moans${styleTxt} in pleasure`,
        `, talks dirty about what they want to do to partner`,
        `, teases partner about their desires`,
        `, makes a naughty comment about partner's body`,
        // `, asks${styleTxt} partner to change sex position`,
        // `, asks${styleTxt} partner to go faster`,
        // `, asks${styleTxt} partner to go slower`,
        // `, asks${styleTxt} partner to touch a specific body part`,
        // `, asks${styleTxt} partner to kiss a specific body part`,
        // `, asks partner to use a sex toy`,
        // ...(possibleStyles.find(st => st.includes('dirty') || st.includes('explicit')) ? [
        //     `, talks dirty about what they want to do to partner`,
        //     `, teases partner about their desires`,
        //     `, makes a naughty comment about partner's body`,
        // ] : [])
    ]
}

const xSceneChangeDialLine = (name: string, currScene: string, prevScene: string) => `${startDialLine(name)}: ${name} comments changing sex position from:
"${prevScene}"
to:
"${currScene}"
${dialPromptFormat(name)}`

const scenePrompt = (currentName: string, participantsNames: string[], currentSceneDesc?: string | null) => participantsNames.reduce((acc, item, index) => {
    return acc.replaceAll(`{actor${index}}`, item)
}, `
- All participants are adults and consent. 
- During sex follow ${currentName}'s personality and sex personality guidelines! 
- If spouse finds their loved one has sex with somebody else they need to decide be jealous/cuckold/breakup.
${currentSceneDesc}`)

const xSceneDialLine = (name: string, line: string) => `${startDialLine(name)}${line}${dialPromptFormat(name)}`

const buildDialPrompt = (name: string, line?: string) => `${startDialLine(name)}${line ? `${line}` : ''}${dialPromptFormat(name)}`

const characterPrompt = (personality: Personality, sceneDesc: string | null, xPersonality: XPersonality) => `Let's roleplay in the Universe of Skyrim. I'm Player.

Roleplay as ${personality.name},
${JSON.stringify(personality)}

- Respect ${personality.name} and avoid pushing them to engage in activities that make them uncomfortable.
${xPersonality ? `${personality.name}'s sexual orintation is ${xPersonality.orientation}, and preferred relationship type is ${xPersonality.relationshipStyle}` : ''}

${sceneDesc && xPersonality ? `${personality.name}'s sex personality can be described as:\n${JSON.stringify(xPersonality)}` : ''}

${sceneDesc}
`

const sysMsg = (msg: string): Message => ({
    role: 'system',
    content: msg
})

const userMsg = (msg: string): Message => ({
    role: 'user',
    content: msg
})

// const assistMsg = (msg: string): Message => ({
//     role: 'assistant',
//     content: msg
// })

export const buildPrompt = ({
    participants,
    speakingCharacter,
    userMessage,
    history,
    xSceneDesc,
    prevXSceneDesc,
    includePlayer
}: { history: HistoryMessageItem[], userMessage?: string, speakingCharacter: CombinedPersonalityDB | null, xSceneDesc?: string, prevXSceneDesc?: string, participants: string[], includePlayer?: boolean }): Message[] => {
    const characterPers = speakingCharacter?.personality as Personality
    const characterXPers = speakingCharacter?.xPersonality as XPersonality
    let dialPrompt = buildDialPrompt(characterPers.name)
    
    let sceneDesc = ''

    if(xSceneDesc) {
        const sceneParticipants = participants

        sceneDesc = scenePrompt(speakingCharacter?.personality?.name || 'Undefined', [...(includePlayer ? ['PLayer', ...sceneParticipants] : sceneParticipants)].filter(p => p !== 'none'), xSceneDesc)
    }

    const prompts = [
        sysMsg(characterPrompt(speakingCharacter?.personality as Personality, sceneDesc, characterXPers))
    ]

    prompts.push(...(history.slice(history.length - 50).map(({ content, role, name }) => {
        if (role === 'assistant') {
            return userMsg(`${name} says: ${content.message}`)
        }

        return userMsg(`Player says: ${content.message}`)
    })))

    if(userMessage?.toLowerCase().includes('stop roleplaying')) {
        prompts.push(userMsg(userMessage))
        return prompts
    }

    if (xSceneDesc) {
        if (prevXSceneDesc) {
            dialPrompt = xSceneChangeDialLine(characterPers.name, xSceneDesc, prevXSceneDesc)
        } else {
            // prompts.push(userMsg()
            const currChance = Math.random() * 100
            if (!userMessage && currChance < CHANCE_TO_TRIGGER_X_DIAL) {
                const lines = xDialLines(speakingCharacter?.xPersonality?.speakStyleDuringSex || [])
                dialPrompt = xSceneDialLine(characterPers.name, lines[Math.floor(Math.random() * lines.length)])
            }
        }
    }

    if (userMessage) {
        prompts.push(userMsg(userMessage))
    }

    prompts.push(userMsg(dialPrompt))

    return prompts
}