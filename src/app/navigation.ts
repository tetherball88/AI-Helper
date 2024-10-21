export type NavItem = {
    link: string
    text: string
    items?: NavItem[]
}

export const navigation: NavItem[] = [
    {
        link: '/chat',
        text: 'Chat'
    },
    {
        link: '/assistant',
        text: 'Assistant'
    },
    {
        link: '/personalities',
        text: 'Personalities'
    },
    // {
    //     link: '/scenes',
    //     text: 'Scenes'
    // },
    {  
        link: '/scenes-configs',
        text: 'Scenes'
    },
    {
        link: '/events',
        text: 'Events',
        items: [
            {
                link: '/events/events',
                text: 'Events'
            },
            {
                link: '/events/responses',
                text: 'Responses'
            },
            {
                link: '/events/ai-log',
                text: 'AI Log'
            },
            {
                link: '/events/current-active-quests',
                text: 'Current Active Quests'
            },
            {
                link: '/events/monitor-events',
                text: 'Monitor Events'
            }
        ]
    }
]