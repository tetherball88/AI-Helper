import { NextRequest, NextResponse } from "next/server";
import fs from 'fs'
import { ScenesPathsConfig, ScenesPathsConfigItem } from "@/app/_types/ScenesPathsConfig";
import { scenesConfigsFilePath } from "@/app/_utils/scenesConfigsFilePath";


export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const framework = searchParams.get('framework')

    const allConfigs = JSON.parse(fs.readFileSync(scenesConfigsFilePath, 'utf-8')) as ScenesPathsConfig

    if(framework === 'ostim') {
        return allConfigs.configs.filter((item) => item.framework === 'ostim')
    } else if(framework === 'sexlab') {
        return allConfigs.configs.filter((item) => item.framework === 'sexlab')
    }

    return NextResponse.json({ data: allConfigs.configs }, { status: 200 });
}

export async function POST(req: NextRequest) {
    const config = (await req.json()) as ScenesPathsConfigItem

    const allConfigs = JSON.parse(fs.readFileSync(scenesConfigsFilePath, 'utf-8')) as ScenesPathsConfig

    if(allConfigs.configs.find(item => item.name === config.name)) {
        console.error(`Config with name "${config.name}" already exists.`);
        return NextResponse.json({ message: `Config with name "${config.name}" already exists.` }, { status: 500 });
    }

    allConfigs.configs.push(config)

    fs.writeFileSync(scenesConfigsFilePath, JSON.stringify(allConfigs, null, 4))

    return NextResponse.json({ data: config }, { status: 201 });
}

export async function PUT(req: NextRequest) {
    const config = (await req.json()) as ScenesPathsConfigItem
    const allConfigs = JSON.parse(fs.readFileSync(scenesConfigsFilePath, 'utf-8')) as ScenesPathsConfig
    
    allConfigs.configs = allConfigs.configs.map(item => {
        if(item.name === config.name) {
            return config
        }

        return item
    })

    fs.writeFileSync(scenesConfigsFilePath, JSON.stringify(allConfigs, null, 4))

    return NextResponse.json({ data: config }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
    const { name } = (await req.json()) as { name: string }
    const allConfigs = JSON.parse(fs.readFileSync(scenesConfigsFilePath, 'utf-8')) as ScenesPathsConfig
    
    allConfigs.configs = allConfigs.configs.filter(item => item.name !== name)

    fs.writeFileSync(scenesConfigsFilePath, JSON.stringify(allConfigs, null, 4))
    return NextResponse.json({ data: { name } }, { status: 200 });
}