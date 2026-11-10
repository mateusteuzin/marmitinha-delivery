import { NextRequest,NextResponse } from "next/server";
import { authorized,sameOrigin } from "../../../../lib/auth";
import { readState,mutate } from "../../../../lib/store";
import { products } from "../../../../lib/catalog";
export const runtime="nodejs";
export async function GET(r:NextRequest){if(!authorized(r))return new Response(null,{status:401});try{return NextResponse.json(await readState(),{headers:{"Cache-Control":"no-store"}});}catch(e){return NextResponse.json({error:(e as Error).message},{status:503});}}
const price=(v:unknown)=>typeof v==="number"&&Number.isFinite(v)&&v>=0&&v<=10000&&Math.abs(v*100-Math.round(v*100))<.00001;
export async function PATCH(r:NextRequest){if(!authorized(r))return new Response(null,{status:401});if(!sameOrigin(r))return new Response(null,{status:403});try{
 const b=await r.json();await mutate(s=>{
 if(b.action==="settings"){
  if(b.version!==s.version)throw new Error("Os dados mudaram. Atualize antes de salvar.");
  if(!price(b.settings?.defaultFee))throw new Error("Frete inválido.");
  for(const p of products){const v=b.settings.products?.[p.id];if(!v||!price(v.price)||typeof v.available!=="boolean")throw new Error("Confira os preços.");}
  s.settings={defaultFee:b.settings.defaultFee,products:Object.fromEntries(products.map(p=>[p.id,{price:b.settings.products[p.id].price,available:b.settings.products[p.id].available}]))};
 }else if(b.action==="complete"){
  if(!Array.isArray(b.orders)||!b.orders.length)throw new Error("Selecione um pedido.");
  for(const item of b.orders){const o=s.orders.find(o=>o.id===item.id);if(!o||o.status!=="pending"||o.revision!==item.revision)throw new Error("Um pedido mudou. Atualize a lista.");o.status="completed";o.updatedAt=new Date().toISOString();o.revision++;}
 }else if(b.action==="order"){
  const o=s.orders.find(o=>o.id===b.order?.id);if(!o||o.revision!==b.order.revision)throw new Error("Este pedido mudou. Atualize a lista.");
  const v=b.order;if(!["pending","completed","cancelled"].includes(v.status)||!["Entrega","Retirada"].includes(v.type)||!price(v.fee)||!["Pix","Dinheiro","Cartão","A informar"].includes(v.payment)||!Array.isArray(v.lines)||v.lines.length!==o.lines.length)throw new Error("Confira os dados do pedido.");
  for(const l of v.lines)if(!Number.isInteger(l.quantity)||l.quantity<1||l.quantity>99||!price(l.unitPrice))throw new Error("Quantidade ou preço inválido.");
  o.lines=o.lines.map((l,i)=>({...l,quantity:v.lines[i].quantity,unitPrice:v.lines[i].unitPrice}));o.fee=v.type==="Entrega"?v.fee:0;o.type=v.type;o.payment=v.payment;o.status=v.status;o.updatedAt=new Date().toISOString();o.revision++;
 }else throw new Error("Ação inválida.");
 });return NextResponse.json({ok:true});
 }catch(e){return NextResponse.json({error:(e as Error).message},{status:409});}}

