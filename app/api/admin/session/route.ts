import { NextRequest, NextResponse } from "next/server";
import { passwordMatches,session,sameOrigin,authorized } from "../../../../lib/auth";
export const runtime="nodejs";
const attempts=new Map<string,{count:number;expires:number}>();
export async function GET(r:NextRequest){return NextResponse.json({authenticated:authorized(r)},{headers:{"Cache-Control":"no-store"}});}
export async function POST(r:NextRequest){
 if(!sameOrigin(r))return NextResponse.json({error:"Origem inválida"},{status:403});
 if(!process.env.ADMIN_PASSWORD||!process.env.ADMIN_SESSION_SECRET)return NextResponse.json({error:"Configure a senha de administração no servidor."},{status:503});
 const ip=r.headers.get("x-forwarded-for")||"local";const now=Date.now();let a=attempts.get(ip);if(!a||a.expires<now){a={count:0,expires:now+900000};attempts.set(ip,a);}if(a.count>=8)return NextResponse.json({error:"Muitas tentativas. Aguarde 15 minutos."},{status:429});a.count++;
 const b=await r.json().catch(()=>({}));if(typeof b.password!=="string"||b.password.length>200||!passwordMatches(b.password))return NextResponse.json({error:"Senha incorreta"},{status:401});
 attempts.delete(ip);const res=NextResponse.json({ok:true});res.cookies.set("marmitinha_admin",session(),{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"strict",path:"/",maxAge:43200});return res;
}
export async function DELETE(r:NextRequest){if(!sameOrigin(r))return new Response(null,{status:403});const res=NextResponse.json({ok:true});res.cookies.set("marmitinha_admin","",{httpOnly:true,path:"/",maxAge:0});return res;}

