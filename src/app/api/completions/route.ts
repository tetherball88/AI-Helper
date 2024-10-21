import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const query = request.query
    const apiKey = process.env['NEXT_PUBLIC_OPENROUTER_API_KEY']
    // const aiResponse= await fetch("https://openrouter.ai/api/v1/chat/completions", {
    //     method: "POST",
    //     headers: {
    //       "Authorization": `Bearer ${apiKey}`,
    //       "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify({
    //       "model": "meta-llama/llama-3.1-70b-instruct",
    //       messages,
    //       ...(isJson ? { response_format: { type: 'json_object' } } : {}),
    //       stream: false,
    //     }),
    //   });
    console.log(request)
    return NextResponse.json({})
}
