export const tryToSanitizeAnswerJson = (json:any | {type: string, properties: any}): any => {
    if ('type' in json && json.properties) {
        return json.properties
    }

    json = JSON.parse(JSON.stringify(json, undefined, 4).replaceAll(/,\n[\s\t]*"connection": ""/gmi, ''))

    if(json.age)
        json.age = json.age.toLowerCase()

    if(!(json.nameAliases as [])?.length) {
        delete json.nameAliases
    }

    if(json.beastfolk === '' || json.beastfolk === null) {
        delete json.beastfolk
    }

    return json
}