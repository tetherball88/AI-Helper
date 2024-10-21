import { glob } from "glob";
import { NextRequest, NextResponse } from "next/server";
import fs from 'fs'
import path from "path";
import { connectDb } from "@/app/_logic/connectDb";
import { scenesConfigsFilePath } from "@/app/_utils/scenesConfigsFilePath";
import { ScenesPathsConfig, ScenesPathsConfigItemOstim, ScenesPathsConfigItemSexlab } from "@/app/_types/ScenesPathsConfig";
import { getAllSlalAnims } from "@/app/api/scenes-local/findSlalAnimation";
import { SlalScene } from "@/app/_types/SlalScene";

const pool = connectDb()

async function searchOstimFiles(config: ScenesPathsConfigItemOstim) {
    const folderPath = config.config.ostimPackPath

    const files = await glob(`${folderPath.replaceAll('\\', '/')}/**/OStim/Scenes/**/*.json`);

    if(!files.length) {
        throw new Error(`no ostim scenes were found in this location ${folderPath}`);
    }

    return files;
}

async function searchSexlabFiles(config: ScenesPathsConfigItemSexlab) {
    if(config.config.slalPackPath)
        return (await getAllSlalAnims(config.config.slalPackPath)).animations

    return []
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const scenesConfigName = searchParams.get('scenesConfigName')

    if(!scenesConfigName)
        return NextResponse.json({ message: 'scenesConfigName is required' }, { status: 400 });

    const { configs } = JSON.parse(fs.readFileSync(scenesConfigsFilePath, 'utf-8')) as ScenesPathsConfig
    const currentConfig = configs.find(({name}) => name === scenesConfigName)

    if(!currentConfig) {
        return NextResponse.json({ message: `Couldn't find config with such name ${scenesConfigName}` }, { status: 400 });
    }

    let scenes: {[key: string]: Record<string, unknown>} = {}

    if(currentConfig.framework === 'sexlab') {
        scenes = (await searchSexlabFiles(currentConfig)).reduce<{[key: string]: Record<string, unknown>}>((acc, scene) => {
            acc[scene.id] = scene as any
            return acc;
        }, {})
    } else {
        let files: string[] = []
    
        try {
            files = await searchOstimFiles(currentConfig)
        } catch(e: any) {
            return NextResponse.json({ message: e.message }, { status: 400 })
        }
    
        for(const file of files) {
            const content = JSON.parse(fs.readFileSync(file, 'utf-8'))
            scenes[path.parse(file).name] = content
        }
    }

    return NextResponse.json({
        data: scenes,
    });
}
