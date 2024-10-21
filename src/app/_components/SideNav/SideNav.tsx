"use client"

import { Box, Drawer, List } from "@mui/material"
import { navigation } from "@/app/navigation";
import { SideNavItem } from "@/app/_components/SideNav/SideNavItem";

export const SideNav = () => {
    return (
        <Drawer
            open
            variant="permanent" 
            PaperProps={{
                sx: {
                    mt: "64px",
                }
            }}
          >
            <Box
                role="presentation"
            >
                <List>
                    {navigation.map((navItem) => (
                        <SideNavItem key={navItem.link} navItem={navItem} />
                    ))}
                </List>
            </Box>
        </Drawer>
    )
}