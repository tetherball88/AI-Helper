export const getAnswer = async (messages: Message[], isJson: boolean = false) => {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env['NEXT_PUBLIC_OPENROUTER_API_KEY']}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": "meta-llama/llama-3.1-70b-instruct",
            messages,
            ...(isJson ? { response_format: { type: 'json_object' } } : {}),
            stream: false,
        }),
        // signal: AbortSignal.timeout(20000)
    });
    
    return response.json()
}

// export const getAnswerStream = () => {}

// export const getAnswerJson = () => {}