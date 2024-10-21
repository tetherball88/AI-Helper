import { Autocomplete, ButtonGroup, Checkbox, Grow, Paper, Popper, TextField } from "@mui/material"
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { FC, useRef, useState } from "react";
import { getPersonalitiesTable } from "@/app/_logic/getPersonalitiesTable";
import { useQuery } from "@tanstack/react-query";
import { CombinedPersonalityDB } from "@/app/_logic/getPersonalities";
import LoadingButton from '@mui/lab/LoadingButton';

export const ChatCharacterSelectButton: FC<{
    characterIndex: number,
    participantId: string
    active: boolean
    onSelect: (character: CombinedPersonalityDB, index: number) => void
    onAdd: (id: string, index: number) => void
    participant: boolean
    onToggleParticipant: (name: string, checked: boolean) => void
}> = ({ characterIndex, onSelect, participantId, onAdd, active, participant, onToggleParticipant }) => {
    const anchorRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const {
        isLoading: loading,
        data: personalities,
    } = useQuery({
        queryKey: ['personalitiesDB'],
        queryFn: () => getPersonalitiesTable(),
    });

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: Event) => {
        if (
            anchorRef.current &&
            anchorRef.current.contains(event.target as HTMLElement)
        ) {
            return;
        }

        setOpen(false);
    };

    const selectedCharacter = personalities?.data.find(({ npc_name }) => npc_name === participantId)

    return (
        <>
            <ButtonGroup
                variant={active ? "contained" : "outlined"}
                ref={anchorRef}
                aria-label="Button group with a nested menu"
                size="large"
            >
                <Checkbox checked={participant} onChange={(e) => selectedCharacter && onToggleParticipant(selectedCharacter.npc_name, e.target.checked)}  />
                <LoadingButton
                    loading={loading}
                    disabled={loading || !selectedCharacter}
                    onClick={() => selectedCharacter && onSelect(selectedCharacter, characterIndex)}
                >{selectedCharacter?.npc_name || 'Select npc'}</LoadingButton>
                <LoadingButton
                    size="small"
                    aria-controls={open ? 'split-button-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-label="select merge strategy"
                    aria-haspopup="menu"
                    onClick={handleToggle}
                    loading={loading}
                    disabled={loading}
                >
                    <ArrowDropDownIcon />
                </LoadingButton>
            </ButtonGroup>
            <Popper
                sx={{ zIndex: 1 }}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin:
                                placement === 'bottom' ? 'center top' : 'center bottom',
                        }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <Autocomplete
                                    disablePortal
                                    open
                                    options={personalities?.data || []}
                                    getOptionLabel={({ npc_name }) => npc_name}
                                    onChange={(event, newValue) => {
                                        if(newValue)
                                            onAdd(newValue.npc_name, characterIndex);
                                      }}
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField {...params} label="Select npc" />}
                                />
                                {/* <MenuList id="split-button-menu" autoFocusItem>
                                    {personalities?.data.map((option) => (
                                        <MenuItem
                                            key={option.npc_name}
                                            selected={selectedCharacter?.npc_name === option.npc_name}
                                            onClick={() => {
                                                onAdd(option.npc_name, characterIndex);
                                                setOpen(false);
                                            }}
                                        >
                                            {option.npc_name}
                                        </MenuItem>
                                    ))}
                                </MenuList> */}
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </>
    )
}