"use client";

import { useState, useEffect, useRef, type CSSProperties } from "react";
import { siInstagram, siWhatsapp } from "simple-icons";

import { products as baseProducts, extras, categories, money, type Product, type Extra, type CartItem, type Category } from "../lib/catalog";

function WhatsAppIcon({ size = 22 }: { size?: number }) {
  return <svg className="whatsapp-icon" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"><path d={siWhatsapp.path}/></svg>;
}

function InstagramIcon({ size = 22 }: { size?: number }) {
  return <svg className="instagram-icon" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"><path d={siInstagram.path}/></svg>;
}

function BagIcon({ size = 22 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.7 8.5h10.6l1 11H5.7l1-11Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M9 9V6.8a3 3 0 0 1 6 0V9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
}

function ArrowIcon() {
  return <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h11m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

export function MenuApp() {
  const [catalog,setCatalog] = useState<Record<string,{price:number;available:boolean}>>({});
  const [defaultFee,setDefaultFee] = useState(0);
  const [sending,setSending] = useState(false);
  const [sendError,setSendError] = useState("");
  const orderRequestId = useRef<string|null>(null);
  const products = baseProducts.map(p=>({...p,price:catalog[p.id]?.price??p.price})).filter(p=>catalog[p.id]?.available!==false);
  useEffect(()=>{const load=()=>fetch("/api/catalog",{cache:"no-store"}).then(r=>r.ok?r.json():null).then(b=>{if(b){setCatalog(b.products);setDefaultFee(b.defaultFee);}}).catch(()=>{});void load();window.addEventListener("focus",load);return()=>window.removeEventListener("focus",load);},[]);
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

  const modalOpen = !!selected || cartOpen;
  useEffect(() => {
    if (!modalOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const dialog = document.querySelector<HTMLElement>('[role="dialog"]');
    const focusable = () => Array.from(dialog?.querySelectorAll<HTMLElement>('button, input, select, textarea, a[href]') || []).filter(el => !el.hasAttribute('disabled'));
    focusable()[0]?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setSelected(null); setCartOpen(false); }
      if (event.key === "Tab") {
        const items = focusable();
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = overflow; document.removeEventListener("keydown", onKey); previous?.focus(); };
  }, [modalOpen]);

  const visible = products.filter(p => p.category === category);
  const itemCount = cart.reduce((sum,item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum,item) => sum + (item.product.price + item.extras.reduce((s,e)=>s+e.price,0))*item.quantity, 0);
  const currentExtras = extras.filter(extra => selectedExtras.includes(extra.id));
  const currentTotal = selected ? (selected.price + currentExtras.reduce((sum,e)=>sum+e.price,0))*productQty : 0;

  function choose(product:Product) { setSendError(""); orderRequestId.current=null; setSelected(product); setSelectedExtras([]); setProductQty(1); }
  function addSelected() {
    if (!selected) return;
    const productName = selected.name;
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const source = document.querySelector('.sheet-photo');
      const start = source?.getBoundingClientRect();
      const target = document.querySelector('.cart-dock')?.getBoundingClientRect();
      const flyer = document.createElement('img');
      flyer.src = selected.image;
      flyer.className = 'flying-product';
      flyer.alt = '';
      flyer.setAttribute('aria-hidden', 'true');
      const x = start ? start.left + start.width / 2 - 30 : window.innerWidth / 2;
      const y = start ? start.top + start.height / 2 - 30 : window.innerHeight / 2;
      flyer.style.left = `${x}px`; flyer.style.top = `${y}px`;
      document.body.appendChild(flyer);
      const endX = target ? target.left + 30 : window.innerWidth - 70;
      const endY = target ? target.top + 20 : window.innerHeight - 55;
      const flight = flyer.animate([
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: `translate(${(endX-x)*.45}px,${(endY-y)*.3-55}px) scale(.9)`, opacity: 1, offset: .45 },
        { transform: `translate(${endX-x}px,${endY-y}px) scale(.2)`, opacity: 0 }
      ], { duration: 650, easing: 'cubic-bezier(.22,.61,.36,1)' });
      flight.onfinish = () => {
        flyer.remove();
        document.querySelector('.cart-dock')?.animate([{transform:'scale(1)'},{transform:'scale(1.035)'},{transform:'scale(1)'}],{duration:280});
      };
      flight.oncancel = () => flyer.remove();
    }
    const chosen = selected.customizable ? currentExtras : [];
    const key = `${selected.id}-${chosen.map(e=>e.id).sort().join("-")}`;
    orderRequestId.current=null;
    setCart(old => {
      const found = old.find(item => item.key === key);
      return found ? old.map(item => item.key === key ? {...item,quantity:item.quantity+productQty}:item) : [...old,{key,product:selected,extras:chosen,quantity:productQty}];
    });
    setSelected(null); setAddedProduct(productName);
    window.setTimeout(() => setAddedProduct(null), 1800);
  }
  function changeQty(key:string, delta:number) {
    orderRequestId.current=null;
    setCart(old => old.map(item => item.key === key ? {...item,quantity:item.quantity+delta}:item).filter(item=>item.quantity>0));
  }
  async function sendWhatsApp() {
    if (sending) return;
    if (!name.trim() || (orderType === "Entrega" && !address.trim())) { setSendError("Informe seu nome e o endereço para entrega."); return; }
    setSending(true); setSendError("");

    orderRequestId.current ||= globalThis.crypto?.randomUUID?.() || `pedido-${Date.now()}-${Math.random().toString(36).slice(2,14)}`;
    try {
      const r=await fetch("/api/orders",{signal:AbortSignal.timeout(5000),method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({requestId:orderRequestId.current,name,address,payment,notes,type:orderType,items:cart.map(i=>({productId:i.product.id,quantity:i.quantity,extras:i.extras.map(e=>e.id)}))})});
      const b=await r.json();if(!r.ok)throw new Error(b.error||"Não foi possível registrar o pedido.");
      window.location.assign(b.whatsappUrl);
      setSendError(`Pedido #${b.code} registrado. Envie a mensagem no WhatsApp para confirmar com a Marmitinha.`);
     }catch{
      const text=["Olá! Quero fazer um pedido (confirmar pelo WhatsApp):",`Nome: ${name}`, ...cart.map(i=>`${i.quantity}x ${i.product.name}${i.extras.length?" ("+i.extras.map(e=>e.name).join(", ")+")":""} — ${money((i.product.price+i.extras.reduce((v,e)=>v+e.price,0))*i.quantity)}`),`Tipo: ${orderType}`,orderType==="Entrega"?`Endereço: ${address}`:"Retirada: Rua Senador Virgílio Távora, 1000, Itarema–CE",`Pagamento: ${payment||"A informar"}`,`Observações: ${notes||"Nenhuma"}`,"Valores e frete a confirmar. Pedido enviado diretamente, sem registro automático no painel."].join("\n");
      setSendError("Abrindo o WhatsApp para atendimento direto.");
      window.location.assign(`https://wa.me/558897309179?text=${encodeURIComponent(text)}`);
    }finally{setSending(false);}
  }

  return <main>
    <header className="hero" id="inicio">
      <div className="restaurant-cover"><img src="/cuscuz-hero.jpg" alt="Cuscuz da Marmitinha Delivery"/><span className="open-badge">Pedidos pelo WhatsApp</span></div>
      <div className="restaurant-profile">
        <div className="profile-logo"><img src="/logo-marmitinha-transparent.png" alt="Logo Marmitinha Delivery"/></div>
        <p className="profile-kicker">Cardápio digital</p>
        <h1>Marmitinha Delivery</h1>
        <p className="profile-tagline">Feito com carinho, entregue com amor.</p>
        <div className="profile-info"><span><b>Entrega e retirada</b><small>Escolha como receber</small></span><span><b>Pedido pelo WhatsApp</b><small>(88) 9730-9179</small></span></div>
        <a className="profile-cta" href="#cardapio">Ver cardápio <ArrowIcon/></a>
      </div>
    </header>

    <section className="menu-shell" id="cardapio">
      <div className="section-heading"><div><p className="eyebrow">Da nossa cozinha para você</p><h2>Escolha seu favorito</h2></div><div className="menu-guide"><span>{products.length} opções</span><p>Toque em um item para ver detalhes e adicionais.</p></div></div>
      <div className="category-tabs" aria-label="Categorias">{categories.map(cat=><button className={category===cat?"active":""} key={cat} onClick={()=>setCategory(cat)} aria-pressed={category===cat}>{cat}<span>{products.filter(p=>p.category===cat).length}</span></button>)}</div>
      <div className="category-intro"><p><strong>{category}</strong> • {category === "Bebidas" ? "Para acompanhar, sempre bem geladas." : "Escolha o seu e acrescente extras se quiser."}</p></div>
      <div className="menu-grid" key={category} aria-live="polite">
        {visible.map((item,index)=><button type="button" className={`product-card product-${item.id} ${item.fit === "contain" ? "drink-card" : ""}`} key={item.id} onClick={()=>choose(item)} aria-label={`${item.customizable?"Escolher opções de":"Adicionar"} ${item.name}`} style={{"--delay":`${index*45}ms`} as CSSProperties}>
          <span className="product-photo"><img src={item.image} alt={item.category==="Bebidas"?item.name:`${item.name} da Marmitinha`} loading="lazy" decoding="async" style={{objectPosition:item.focus || "center",objectFit:item.fit || "cover"}}/><span className="photo-shine"/></span>
          <span className="product-info"><span className="product-kind">{item.badge || "Feito na hora"}</span><span className="product-title">{item.name}</span><span className="product-description">{item.description}</span><span className="product-bottom"><span className="price-block"><small>A partir de</small><strong>{money(item.price)}</strong></span><span className="product-action"><span className="action-label">{item.customizable?"Personalizar":"Adicionar"}</span><span className="action-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/></svg></span></span></span></span>
        </button>)}
      </div>
    </section>

    <footer className="site-footer"><div className="footer-inner"><div className="footer-brand"><span className="footer-logo"><img src="/logo-marmitinha-transparent.png" alt="Marmitinha Delivery"/></span><div><strong>Feito com carinho,<br/>entregue com amor.</strong><p>Pedidos pelo WhatsApp: (88) 9730-9179</p></div></div><div className="footer-actions"><a className="instagram-link" href="https://www.instagram.com/marmitinha_1/" target="_blank" rel="noreferrer" aria-label="Abrir Instagram da Marmitinha"><InstagramIcon size={22}/><span><small>Siga a Marmitinha</small><b>@marmitinha_1</b></span></a><a className="back-top" href="#inicio">Voltar ao topo ↑</a></div></div></footer>

    {itemCount>0&&<button className="cart-dock has-items" onClick={()=>setCartOpen(true)} aria-label={`Abrir pedido com ${itemCount} itens`}><span className="cart-symbol"><BagIcon/></span><span className="cart-copy"><small>Seu pedido está em andamento</small><strong>{itemCount} {itemCount===1?"item":"itens"} · {money(subtotal)}</strong></span><span className="cart-action"><span className="cart-action-label">Revisar pedido</span><span className="cart-count">{itemCount}</span><ArrowIcon/></span></button>}
    <div className={`add-toast ${addedProduct ? "show" : ""}`} role="status"><span>✓</span><div><strong>Adicionado ao pedido</strong><small>{addedProduct}</small></div></div>

    {selected&&<div className="overlay" role="presentation" onMouseDown={()=>setSelected(null)}><section className="sheet product-sheet" role="dialog" aria-modal="true" aria-labelledby="product-title" onMouseDown={e=>e.stopPropagation()}><button className="close" onClick={()=>setSelected(null)} aria-label="Fechar">×</button><div className={`sheet-photo-wrap ${selected.fit === "contain" ? "contain" : ""}`}><img className="sheet-photo" src={selected.image} alt="" style={{objectPosition:selected.focus || "center",objectFit:selected.fit || "cover"}}/></div><div className="sheet-body"><p className="eyebrow">{selected.badge || selected.category}</p><h2 id="product-title">{selected.name}</h2><p className="sheet-description">{selected.description}</p><strong className="sheet-price">A partir de {money(selected.price)}</strong>{selected.customizable&&<fieldset className="extras"><legend>Quer acrescentar algo? <small>Opcional</small></legend>{extras.map(extra=><label key={extra.id}><input type="checkbox" checked={selectedExtras.includes(extra.id)} onChange={()=>setSelectedExtras(old=>old.includes(extra.id)?old.filter(id=>id!==extra.id):[...old,extra.id])}/><span>{extra.name}</span><strong>+ {money(extra.price)}</strong></label>)}</fieldset>}<div className="quantity"><span>Quantidade do item</span><div><button onClick={()=>setProductQty(q=>Math.max(1,q-1))} aria-label="Diminuir quantidade">−</button><strong>{productQty}</strong><button onClick={()=>setProductQty(q=>q+1)} aria-label="Aumentar quantidade">+</button></div></div><button className="primary-action" onClick={addSelected}>Adicionar ao pedido <span>{money(currentTotal)}</span></button></div></section></div>}

    {cartOpen&&<div className="overlay" role="presentation" onMouseDown={()=>setCartOpen(false)}><aside className="sheet cart-sheet" role="dialog" aria-modal="true" aria-labelledby="cart-title" onMouseDown={e=>e.stopPropagation()}><div className="cart-head"><div><p className="eyebrow">Quase lá</p><h2 id="cart-title">Seu pedido</h2></div><button className="close static" onClick={()=>setCartOpen(false)} aria-label="Fechar pedido">×</button></div><div className="cart-scroll">{!cart.length?<div className="empty-cart"><span>◇</span><h3>Seu pedido está vazio</h3><p>Escolha um item do cardápio para começar.</p><button onClick={()=>setCartOpen(false)}>Voltar ao cardápio</button></div>:<><div className="cart-items">{cart.map(item=>{const unit=item.product.price+item.extras.reduce((s,e)=>s+e.price,0);return <article className="cart-item" key={item.key}><img src={item.product.image} alt="" style={{objectPosition:item.product.focus || "center",objectFit:item.product.fit || "cover"}}/><div><h3>{item.product.name}</h3>{item.extras.length>0&&<p>{item.extras.map(e=>e.name).join(", ")}</p>}<strong>{money(unit*item.quantity)}</strong><div className="cart-qty"><button onClick={()=>changeQty(item.key,-1)} aria-label={`Diminuir ${item.product.name}`}>−</button><span>{item.quantity}</span><button onClick={()=>changeQty(item.key,1)} aria-label={`Aumentar ${item.product.name}`}>+</button><button className="remove" onClick={()=>{orderRequestId.current=null;setCart(old=>old.filter(x=>x.key!==item.key));}}>Remover</button></div></div></article>})}</div><div className="order-form"><h3>Como você quer receber?</h3><div className="type-toggle"><label><input type="radio" checked={orderType==="Entrega"} onChange={()=>{orderRequestId.current=null;setOrderType("Entrega");}}/> Entrega</label><label><input type="radio" checked={orderType==="Retirada"} onChange={()=>{orderRequestId.current=null;setOrderType("Retirada");}}/> Retirada</label></div>{orderType === "Retirada" && <div className="pickup-location"><strong>Local de retirada</strong><p>Rua Senador Virgílio Távora, 1000<br/>Itarema – CE</p><a href="https://www.google.com/maps/dir/?api=1&destination=Rua%20Senador%20Virg%C3%ADlio%20T%C3%A1vora%2C%201000%2C%20Itarema%2C%20CE" target="_blank" rel="noopener noreferrer">Abrir rota no Google Maps ↗</a></div>}<label>Seu nome<input autoComplete="name" value={name} onChange={e=>{orderRequestId.current=null;setName(e.target.value);}} placeholder="Como podemos chamar você?"/></label>{orderType==="Entrega"&&<label>Endereço<input autoComplete="street-address" value={address} onChange={e=>{orderRequestId.current=null;setAddress(e.target.value);}} placeholder="Rua, número e bairro"/></label>}<label>Forma de pagamento<select value={payment} onChange={e=>{orderRequestId.current=null;setPayment(e.target.value);}}><option value="">Escolha no WhatsApp</option><option>Pix</option><option>Dinheiro</option><option>Cartão</option></select></label><label>Observações<textarea value={notes} onChange={e=>{orderRequestId.current=null;setNotes(e.target.value);}} placeholder="Ex.: sem cebola, troco para R$ 50..."/></label></div><div className="summary"><p><span>Subtotal</span><strong>{money(subtotal)}</strong></p><p><span>Entrega</span><strong>{orderType === "Entrega" ? `${money(defaultFee)} · a confirmar` : "Sem taxa · retirada"}</strong></p><p className="total"><span>Total estimado</span><strong>{money(subtotal+(orderType==="Entrega"?defaultFee:0))}</strong></p><small>O pedido será confirmado após nosso atendimento responder.</small></div></>}</div>{cart.length>0&&<div className="cart-footer">{sendError&&<p role="status" style={{fontSize:13,lineHeight:1.5,margin:"0 0 12px"}}>{sendError}</p>}<button className="whatsapp" disabled={sending} onClick={sendWhatsApp}><WhatsAppIcon size={23}/> {sending?"Registrando pedido…":"Enviar pedido pelo WhatsApp"}</button></div>}</aside></div>}
  </main>;
}

