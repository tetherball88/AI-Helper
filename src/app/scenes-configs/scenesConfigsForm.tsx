import { ScenesPathsConfigItem, ScenesPathsConfigItemOstim } from "@/app/_types/ScenesPathsConfig"
import { useCreateScenesConfig } from "@/app/scenes-configs/useCreateScenesConfig"
import { useUpdateScenesConfig } from "@/app/scenes-configs/useUpdateScenesConfig"
import { Box, Button, TextField, ToggleButton, ToggleButtonGroup } from "@mui/material"
import { FC, useState } from "react"

interface ScenesConfigsFormProps {
    currentConfig?: ScenesPathsConfigItem | null
    onSuccess: () => void
}

export const ScenesConfigsForm: FC<ScenesConfigsFormProps> = ({currentConfig, onSuccess}) => {
    const {mutate: createScenesConfig} = useCreateScenesConfig()
    const {mutate: updateScenesConfig} = useUpdateScenesConfig()
    const [framework, setFramework] = useState(currentConfig?.framework || 'ostim')
    const [name, setName] = useState(currentConfig?.name || '')
    const [ostimPath, setOstimPath] = useState((currentConfig as ScenesPathsConfigItemOstim)?.config.ostimPackPath || '')
    const [sexlabPath, setSexlabPath] = useState(currentConfig?.config.slalPackPath || '')
    const [authorName, setAuthorName] = useState((currentConfig as ScenesPathsConfigItemOstim)?.config.authorName || '')

    // const [customPrefixes, setCustomPrefixes] = useState('')
    const [errors, setErrors] = useState<Record<string, string>>({})

    const validate = () => {
        const possibleErrors: Record<string, string> = {}

        if(!name) {
            possibleErrors['name'] = 'Name is required!'
        }

        if(framework === 'ostim') {
            if(!ostimPath) {
                possibleErrors['ostimPath'] = 'Ostim pack folder path is required!'
            }

            if(sexlabPath && !authorName) {
                possibleErrors['authorName'] = 'Author name is required when sexlab path provided!'
            }
        } else {
            if(!sexlabPath) {
                possibleErrors['sexlabPath'] = 'Sexlab pack folder path is required!'
            }
        }
        setErrors(possibleErrors);

        if(Object.keys(possibleErrors).length === 0) {
            return true
        }

        return false
    }

    const onSubmit = () => {
        if(validate()) {
            if(currentConfig) {
                updateScenesConfig(framework === "ostim" ? {
                    name,
                    framework,
                    config: {
                        ostimPackPath: ostimPath,
                        slalPackPath: sexlabPath,
                        authorName,
                        customPrefixes: []
                    }
                } : {
                    name,
                    framework,
                    config: {
                        slalPackPath: sexlabPath,
                    }
                })
            } else {
                createScenesConfig(framework === "ostim" ? {
                    name,
                    framework,
                    config: {
                        ostimPackPath: ostimPath,
                        slalPackPath: sexlabPath,
                        authorName,
                        customPrefixes: []
                    }
                } : {
                    name,
                    framework,
                    config: {
                        slalPackPath: sexlabPath,
                    }
                })
            }
            onSuccess()
        }
    }

    return (
        <Box sx={{
            width: "500px",
            display: 'flex',
            flexDirection: 'column',
            gap: "20px",
        }}>
            <TextField id="name" label="Name" variant="outlined" value={name} onChange={(e) => setName(e.target.value)} error={!!errors['name']} helperText={errors['name']} disabled={!!currentConfig}/>
            <ToggleButtonGroup
                value={framework}
                exclusive
                onChange={(e, value) => setFramework(value)}
            >
                <ToggleButton value="ostim">
                    ostim
                </ToggleButton>
                <ToggleButton value="sexlab">
                    sexlab
                </ToggleButton>
            </ToggleButtonGroup>
            {framework === 'ostim' && <TextField id="ostimPath" label="Ostim pack folder path" variant="outlined" value={ostimPath} onChange={(e) => setOstimPath(e.target.value)} error={!!errors['ostimPath']} helperText={errors['ostimPath']}/>}
            <TextField id="sexlabPath" label="Sexlab pack folder path" variant="outlined" value={sexlabPath} onChange={(e) => setSexlabPath(e.target.value)} error={!!errors['sexlabPath']} helperText={errors['sexlabPath']}/>
            {framework === 'ostim' && <TextField id="authorName" label="Author name" variant="outlined" value={authorName} onChange={(e) => setAuthorName(e.target.value)} error={!!errors['authorName']} helperText={errors['authorName']}/>}
            {/* <TextField id="authorName" label="Author name" variant="outlined" value={authorName} onChange={(e) => setAuthorName(e.target.value)} /> */}
            <Button variant="contained" onClick={() => onSubmit()}>Save</Button>
        </Box>
    )
}