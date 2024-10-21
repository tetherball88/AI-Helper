import { getOstimActions } from "@/app/_logic/getOstimActions"
import { getScenesDB } from "@/app/_logic/getScenesDB"
import { getScenesLocal } from "@/app/_logic/getScenesLocal"
import { ScenesPathsConfigItemOstim, ScenesPathsConfigItemSexlab } from "@/app/_types/ScenesPathsConfig"
import { transformScene } from "@/app/scenes-configs/[name]/_components/OstimScenesPage/transformScene"
import { useCreateScene } from "@/app/scenes-configs/[name]/_components/OstimScenesPage/useCreateScene"
import { LoadingButton } from "@mui/lab"
import { Button, IconButton, Paper, Tooltip,  } from "@mui/material"
import { DataGrid, GridColDef, GridRow } from "@mui/x-data-grid"
import { useQuery } from "@tanstack/react-query"
import { FC, ReactNode, useState } from "react"
import ReplayIcon from '@mui/icons-material/Replay';
import { useMatchSlal } from "@/app/scenes-configs/[name]/_components/OstimScenesPage/useMatchSlal"
import { SlalScene } from "@/app/_types/SlalScene"
import { transformSlalScene } from "@/app/scenes-configs/[name]/_components/SlalScenesPage/transformSlalScene"
import { useCreateSlalScene } from "@/app/scenes-configs/[name]/_components/SlalScenesPage/useCreateSlalScene"



interface ScenesTableItem {
    ostim_id: string
    sexlab_id: string
    json: any,
    content: string
    description?: string
}

interface SlalScenesPageProps {
    currentConfig: ScenesPathsConfigItemSexlab
    showContent: (params: {content: string, jsonSchema?: any, isJson: boolean}) => void
}



export const SlalScenesPage: FC<SlalScenesPageProps> = ({ showContent, currentConfig }) => {
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({})
    
    const setLoadingMapItem = (id: string, val: boolean) => {
        setLoadingMap((oldValue) => ({
            ...oldValue,
            [id]: val
        }))
    }

    const { mutate: createScene } = useCreateSlalScene(({ sexlab_id }) => {
        setLoadingMapItem(sexlab_id, true)
    })

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
        queryFn: () => getScenesLocal(currentConfig.name) as any as Promise<Record<string, SlalScene>>,
    })

    const scenesArr = Object.entries(scenesFromLocalFiles || {})?.map(([name, currScene]) => {
        const transformedDescription = transformSlalScene(currScene)

        const scene = scenesFromDb?.find(({ sexlab_id }) => sexlab_id === currScene.id)

        const tableItem: ScenesTableItem = {
            ostim_id: 'na',
            sexlab_id: currScene.id,
            content: transformedDescription || JSON.stringify(currScene),
            json: currScene,
        }

        if (scene) {
            tableItem.description = scene.description
        }

        return tableItem
    }).sort((a, b) => a.ostim_id.localeCompare(b.ostim_id))

    const columns: GridColDef<ScenesTableItem>[] = ([
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
                                    slalId: row.sexlab_id,
                                    sceneContent: row.content,
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
                                        slalId: row.sexlab_id,
                                        sceneContent: row.content,
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
                            loading={isScenesDBLoading || isScenesLocalLoading}
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