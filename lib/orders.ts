export type OrderLine = { productId:string; name:string; quantity:number; unitPrice:number; extras:string[] };
export type Order = { id:string; code:string; createdAt:string; updatedAt:string; status:"pending"|"completed"|"cancelled"; name:string; address:string; payment:string; notes:string; type:"Entrega"|"Retirada"; fee:number; lines:OrderLine[]; revision:number };
export type Settings = { products:Record<string,{price:number;available:boolean}>; defaultFee:number };
export type State = { version:number; sequence:number; orders:Order[]; settings:Settings };
export const total = (o:Order) => Math.round((o.lines.reduce((s,l)=>s+l.quantity*l.unitPrice,0)+(o.type==="Entrega"?o.fee:0))*100)/100;
export const dayKey = (date:string) => new Intl.DateTimeFormat("en-CA",{timeZone:"America/Fortaleza",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date(date));

