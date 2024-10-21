'use client'

import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Button, Dialog, DialogContent, DialogTitle, Link as MuiLink } from '@mui/material';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getScenesConfigs } from '@/app/_logic/getScenesConfigs';
import { ScenesPathsConfigItem } from '@/app/_types/ScenesPathsConfig';
import { ScenesConfigsForm } from '@/app/scenes-configs/scenesConfigsForm';
import Link from 'next/link';
import { useDeleteScenesConfig } from '@/app/scenes-configs/useDeleteScenesConfig';

export default function ScenesConfigsPage() {
    const {
        isLoading,
        data: configs,
    } = useQuery({
        queryKey: ['scenesConfigs'],
        queryFn: () => getScenesConfigs(),
    })

    const {mutate: deleteConfig} = useDeleteScenesConfig()

    const [openedModal, setOpenedModal] = useState(false)
    const [scenesConfigToEdit, setScenesConfigToEdit] = useState<ScenesPathsConfigItem | null>(null)

    const columns: GridColDef<ScenesPathsConfigItem>[] = [
        { field: 'name', headerName: 'Name' },
        {
            field: 'framework',
            headerName: 'Framework',
            editable: true,
        },
        {
            field: 'config',
            headerName: 'Config',
            width: 450,
            editable: true,
            renderCell: ({row}) => {
                return row.framework === "ostim" ? row.config.ostimPackPath : row.config.slalPackPath
            }
        },
        {
            field: 'view', headerName: 'View details', width: 160, renderCell: ({ row }) => {
                return <Link href={"/scenes-configs/"+row.name}><MuiLink component="span">Generate Scenes</MuiLink></Link>
            }
        },
        {
            field: 'edit', headerName: 'Edit config', renderCell: ({ row }) => {
                return <Button variant="contained" onClick={() => {
                    setScenesConfigToEdit(row)
                    setOpenedModal(true)
                }}>Edit</Button>
            }
        },
        {
            field: 'delete', headerName: 'Edit config', renderCell: ({ row }) => {
                return <Button variant="contained" onClick={() => deleteConfig(row.name)}>Delete</Button>
            }
        },
    ];
    

    return (
        <>
        
            <Dialog
                open={openedModal}
                onClose={() => setOpenedModal(false)}
            >
                <DialogTitle>{!scenesConfigToEdit ? "Create scenes config" : "Update scenes config: " + scenesConfigToEdit.name}</DialogTitle>
                <DialogContent>
                    <ScenesConfigsForm currentConfig={scenesConfigToEdit} onSuccess={() => setOpenedModal(false)} />
                </DialogContent>
                
            </Dialog>
            <Button variant="contained" onClick={() => {
                setScenesConfigToEdit(null)
                setOpenedModal(true)
            }}>Create scenes config</Button>
            <DataGrid
                getRowId={row => row.name}
                loading={isLoading}
                rows={configs}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 15,
                        },
                    },
                }}
                pageSizeOptions={[15]}
                checkboxSelection
                disableRowSelectionOnClick
            />
        </>
    )
}