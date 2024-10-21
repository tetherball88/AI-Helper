import { glob } from "glob";
import { NextResponse } from "next/server";
import fs from 'fs'
import path from "path";
import { OstimAction } from "@/app/_types/OstimAction";

const folderPath = 'E:/Skyrim/mods/MO2 Development/mods/OStim Standalone - Advanced Adult Animation Framework/SKSE/Plugins'

export async function GET() {
    // const { searchParams } = new URL(req.url);
    // const folderPath = searchParams.get('path')

    if(!folderPath)
        return NextResponse.json({ message: 'path is required' }, { status: 400 });

    const files = await glob(`${folderPath.replaceAll('\\', '/')}/**/OStim/actions/**/*.json`);

    if(!files.length) {
        return NextResponse.json({ message: `no ostim actions were found in this location ${folderPath}` }, { status: 400 });
    }

    const scenes: {[key: string]: OstimAction} = {}

    for(const file of files) {
        const content = JSON.parse(fs.readFileSync(file, 'utf-8')) as OstimAction
        scenes[path.parse(file).name] = content
        if(content.aliases?.length) {
            content.aliases.forEach(alias => {
                scenes[alias] = content
            })
        }
    }

    return NextResponse.json({
        data: scenes,
    });
}