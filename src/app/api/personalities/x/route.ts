import { connectDb } from '@/app/_logic/connectDb';
import { NextRequest, NextResponse } from 'next/server';

const pool = connectDb()

export async function POST(req: NextRequest) {
    try {
        // Parse the request body
        const { id, xPersonality } = await req.json();

        // Validate that both id and personality are provided
        if (!id || !xPersonality) {
            return NextResponse.json({ message: 'Both id and x_personality are required' }, { status: 400 });
        }

        // Insert the new row into the personalities_new table
        const result = await pool.query(
            `INSERT INTO minai_x_personalities (id, x_personality) VALUES ($1, $2) RETURNING *`,
            [id, xPersonality]
        );

        // Check if the row was inserted successfully
        const newRow = result.rows[0];

        // Return a success response
        return NextResponse.json({ data: {...newRow, xPersonality: newRow.x_personality} }, { status: 201 });
    } catch (error) {
        console.error('Error creating x personality:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        // Parse the request body
        const { id, xPersonality } = await req.json();

        // Validate that both id and personality are provided
        if (!id || !xPersonality) {
            return NextResponse.json({ message: 'Both id and personality are required' }, { status: 400 });
        }

        // Insert the new row into the personalities_new table
        const result = await pool.query(
            'UPDATE minai_x_personalities SET x_personality = $1 WHERE id = $2 RETURNING *',
            [xPersonality, id]
        );

        // Check if the row was inserted successfully
        const newRow = result.rows[0];

        // Return a success response
        return NextResponse.json({...newRow, xPersonality: newRow.x_personality}, { status: 201 });
    } catch (error) {
        console.error('Error creating x personality:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
