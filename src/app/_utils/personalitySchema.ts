export const personalityCreateSchema = {
    "type": "object",
    "properties": {
        "name": {
            "type": "string",
            "description": "full name of character in snake case format. Don't replace spaces",
            "examples": [
                "Jarl Balgruuf the Greater",
                "Ulfric Stormcloak"
            ]
        },
        "nameAliases": {
            "type": "array",
            "description": "A collection of unique alternative names, titles, nicknames, or pet names by which the NPC is usually addressed in Skyrim. Keep empty if character doiesn't have aliases",
            "items": [{
                "type": "string"
            }], 
            "examples": [
                "Balgruuf the Greater",
                "Jarl Balgruuf",
                "Balgruuf"
            ]
        },
        "gender": {
            "type": "string",
            "description": "npc's gender"
        },
        "race": {
            "type": "string",
            "description": "The character's race or species, referring to fantasy races in the Skyrim game world (e.g., Nord, Elf, Orc, Khajiit)."
        },
        "beastfolk": {
            "type": "string",
            "description": "Vampire or werewolf if applicable",
            "enum": ["vampire", "werewolf"]
        },
        "origin": {
            "type": "string",
            "description": "Describes where the NPC is originally from, and if different, also includes where they currently reside. If the NPC still lives in their place of origin, only the place of origin is provided. If they have moved, both the place of origin and current residence are mentioned (e.g., 'Originally from Solitude, now lives in Riften')."
        },
        "age": {
            "type": "string",
            "enum": [
                "child",
                "young adult",
                "adult",
                "elderly",
                "ancient"
            ]
        },
        "occupation": {
            "type": "string",
            "description": "The character's role or job within the game world. (e.g., 'Village Healer', 'Wandering Merchant', 'Blacksmith', 'Farmer's Daughter')"
        },
        "corePersonalityTraits": {
            "type": "array",
            "description": "A list of key personality attributes that define how the character generally thinks, feels, and acts. (e.g., 'brave', 'cautious', 'compassionate', 'honest', 'curious')",
            "items": [
                {
                    "type": "string"
                }
            ]
        },
        "coreValuesBeliefs": {
            "type": "array",
            "description": "A list of fundamental principles and convictions that guide the character's decisions and worldview. e.g., 'loyalty to family', 'respect for nature', 'honor above all', 'knowledge seeking'",
            "items": [
                {
                    "type": "string"
                }
            ]
        },
        "backgroundSummary": {
            "type": "string",
            "description": "A brief overview of the character's history, including significant past events, upbringing, and motivations."
        },
        "relationships": {
            "type": "array",
            "description": "A list of relationships the NPC has with other characters. Each relationship includes the name of the NPC, a short description, the level of the relationship, and the type of relationship. Don't include relationships with Player",
            "items": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "description": "The name of the NPC with whom this character has a relationship."
                    },
                    "description": {
                        "type": "string",
                        "description": "A description of the relationship between the characters. If they have children mention if it's adult child or not."
                    },
                    // "level": {
                    //     "type": "string",
                    //     "enum": [
                    //         "archnemesis",
                    //         "enemy",
                    //         "rival",
                    //         "foe",
                    //         "acquaintance",
                    //         "friend",
                    //         "confidant",
                    //         "lover",
                    //         "ally"
                    //     ],
                    //     "description": "The level of the relationship, reflecting the emotional or social bond between the characters. Enum is sorted from archnemesis(worst) to ally(best). Ally usually used for family members which are in good relationships."
                    // },
                    // "connection": {
                    //     "type": "string",
                    //     "examples": [
                    //         "parent",
                    //         "son",
                    //         "daughter",
                    //         "aunt",
                    //         "uncle",
                    //         "boss",
                    //         "employee",
                    //         "businessPartner",
                    //         "conspirators",
                    //         "courting",
                    //         "cousins",
                    //         "sister",
                    //         "brother",
                    //         "spouse"
                    //     ],
                    //     "description": "The specific type of relationship."
                    // }
                },
                "required": [
                    "name",
                    "description"
                ]
            }
        },
        "communicationStyle": {
            "type": "object",
            "description": "Defines the character's communication patterns, including tone, language, and mannerisms.",
            "properties": {
                "tone": {
                    "type": "string",
                    "description": "The overall emotional tone of the character's speech (e.g., formal, casual, aggressive, cheerful, humorous)."
                },
                "mannerisms": {
                    "type": "string",
                    "description": "Any distinct language patterns or quirks in the character's speech (e.g., speaks in riddles, uses a lot of slang, frequently sighs, uses proverbs, speaks in short sentences)."
                }
            },
            "required": [
                "tone",
                "mannerisms"
            ]
        },
        "desires": {
            "type": "array",
            "description": "The character's primary goals or ambitions, which influence their behavior and decisions.",
            "items": {
                "type": "string",
                "description": "A specific desire or goal the character wants to achieve."
            }
        },
        "needsRequests": {
            "type": "array",
            "description": "The character's specific, immediate needs or requests, often directed at the player or other NPCs.",
            "items": {
                "type": "string",
                "description": "A specific need or request the character is making."
            }
        }
    },
    "required": [
        "name",
        "gender",
        "age",
        "occupation",
        "corePersonalityTraits",
        "coreValuesBeliefs",
        "backgroundSummary",
        "relationships",
        "communicationStyle"
    ]
}

export const personalityUpdateSchema = {
    "type": "object",
    "properties": {
        "nameAliases": {
            ...personalityCreateSchema.properties.nameAliases
        },
        "corePersonalityTraits": {
            ...personalityCreateSchema.properties.corePersonalityTraits
        },
        "coreValuesBeliefs": {
            ...personalityCreateSchema.properties.coreValuesBeliefs
        },
        "backgroundSummary": {
            ...personalityCreateSchema.properties.backgroundSummary
        },
        "relationships": {
            ...personalityCreateSchema.properties.relationships
        },
        "communicationStyle": {
            ...personalityCreateSchema.properties.communicationStyle
        },
        "desires": {
            ...personalityCreateSchema.properties.desires
        },
        "needsRequests": {
            ...personalityCreateSchema.properties.needsRequests
        }
    }
}