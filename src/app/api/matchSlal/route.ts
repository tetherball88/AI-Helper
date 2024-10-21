import { connectDb } from "@/app/_logic/connectDb";
import { GenerateSceneRequestParams } from "@/app/_types/Scene";
import { findSlalAnimation } from "@/app/api/scenes-db/findSlalAnimation";
import { NextRequest, NextResponse } from "next/server";

const pool = connectDb()

export async function POST(req: NextRequest) {
    try {
        // Parse the request body
        const { ostimId, slalPackPath, authorName } = await req.json() as Pick<GenerateSceneRequestParams, 'ostimId' | 'slalPackPath' | 'authorName'>;

        // Validate that both id and personality are provided
        if (!ostimId || !slalPackPath) {
            return NextResponse.json({ message: 'Both ostimId and slalJsonFile are required' }, { status: 400 });
        }

        const slalId = await findSlalAnimation(ostimId, authorName || '', slalPackPath)

        if(!slalId || slalId == 'na') {
            return NextResponse.json({ message: 'Couldn\'t find slal animation' }, { status: 400 });
        }

        // Insert the new row into the personalities_new table
        await pool.query(
            'UPDATE minai_scenes_descriptions SET sexlab_id = $1 WHERE ostim_id = $2',
            [slalId, ostimId]
        );

        // Return a success response
        return NextResponse.json({ ostim_id: ostimId, sexlab_id: slalId}, { status: 201 });
    } catch (error) {
        console.error('Error matching slal id:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}