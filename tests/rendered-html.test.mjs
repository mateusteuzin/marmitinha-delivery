import test from "node:test";
import assert from "node:assert/strict";
import {total,dayKey} from "../lib/orders.ts";
const order={type:"Entrega",fee:5,lines:[{quantity:2,unitPrice:15}]};
test("entrega inclui frete uma única vez",()=>assert.equal(total(order),35));
test("retirada nunca cobra frete",()=>assert.equal(total({...order,type:"Retirada",fee:100}),30));
test("arredonda centavos ao calcular o pedido",()=>assert.equal(total({type:"Entrega",fee:.2,lines:[{quantity:3,unitPrice:.1}]}),.5));
test("data de vendas segue o fuso de Fortaleza",()=>{assert.equal(dayKey("2026-11-11T02:59:00Z"),"2026-11-10");assert.equal(dayKey("2026-11-11T03:00:00Z"),"2026-11-11");});

