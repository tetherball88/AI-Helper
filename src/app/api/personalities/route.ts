import { connectDb } from "@/app/_logic/connectDb";
import { NextRequest, NextResponse } from "next/server";

const pool = connectDb()

const queryHead = `SELECT nt.*, pn.*, xp.x_personality 
FROM npc_templates_custom nt 
LEFT JOIN personalities_new pn ON nt.npc_name = pn.id
LEFT JOIN minai_x_personalities xp ON nt.npc_name = xp.id`


async function getPersonalitiesPaginated(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    try {
        // Get pagination parameters from query string (with defaults)
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        // Calculate offset for pagination
        const offset = (page - 1) * limit;

        // Example SQL query to get data with pagination
        const query = `${queryHead} ORDER BY nt.npc_name LIMIT $1 OFFSET $2`;
        const values = [limit, offset];

        // Execute the query
        const result = await pool.query(query, values);

        // Count the total number of rows (for pagination purposes)
        const totalQuery = 'SELECT COUNT(*) FROM npc_templates_custom';
        const totalResult = await pool.query(totalQuery);
        const totalRows = parseInt(totalResult.rows[0].count);

        // Return the paginated data
        return NextResponse.json({
            data: result.rows.map(row => ({...row, xPersonality: row.x_personality})),
            pagination: {
                currentPage: page,
                perPage: limit,
                totalPages: Math.ceil(totalRows / limit),
                totalRecords: totalRows,
            },
        });
    } catch (error) {
        console.error('Error fetching data', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

async function getPersonalitiesByNames(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    try {
        const characters = searchParams.get('characters')?.split(',')

        const query = `${queryHead} WHERE npc_name = ANY($1::text[])`
        const values = [characters];

        // Execute the query
        const result = await pool.query(query, values);

        // Return the paginated data
        return NextResponse.json({
            data: result.rows.map(row => ({...row, xPersonality: row.x_personality})),
        });
    } catch (error) {
        console.error('Error fetching data', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
 
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    if(searchParams.get('type') === 'byNames') {
        return getPersonalitiesByNames(req)
    }

    return getPersonalitiesPaginated(req);
}
