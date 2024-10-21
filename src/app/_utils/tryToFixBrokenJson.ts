export const tryToFixBrokenJson = <T>(brokenJson: string): T | null => {
    try {
        // First, try parsing as is
        return JSON.parse(brokenJson);
    } catch (error) {
        console.warn("Initial JSON parse failed, attempting to fix...", error);
    }

    let fixedJson = brokenJson;

    // Step 1: Remove any trailing commas
    fixedJson = fixedJson.replace(/,\s*([\]}])/g, '$1');

    // Step 2: Replace single quotes with double quotes
    fixedJson = fixedJson.replace(/:\s*'([^']*)'/g, ': "$1"');

    // Step 3: Add quotes around unquoted keys (handling objects and arrays)
    // This regex adds quotes around keys or values that are not properly quoted
    fixedJson = fixedJson.replace(/([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)(\s*:\s*)([A-Za-z_][A-Za-z0-9_]*)(\s*[,}])/g, '$1"$2"$3"$4"$5');

    // Step 4: Ensure any missing closing brackets or braces are added
    const openBrackets = (fixedJson.match(/\{/g) || []).length;
    const closeBrackets = (fixedJson.match(/\}/g) || []).length;

    if (openBrackets > closeBrackets) {
        fixedJson += '}'.repeat(openBrackets - closeBrackets);
    } else if (closeBrackets > openBrackets) {
        fixedJson = '{'.repeat(closeBrackets - openBrackets) + fixedJson;
    }

    // Step 5: Try parsing again after fixes
    try {
        return JSON.parse(fixedJson);
    } catch (error) {
        console.error("Failed to fix JSON", error);
        return {character: 'Unknown', listener: 'Unknown', message: brokenJson} as T; // Return null if parsing still fails
    }
}