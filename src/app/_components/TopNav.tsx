import { AppBar, Box, Toolbar, Typography } from "@mui/material"

export const TopNav = () => {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              AI Follower Framework
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
    )
}