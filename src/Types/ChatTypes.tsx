type UserChatInfo = {
    // id из монги
    chat: string,
    settings: any[], // TODO: это ChatSetting[]
    group: string,
    readBefore: Date
}

type UserChats = {
    // id из монги
    user: string,
    notes: UserChatInfo,
    archived: UserChatInfo[],
    deleted: UserChatInfo[],
    other: UserChatInfo[],
}

type ChatUser = {
    user: string,
    leftOn: Date,
    roles: string[]
}

type Chat = {
    id: string,
    name: string,
    about: string,
    type: string,
    settings: any[],
    users: ChatUser[]
}

type Message = {
    id: string
    chat: string,
    sender: string,
    type: string,
    date: Date,
    text: string,
    content?: any
}

export type { UserChats, UserChatInfo, Chat, ChatUser, Message }