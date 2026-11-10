export type Category = "Cuscuz" | "Tapioca" | "Bebidas";
export type Product = {
  id: string; name: string; category: Category; price: number; description: string;
  image: string; customizable?: boolean; badge?: string; focus?: string; fit?: "cover" | "contain";
};
export type Extra = { id: string; name: string; price: number };
export type CartItem = { key: string; product: Product; extras: Extra[]; quantity: number };

export const products: Product[] = [
  { id:"amostrado", name:"Cuscuz Amostrado", category:"Cuscuz", price:15, description:"Carne de sol, carne moída, calabresa, bacon e ovo.", image:"/cuscuz-amostrado.jpg", customizable:true, badge:"Mais pedido", focus:"center 72%" },
  { id:"nordestino", name:"Nordestino Cremoso", category:"Cuscuz", price:15, description:"Cuscuz macio, carne de sol e uma camada bem cremosa.", image:"/nordestino-cremoso-2-limpo.png", customizable:true, badge:"Bem cremoso", focus:"center 57%" },
  { id:"carne-sol", name:"Carne de Sol", category:"Cuscuz", price:13, description:"Cuscuz quentinho com carne de sol desfiada e temperada.", image:"/cuscuz-carne-sol.jpg", customizable:true, badge:"Clássico da casa", focus:"center 48%" },
  { id:"carne-moida-ovo", name:"Carne Moída com Ovo", category:"Cuscuz", price:12, description:"Carne moída bem temperada, ovo e cuscuz feito na hora.", image:"/cuscuz-carne-moida-ovo.jpg", customizable:true, focus:"center 60%" },
  { id:"calabresa", name:"Calabresa", category:"Cuscuz", price:10, description:"Calabresa dourada servida com cuscuz bem quentinho.", image:"/cuscuz-calabresa-limpo.png", customizable:true, focus:"center 63%" },
  { id:"frango", name:"Frango com Catupiry", category:"Cuscuz", price:10, description:"Frango temperado com recheio cremoso e cuscuz macio.", image:"/cuscuz-frango-limpo.png", customizable:true, focus:"center 62%" },
  { id:"queijo", name:"Queijo Coalho", category:"Cuscuz", price:9, description:"Cuscuz macio com queijo coalho derretido no recheio e douradinho por cima.", image:"/cuscuz-queijo-coalho-recheio-cobertura.jpg", customizable:true, badge:"Imagem ilustrativa", focus:"center" },
  { id:"tap-carne-sol", name:"Carne de Sol, Requeijão e Queijo Coalho", category:"Tapioca", price:13, description:"Tapioca recheada com carne de sol, requeijão e queijo coalho.", image:"/tapioca-carne-sol-requeijao-queijo-coalho-limpo.png", customizable:true, badge:"Bem recheada", focus:"center 60%" },
  { id:"tap-frango", name:"Frango com Catupiry", category:"Tapioca", price:10, description:"Frango temperado e recheio cremoso na tapioca.", image:"/tapioca-frango-limpo.png", customizable:true, focus:"center 62%" },
  { id:"tap-queijo", name:"Queijo", category:"Tapioca", price:9, description:"Queijo derretido em uma tapioca leve e fresquinha.", image:"/tapioca.jpg", customizable:true, focus:"center 64%" },
  { id:"tap-carne-moida", name:"Carne Moída", category:"Tapioca", price:10, description:"Carne moída bem temperada e recheio caprichado.", image:"/tapioca.jpg", customizable:true, focus:"center 64%" },
  { id:"tap-calabresa", name:"Calabresa com Queijo", category:"Tapioca", price:10, description:"Calabresa dourada com queijo derretido.", image:"/tapioca.jpg", customizable:true, focus:"center 64%" },
  { id:"tap-nutella", name:"Nutella com Morango", category:"Tapioca", price:12, description:"Creme de avelã e morango em uma tapioca docinha.", image:"/tapioca.jpg", badge:"Doce", focus:"center 64%" },
  { id:"coca-250", name:"Coca-Cola Zero 250 ml", category:"Bebidas", price:3, description:"Garrafinha gelada, sem açúcar.", image:"/coca-zero-250.png", fit:"contain", badge:"Gelada" },
  { id:"guarana-250", name:"Guaraná 250 ml", category:"Bebidas", price:3, description:"Guaraná gelado para acompanhar seu pedido.", image:"/guarana-250.png", fit:"contain", badge:"Gelado" },
  { id:"coca-lata", name:"Coca-Cola Zero lata", category:"Bebidas", price:5, description:"Lata gelada, sem açúcar.", image:"/coca-zero-lata.png", fit:"contain", badge:"Gelada" },
  { id:"sucos", name:"Sucos", category:"Bebidas", price:6, description:"Consulte os sabores disponíveis no WhatsApp.", image:"/suco.png", fit:"contain", badge:"Sabores do dia" },
];

export const extras: Extra[] = [
  { id:"queijo-extra", name:"Queijo", price:3 },
  { id:"ovo-extra", name:"Ovo", price:2 },
  { id:"manteiga-extra", name:"Manteiga extra", price:1.5 },
];
export const categories: Category[] = ["Cuscuz", "Tapioca", "Bebidas"];
export const money = (value:number) => value.toLocaleString("pt-BR", { style:"currency", currency:"BRL" });


