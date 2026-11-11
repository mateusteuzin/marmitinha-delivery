import { NextRequest,NextResponse } from "next/server";
import { mutate } from "../../../lib/store";
import { products,extras,money } from "../../../lib/catalog";
import { total,type Order } from "../../../lib/orders";
import { sameOrigin } from "../../../lib/auth";
export const runtime="nodejs";
export async function POST(r:NextRequest){try{
 if(!sameOrigin(r))return new Response(null,{status:403});
 const b=await r.json();if(!Array.isArray(b.items)||!b.items.length||b.items.length>50||typeof b.name!=="string"||!b.name.trim()||b.name.length>100||!["Entrega","Retirada"].includes(b.type)||typeof b.address!=="string"||b.address.length>500||(b.type==="Entrega"&&!b.address.trim())||typeof b.requestId!=="string"||!/^[-a-zA-Z0-9]{20,80}$/.test(b.requestId))throw new Error("Confira seu nome, endereço e itens do pedido.");
 const order=await mutate(s=>{
  const existing=s.orders.find(o=>o.id===b.requestId);if(existing)return existing;
  if(s.orders.filter(o=>Date.now()-Date.parse(o.createdAt)<60000).length>=100)throw new Error("Muitos pedidos. Tente novamente em instantes.");
  const lines=b.items.map((i:{productId:string;quantity:number;extras:string[]})=>{const p=products.find(p=>p.id===i.productId);if(!p||!Number.isInteger(i.quantity)||i.quantity<1||i.quantity>99||!Array.isArray(i.extras)||new Set(i.extras).size!==i.extras.length||i.extras.some(id=>!extras.some(e=>e.id===id))||(!p.customizable&&i.extras.length))throw new Error("Item inválido.");const cfg=s.settings.products[p.id];if(cfg?.available===false)throw new Error(`${p.name} está indisponível.`);const chosen=extras.filter(e=>i.extras.includes(e.id));return {productId:p.id,name:p.name,quantity:i.quantity,unitPrice:Math.round(((cfg?.price??p.price)+chosen.reduce((v,e)=>v+e.price,0))*100)/100,extras:chosen.map(e=>e.name)};});
  const now=new Date().toISOString();const o:Order={id:b.requestId,code:String(++s.sequence),createdAt:now,updatedAt:now,status:"pending",name:b.name.trim(),address:b.address.trim(),payment:["Pix","Dinheiro","Cartão"].includes(b.payment)?b.payment:"A informar",notes:String(b.notes||"").slice(0,1000),type:b.type,fee:b.type==="Entrega"?s.settings.defaultFee:0,lines,revision:1};s.orders.push(o);return o;
 });
 const text=[`Olá! Pedido #${order.code}`,`Nome: ${order.name}`,"",...order.lines.map(l=>`${l.quantity}x ${l.name}${l.extras.length?" ("+l.extras.join(", ")+")":""} — ${money(l.quantity*l.unitPrice)}`),"",`Tipo: ${order.type}`,order.type==="Entrega"?`Endereço: ${order.address}`:"Retirada: Rua Senador Virgílio Távora, 1000, Itarema - CE",`Frete: ${money(order.fee)}${order.type==="Entrega"?" (a confirmar)":""}`,`Total: ${money(total(order))}`,`Pagamento: ${order.payment}`,order.notes?`Observações: ${order.notes}`:"","Aguardando confirmação da Marmitinha."].filter(Boolean).join("\n");
 return NextResponse.json({code:order.code,whatsappUrl:`https://wa.me/558897309179?text=${encodeURIComponent(text)}`});
 }catch(e){return NextResponse.json({error:(e as Error).message},{status:400});}}

