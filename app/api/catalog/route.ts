import { NextResponse } from "next/server";
import { readState } from "../../../lib/store";
export const runtime="nodejs";
export async function GET(){try{return NextResponse.json((await readState()).settings,{headers:{"Cache-Control":"no-store"}});}catch{return NextResponse.json({error:"Cardápio temporariamente indisponível"},{status:503});}}

