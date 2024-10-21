'use client'

import { prompts } from "@/app/_utils/prompts"
import { getAnswer } from "@/app/_logic/connectors/openrouter/openrouter"
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import { useState } from "react"

export default function ChatPage() {
    const [message, setMessage] = useState('')
    const [answer, setAnswer] = useState('')
    const [selectedPrompt, setSelectedPrompt] = useState(prompts[0])

    const prompt: Message[] = selectedPrompt ? [
        {role: 'system', content: selectedPrompt},
    ] : []

    const sendHandler = async () => {
        const answer = (await getAnswer([
            ...prompt, 
            { role: 'user', content: message }
        ], true)).choices[0].message
        setAnswer(answer.content)
    }

    return (
        <>
            <Box>
                {answer}
            </Box>
            <Box sx={{
                display: "flex",
                position: 'fixed',
                bottom: 0,
                width: 'calc(100vw - 200px)',
                padding: 3,
            }}>
                <FormControl sx={{ width: "300px", mr: 4}}>
                    <InputLabel id="select-prompt">Prompt</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedPrompt}
                        label="Prompt"
                        onChange={event => setSelectedPrompt(event.target.value as string)}
                        disabled={prompts.length === 0}
                    >
                        {prompts.map((p) => (<MenuItem key={p} value={p}>{p}</MenuItem>))}
                    </Select>
                </FormControl>
                <TextField
                    label="Send your message"
                    multiline
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    fullWidth
                    maxRows={6}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <Button size="small" variant="contained" onClick={sendHandler} sx={{ position: 'absolute', right: "20px" }}>Send</Button>
                            ),
                        },
                    }}
                />
            </Box>

        </>

    )
}