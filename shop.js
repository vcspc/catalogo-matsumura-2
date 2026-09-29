function readDemo(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
const shopState={
  favorites:readDemo("matsumura-favorites",[]),
  cart:readDemo("matsumura-cart",[]),
  user:readDemo("matsumura-user",null),
  orders:readDemo("matsumura-orders",[{id:"MT-1042",date:"24/09/2026",status:"Entregue",lines:[{id:"vestido",size:"M",qty:1}],total:329.9}]),
  tickets:readDemo("matsumura-tickets",[{id:"CH-201",subject:"Dúvida sobre tamanho",status:"Respondido",date:"25/09/2026",messages:[{from:"Cliente",text:"O vestido tem modelagem maior?"},{from:"Matsumura",text:"Essa é uma conversa demonstrativa para apresentação do atendimento."}]}]),
  categories:readDemo("matsumura-categories",["Roupas","Calçados","Bolsas","Acessórios"])
};
window.shopState=shopState;
function saveShop(){
  for(const [key,value] of Object.entries({favorites:shopState.favorites,cart:shopState.cart,user:shopState.user,orders:shopState.orders,tickets:shopState.tickets,categories:shopState.categories}))localStorage.setItem("matsumura-"+key,JSON.stringify(value));
}
window.cartCount=()=>shopState.cart.reduce((sum,line)=>sum+line.qty,0);
const pById=id=>items.find(p=>p.id===id);
const roundMoney=value=>Math.round((value+Number.EPSILON)*100)/100;
const lineTotal=line=>roundMoney((pById(line.id)?.price||0)*line.qty);
const cartTotal=()=>roundMoney(shopState.cart.reduce((sum,line)=>sum+lineTotal(line),0));
const shippingState={zip:"",calculated:false};
const zipDigits=value=>String(value??"").replace(/\D/g,"").slice(0,8);
const formatZip=value=>zipDigits(value).replace(/^(\d{5})(\d)/,"$1-$2");
function calculateDemoShipping(zip,subtotal){
  if(!/^[0-9]{5}-?[0-9]{3}$/.test(String(zip??"").trim()))return null;
  const digits=zipDigits(zip);
  const inPara=digits.startsWith("68");
  return {zip:formatZip(digits),region:inPara?"Pará":"demais regiões",price:subtotal>=399?0:inPara?19.9:34.9,days:inPara?"3 a 5 dias úteis":"7 a 12 dias úteis"};
}
function shippingQuoteFor(subtotal){return shippingState.calculated?calculateDemoShipping(shippingState.zip,subtotal):null}
window.shippingQuoteFor=shippingQuoteFor;
window.shippingZip=()=>shippingState.zip;
window.shippingResultHtml=(quote,message="Digite um CEP para consultar o frete ilustrativo.")=>quote?`<div class="shipping-quote"><span>Entrega para ${quote.region}</span><strong>${quote.price===0?"Grátis":money(quote.price)}</strong><small>Prazo estimado: ${quote.days}</small></div>`:`<p class="shipping-hint">${message}</p>`;
const safe=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const imgFor=(id)=>{const p=pById(id);return p?image(p.image,p.name):""};
const demoNote='<div class="demo-note">Demonstração local: dados, pedidos e pagamentos desta tela são fictícios.</div>';
function heading(title,subtitle="",eyebrow="MATSUMURA"){
  return `<div class="inner-heading"><span class="eyebrow">${eyebrow}</span><h1>${title}</h1>${subtitle?`<p>${subtitle}</p>`:""}</div>`;
}
function page(title,body,subtitle="",eyebrow="MATSUMURA"){
  return `<main class="container inner-page">${heading(title,subtitle,eyebrow)}${body}</main>`;
}
function empty(title,copy,href="#/",label="Explorar catálogo"){
  return `<div class="empty-card"><span class="empty-mark">✧</span><h2>${title}</h2><p>${copy}</p><a class="return-button" href="${href}">${label}</a></div>`;
}
function favPage(){
  const selected=shopState.favorites.map(pById).filter(Boolean);
  return page("Meus Favoritos",selected.length?`<div class="products-grid">${selected.map(card).join("")}</div>`:empty("Nenhum favorito ainda","Explore a coleção e selecione as peças que chamarem sua atenção."),selected.length?`${selected.length} peça${selected.length===1?"":"s"} salva${selected.length===1?"":"s"} para rever depois.`:"As peças que você mais gostou ficam aqui.","SUAS ESCOLHAS");
}
function cartPage(){
  const lines=shopState.cart.filter(line=>pById(line.id));
  const quote=shippingQuoteFor(cartTotal());
  const body=lines.length?`<div class="commerce-layout"><div class="commerce-list">${lines.map(line=>{const p=pById(line.id);return `<article class="cart-line">${imgFor(line.id)}<div class="cart-line-main"><span class="eyebrow">${p.category}</span><a href="#/produto/${p.id}">${p.name}</a><small>Tamanho: ${line.size}</small><strong>${money(p.price)}</strong><div class="qty-control"><button data-shop="qty" data-id="${p.id}" data-size="${line.size}" data-delta="-1" aria-label="Diminuir quantidade">−</button><span>${line.qty}</span><button data-shop="qty" data-id="${p.id}" data-size="${line.size}" data-delta="1" aria-label="Aumentar quantidade">+</button></div></div><button class="text-button" data-shop="remove" data-id="${p.id}" data-size="${line.size}">Remover</button></article>`}).join("")}</div><aside class="summary-box"><h2>Resumo do pedido</h2><div><span>Subtotal</span><strong>${money(cartTotal())}</strong></div><div><span>Frete</span><span>${quote?(quote.price===0?"Grátis":money(quote.price)):"Calcule no checkout"}</span></div><div class="summary-total"><span>Total</span><strong>${money(cartTotal()+(quote?.price||0))}</strong></div><a href="#/checkout" class="return-button full">Finalizar compra</a><small>Fluxo ilustrativo. Nenhuma cobrança será feita.</small></aside></div>`:empty("Seu carrinho está vazio","Escolha uma peça para experimentar o fluxo de compra.","#/","Ver produtos");
  return page("Carrinho de Compras",body,`${window.cartCount()} ${window.cartCount()===1?"item":"itens"} no carrinho`,"SUA SACOLA");
}
function field(label,name,type="text",value="",required=true){
  return `<label class="form-field"><span>${label}</span><input name="${name}" type="${type}" ${type==="number"?'step="0.01"':""} value="${safe(value)}" ${required?"required":""}></label>`;
}
function checkoutPage(){
  if(!shopState.cart.length)return page("Finalizar Compra",empty("Carrinho vazio","Adicione produtos antes de finalizar.","#/","Ver catálogo"),"Confira seus dados e a forma de entrega.","CHECKOUT");
  const u=shopState.user||{};
  const subtotal=cartTotal();
  const quote=shippingQuoteFor(subtotal);
  const body=`<div class="commerce-layout"><form id="checkout-form" class="form-panel"><h2>Dados pessoais</h2><div class="form-grid">${field("Nome completo","name","text",u.name||"")}${field("E-mail","email","email",u.email||"")}${field("Telefone","phone","tel",u.phone||"")}${field("CPF (exemplo)","document","text","",false)}</div><h2>Endereço de entrega</h2><div class="form-grid"><label class="form-field"><span>CEP</span><input id="checkout-zip" name="zip" type="text" inputmode="numeric" autocomplete="postal-code" pattern="[0-9]{5}-?[0-9]{3}" maxlength="9" placeholder="00000-000" value="${safe(shippingState.zip)}" required></label>${field("Cidade","city","text",u.city||"")}${field("Endereço","address")}${field("Número","number")}</div><div class="checkout-shipping"><button type="button" class="outline-button" data-shop="shipping-checkout">Calcular frete</button><div id="checkout-shipping-result" class="shipping-result" aria-live="polite">${window.shippingResultHtml(quote)}</div><small>Frete de demonstração. Valores e prazos são ilustrativos.</small></div><h2>Forma de pagamento</h2><label class="choice"><input type="radio" name="payment" value="pix" checked> PIX demonstrativo</label><label class="choice"><input type="radio" name="payment" value="cartao"> Cartão demonstrativo</label><label class="choice"><input type="radio" name="payment" value="boleto"> Boleto demonstrativo</label><button class="return-button" type="submit">Simular pedido</button><p class="fine-print">Os dados digitados nesta etapa não são enviados a nenhum serviço.</p></form><aside class="summary-box"><h2>Seu pedido</h2>${shopState.cart.map(line=>`<div><span>${line.qty}× ${pById(line.id)?.name}</span><strong>${money(lineTotal(line))}</strong></div>`).join("")}<div><span>Subtotal</span><strong>${money(subtotal)}</strong></div><div><span>Frete</span><strong id="checkout-shipping-price">${quote?(quote.price===0?"Grátis":money(quote.price)):"Não calculado"}</strong></div><div class="summary-total"><span>Total ilustrativo</span><strong id="checkout-total">${money(subtotal+(quote?.price||0))}</strong></div>${demoNote}</aside></div>`;
  return page("Finalizar Compra",body,"Revise as peças e percorra o checkout de demonstração.","CHECKOUT");
}
function orderCard(order){
  return `<article class="order-card"><div><span class="eyebrow">PEDIDO ${order.id}</span><h3>${order.date}</h3><p>${order.lines.map(line=>pById(line.id)?.name||"Produto").join(", ")}</p></div><div><span class="status-pill">${order.status}</span><strong>${money(order.total)}</strong><a href="#/pedidos/${order.id}">Ver detalhes →</a></div></article>`;
}
function ordersPage(){
  return page("Meus Pedidos",`<div class="stack">${shopState.orders.map(orderCard).join("")}</div>`,"Acompanhe suas compras de demonstração.","MINHA CONTA");
}
function orderDetail(id){
  const order=shopState.orders.find(o=>o.id===id);
  if(!order)return page("Pedido não encontrado",empty("Pedido não encontrado","Volte à lista de pedidos.","#/pedidos","Meus pedidos"));
  return page(`Pedido ${order.id}`,`<div class="commerce-layout"><div class="stack"><section class="info-card"><h2>Status do pedido</h2><span class="status-pill">${order.status}</span><p>Criado em ${order.date}. Acompanhamento ilustrativo.</p></section><section class="info-card"><h2>Produtos</h2>${order.lines.map(line=>`<div class="order-product">${imgFor(line.id)}<div><strong>${pById(line.id)?.name}</strong><small>Tamanho: ${line.size} · Quantidade: ${line.qty}</small></div><strong>${money(lineTotal(line))}</strong></div>`).join("")}</section><a href="#/perfil/chamados" class="outline-button">Precisa de ajuda com o pedido?</a></div><aside class="summary-box"><h2>Resumo</h2>${order.shipping!==undefined?`<div><span>Subtotal</span><strong>${money(order.subtotal??order.total-order.shipping)}</strong></div><div><span>Frete</span><strong>${order.shipping===0?"Grátis":money(order.shipping)}</strong></div>`:""}<div class="summary-total"><span>Total</span><strong>${money(order.total)}</strong></div>${demoNote}</aside></div>`,"Detalhes e acompanhamento do pedido.","MINHA CONTA");
}
function profilePage(){
  const u=shopState.user;
  if(!u)return page("Meu Perfil",empty("Entre para ver seu perfil","Use uma conta fictícia para navegar por esta área.","#/login","Entrar"),"Sua área pessoal de demonstração.","MINHA CONTA");
  return page("Meu Perfil",`<div class="profile-layout"><nav class="profile-nav"><a href="#/perfil">Meus dados</a><a href="#/pedidos">Meus pedidos</a><a href="#/perfil/chamados">Meus chamados</a><a href="#/favoritos">Favoritos</a><button data-shop="logout">Sair da conta</button></nav><form id="profile-form" class="form-panel"><h2>Informações pessoais</h2><div class="form-grid">${field("Nome completo","name","text",u.name)}${field("E-mail","email","email",u.email)}${field("Telefone","phone","tel",u.phone||"",false)}${field("Cidade","city","text",u.city||"",false)}</div><button type="submit" class="return-button">Salvar alterações</button>${demoNote}</form></div>`,"Gerencie seus dados fictícios e navegue pelos pedidos.","MINHA CONTA");
}
function authPage(kind){
  const config={
    login:{eyebrow:"BEM-VINDA DE VOLTA",title:"Entrar na conta",button:"Entrar",fields:field("E-mail","email","email")+field("Senha","password","password"),links:'<a href="#/esqueci-senha">Esqueceu a senha?</a><a href="#/cadastro">Criar conta</a>'},
    cadastro:{eyebrow:"FAÇA PARTE",title:"Criar Conta",button:"Criar conta",fields:field("Nome completo","name")+field("E-mail","email","email")+field("Telefone","phone","tel","",false)+field("Senha","password","password"),links:'<a href="#/login">Já tenho uma conta</a>'},
    "esqueci-senha":{eyebrow:"RECUPERAR ACESSO",title:"Esqueceu a senha?",button:"Simular envio",fields:field("E-mail","email","email"),links:'<a href="#/login">Voltar ao login</a>'},
    "redefinir-senha":{eyebrow:"RECUPERAR ACESSO",title:"Criar Nova Senha",button:"Salvar senha de demonstração",fields:field("Nova senha","password","password")+field("Confirmar senha","confirm","password"),links:'<a href="#/login">Voltar ao login</a>'}
  }[kind];
  return `<main class="auth-page"><div class="auth-image"><span>Moda que valoriza quem você é.</span></div><div class="auth-side"><form id="auth-form" data-kind="${kind}" class="auth-card"><span class="eyebrow">${config.eyebrow}</span><h1>${config.title}</h1><p>Experimente este fluxo com dados fictícios.</p>${config.fields}<button type="submit" class="return-button full">${config.button}</button><div class="auth-links">${config.links}</div>${demoNote}</form></div></main>`;
}
function ticketsPage(){
  return page("Meus Chamados",`<div class="profile-layout"><nav class="profile-nav"><a href="#/perfil">Meu perfil</a><a href="#/pedidos">Meus pedidos</a><a href="#/central-de-ajuda">Abrir chamado</a></nav><div class="stack">${shopState.tickets.map(t=>`<a class="ticket-card" href="#/perfil/chamados/${t.id}"><div><span class="eyebrow">${t.id} · ${t.date}</span><h2>${t.subject}</h2></div><span class="status-pill">${t.status}</span></a>`).join("")}</div></div>`,"Acompanhe suas conversas com a loja.","ATENDIMENTO");
}
function ticketDetail(id,admin=false){
  const t=shopState.tickets.find(x=>x.id===id);
  if(!t)return page("Chamado não encontrado",empty("Chamado não encontrado","Volte à lista de atendimentos.","#/perfil/chamados","Meus chamados"));
  const back=admin?"#/painel-admin/chamados":"#/perfil/chamados";
  return page(`Chamado: ${t.subject}`,`<a class="back-link" href="${back}">← Voltar aos chamados</a><div class="chat-panel"><div class="chat-head"><span>${t.id}</span><span class="status-pill">${t.status}</span></div><div class="messages">${t.messages.map(m=>`<div class="message ${m.from==="Matsumura"?"staff":""}"><strong>${m.from}</strong><p>${safe(m.text)}</p></div>`).join("")}</div><form id="message-form" data-id="${t.id}"><input name="message" required placeholder="Escreva uma mensagem de demonstração"><button type="submit">Enviar</button></form></div>`,"Conversa ilustrativa de atendimento.","ATENDIMENTO");
}
function helpPage(){
  return page("Central de Ajuda",`<div class="help-grid"><article class="info-card"><h2>Pedidos</h2><p>Acompanhe o status dos pedidos na sua área pessoal.</p><a href="#/pedidos">Meus pedidos →</a></article><article class="info-card"><h2>Trocas e devoluções</h2><p>Veja como esta seção poderá orientar a cliente.</p><a href="#/trocas">Ver informações →</a></article><article class="info-card"><h2>Atendimento</h2><p>Abra uma conversa de demonstração para experimentar o fluxo.</p><a href="#/perfil/chamados">Meus chamados →</a></article></div><form id="ticket-form" class="form-panel help-form"><h2>Abrir chamado</h2>${field("Assunto","subject")}<label class="form-field"><span>Mensagem</span><textarea name="message" required></textarea></label><button type="submit" class="return-button">Enviar chamado de demonstração</button>${demoNote}</form>`,"Encontre informações e simule uma conversa com a loja.","ATENDIMENTO");
}
function policyPage(kind){
  const trade=kind==="trocas";
  return page(trade?"Trocas e Devoluções":"Política de Privacidade",`<div class="policy-layout"><section class="info-card"><h2>${trade?"Informações para a cliente":"Sobre esta demonstração"}</h2><p>${trade?"Esta página reproduz o espaço de orientação para trocas do projeto de referência. Prazos e condições reais deverão ser definidos pela Matsumura antes da publicação.":"Este protótipo guarda apenas dados de demonstração no armazenamento local deste navegador. Não há envio a servidor, API ou banco de dados."}</p><h2>${trade?"Como funciona o fluxo":"Dados de exemplo"}</h2><p>${trade?"A cliente poderá abrir um chamado, acompanhar a análise e consultar a solução pela área do perfil.":"Formulários de login, perfil, pedidos e atendimento simulam a experiência. Os dados podem ser apagados com a limpeza do armazenamento do navegador."}</p><a href="${trade?"#/central-de-ajuda":"#/perfil"}" class="return-button">${trade?"Abrir central de ajuda":"Ir para o perfil"}</a></section></div>`,"Conteúdo demonstrativo, sujeito à definição da loja.","INFORMAÇÕES");
}

function statusPage(kind){
  const data={
    "pedido-confirmado":["Pedido Confirmado","Seu pedido demonstrativo foi criado com sucesso.","#/pedidos","Ver meus pedidos"],
    "processando":["Processando pagamento","Esta tela representa o momento de confirmação do pagamento.","#/pagamento/sucesso","Ver sucesso"],
    "pagamento/sucesso":["Pagamento aprovado","O pagamento fictício foi aprovado na simulação.","#/pedidos","Ver pedido"],
    "pagamento/pendente":["Pagamento pendente","A confirmação demonstrativa ainda está em andamento.","#/pedidos","Acompanhar pedido"],
    "pagamento/falha":["Pagamento não aprovado","Este é um exemplo de retorno em caso de falha.","#/checkout","Tentar novamente"]
  }[kind];
  return page(data[0],`<div class="status-view"><span>✧</span><h2>${data[0]}</h2><p>${data[1]}</p><a href="${data[2]}" class="return-button">${data[3]}</a><div class="status-links"><a href="#/processando">Processando</a><a href="#/pagamento/sucesso">Sucesso</a><a href="#/pagamento/pendente">Pendente</a><a href="#/pagamento/falha">Falha</a></div>${demoNote}</div>`,"Etapa ilustrativa do fluxo de compra.","PEDIDO");
}

function adminFrame(title,content,subtitle="Gerenciamento demonstrativo"){
  return `<main class="container admin-page"><div class="admin-heading"><span class="eyebrow">PAINEL ADMINISTRATIVO · DEMONSTRAÇÃO</span><h1>${title}</h1><p>${subtitle}</p></div><div class="admin-layout"><nav class="admin-nav"><a href="#/painel-admin">Visão geral</a><a href="#/painel-admin/produtos">Produtos</a><a href="#/painel-admin/categorias">Categorias</a><a href="#/painel-admin/pedidos">Pedidos</a><a href="#/painel-admin/chamados">Chamados</a><a href="#/">Ver catálogo</a></nav><div class="admin-content">${content}</div></div></main>`;
}
function adminHome(){
  return adminFrame("Visão Geral",`<div class="stat-grid"><article><span>Produtos</span><strong>${items.length}</strong><a href="#/painel-admin/produtos">Gerenciar →</a></article><article><span>Pedidos</span><strong>${shopState.orders.length}</strong><a href="#/painel-admin/pedidos">Ver pedidos →</a></article><article><span>Categorias</span><strong>${shopState.categories.length}</strong><a href="#/painel-admin/categorias">Gerenciar →</a></article><article><span>Chamados</span><strong>${shopState.tickets.length}</strong><a href="#/painel-admin/chamados">Responder →</a></article></div><div class="info-card"><h2>Pedidos recentes</h2>${shopState.orders.slice(0,3).map(orderCard).join("")}</div>`);
}
function adminProducts(){
  return adminFrame("Produtos",`<div class="admin-toolbar"><p>${items.length} produtos de exemplo</p><a class="return-button" href="#/painel-admin/produtos/novo">Novo Produto</a></div><div class="admin-table-wrap"><table><thead><tr><th>Produto</th><th>Categoria</th><th>Preço</th><th>Destaque</th><th></th></tr></thead><tbody>${items.map(p=>`<tr><td><div class="table-product">${image(p.image,p.name)}<strong>${p.name}</strong></div></td><td>${p.category}</td><td>${money(p.price)}</td><td>${p.featured?"Sim":"Não"}</td><td><a href="#/painel-admin/produtos/${p.id}">Editar</a></td></tr>`).join("")}</tbody></table></div>`);
}
function productForm(id){
  const existing=id&&id!=="novo"?pById(id):null;
  return adminFrame(existing?"Editar Produto":"Novo Produto",`<form id="admin-product-form" data-id="${existing?.id||"novo"}" class="form-panel"><h2>Informações do produto</h2><div class="form-grid">${field("Nome","name","text",existing?.name||"")}<label class="form-field"><span>Categoria</span><select name="category">${shopState.categories.map(c=>option(c,c,existing?.category||"")).join("")}</select></label>${field("Preço","price","number",existing?.price||"",true)}${field("Preço anterior","oldPrice","number",existing?.oldPrice||"",false)}${field("Cor","color","text",existing?.color||"",false)}${field("Tamanhos (separados por vírgula)","sizes","text",existing?.sizes.join(", ")||"",false)}</div><label class="form-field"><span>Descrição</span><textarea name="description">${safe(existing?.description||"")}</textarea></label><label class="choice"><input type="checkbox" name="featured" ${existing?.featured?"checked":""}> Produto em destaque</label><button type="submit" class="return-button">Salvar produto</button>${demoNote}</form>`);
}
function adminCategories(){
  return adminFrame("Categorias",`<div class="admin-toolbar"><p>Organize o catálogo</p><a href="#/painel-admin/categorias/novo" class="return-button">Nova Categoria</a></div><div class="admin-table-wrap"><table><thead><tr><th>Nome</th><th>Produtos</th><th></th></tr></thead><tbody>${shopState.categories.map((c,i)=>`<tr><td><strong>${c}</strong></td><td>${items.filter(p=>p.category===c).length}</td><td><a href="#/painel-admin/categorias/${i}">Editar</a></td></tr>`).join("")}</tbody></table></div>`);
}
function categoryForm(id){
  const existing=id!=="novo"?shopState.categories[Number(id)]:null;
  return adminFrame(existing?"Editar Categoria":"Nova Categoria",`<form id="admin-category-form" data-id="${id}" class="form-panel"><h2>Dados da categoria</h2>${field("Nome da categoria","name","text",existing||"")}<button type="submit" class="return-button">Salvar categoria</button>${demoNote}</form>`);
}
function adminOrders(){
  return adminFrame("Pedidos",`<div class="stack">${shopState.orders.map(o=>`<article class="order-card"><div><span class="eyebrow">${o.id} · ${o.date}</span><h3>${o.lines.map(line=>pById(line.id)?.name).join(", ")}</h3><p>${money(o.total)}</p></div><div><label>Status<select data-shop="order-status" data-id="${o.id}">${["Pendente","Pago","Em trânsito","Entregue","Cancelado"].map(s=>option(s,s,o.status)).join("")}</select></label><a href="#/pedidos/${o.id}">Detalhes →</a></div></article>`).join("")}</div>`);
}
function adminTickets(){
  return adminFrame("Chamados de Clientes",`<div class="stack">${shopState.tickets.map(t=>`<a href="#/painel-admin/chamados/${t.id}" class="ticket-card"><div><span class="eyebrow">${t.id} · ${t.date}</span><h2>${t.subject}</h2></div><span class="status-pill">${t.status}</span></a>`).join("")}</div>`);
}
function adminTicketDetail(id){
  const t=shopState.tickets.find(x=>x.id===id);
  if(!t)return adminFrame("Chamado não encontrado",empty("Chamado não encontrado","Volte à lista.","#/painel-admin/chamados","Chamados"));
  return adminFrame(`Chamado: ${t.subject}`,`<div class="chat-panel"><div class="chat-head"><span>${t.id}</span><span class="status-pill">${t.status}</span></div><div class="messages">${t.messages.map(m=>`<div class="message ${m.from==="Matsumura"?"staff":""}"><strong>${m.from}</strong><p>${safe(m.text)}</p></div>`).join("")}</div><form id="message-form" data-id="${t.id}"><input name="message" required placeholder="Resposta demonstrativa"><button type="submit">Responder</button></form></div>`);
}

window.extraPage=function(current){
  if(current==="/favoritos")return favPage();
  if(current==="/carrinho")return cartPage();
  if(current==="/checkout")return checkoutPage();
  if(current==="/pedidos")return ordersPage();
  if(current.startsWith("/pedidos/"))return orderDetail(current.split("/")[2]);
  if(current==="/perfil")return profilePage();
  if(current==="/perfil/chamados")return ticketsPage();
  if(current.startsWith("/perfil/chamados/"))return ticketDetail(current.split("/")[3]);
  if(["/login","/cadastro","/esqueci-senha","/redefinir-senha"].includes(current))return authPage(current.slice(1));
  if(current==="/central-de-ajuda")return helpPage();
  if(["/trocas","/privacidade"].includes(current))return policyPage(current.slice(1));
  if(["/pedido-confirmado","/processando","/pagamento/sucesso","/pagamento/pendente","/pagamento/falha"].includes(current))return statusPage(current.slice(1));
  if(current==="/painel-admin")return adminHome();
  if(current==="/painel-admin/produtos")return adminProducts();
  if(current.startsWith("/painel-admin/produtos/"))return productForm(current.split("/")[3]);
  if(current==="/painel-admin/categorias")return adminCategories();
  if(current.startsWith("/painel-admin/categorias/"))return categoryForm(current.split("/")[3]);
  if(current==="/painel-admin/pedidos")return adminOrders();
  if(current==="/painel-admin/chamados")return adminTickets();
  if(current.startsWith("/painel-admin/chamados/"))return adminTicketDetail(current.split("/")[3]);
  return null;
};
function goDemo(route){location.hash=route;if(decodeURIComponent(location.hash.slice(1))===route)render()}
function flash(message){document.querySelector(".flash")?.remove();const el=document.createElement("div");el.className="flash";el.textContent=message;document.body.append(el);setTimeout(()=>el.remove(),2500)}
function updateCheckoutShipping(showError=false){
  const input=document.getElementById("checkout-zip");
  if(!input)return null;
  const quote=calculateDemoShipping(input.value,cartTotal());
  shippingState.calculated=!!quote;
  shippingState.zip=quote?.zip||"";
  if(quote)input.value=quote.zip;
  const result=document.getElementById("checkout-shipping-result");
  if(result)result.innerHTML=window.shippingResultHtml(quote,showError?"Informe um CEP válido com 8 dígitos.":"Digite seu CEP para calcular o frete ilustrativo.");
  const price=document.getElementById("checkout-shipping-price");
  if(price)price.textContent=quote?(quote.price===0?"Grátis":money(quote.price)):"Não calculado";
  const total=document.getElementById("checkout-total");
  if(total)total.textContent=money(cartTotal()+(quote?.price||0));
  return quote;
}
document.addEventListener("click",event=>{
  const button=event.target.closest("[data-shop]");
  if(!button)return;
  const action=button.dataset.shop,id=button.dataset.id,size=button.dataset.size;
  if(action==="favorite"){shopState.favorites=shopState.favorites.includes(id)?shopState.favorites.filter(x=>x!==id):[...shopState.favorites,id];saveShop();render(false);flash("Favoritos atualizados")}
  if(action==="add"){const chosen=document.getElementById("product-size")?.value||pById(id)?.sizes[0]||"Único";const line=shopState.cart.find(x=>x.id===id&&x.size===chosen);if(line)line.qty++;else shopState.cart.push({id,size:chosen,qty:1});saveShop();render(false);flash(`Produto adicionado à sacola${chosen==="Único"?"":" · tamanho "+chosen}`)}
  if(action==="shipping-checkout")updateCheckoutShipping(true);
  if(action==="qty"){const line=shopState.cart.find(x=>x.id===id&&x.size===size);if(line)line.qty+=Number(button.dataset.delta);shopState.cart=shopState.cart.filter(x=>x.qty>0);saveShop();render(false)}
  if(action==="remove"){shopState.cart=shopState.cart.filter(x=>!(x.id===id&&x.size===size));saveShop();render(false)}
  if(action==="logout"){shopState.user=null;saveShop();goDemo("/login")}
});
document.addEventListener("input",event=>{
  if(event.target.id==="checkout-zip")updateCheckoutShipping(false);
});
document.addEventListener("change",event=>{
  if(event.target.dataset.shop==="order-status"){const order=shopState.orders.find(x=>x.id===event.target.dataset.id);if(order)order.status=event.target.value;saveShop();flash("Status atualizado")}
});
document.addEventListener("submit",event=>{
  const form=event.target;
  if(!["product-shipping-form","checkout-form","auth-form","profile-form","ticket-form","message-form","admin-product-form","admin-category-form"].includes(form.id))return;
  event.preventDefault();
  const data=Object.fromEntries(new FormData(form));
  if(form.id==="product-shipping-form"){
    const quote=calculateDemoShipping(data.zip,pById(form.dataset.id)?.price||0);
    shippingState.calculated=!!quote;
    shippingState.zip=quote?.zip||"";
    document.getElementById("product-shipping-result").innerHTML=window.shippingResultHtml(quote,"Informe um CEP válido com 8 dígitos.");
    if(quote)form.querySelector("input[name=zip]").value=quote.zip;
  }
  if(form.id==="checkout-form"){
    const quote=calculateDemoShipping(data.zip,cartTotal());
    if(!quote){updateCheckoutShipping(true);form.querySelector("input[name=zip]").focus();return}
    shippingState.calculated=true;
    shippingState.zip=quote.zip;
    const payment=data.payment;
    const subtotal=cartTotal();
    const order={id:"MT-"+Math.floor(1000+Math.random()*8999),date:new Date().toLocaleDateString("pt-BR"),status:payment==="boleto"?"Pendente":"Pago",lines:shopState.cart.map(x=>({...x})),subtotal,shipping:quote.price,zip:quote.zip,total:roundMoney(subtotal+quote.price)};
    shopState.orders.unshift(order);shopState.cart=[];saveShop();goDemo(payment==="boleto"?"/pagamento/pendente":"/pedido-confirmado");
  }
  if(form.id==="auth-form"){const kind=form.dataset.kind;if(kind==="login"){shopState.user=shopState.user||{name:data.email.split("@")[0],email:data.email,phone:"",city:""};saveShop();goDemo("/perfil")}if(kind==="cadastro"){shopState.user={name:data.name,email:data.email,phone:data.phone||"",city:""};saveShop();goDemo("/perfil")}if(kind==="esqueci-senha"){goDemo("/redefinir-senha")}if(kind==="redefinir-senha"){if(data.password!==data.confirm){flash("As senhas não conferem");return}flash("Senha de demonstração atualizada");goDemo("/login")}}
  if(form.id==="profile-form"){shopState.user={...shopState.user,...data};saveShop();render(false);flash("Perfil atualizado")}
  if(form.id==="ticket-form"){const ticket={id:"CH-"+Math.floor(200+Math.random()*800),subject:data.subject,status:"Aberto",date:new Date().toLocaleDateString("pt-BR"),messages:[{from:"Cliente",text:data.message}]};shopState.tickets.unshift(ticket);saveShop();goDemo("/perfil/chamados/"+ticket.id)}
  if(form.id==="message-form"){const ticket=shopState.tickets.find(t=>t.id===form.dataset.id);if(ticket){ticket.messages.push({from:location.hash.includes("/painel-admin/")?"Matsumura":"Cliente",text:data.message});ticket.status="Respondido";saveShop();render(false)}}
  if(form.id==="admin-product-form"){const id=form.dataset.id;const p=id==="novo"?{id:"item-"+Date.now(),image:"vestido.webp"}:pById(id);if(!p)return;Object.assign(p,{name:data.name,category:data.category,price:Number(data.price),oldPrice:data.oldPrice?Number(data.oldPrice):undefined,color:data.color||"Variada",sizes:data.sizes?data.sizes.split(",").map(x=>x.trim()).filter(Boolean):["Único"],description:data.description||"",featured:!!data.featured});if(id==="novo")items.push(p);saveProducts();goDemo("/painel-admin/produtos")}
  if(form.id==="admin-category-form"){const index=form.dataset.id;if(index==="novo")shopState.categories.push(data.name);else shopState.categories[Number(index)]=data.name;saveShop();goDemo("/painel-admin/categorias")}
});
function saveProducts(){localStorage.setItem("matsumura-product-overrides",JSON.stringify(items))}
