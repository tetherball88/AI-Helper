export const extractJsonFromAnswer = (input: string) => {
    // Regular expression to find JSON-like content between braces
    const jsonMatch = input.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
        try {
            // Attempt to parse the matched string as JSON
            const parsedJson = JSON.parse(jsonMatch[0]);
            return parsedJson;
        } catch (error) {
            console.error("Invalid JSON format: ", error);
            return null; // Return null if parsing fails
        }
    }
    
    return null; // Return null if no JSON object is found
}