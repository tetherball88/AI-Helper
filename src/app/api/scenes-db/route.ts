import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/app/_logic/connectDb";
import { GenerateSceneRequestParams } from "@/app/_types/Scene";
import { findSlalAnimation } from "@/app/api/scenes-db/findSlalAnimation";

const pool = connectDb()

export async function GET(req: NextRequest) {
    try {
        const query = 'SELECT * FROM minai_scenes_descriptions';

        // Execute the query
        const result = await pool.query(query);

        // Return the paginated data
        return NextResponse.json({
            data: result.rows,
        });
    } catch (error) {
        console.error('Error fetching data', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        // Parse the request body
        const { ostimId, description, slalPackPath, authorName, slalId: slalIdFromRoute, type } = await req.json() as GenerateSceneRequestParams;

        let newRow: any

        if (type === "sexlab") {
            if (!slalIdFromRoute) {
                return NextResponse.json({ message: 'slalId is required' }, { status: 400 });
            }

            const result = await pool.query(
                'INSERT INTO minai_scenes_descriptions (ostim_id, sexlab_id, description) VALUES ($1, $2, $3) RETURNING *',
                [null, slalIdFromRoute, description]
            );
            // Check if the row was inserted successfully
            newRow = result.rows[0];
        } else {
            // Validate that both id and personality are provided
            if (!ostimId || !description || !slalPackPath) {
                return NextResponse.json({ message: 'ostimId, slalJsonFile and description are required' }, { status: 400 });
            }

            const slalId = await findSlalAnimation(ostimId, authorName || '', slalPackPath)

            const result = await pool.query(
                'INSERT INTO minai_scenes_descriptions (ostim_id, sexlab_id, description) VALUES ($1, $2, $3) RETURNING *',
                [ostimId, slalId, description]
            );
            // Check if the row was inserted successfully
            newRow = result.rows[0];
        }


        

        // Return a success response
        return NextResponse.json({ data: newRow }, { status: 201 });
    } catch (error) {
        console.error('Error creating personality:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}