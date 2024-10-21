'use client'

import { ThemeProvider, createTheme } from "@mui/material";
import { FC, useCallback, useEffect, useRef } from "react";
import { Editor, useMonaco, OnMount, BeforeMount } from '@monaco-editor/react';
import { editor } from 'monaco-editor'
import * as monaco from 'monaco-editor';
import { loader } from '@monaco-editor/react';
import { Personality } from "@/app/_types/Personality";

loader.config({ monaco });

export const prettifyJsonString = (personality: Personality | null): string => {
    try {
        return JSON.stringify(personality, null, "\t");
    } catch (err) {
        console.error(err)
        return JSON.stringify(personality);
    }
};

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

interface JsonEditorProps {
    json: Personality,
    onSave?: () => Promise<void>
    onChange?: (value?: string) => void
    selectedSchema?: Record<string, unknown>
}

export const JsonEditor: FC<JsonEditorProps> = ({ json, onSave, onChange, selectedSchema }) => {
    const monaco = useMonaco();
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

    const handleEditorUpdateValue = useCallback((value: Personality | null) => {
        const editor = editorRef.current;
        if (!editor) return;

        editor.setValue(value ? prettifyJsonString(value) : '{}')

        if(value) {
            editor.getAction("editor.action.formatDocument")?.run();
        }
    }, []);

    useEffect(() => {
        handleEditorUpdateValue(json);
    }, [json, handleEditorUpdateValue])

    const saveScene = () => {
        if (editorRef.current) {
            onSave?.()
        }
    }

    const handleEditorDidMount: OnMount = (editor) => {
        editorRef.current = editor;

        editor.getModel()?.updateOptions({ tabSize: 4, insertSpaces: false });

        if (monaco) {
            editor.addAction({
                id: 'file-save',
                label: 'Save',
                keybindings: [
                    monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
                ],
                run: saveScene,
                contextMenuGroupId: '1_modification'
            })
        }

        handleEditorUpdateValue(json)
    }

    const handleEditorWillMount: BeforeMount = () => {
        if(!selectedSchema) {
            return
        }
        monaco?.languages.json.jsonDefaults.setDiagnosticsOptions({
            validate: true,
            schemas: [
                {
                    uri: window.location.href, // id of the first schema
                    fileMatch: ["*"], // associate with our model
                    schema: selectedSchema,
                },
            ],
            schemaValidation: 'error',
        });
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <Editor
                language="json"
                options={{
                    automaticLayout: true,
                    autoClosingBrackets: "always",
                    autoClosingQuotes: "always",
                    formatOnPaste: true,
                    formatOnType: true,
                    scrollBeyondLastLine: false,
                }}
                onMount={handleEditorDidMount}
                beforeMount={handleEditorWillMount}
                onChange={onChange}
                theme="vs-dark"
            />
        </ThemeProvider>

    )
}