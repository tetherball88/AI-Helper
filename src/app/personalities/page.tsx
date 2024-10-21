'use client'

import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { getPersonalitiesTable } from '@/app/_logic/getPersonalitiesTable';
import { useRef, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, styled, Tooltip } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import CloseIcon from '@mui/icons-material/Close';
import Ajv from 'ajv'
import { personalityCreateSchema } from '@/app/_utils/personalitySchema';
import ErrorIcon from '@mui/icons-material/Error';
import { JsonEditor } from '@/app/_components/JsonEditor';
import { useCreateNewPersonality } from '@/app/personalities/useCreateNewPersonality';
import { useUpdatePersonality } from '@/app/personalities/useUpdatePersonality';
import { CombinedPersonalityDB } from '@/app/_logic/getPersonalities';
import { orderPersonalityProperties, xPersonalityFieldsOrder } from '@/app/personalities/orderPersonalityProperties';
import { Personality } from '@/app/_types/Personality';
import { useCreateXPersonality } from '@/app/personalities/useCreateXPersonality';
import { useUpdateXPersonality } from '@/app/personalities/useUpdateXPersonality';
import { xPersonalitySchema } from '@/app/_utils/xPersonalitySchema';

const ajv = new Ajv()
const validate = ajv.compile({ ...personalityCreateSchema, additionalProperties: false })

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export default function PersonaitiesPage() {
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({})
    const [selectedPersona, setSelectedPersona] = useState<{ id: string, type: 'old' | 'new' | 'x', content: string } | null>(null)
    const selectedJson = useRef<string | null>(null)
    const [schema, setSchema] = useState<any | null>(null)

    const setLoadingMapItem = (name: string, val: boolean) => {
        setLoadingMap((old) => ({...old, [name]: val}))
    }

    const {
        isLoading,
        data,
    } = useQuery({
        queryKey: ['personalitiesDB'],
        queryFn: () => getPersonalitiesTable(),
    })

    const { mutate: createPersonality } = useCreateNewPersonality((name) => setLoadingMapItem(name, false))
    const { mutate: createXPersonality } = useCreateXPersonality((name) => setLoadingMapItem(name, false))

    const { mutate: updatePersonality } = useUpdatePersonality((personality) => {
        setLoadingMapItem(personality.id, false)
        selectedJson.current = JSON.stringify(personality.personality, undefined, 4)
    })

    const { mutate: updateXPersonality } = useUpdateXPersonality((personality) => {
        setLoadingMapItem(personality.id, false)
        selectedJson.current = JSON.stringify(personality.xPersonality, undefined, 4)
    })

    const handleClose = () => setSelectedPersona(null)

    const generateNewPersonality = async (id: string, oldContent: string) => {
        setLoadingMapItem(id, true)
        createPersonality({ id, oldContent })
    }

    const generateXPersonality = async (id: string, personality: Personality) => {
        setLoadingMapItem(id, true)
        createXPersonality({ id, personality })
    }

    const columns: GridColDef<CombinedPersonalityDB>[] = ([
        { field: 'npc_name', headerName: 'Name', width: 70 },
        {
            field: 'npc_pers',
            headerName: 'Old Persona',
            renderCell: ({ row }) => (
                <Button
                    onClick={() => {
                        setSelectedPersona({ id: row.npc_name, type: 'old', content: row.npc_pers })
                        selectedJson.current = JSON.stringify({ content: row.npc_pers })
                        setSchema(null)
                    }}>
                    Show
                </Button>
            )
        },
        {
            field: 'personality',
            headerName: 'New Persona',
            width: 140,
            renderCell: ({ row }) => {
                if (row.personality) {
                    return (
                        <Button
                            variant="contained"
                            onClick={() => {
                                if (!row.personality) {
                                    return
                                }
                                setSelectedPersona({ id: row.npc_name, type: 'new', content: row.personality as any })
                                selectedJson.current = JSON.stringify(orderPersonalityProperties(row.personality as any))
                                setSchema(personalityCreateSchema)
                            }}>
                            Show
                        </Button>
                    )
                } else {
                    const loadingBtn = !!loadingMap[row.npc_name]
                    return (
                        <LoadingButton
                            variant="outlined"
                            loading={loadingBtn}
                            disabled={loadingBtn}
                            onClick={() => generateNewPersonality(row.npc_name, row.npc_pers.replace(/Roleplay as [^\n]+\n/gmi, ''))}
                        >
                            Generate
                        </LoadingButton>
                    )
                }
            }
        },
        {
            field: 'errors',
            headerName: 'JSON errors',
            renderCell: ({ row }) => {

                if (row.personality) {
                    validate(row.personality)

                }

                if (validate.errors?.length) {
                    return <Tooltip title={JSON.stringify(validate.errors, undefined, 4)}><ErrorIcon color="error" /></Tooltip>
                }


                return ''
            }
        },
        {
            field: 'xPersonality',
            headerName: 'X Persona',
            width: 140,
            renderCell: ({ row }) => {
                if (row.xPersonality) {
                    return <Button
                        variant="contained"
                        onClick={() => {
                            if (!row.xPersonality) {
                                return
                            }
                            setSelectedPersona({ id: row.npc_name, type: 'x', content: row.xPersonality as any })
                            selectedJson.current = JSON.stringify(orderPersonalityProperties(row.xPersonality as any, xPersonalityFieldsOrder))
                            setSchema(xPersonalitySchema)
                        }}>
                        Show
                    </Button>
                } else {
                    const loadingBtn = loadingMap[row.npc_name]
                    return (
                        <LoadingButton
                            variant="outlined"
                            loading={loadingBtn}
                            disabled={loadingBtn || !row.personality}
                            onClick={() => generateXPersonality(row.npc_name, row.personality as Personality)}
                        >
                            Generate
                        </LoadingButton>
                    )
                }
            }
        },
    ]);

    const updateJson = () => {
        if (selectedPersona?.type === 'new' && selectedJson.current) {
            updatePersonality({ id: selectedPersona.id, personality: JSON.parse(selectedJson.current) })
        }

        if (selectedPersona?.type === 'x' && selectedJson.current) {
            updateXPersonality({ id: selectedPersona.id, xPersonality: JSON.parse(selectedJson.current) })
        }

        return Promise.resolve()
    }

    return (
        <>
            <Paper sx={{ height: "100%", width: '100%' }}>
                <DataGrid<CombinedPersonalityDB>
                    loading={isLoading}
                    getRowId={(row) => {
                        return row.npc_name
                    }}
                    rows={data?.data.map(item => ({ ...item, id: item.npc_name }))}
                    rowCount={data?.pagination.totalRecords}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                page: 0,
                                pageSize: 100,
                            }
                        }
                    }}
                    pageSizeOptions={[100, 200, 500]}
                    checkboxSelection
                    sx={{ border: 0 }}
                    onCellDoubleClick={(cell) => {
                        // if (cell.field === 'npc_pers') {
                        //     setSelectedPersona({ id: cell.row.npc_name, type: 'old', content: cell.row.npc_pers })
                        //     selectedJson.current = JSON.stringify({ content: cell.row.npc_pers })
                        // }

                        // if (cell.field === 'personality') {
                        //     setSelectedPersona({ id: cell.row.npc_name, type: 'new', content: cell.row.personality })
                        //     selectedJson.current = JSON.stringify(orderPersonalityProperties(cell.row.personality))
                        //     setSchema(personalityCreateSchema)
                        // }

                        // if (cell.field === 'xPersonality') {
                        //     setSelectedPersona({ id: cell.row.npc_name, type: 'x', content: cell.row.xPersonality })
                        //     selectedJson.current = JSON.stringify(orderPersonalityProperties(cell.row.xPersonality, xPersonalityFieldsOrder))
                        //     setSchema(xPersonalitySchema)
                        // }
                    }}
                    disableRowSelectionOnClick
                    autosizeOptions={{
                        columns: ['name', 'status', 'createdBy'],
                        includeOutliers: true,
                        includeHeaders: false,
                    }}
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{
                        toolbar: {
                            showQuickFilter: true,
                        },
                    }}
                />
            </Paper >

            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={!!selectedPersona}
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
                        {
                            selectedJson.current && (
                                <JsonEditor
                                    json={JSON.parse(selectedJson.current)}
                                    onChange={value => {
                                        selectedJson.current = value || null
                                    }}
                                    onSave={updateJson}
                                    selectedSchema={schema}
                                />
                            )
                        }
                    </Box>


                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" onClick={updateJson}>Save</Button>
                </DialogActions>
            </BootstrapDialog>
        </>
    )
}