'use client'

import { getAnswer } from "@/app/_logic/connectors/openrouter/openrouter"
import { CombinedPersonalityDB } from "@/app/_logic/getPersonalities"
import { Box, Button, ButtonGroup, Checkbox, FormControl, FormControlLabel, InputLabel, List, ListItem, ListItemText, MenuItem, Select, TextField, Tooltip } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getScenes, getScenesDB } from "@/app/_logic/getScenesDB"
import { buildPrompt } from "@/app/chat/_logic/buildPrompt"
import { HistoryMessageItem } from "@/app/_types/HistoryMessageItem"
import { tryToFixBrokenJson } from "@/app/_utils/tryToFixBrokenJson"
import { ChatCharacterSelectButton } from "@/app/chat/_components/ChatCharacterSelectButton"
import { getChatHistoryFromStore, storeChatHistory } from "@/app/chat/_logic/storeChatHistory"
import { v4 as uuidv4 } from 'uuid'


export default function ChatPage() {
    const [chatHistory, setChatHistory] = useState<HistoryMessageItem[]>([])
    const [message, setMessage] = useState('')
    const [selectedPersonality, setSelectedPersonality] = useState<CombinedPersonalityDB | null>(null)
    const [participants, setParticipants] = useState<string[]>(['none'])
    const [sceneParticipants, setSceneParticipants] = useState<string[]>([])
    const [chatId, setChatId] = useState('')
    const chatMessagesRef = useRef<any>()
    const [selectedScene, setSelectedScene] = useState<{
        curr: string
        prev: string
    }>({ curr: '', prev: '' })
    const [includePlayer, setIncludePlayer] = useState(true)

    const { data: allSavedChats } = useQuery({ queryKey: ['localHistory'], queryFn: () => getChatHistoryFromStore() })

    const scrollToBottom = () => {
        if(chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
        
    }

    useEffect(() => {
        const savedChat = allSavedChats?.find(({ id }) => id === chatId)

        if (savedChat) {
            setParticipants(savedChat.participants)
            setChatHistory(savedChat.chat)
            setSceneParticipants(savedChat.sceneParticipants || [])
            setSelectedScene(old => ({...old, curr: savedChat.scene || '' }))
        }
    }, [chatId])

    

    let {
        data: scenesFromDb,
    } = useQuery({
        queryKey: ['scenesDB'],
        queryFn: () => getScenesDB(),
    })

    scenesFromDb = scenesFromDb?.sort((a, b) => a.id.localeCompare(b.id))

    const sendHandler = async () => {
        const newChatHistory: HistoryMessageItem[] = [...chatHistory.slice(-60)]

        const currentSceneDesc = scenesFromDb?.find(({ id }) => id === selectedScene.curr)?.description
        const prevSceneDesc = scenesFromDb?.find(({ id }) => id === selectedScene.prev)?.description
        const prompts = buildPrompt({
            participants: sceneParticipants.sort((a, b) => participants.indexOf(a) - participants.indexOf(b)),
            includePlayer,
            xSceneDesc: currentSceneDesc,
            prevXSceneDesc: prevSceneDesc,
            speakingCharacter: selectedPersonality,
            history: newChatHistory,
            userMessage: message
        })

        if (message) {
            setChatHistory((oldHistory) => [...oldHistory, { role: 'user', name: 'Player', content: { character: 'Player', listener: selectedPersonality?.personality?.name || '', message } }])
            scrollToBottom()
        }

        setMessage('')

        const answer = (await getAnswer(prompts, true)).choices[0].message

        if (selectedScene.prev) {
            setSelectedScene((sc) => ({ ...sc, prev: '' }))
            scrollToBottom()
        }


        setChatHistory((oldHistory) => {
            const updatedHistory = [...oldHistory, { ...answer, name: selectedPersonality?.personality?.name || 'Unknown', content: tryToFixBrokenJson(answer.content) }]
            storeChatHistory({
                id: chatId,
                chat: updatedHistory,
                participants,
                sceneParticipants,
            })

            return updatedHistory
        })
    }

    if (!chatId) {
        return (<>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Button size="small" variant="contained" onClick={() => setChatId(uuidv4())}>Create new chat</Button>
                <FormControl sx={{ width: "300px", mr: 4 }}>
                    <InputLabel id="select-prompt">Select chat or create new</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedScene.curr}
                        size="small"
                        onChange={event => {
                            setChatId(event.target.value)
                        }}
                        disabled={scenesFromDb?.length === 0}
                    >
                        {allSavedChats?.map(({ id }) => (<MenuItem key={id} value={id}>{id}</MenuItem>))}
                    </Select>
                </FormControl>
            </Box>

        </>)

    }

    return (
        <>
            <Box sx={{ position: 'sticky', top: '0px', background: 'white', padding: 1, zIndex: 2 }}>
                <FormControlLabel control={<Checkbox defaultChecked={includePlayer} value={includePlayer} onChange={(e) => setIncludePlayer(e.target.checked)} />} label="Player" />
                <ButtonGroup
                    color="primary"
                    aria-label="Platform"
                    size="large"
                >
                    {
                        participants.filter(name => name.toLowerCase() !== 'player').map((p, index) => (
                            <ChatCharacterSelectButton
                                key={p}
                                active={selectedPersonality?.npc_name === p}
                                characterIndex={index}
                                participantId={p}
                                onAdd={(id, index) => {
                                    const newParticipants = [...participants.slice(0, index), id, ...participants.slice(index + 1)]
                                    if (newParticipants.length < 5 && !newParticipants.find(par => par === 'none')) {
                                        newParticipants.push('none')
                                    }
                                    setParticipants(newParticipants)

                                }}
                                onSelect={(selectedCharacter) => {
                                    setSelectedPersonality(selectedCharacter)
                                }}
                                participant={sceneParticipants.includes(p)}
                                onToggleParticipant={(name, checked) => {
                                    let updatedParticipants = [...sceneParticipants]
                                    if(checked) {
                                        if (!sceneParticipants.includes(p))
                                            updatedParticipants.push(name)
                                    } else {
                                        updatedParticipants = updatedParticipants.filter(n => n !== name)
                                    }

                                    setSceneParticipants(updatedParticipants)
                                }}
                            />
                        ))
                    }

                </ButtonGroup>
                <FormControl sx={{ width: "300px", mr: 4 }}>
                    <InputLabel id="select-prompt">Select scene</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedScene.curr}
                        size="small"
                        onChange={event => {
                            setSelectedScene(({ curr }) => ({ curr: event.target.value as string, prev: curr }))
                        }}
                        disabled={scenesFromDb?.length === 0}
                    >
                        <MenuItem value="">None</MenuItem>
                        {scenesFromDb?.map(({ id }) => (<MenuItem key={id} value={id}>{id}</MenuItem>))}
                    </Select>
                </FormControl>
            </Box>

            <Box>
                <List ref={chatMessagesRef} sx={{ height: 'calc(100vh - 300px)', overflow: 'auto' }}>
                    {chatHistory.map(({ role, name, content }) => {
                        return (
                            <ListItem key={role + name + content.message} sx={{
                                textAlign: role === 'assistant' ? 'right' : 'left'
                            }}>
                                <ListItemText primary={content.character} secondary={content.message} />
                            </ListItem>
                        )
                    })}
                </List>
            </Box>
            <Box sx={{
                display: "flex",
                position: 'fixed',
                bottom: 0,
                width: 'calc(100vw - 200px)',
                padding: 3,
            }}>

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
                                <Tooltip title={!selectedPersonality ? 'Please select speaker' : ''} disableInteractive>
                                    <Button 
                                        size="small" 
                                        variant="contained" 
                                        onClick={sendHandler} 
                                        disabled={!selectedPersonality} 
                                        sx={{ position: 'absolute', right: "20px" }}
                                    >
                                        Send
                                    </Button>
                                </Tooltip>
                                
                            ),
                        },
                    }}
                />
            </Box>

        </>

    )
}