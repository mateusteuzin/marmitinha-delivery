"use client";

import { useState, type CSSProperties } from "react";
import { siWhatsapp } from "simple-icons";

type Category = "Cuscuz" | "Tapioca" | "Bebidas";
type Product = {
  id: string; name: string; category: Category; price: number; description: string;
  image: string; customizable?: boolean; badge?: string; focus?: string; fit?: "cover" | "contain";
};
type Extra = { id: string; name: string; price: number };
type CartItem = { key: string; product: Product; extras: Extra[]; quantity: number };

const products: Product[] = [
  { id:"amostrado", name:"Cuscuz Amostrado", category:"Cuscuz", price:15, description:"Carne de sol, carne moída, calabresa, bacon e ovo.", image:"/cuscuz-amostrado.jpg", customizable:true, badge:"Mais pedido", focus:"center 72%" },
  { id:"nordestino", name:"Nordestino Cremoso", category:"Cuscuz", price:14, description:"Cuscuz macio, carne de sol e uma camada bem cremosa.", image:"/cuscuz-hero.jpg", customizable:true, badge:"Bem cremoso", focus:"center 54%" },
  { id:"carne-sol", name:"Carne de Sol", category:"Cuscuz", price:13, description:"Cuscuz quentinho com carne de sol desfiada e temperada.", image:"/cuscuz-carne-sol.jpg", customizable:true, badge:"Clássico da casa", focus:"center 48%" },
  { id:"carne-moida-ovo", name:"Carne Moída com Ovo", category:"Cuscuz", price:12, description:"Carne moída bem temperada, ovo e cuscuz feito na hora.", image:"/cuscuz-amostrado.jpg", customizable:true, focus:"center 72%" },
  { id:"calabresa", name:"Calabresa", category:"Cuscuz", price:10, description:"Calabresa dourada servida com cuscuz bem quentinho.", image:"/cuscuz-hero.jpg", customizable:true, focus:"center 54%" },
  { id:"frango", name:"Frango com Catupiry", category:"Cuscuz", price:10, description:"Frango temperado com recheio cremoso e cuscuz macio.", image:"/cuscuz-carne-sol.jpg", customizable:true, focus:"center 48%" },
  { id:"queijo", name:"Queijo", category:"Cuscuz", price:9, description:"Cuscuz leve com queijo bem derretido.", image:"/cuscuz-amostrado.jpg", customizable:true, focus:"center 72%" },
  { id:"tap-carne-sol", name:"Carne de Sol", category:"Tapioca", price:13, description:"Tapioca fresquinha com recheio generoso de carne de sol.", image:"/tapioca.jpg", customizable:true, badge:"Bem recheada", focus:"center 64%" },
  { id:"tap-frango", name:"Frango com Catupiry", category:"Tapioca", price:10, description:"Frango temperado e recheio cremoso na tapioca.", image:"/tapioca.jpg", customizable:true, focus:"center 64%" },
  { id:"tap-queijo", name:"Queijo", category:"Tapioca", price:9, description:"Queijo derretido em uma tapioca leve e fresquinha.", image:"/tapioca.jpg", customizable:true, focus:"center 64%" },
  { id:"tap-carne-moida", name:"Carne Moída", category:"Tapioca", price:10, description:"Carne moída bem temperada e recheio caprichado.", image:"/tapioca.jpg", customizable:true, focus:"center 64%" },
  { id:"tap-calabresa", name:"Calabresa com Queijo", category:"Tapioca", price:10, description:"Calabresa dourada com queijo derretido.", image:"/tapioca.jpg", customizable:true, focus:"center 64%" },
  { id:"tap-nutella", name:"Nutella com Morango", category:"Tapioca", price:12, description:"Creme de avelã e morango em uma tapioca docinha.", image:"/tapioca.jpg", badge:"Doce", focus:"center 64%" },
  { id:"coca-250", name:"Coca-Cola Zero 250 ml", category:"Bebidas", price:3, description:"Garrafinha gelada, sem açúcar.", image:"/coca-zero-250.png", fit:"contain", badge:"Gelada" },
  { id:"guarana-250", name:"Guaraná 250 ml", category:"Bebidas", price:3, description:"Guaraná gelado para acompanhar seu pedido.", image:"/guarana-250.png", fit:"contain", badge:"Gelado" },
  { id:"coca-lata", name:"Coca-Cola Zero lata", category:"Bebidas", price:5, description:"Lata gelada, sem açúcar.", image:"/coca-zero-lata.png", fit:"contain", badge:"Gelada" },
  { id:"sucos", name:"Sucos", category:"Bebidas", price:6, description:"Consulte os sabores disponíveis no WhatsApp.", image:"/suco.png", fit:"contain", badge:"Sabores do dia" },
];

const extras: Extra[] = [
  { id:"queijo-extra", name:"Queijo", price:3 },
  { id:"ovo-extra", name:"Ovo", price:2 },
  { id:"manteiga-extra", name:"Manteiga extra", price:1.5 },
];
const categories: Category[] = ["Cuscuz", "Tapioca", "Bebidas"];
const money = (value:number) => value.toLocaleString("pt-BR", { style:"currency", currency:"BRL" });

function WhatsAppIcon({ size = 22 }: { size?: number }) {
  return <svg className="whatsapp-icon" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"><path d={siWhatsapp.path}/></svg>;
}

function BagIcon({ size = 22 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.7 8.5h10.6l1 11H5.7l1-11Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M9 9V6.8a3 3 0 0 1 6 0V9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
}

function ArrowIcon() {
  return <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h11m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

function NordestinoPattern({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 1200 620" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <g className="pattern-stroke">
      <path d="M82 508v-92m0 34c-24 0-30-17-30-37m30 67c25 0 34-17 34-39M67 508h30"/>
      <path d="M1050 102v-62m0 24c-17 0-22-12-22-26m22 47c18 0 24-12 24-27m-34 44h21"/>
      <circle cx="1090" cy="465" r="35"/><path d="M1090 412v-20m0 146v-20m53-53h20m-146 0h20m91-38 14-14m-103 103 14-14m75 14 14 14m-103-103 14 14"/>
      <path d="M174 106c28-28 57-28 85 0-28 8-57 8-85 0Zm42-40v31m-17-21 17 21 18-21"/>
      <path d="M860 535c20-28 52-30 76-8-19 26-51 29-76 8Zm13 4c17-4 32-7 50-10m-28-8 1 14m15-21 2 18"/>
      <path d="m470 74 8 18 20 2-15 13 5 20-18-10-18 10 5-20-15-13 20-2 8-18Z"/>
      <path d="M742 146c0-20 16-36 36-36s36 16 36 36m-72 0h72m-61 0c3 20 13 31 25 31s22-11 25-31"/>
      <path d="M273 452c17-17 35-17 52 0-17 5-35 5-52 0Zm26-25v19"/>
      <path d="M0 210c102 16 172 14 256-8s173-19 258 4 176 24 270 3 198-25 416-2"/>
    </g>
    <g className="pattern-fill">
      <path d="m334 177 5 12 13 1-10 8 3 13-11-7-12 7 4-13-10-8 13-1 5-12Z"/>
      <path d="m995 298 4 10 11 1-9 7 3 11-9-6-10 6 3-11-8-7 11-1 4-10Z"/>
      <circle cx="575" cy="520" r="6"/><circle cx="623" cy="111" r="4"/><circle cx="142" cy="298" r="5"/>
    </g>
  </svg>;
}

export function MenuApp() {
  const [category,setCategory] = useState<Category>("Cuscuz");
  const [selected,setSelected] = useState<Product|null>(null);
  const [selectedExtras,setSelectedExtras] = useState<string[]>([]);
  const [productQty,setProductQty] = useState(1);
  const [cart,setCart] = useState<CartItem[]>([]);
  const [cartOpen,setCartOpen] = useState(false);
  const [orderType,setOrderType] = useState<"Entrega"|"Retirada">("Entrega");
  const [name,setName] = useState("");
  const [address,setAddress] = useState("");
  const [payment,setPayment] = useState("");
  const [notes,setNotes] = useState("");
  const [addedProduct,setAddedProduct] = useState<string|null>(null);

  const visible = products.filter(p => p.category === category);
  const itemCount = cart.reduce((sum,item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum,item) => sum + (item.product.price + item.extras.reduce((s,e)=>s+e.price,0))*item.quantity, 0);
  const currentExtras = extras.filter(extra => selectedExtras.includes(extra.id));
  const currentTotal = selected ? (selected.price + currentExtras.reduce((sum,e)=>sum+e.price,0))*productQty : 0;

  function choose(product:Product) { setSelected(product); setSelectedExtras([]); setProductQty(1); }
  function addSelected() {
    if (!selected) return;
    const productName = selected.name;
    const chosen = selected.customizable ? currentExtras : [];
    const key = `${selected.id}-${chosen.map(e=>e.id).sort().join("-")}`;
    setCart(old => {
      const found = old.find(item => item.key === key);
      return found ? old.map(item => item.key === key ? {...item,quantity:item.quantity+productQty}:item) : [...old,{key,product:selected,extras:chosen,quantity:productQty}];
    });
    setSelected(null); setAddedProduct(productName);
    window.setTimeout(() => setAddedProduct(null), 1800);
  }
  function changeQty(key:string, delta:number) {
    setCart(old => old.map(item => item.key === key ? {...item,quantity:item.quantity+delta}:item).filter(item=>item.quantity>0));
  }
  function sendWhatsApp() {
    const lines = ["Olá! Quero fazer este pedido:",""];
    cart.forEach(item => {
      const unit = item.product.price + item.extras.reduce((sum,e)=>sum+e.price,0);
      lines.push(`${item.quantity}x ${item.product.name} — ${money(unit*item.quantity)}`);
      if (item.extras.length) lines.push(`Adicionais: ${item.extras.map(e=>`${e.name} (+${money(e.price)})`).join(", ")}`);
      lines.push("");
    });
    lines.push(`Subtotal: ${money(subtotal)}`,`Tipo do pedido: ${orderType}`);
    if (orderType === "Entrega") lines.push("Taxa de entrega: a confirmar");
    lines.push(`Total parcial: ${money(subtotal)}`,"",`Nome: ${name || "a informar"}`);
    if (orderType === "Entrega") lines.push(`Endereço: ${address || "a informar"}`);
    lines.push(`Forma de pagamento: ${payment || "a informar"}`);
    if (notes) lines.push(`Observações: ${notes}`);
    window.open(`https://wa.me/558897309179?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener,noreferrer");
  }

  return <main>
    <header className="hero" id="inicio">
      <NordestinoPattern className="hero-pattern"/>
      <nav className="topbar" aria-label="Navegação principal">
        <a className="brand" href="#inicio" aria-label="Marmitinha Delivery — início"><span className="brand-plate"><img className="brand-logo" src="/logo-marmitinha-transparent.png" alt="Marmitinha Delivery"/></span></a>
        <div className="header-actions"><span className="open-pill"><i/> <span className="open-copy"><b>Estamos abertos</b><small>Pedidos pelo WhatsApp</small></span></span><a className="header-whatsapp" href="https://wa.me/558897309179" target="_blank" rel="noreferrer" aria-label="Falar com a Marmitinha no WhatsApp"><WhatsAppIcon size={19}/><span>Falar agora</span></a></div>
      </nav>
      <div className="hero-layout">
        <div className="hero-copy">
          <p className="eyebrow">Cardápio online • sabor nordestino</p>
          <h1>Comida feita<br/><em>com carinho.</em></h1>
          <p>Cuscuz, tapioca e bebidas preparados do seu jeito. Escolha, personalize e finalize direto pelo WhatsApp.</p>
          <div className="hero-actions"><a className="hero-cta" href="#cardapio">Explorar cardápio <ArrowIcon/></a><span className="hero-microcopy">Entrega e retirada<br/><b>Peça em poucos passos</b></span></div>
        </div>
        <div className="hero-visual" aria-label="Destaque do cardápio">
          <img src="/cuscuz-amostrado.jpg" alt="Cuscuz completo da Marmitinha"/>
          <span className="hero-tag"><small>O queridinho da casa</small><b>Cuscuz Amostrado</b><em>{money(15)}</em></span>
          <span className="hero-stamp">Feito<br/>na hora</span>
        </div>
      </div>
      <div className="hero-notes" aria-label="Diferenciais"><span><b>01</b> Ingredientes frescos</span><span><b>02</b> Personalize seu pedido</span><span><b>03</b> Finalize no WhatsApp</span></div>
    </header>

    <section className="menu-shell" id="cardapio">
      <NordestinoPattern className="menu-pattern"/>
      <div className="section-heading"><div><p className="eyebrow">Da nossa cozinha para você</p><h2>Escolha seu favorito</h2></div><div className="menu-guide"><span>18 opções</span><p>Toque em um item para ver detalhes e adicionais.</p></div></div>
      <div className="category-tabs" aria-label="Categorias">{categories.map(cat=><button className={category===cat?"active":""} key={cat} onClick={()=>setCategory(cat)} aria-pressed={category===cat}>{cat}<span>{products.filter(p=>p.category===cat).length}</span></button>)}</div>
      <div className="category-intro"><p><strong>{category}</strong> • {category === "Bebidas" ? "Para acompanhar, sempre bem geladas." : "Escolha o seu e acrescente extras se quiser."}</p></div>
      <div className="menu-grid" key={category} aria-live="polite">
        {visible.map((item,index)=><button type="button" className={`product-card product-${item.id} ${item.fit === "contain" ? "drink-card" : ""}`} key={item.id} onClick={()=>choose(item)} aria-label={`${item.customizable?"Escolher opções de":"Adicionar"} ${item.name}`} style={{"--delay":`${index*45}ms`} as CSSProperties}>
          <span className="product-photo"><img src={item.image} alt={item.category==="Bebidas"?item.name:`${item.name} da Marmitinha`} loading="lazy" decoding="async" style={{objectPosition:item.focus || "center",objectFit:item.fit || "cover"}}/><span className="photo-shine"/></span>
          <span className="product-info"><span className="product-kind">{item.badge || "Feito na hora"}</span><span className="product-title">{item.name}</span><span className="product-description">{item.description}</span><span className="product-bottom"><span className="price-block"><small>A partir de</small><strong>{money(item.price)}</strong></span><span className="product-action"><span className="action-label">{item.customizable?"Personalizar":"Adicionar"}</span><span className="action-icon">+</span></span></span></span>
        </button>)}
      </div>
    </section>

    <footer className="site-footer"><div><img src="/logo-marmitinha-transparent.png" alt="Marmitinha Delivery"/><div><strong>Feito com carinho,<br/>entregue com amor.</strong><p>Pedidos pelo WhatsApp: (88) 9730-9179</p></div></div><a href="#inicio">Voltar ao topo ↑</a></footer>

    {itemCount>0&&<button className="cart-dock has-items" onClick={()=>setCartOpen(true)} aria-label={`Abrir pedido com ${itemCount} itens`}><span className="cart-symbol"><BagIcon/></span><span className="cart-copy"><small>Seu pedido está em andamento</small><strong>{itemCount} {itemCount===1?"item":"itens"} · {money(subtotal)}</strong></span><span className="cart-action"><span className="cart-action-label">Revisar pedido</span><span className="cart-count">{itemCount}</span><ArrowIcon/></span></button>}
    <div className={`add-toast ${addedProduct ? "show" : ""}`} role="status"><span>✓</span><div><strong>Adicionado ao pedido</strong><small>{addedProduct}</small></div></div>

    {selected&&<div className="overlay" role="presentation" onMouseDown={()=>setSelected(null)}><section className="sheet product-sheet" role="dialog" aria-modal="true" aria-labelledby="product-title" onMouseDown={e=>e.stopPropagation()}><button className="close" onClick={()=>setSelected(null)} aria-label="Fechar">×</button><div className={`sheet-photo-wrap ${selected.fit === "contain" ? "contain" : ""}`}><img className="sheet-photo" src={selected.image} alt="" style={{objectPosition:selected.focus || "center",objectFit:selected.fit || "cover"}}/></div><div className="sheet-body"><p className="eyebrow">{selected.badge || selected.category}</p><h2 id="product-title">{selected.name}</h2><p className="sheet-description">{selected.description}</p><strong className="sheet-price">A partir de {money(selected.price)}</strong>{selected.customizable&&<fieldset className="extras"><legend>Quer acrescentar algo? <small>Opcional</small></legend>{extras.map(extra=><label key={extra.id}><input type="checkbox" checked={selectedExtras.includes(extra.id)} onChange={()=>setSelectedExtras(old=>old.includes(extra.id)?old.filter(id=>id!==extra.id):[...old,extra.id])}/><span>{extra.name}</span><strong>+ {money(extra.price)}</strong></label>)}</fieldset>}<div className="quantity"><span>Quantidade do item</span><div><button onClick={()=>setProductQty(q=>Math.max(1,q-1))} aria-label="Diminuir quantidade">−</button><strong>{productQty}</strong><button onClick={()=>setProductQty(q=>q+1)} aria-label="Aumentar quantidade">+</button></div></div><button className="primary-action" onClick={addSelected}>Adicionar ao pedido <span>{money(currentTotal)}</span></button></div></section></div>}

    {cartOpen&&<div className="overlay" role="presentation" onMouseDown={()=>setCartOpen(false)}><aside className="sheet cart-sheet" role="dialog" aria-modal="true" aria-labelledby="cart-title" onMouseDown={e=>e.stopPropagation()}><div className="cart-head"><div><p className="eyebrow">Quase lá</p><h2 id="cart-title">Seu pedido</h2></div><button className="close static" onClick={()=>setCartOpen(false)} aria-label="Fechar pedido">×</button></div><div className="cart-scroll">{!cart.length?<div className="empty-cart"><span>◇</span><h3>Seu pedido está vazio</h3><p>Escolha um item do cardápio para começar.</p><button onClick={()=>setCartOpen(false)}>Voltar ao cardápio</button></div>:<><div className="cart-items">{cart.map(item=>{const unit=item.product.price+item.extras.reduce((s,e)=>s+e.price,0);return <article className="cart-item" key={item.key}><img src={item.product.image} alt="" style={{objectPosition:item.product.focus || "center",objectFit:item.product.fit || "cover"}}/><div><h3>{item.product.name}</h3>{item.extras.length>0&&<p>{item.extras.map(e=>e.name).join(", ")}</p>}<strong>{money(unit*item.quantity)}</strong><div className="cart-qty"><button onClick={()=>changeQty(item.key,-1)} aria-label={`Diminuir ${item.product.name}`}>−</button><span>{item.quantity}</span><button onClick={()=>changeQty(item.key,1)} aria-label={`Aumentar ${item.product.name}`}>+</button><button className="remove" onClick={()=>setCart(old=>old.filter(x=>x.key!==item.key))}>Remover</button></div></div></article>})}</div><div className="order-form"><h3>Como você quer receber?</h3><div className="type-toggle"><label><input type="radio" checked={orderType==="Entrega"} onChange={()=>setOrderType("Entrega")}/> Entrega</label><label><input type="radio" checked={orderType==="Retirada"} onChange={()=>setOrderType("Retirada")}/> Retirada</label></div><label>Seu nome<input value={name} onChange={e=>setName(e.target.value)} placeholder="Como podemos chamar você?"/></label>{orderType==="Entrega"&&<label>Endereço<input value={address} onChange={e=>setAddress(e.target.value)} placeholder="Rua, número e bairro"/></label>}<label>Forma de pagamento<select value={payment} onChange={e=>setPayment(e.target.value)}><option value="">Escolha no WhatsApp</option><option>Pix</option><option>Dinheiro</option><option>Cartão</option></select></label><label>Observações<textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Ex.: sem cebola, troco para R$ 50..."/></label></div><div className="summary"><p><span>Subtotal</span><strong>{money(subtotal)}</strong></p><p><span>Entrega</span><strong>A confirmar</strong></p><p className="total"><span>Total parcial</span><strong>{money(subtotal)}</strong></p><small>O pedido será confirmado após nosso atendimento responder.</small></div></>}</div>{cart.length>0&&<div className="cart-footer"><button className="whatsapp" onClick={sendWhatsApp}><WhatsAppIcon size={23}/> Enviar pedido pelo WhatsApp</button></div>}</aside></div>}
  </main>;
}
