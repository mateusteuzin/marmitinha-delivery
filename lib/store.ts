import { promises as fs } from "node:fs";
import path from "node:path";
import { get,head,put,BlobPreconditionFailedError } from "@vercel/blob";
import { products } from "./catalog";
import type { State } from "./orders";
const initial = ():State => ({version:0,sequence:1000,orders:[],settings:{defaultFee:0,products:Object.fromEntries(products.map(p=>[p.id,{price:p.price,available:true}]))}});
const file=path.join(process.cwd(),".local-data","store.json");
const pathname="admin/state-v1.json";
function online(){if(process.env.BLOB_READ_WRITE_TOKEN||process.env.BLOB_STORE_ID)return true;if(process.env.VERCEL)throw new Error("Armazenamento privado ainda não conectado.");return false;}
async function snapshot():Promise<{state:State;etag?:string}>{
 if(online()){
  const abortSignal=AbortSignal.timeout(10000);
  const token=process.env.BLOB_READ_WRITE_TOKEN;
  for(let attempt=0;attempt<3;attempt++){
   const r=await get(pathname,{access:"private",useCache:false,token,abortSignal,headers:{"Accept-Encoding":"identity"}});
   if(!r)return {state:initial()};
   if(r.statusCode!==200||!r.stream)throw new Error("Não foi possível ler os pedidos.");
   const state:State=JSON.parse(await new Response(r.stream).text());
   const metadata=await head(pathname,{token,abortSignal});
   const verify=await get(pathname,{access:"private",useCache:false,token,abortSignal,headers:{"Accept-Encoding":"identity"}});
   if(!verify||!verify.stream)continue;
   const latest:State=JSON.parse(await new Response(verify.stream).text());
   const after=await head(pathname,{token,abortSignal});
   if(metadata.etag===after.etag&&state.version===latest.version)return {state:latest,etag:after.etag};
  }
  throw new Error("Os pedidos estão sendo atualizados. Tente novamente em instantes.");
 }
 try{return {state:JSON.parse(await fs.readFile(file,"utf8"))};}catch(e){if((e as NodeJS.ErrnoException).code!=="ENOENT")throw e;return {state:initial()};}
}
export async function readState(){return (await snapshot()).state;}
let queue:Promise<unknown>=Promise.resolve();
export async function mutate<T>(change:(s:State)=>T):Promise<T>{
 const run=async()=>{for(let attempt=0;attempt<8;attempt++){
  const {state:s,etag}=await snapshot();const result=change(s);s.version++;
  if(online()){
   try{await put(pathname,JSON.stringify(s),{access:"private",addRandomSuffix:false,allowOverwrite:!!etag,ifMatch:etag,contentType:"application/json",cacheControlMaxAge:60,token:process.env.BLOB_READ_WRITE_TOKEN,abortSignal:AbortSignal.timeout(8000)});return result;}
   catch(e){if(e instanceof BlobPreconditionFailedError||(e instanceof Error&&/already exists/i.test(e.message)))continue;throw e;}
  }else{await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file+".tmp",JSON.stringify(s));await fs.rename(file+".tmp",file);return result;}
 }throw new Error("Outro pedido foi atualizado. Tente novamente.");};
 if(online())return run();
 const next=queue.then(run,run);queue=next.catch(()=>{});return next;
}

