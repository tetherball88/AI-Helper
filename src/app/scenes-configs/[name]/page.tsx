'use client'

import { Box, Breadcrumbs, Dialog, DialogContent, DialogTitle, IconButton, styled, Link as MuiLink, Accordion, Typography, AccordionSummary, AccordionDetails, Grid2 } from '@mui/material';
import { FC, PropsWithChildren, ReactNode, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import CloseIcon from '@mui/icons-material/Close';
import { useParams } from 'next/navigation';
import { getSceneConfig } from '@/app/_logic/getScenesConfigs';
import { OstimScenesPage } from '@/app/scenes-configs/[name]/_components/OstimScenesPage/OstimScenesPage';
import { JsonEditor } from '@/app/_components/JsonEditor';
import Link from 'next/link';
import { grey } from '@mui/material/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SlalScenesPage } from '@/app/scenes-configs/[name]/_components/SlalScenesPage/SlalScenesPage';

interface ScenesTableItem {
    ostim_id: string
    sexlab_id: string
    content: string
    description?: string
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const ConfigRow: FC<PropsWithChildren> = ({ children }) => {
    return <Box sx={{ background: grey[700], color: grey[100], padding: 1, borderRadius: 1, fontSize: '20px', whiteSpace: 'nowrap', overflow: 'auto' }}>{children}</Box>
}

export default function ScenesPage() {
    const { name } = useParams<{ name: string }>()
    const { data: currentConfig } = useQuery({
        queryKey: ['currentConfig'],
        queryFn: () => getSceneConfig(name)
    })
    
    const [contentToOpen, setContentToOpen] = useState<{ content: string, isJson: boolean, jsonSchema?: any } | null>(null)

    let content: ReactNode = "Loading"

    if (currentConfig?.framework === 'ostim') {
        content = <OstimScenesPage showContent={(params) => setContentToOpen(params)} currentConfig={currentConfig} />
    } else if(currentConfig?.framework === 'sexlab') {
        content = <SlalScenesPage showContent={(params) => setContentToOpen(params)} currentConfig={currentConfig}  />
    }

    let modalContent: ReactNode = null

    if (contentToOpen) {
        if (contentToOpen.isJson) {
            modalContent = (
                <JsonEditor
                    json={JSON.parse(contentToOpen.content)}
                    selectedSchema={contentToOpen.jsonSchema}
                />
            )
        } else {
            modalContent = <pre style={{ whiteSpace: 'wrap' }}>{contentToOpen.content}</pre>
        }
    }

    const handleClose = () => setContentToOpen(null)

    return (
        <>
            <Breadcrumbs>
                <Link href="/scenes-configs"><MuiLink component="span">Scenes configs</MuiLink></Link>
                <Typography sx={{ color: 'text.primary' }}>{name}</Typography>
            </Breadcrumbs>
            {
                currentConfig && (
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                        >
                            Folders config
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid2 container rowSpacing={1} columnSpacing={3}>
                                {
                                    'ostimPackPath' in currentConfig.config && (
                                        <Grid2 size={6}>
                                            <Typography variant="h5">
                                                Ostim pack folder path:
                                                <ConfigRow>
                                                    {currentConfig.config.ostimPackPath}
                                                </ConfigRow>
                                            </Typography>
                                        </Grid2>
                                    )
                                }

                                <Grid2 size={6}>
                                    <Typography variant="h5">
                                        Slal folder path(to match sexlab_id):
                                        <ConfigRow>
                                            {currentConfig.config.slalPackPath || 'None'}
                                        </ConfigRow>
                                    </Typography>
                                </Grid2>
                                {
                                    'authorName' in currentConfig.config && (
                                        <Grid2 size={6}>
                                            <Typography variant="h5">
                                                Author name(to match sexlab_id):
                                                <ConfigRow>
                                                    {currentConfig.config.authorName || 'None'}
                                                </ConfigRow>
                                            </Typography>
                                        </Grid2>
                                    )}
                                {
                                    'customPrefixes' in currentConfig.config && (
                                        <Grid2 size={6}>
                                            <Typography variant="h5">
                                                Custom ostim prefixes(to match sexlab_id):
                                                <ConfigRow>
                                                    {currentConfig.config.customPrefixes?.join(', ') || 'None'}
                                                </ConfigRow>
                                            </Typography>
                                        </Grid2>
                                    )}
                            </Grid2>
                        </AccordionDetails>
                    </Accordion>
                )
            }

            {content}
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={!!contentToOpen}
                fullWidth
                maxWidth="xl"
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Modal title
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                    })}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '60vh'
                    }}>
                        {modalContent}
                    </Box>
                </DialogContent>
            </BootstrapDialog>
        </>
    )
}