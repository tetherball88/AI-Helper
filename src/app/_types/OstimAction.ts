interface OstimActionActorFaction {
    /**
     *  (string): the name of the mod this form is defined in, including the file extension
     */
    mod: string
    /**
     *  (string): the form id of the form in hexadecimal notation
	 *  note: json doesn't support hexadecimal notation, which is why this is a string and not an int
     */
    formid: string
}
export interface OstimActionActor {
    /**
     * (string): this field does not get parsed, it's just there to help understanding how to properly use this action
     */
    info?: string
    /**
     *  (float): the amount of stimulation this action generates every second for this Skyrim actor
     *  in an animation with multiple stimulating actions the Skyrim actor will get stimulation equal to the highest stimulation defined for them plus 10% of all other stimulation defined for them
     */
    stimulation?: number
    /**
     *  (float): a stimulation threshold after which this action will no longer generate any stimulation
     *  this for example can be used by actions like kissing to prevent the Skyrim actors climaxing from kissing alone
     */
    maxStimulation?: number
    /**
     *  (object): a faction that the actor can be put in to modify the stimulation they receive from this action (see form fields)
     */
    stimulationFaction?: OstimActionActorFaction
    /**
     * (object): a faction that the actor can be put in to modify the maximum stimulation they can receive from this action (see form fields)
     */
    maxStimulationFaction?: OstimActionActorFaction
    /**
     *  (bool): When true executing this action will fully strip this Skyrim actor (if fully undress mid scene is enabled in the MCM)
     */
    fullStrip?: boolean
    /**
     *  (bool): When true the Skyrim actor will do moaning sounds when this action is played.
     */
    moan?: boolean
    /**
     *  (bool): When true the Skyrim actor will talk when this action is played.
     *  This requires add-ons to add dialogue for this actor as OStim does not come with any dialogue on its own.
     */
    talk?: boolean
    /**
     *  (bool): When true the Skyirm actor will only do muffled sounds when moaning and do no talking.
     *  this is mainly used for when an actor has their mouth full (usually by performing an oral action)
     */
    muffled?: boolean
    /**
     *  (string): when set executing this action will override this Skyrim actors facial expression with one for this set (see facial expression README for how to define an expression set)
     *  this can be used to open the mouth and/or stick out the tongue for oral actions
     */
    expressionOverride?: string
    /**
     * (list<string>): a list of requirements for this Skyrim actor, if they are not met an animation containing this action will not show up in navigation (see actor properties README)
     */
    requirements?: string[]
    /**
     *  (list<int>): a list of biped slots to strip on this Skyrim actor when executing this scene (if partial undressing is enabled in the MCM)
     */
    strippingSlots?: number[]
    /**
     * (object/list<object>): a faction or list of factions the actor is put in while participating in this role in this action (see form fields)
     * this is mainly useful for condition functions for addons / voice sets
     */
    faction?: OstimActionActorFaction | OstimActionActorFaction[]
    /**
     *  (map<string, int>): A map of custom ints that can be used by addons
     */
    ints?: Record<string, number>
    /**
     * (map<string, list<int>>): a map of custom int lists that can be used by addons
     */
    intLists?: Record<string, number[]>
    /**
     *  (map<string, float>): a map of custom floats that can be used by addons
     *  known ones are: "stamina" for the actions stamina cost for OEndurance
     */
    floats?: Record<string, number>

    /**
     *  (map<string, list<float>>): a map of custom float lists that can be used by addons
     */
    floatLists?: Record<string, number[]>
    /**
     *  (map<string, string>): a map of custom strings that can be used by addons
     */
    strings?: Record<string, string>
    /**
     *  (map<string, list<string>>): a map of custom string lists that can be used by addons
     *  known ones are: "cum" for the cum overlay slots for OCum
     */
    stringLists?: Record<string, string[]>
}

interface OstimActionSound {
    /**
     *  (string): the type of the sound, depending on type additional fields may be required (see sound types)
     */
    type: string
    /**
     *  (object): the sound descriptor of the sound (see form fields)
     */
    sound: any
    /**
     *  (bool): when set to true the sound will not play while the actor is muted
     */
    muteWithActor: boolean
    /**
     *  (bool): when set to true the sound will not play while the target is muted
     */
    muteWithTarget: boolean
    /**
     * (bool): when set to true this sound will not play in NPCxNPC threads
     */
    playerThreadOnly: boolean

}

export interface OstimAction {
    /**
     * (string): this field does not get parsed, it's just there to help understanding how to properly use this action
     */
    info?: string
    /**
     * (list<string>): a list of aliases for this action, using an alias in a scene file will result in it being treated as if this action was used
     */
    aliases?: string[]
    /**
     * (object): a collection of attributes for the action actor (see actor fields)
     */
    actor: OstimActionActor
    /**
     * (object): a collection of attributes for the action target (see actor fields)
     */
    target?: OstimActionActor
    /**
     * (object): a collection of attributes for the action performer (see actor fields)
     */
    performer?: OstimActionActor
    /**
     *  (list<object>): a list of sounds to play during this action (see sound fields)
     */
    sounds: OstimActionSound[]
    /**
     *  (list<string>): a list of tags for this action, commonly used are "oral", playful", "seductive", "sensual" and "sexual"
     */
    tags?: string[]
}