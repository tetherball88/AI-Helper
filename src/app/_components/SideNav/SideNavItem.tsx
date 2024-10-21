import { NavItem } from "@/app/navigation"
import { Collapse, List, ListItem } from "@mui/material"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FC, useState } from "react"

interface SideNavItemProps {
    navItem: NavItem
    level?: number
}

export const SideNavItem: FC<SideNavItemProps> = ({ navItem, level = 0 }) => {
    const pathName = usePathname();
    const isActive = pathName.startsWith(navItem.link)
    const [active, setActive] = useState(isActive)

    if(navItem.items?.length) {
        return (
            <>
            <ListItem sx={{ pl: level }} onClick={() => setActive(!active)}>
                {navItem.text}
            </ListItem>
            
            <Collapse in={active} timeout="auto">
                
                <List component="div" disablePadding>
                    {navItem.items.map((item) => (
                        <SideNavItem key={item.link} navItem={item} level={level+1} />
                    ))}
                </List>
            </Collapse>
            </>
            
        )
    }

    return (
        <ListItem sx={{ pl: level }}>
            <Link href={navItem.link}>{navItem.text}</Link>
        </ListItem>
    )
}