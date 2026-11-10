import { createHmac, timingSafeEqual, scryptSync } from "node:crypto";
import type { NextRequest } from "next/server";
const secret=()=>process.env.ADMIN_SESSION_SECRET || "";
export function passwordMatches(value:string){const expected=process.env.ADMIN_PASSWORD;if(!expected||!secret())return false;return timingSafeEqual(scryptSync(value,"marmitinha-admin",32),scryptSync(expected,"marmitinha-admin",32));}
export function session(){const payload=String(Date.now()+12*60*60*1000);return payload+"."+createHmac("sha256",secret()).update(payload).digest("hex");}
export function authorized(r:NextRequest){if(!secret())return false;const token=r.cookies.get("marmitinha_admin")?.value||"";const [payload,sig]=token.split(".");if(!payload||!sig||Number(payload)<Date.now())return false;const expected=createHmac("sha256",secret()).update(payload).digest("hex");return sig.length===expected.length&&timingSafeEqual(Buffer.from(sig),Buffer.from(expected));}
export function sameOrigin(r:NextRequest){const origin=r.headers.get("origin");return !!origin&&origin===(process.env.APP_ORIGIN||r.nextUrl.origin);}

