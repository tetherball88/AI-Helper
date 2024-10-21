'use client'

import { SideNav, TopNav } from "@/app/_components";
import theme from "@/theme";
import { ThemeProvider } from "@emotion/react";
import { Box } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter"
import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FC, PropsWithChildren } from "react";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onSuccess(data, query) {
        // if(query.)
    },
  })
})

export const Providers: FC<PropsWithChildren> = ({ children }) => {
    
    return (
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
              <ReactQueryDevtools initialIsOpen={false} />
              <SideNav />
              <TopNav />
              <Box sx={{ pt: "94px", pl: "200px", pr: 3, pb: 3, height: 'calc(100vh - 60px)', overflow: "auto" }}>
                {children}
              </Box>
            </QueryClientProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
    )
}