import { getOstimActions } from "@/app/_logic/getOstimActions"
import { getScenesDB } from "@/app/_logic/getScenesDB"
import { getScenesLocal } from "@/app/_logic/getScenesLocal"
import { ScenesPathsConfigItemOstim } from "@/app/_types/ScenesPathsConfig"
import { transformScene } from "./transformScene"
import { useCreateScene } from "./useCreateScene"
import { LoadingButton } from "@mui/lab"
import { Button, IconButton, Paper, Tooltip,  } from "@mui/material"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { useQuery } from "@tanstack/react-query"
import { FC, ReactNode, useState } from "react"
import ReplayIcon from '@mui/icons-material/Replay';
import { useMatchSlal } from "./useMatchSlal"



interface ScenesTableItem {
    ostim_id: string
    sexlab_id: string
    json: any,
    content: string
    description?: string
}

interface OstimScenesPageProps {
    currentConfig: ScenesPathsConfigItemOstim
    showContent: (params: {content: string, jsonSchema?: any, isJson: boolean}) => void
}



export const OstimScenesPage: FC<OstimScenesPageProps> = ({ showContent, currentConfig }) => {
    const { mutate: createScene } = useCreateScene(({ ostim_id }) => {
        setLoadingMapItem(ostim_id, true)
    })
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({})
    // const { mutate: matchSlal } = useMatchSlal()
    // const [selectedScene, setSelectedScene] = useState<string | null>(null)

    const setLoadingMapItem = (id: string, val: boolean) => {
        setLoadingMap((oldValue) => ({
            ...oldValue,
            [id]: val
        }))
    }

    const slalPackPath = currentConfig.config.slalPackPath
    const authorName = currentConfig.config.authorName

    const {
        data: scenesFromDb,
        isLoading: isScenesDBLoading,
    } = useQuery({
        queryKey: ['scenesDB'],
        queryFn: () => getScenesDB(),
    })

    const {
        data: scenesFromLocalFiles,
        isLoading: isScenesLocalLoading,
    } = useQuery({
        queryKey: ['scenesLocal'],
        queryFn: () => getScenesLocal(currentConfig.name),
    })

    const {
        data: ostimActions,
        isLoading: isOstimActionsLoading,
    } = useQuery({
        queryKey: ['actionsLocal'],
        queryFn: () => getOstimActions(),
    })

    const { mutate: matchSlal } = useMatchSlal()

    const scenesArr = Object.entries(scenesFromLocalFiles || {}).map(([name, content]) => {
        const transformedDescription = ostimActions ? transformScene(content, ostimActions) : null

        const scene = scenesFromDb?.find(({ ostim_id }) => ostim_id === name)

        const tableItem: ScenesTableItem = {
            ostim_id: name,
            sexlab_id: 'na',
            content: transformedDescription || JSON.stringify(content),
            json: content,
        }

        if (scene) {
            tableItem.description = scene.description
            tableItem.sexlab_id = scene.sexlab_id
        }

        return tableItem
    }).sort((a, b) => a.ostim_id.localeCompare(b.ostim_id))

    const columns: GridColDef<ScenesTableItem>[] = ([
        { field: 'ostim_id', headerName: 'Ostim Name', width: 250 },
        { field: 'sexlab_id', headerName: 'Sexlab Name', width: 250 },
        {
            field: 'json',
            headerName: 'Scene JSON',
            width: 140,
            renderCell: ({ row }) => {
                return <Button variant="contained" onClick={() => {
                    showContent({content: JSON.stringify(row.json), isJson: true})
                }}>Show JSON</Button>
            }
        },
        {
            field: 'description',
            headerName: 'Generated description',
            width: 300,
            renderCell: ({ row }) => {
                if (row.description) {
                    return <Tooltip title={row.description}><span>{row.description}</span></Tooltip>
                } else {
                    const loadingBtn = loadingMap[row.ostim_id]
                    return (
                        <LoadingButton
                            variant="outlined"
                            loading={loadingBtn}
                            disabled={loadingBtn}
                            onClick={() => {
                                createScene({
                                    ostimId: row.ostim_id,
                                    sceneContent: row.content,
                                    slalPackPath,
                                    authorName
                                })
                                setLoadingMapItem(row.ostim_id, true)
                            }}
                        >
                            Generate
                        </LoadingButton>
                    )
                }
            }
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 700,
            renderCell: ({ row }) => {
                let content: ReactNode = null
                if (row.description) {
                    content = (
                        <Tooltip title="Regenerate scene description.">
                            <IconButton
                                onClick={() => {
                                    createScene({
                                        ostimId: row.ostim_id,
                                        sceneContent: row.content,
                                        slalPackPath,
                                        authorName
                                    })
                                }}
                            >
                                <ReplayIcon />
                            </IconButton>
                        </Tooltip>
                    )
                }

                return (
                    <>
                        {content}
                        <Button
                            disabled={!slalPackPath || !authorName}
                            onClick={() => {
                                if (!slalPackPath || !authorName) {
                                    return
                                }
                                matchSlal({
                                    ostimId: row.ostim_id,
                                    slalPackPath,
                                    authorName
                                })
                                setLoadingMapItem(row.ostim_id, true)
                            }}
                        >
                            Match SLAL
                        </Button>
                        
                    </>
                )
            }
        }
    ]);

    return (
        <>
            {
                (
                    <Paper sx={{ height: "calc(100vh - 370px)", width: '100%', marginTop: 2 }}>
                        <DataGrid<ScenesTableItem>
                            loading={isScenesDBLoading || isScenesLocalLoading || isOstimActionsLoading}
                            rows={scenesArr}
                            columns={columns}
                            getRowId={(row) => row.ostim_id}
                            initialState={{ pagination: { paginationModel: { page: 0, pageSize: 50 } } }}
                            pageSizeOptions={[50, 100, 200, 500]}
                            checkboxSelection
                            sx={{ border: 0 }}
                            autosizeOptions={{
                                columns: ['id', 'json', 'description'],
                                includeOutliers: true,
                                includeHeaders: false,
                            }}
                            disableRowSelectionOnClick
                            onCellDoubleClick={(cell) => {
                                if (cell.field === 'description') {
                                    showContent({ content: cell.row.description, isJson: false })
                                }
                            }}
                        />
                    </Paper >
                )
            }
        </>
    )
}