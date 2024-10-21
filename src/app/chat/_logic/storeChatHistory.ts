import { IndexedDbService } from "@/app/_logic/IndexedDB"
import { HistoryMessageItem } from "@/app/_types/HistoryMessageItem"

type LocalStorageChatHistoryItem = {
    id: string
    chat: HistoryMessageItem[]
    participants: string[]
    sceneParticipants: string[]
    scene?: string
}

const idb = new IndexedDbService<LocalStorageChatHistoryItem>('chat', 'chatHistory')

export function getChatHistoryFromStore(): Promise<LocalStorageChatHistoryItem[]>
export function getChatHistoryFromStore(id: string): Promise<LocalStorageChatHistoryItem>
export function getChatHistoryFromStore(id?: string) {
    if(!id) 
        return idb.getAllItems()
    
    return idb.getItem(id)
}

export const storeChatHistory = (data: LocalStorageChatHistoryItem) => {
    return idb.addItem(data)
}

