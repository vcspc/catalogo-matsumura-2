const items = [
  {id:"blazer",name:"Blazer Alfaiataria Vinho",category:"Roupas",price:389.9,oldPrice:449.9,image:"blazer.webp",featured:true,color:"Vinho",sizes:["P","M","G"],description:"Uma peça de presença marcante para composições elegantes e cheias de personalidade."},
  {id:"vestido",name:"Vestido Midi Essência",category:"Roupas",price:329.9,image:"vestido.webp",featured:true,color:"Off-white",sizes:["P","M","G"],description:"Leveza e delicadeza em uma silhueta atemporal para momentos especiais."},
  {id:"bolsa",name:"Bolsa Couro Caramelo",category:"Bolsas",price:279.9,image:"bolsa.webp",featured:false,color:"Caramelo",sizes:["Único"],description:"O complemento versátil que acompanha sua rotina com elegância."},
  {id:"scarpin",name:"Scarpin Clássico Preto",category:"Calçados",price:259.9,oldPrice:299.9,image:"scarpin.webp",featured:true,color:"Preto",sizes:["35","36","37","38","39"],description:"Um clássico para elevar o look com equilíbrio e confiança."},
  {id:"calca",name:"Calça Pantalona Areia",category:"Roupas",price:299.9,image:"calca.webp",featured:false,color:"Areia",sizes:["P","M","G"],description:"Alfaiataria confortável, feita para expressar sua presença."},
  {id:"brincos",name:"Argolas Douradas Aura",category:"Acessórios",price:119.9,image:"brincos.webp",featured:true,color:"Dourado",sizes:["Único"],description:"Um toque de luz para finalizar a produção de forma natural."}
];
try{const saved=JSON.parse(localStorage.getItem("matsumura-product-overrides"));if(Array.isArray(saved)&&saved.length)items.splice(0,items.length,...saved)}catch{}
const groups = ["Roupas","Calçados","Bolsas","Acessórios"];
const money = value => value.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const route = () => decodeURIComponent(location.hash.slice(1) || "/");
const path = () => route().split("?")[0];
const qs = () => new URLSearchParams(route().split("?")[1] || "");
const icon = {
  search:'<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
  grid:'<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
  list:'<svg viewBox="0 0 24 24"><path d="M8 5h13M8 12h13M8 19h13M3 5h1M3 12h1M3 19h1"/></svg>',
  filter:'<svg viewBox="0 0 24 24"><path d="M4 7h16M7 12h10M10 17h4"/></svg>',
  arrow:'<svg viewBox="0 0 24 24"><path d="M4 12h15m-6-6 6 6-6 6"/></svg>',
  back:'<svg viewBox="0 0 24 24"><path d="M20 12H5m6 6-6-6 6-6"/></svg>',
  menu:'<svg viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
  close:'<svg viewBox="0 0 24 24"><path d="M5 5 19 19M19 5 5 19"/></svg>',
  heart:'<svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></svg>',
  bag:'<svg viewBox="0 0 24 24"><path d="M4 8h16l-1 13H5L4 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></svg>',
  user:'<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/></svg>'
};
let view = "grid";
let showFilters = false;
let showMenu = false;
const image = (file,alt,klass="") => `<img src="assets/${file}" alt="${alt}" class="${klass}" loading="lazy">`;
const option = (value,label,current) => `<option value="${value}" ${current===value?"selected":""}>${label}</option>`;
const fieldValue = (params,key) => (params.get(key)||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

function header(){
  return `<div class="demo-bar">CATÁLOGO DE APRESENTAÇÃO <span>·</span> Produtos e valores ilustrativos</div>
    <header class="site-header"><div class="container header-inner">
      <a href="#/" class="brand" aria-label="Matsumura — catálogo">${image("logo-matsumura.png","Matsumura Moda & Estilo")}</a>
      <nav class="top-nav" aria-label="Navegação principal"><a href="#/" class="${path()==="/"||path()==="/catalogo"?"active":""}">Catálogo</a><a href="#/sobre" class="${path()==="/sobre"?"active":""}">Nossa história</a><a href="#/central-de-ajuda">Ajuda</a></nav>
      <div class="shop-actions"><a href="#/favoritos" aria-label="Favoritos">${icon.heart}<b>${window.shopState?.favorites.length||""}</b></a><a href="#/carrinho" aria-label="Carrinho">${icon.bag}<b>${window.cartCount?.()||""}</b></a><a href="#/perfil" aria-label="Perfil">${icon.user}</a></div>
      <button class="menu-button" data-action="menu" aria-label="${showMenu?"Fechar":"Abrir"} menu">${showMenu?icon.close:icon.menu}</button>
    </div>
    <nav class="category-nav ${showMenu?"open":""}" aria-label="Categorias"><div class="container category-links"><a href="#/">Todos os produtos</a>${groups.map(g=>`<a href="#/catalogo?categoria=${encodeURIComponent(g)}">${g}</a>`).join("")}<a href="#/sobre" class="mobile-history">Nossa história</a><a href="#/favoritos" class="mobile-history">Favoritos</a><a href="#/carrinho" class="mobile-history">Carrinho</a><a href="#/perfil" class="mobile-history">Meu perfil</a><a href="#/central-de-ajuda" class="mobile-history">Ajuda</a></div></nav>
    </header>`;
}

function footer(){
  return `<footer class="site-footer"><div class="container footer-main"><div>${image("logo-matsumura.png","Matsumura Moda & Estilo","footer-logo")}<p>Moda, autoestima e acolhimento em cada escolha.</p></div><nav aria-label="Rodapé"><a href="#/">Catálogo</a><a href="#/sobre">Nossa história</a><a href="#/favoritos">Favoritos</a><a href="#/carrinho">Carrinho</a><a href="#/perfil">Meu perfil</a></nav><nav aria-label="Informações"><a href="#/central-de-ajuda">Central de ajuda</a><a href="#/trocas">Trocas e devoluções</a><a href="#/privacidade">Privacidade</a><a href="#/painel-admin">Painel de demonstração</a></nav><span>Concórdia do Pará · Pará</span></div><div class="container footer-bottom">Protótipo para apresentação · Produtos, preços e fluxos de compra fictícios</div></footer>`;
}

function filteredItems(params){
  const search=(params.get("busca")||"").trim().toLocaleLowerCase("pt-BR");
  let result=items.filter(item=>{
    if(search && !(item.name+" "+item.category).toLocaleLowerCase("pt-BR").includes(search)) return false;
    if(params.get("categoria") && item.category!==params.get("categoria")) return false;
    if(params.get("preco_min") && item.price<Number(params.get("preco_min"))) return false;
    if(params.get("preco_max") && item.price>Number(params.get("preco_max"))) return false;
    if(params.get("tamanho") && !item.sizes.includes(params.get("tamanho"))) return false;
    if(params.get("cor") && item.color!==params.get("cor")) return false;
    if(params.get("destaque")==="1" && !item.featured) return false;
    return true;
  });
  const sort=params.get("ordenar")||"recentes";
  if(sort==="preco-asc") result.sort((a,b)=>a.price-b.price);
  if(sort==="preco-desc") result.sort((a,b)=>b.price-a.price);
  if(sort==="nome-asc") result.sort((a,b)=>a.name.localeCompare(b.name,"pt-BR"));
  if(sort==="nome-desc") result.sort((a,b)=>b.name.localeCompare(a.name,"pt-BR"));
  return result;
}

function sidebar(params){
  const sizes=["P","M","G","35","36","37","38","39","Único"];
  const colors=["Vinho","Off-white","Caramelo","Preto","Areia","Dourado"];
  return `<aside class="sidebar"><button class="mobile-filter-toggle" data-action="filters">${icon.filter} Filtros <span>${showFilters?"−":"+"}</span></button>
    <form id="filter-form" class="filters ${showFilters?"open":""}">
      <div class="filter-section"><h2>Buscar</h2><div class="search-field">${icon.search}<input name="busca" type="search" placeholder="Nome do produto..." value="${fieldValue(params,"busca")}" aria-label="Buscar produto"></div></div>
      <div class="filter-section"><h2>Categoria</h2><select name="categoria" aria-label="Categoria">${option("","Todas as categorias",params.get("categoria")||"")}${groups.map(g=>option(g,g,params.get("categoria")||"")).join("")}</select></div>
      <div class="filter-section"><h2>Preço</h2><div class="price-fields"><input name="preco_min" type="number" min="0" step="1" placeholder="Preço mínimo" aria-label="Preço mínimo" value="${fieldValue(params,"preco_min")}"><input name="preco_max" type="number" min="0" step="1" placeholder="Preço máximo" aria-label="Preço máximo" value="${fieldValue(params,"preco_max")}"></div></div>
      <div class="filter-section"><h2>Tamanho</h2><select name="tamanho" aria-label="Tamanho">${option("","Todos os tamanhos",params.get("tamanho")||"")}${sizes.map(s=>option(s,s,params.get("tamanho")||"")).join("")}</select></div>
      <div class="filter-section"><h2>Cor</h2><select name="cor" aria-label="Cor">${option("","Todas as cores",params.get("cor")||"")}${colors.map(c=>option(c,c,params.get("cor")||"")).join("")}</select></div>
      <div class="filter-section feature-filter"><label><input type="checkbox" name="destaque" value="1" ${params.get("destaque")==="1"?"checked":""}><span>Apenas em destaque</span></label></div>
      <button type="submit" class="apply-filters">Aplicar filtros ${icon.arrow}</button><a href="#/" class="clear-filters">Limpar filtros</a>
    </form></aside>`;
}

function card(item){
  return `<article class="product-card"><a class="product-photo" href="#/produto/${item.id}" aria-label="Ver ${item.name}">${image(item.image,item.name)}${item.featured?'<span class="product-badge">Destaque</span>':""}<span class="photo-overlay">Ver detalhes ${icon.arrow}</span></a><button class="card-favorite ${window.shopState?.favorites.includes(item.id)?"active":""}" data-shop="favorite" data-id="${item.id}" aria-label="${window.shopState?.favorites.includes(item.id)?"Remover dos":"Adicionar aos"} favoritos">♡</button><div class="product-text"><span class="product-category">${item.category}</span><a href="#/produto/${item.id}" class="product-name">${item.name}</a><div class="product-price"><strong>${money(item.price)}</strong>${item.oldPrice?`<s>${money(item.oldPrice)}</s>`:""}</div><a class="product-detail-link" href="#/produto/${item.id}">Ver detalhes ${icon.arrow}</a></div></article>`;
}

function catalog(){
  const params=qs();
  const products=filteredItems(params);
  return `<main class="container catalog-page"><div class="catalog-heading"><div><span class="eyebrow">CURADORIA MATSUMURA</span><h1>Catálogo de Produtos</h1><p>${products.length} produto${products.length===1?"":"s"} encontrado${products.length===1?"":"s"}</p></div><a href="#/sobre" class="history-link">Conheça nossa história ${icon.arrow}</a></div>
    <div class="catalog-layout">${sidebar(params)}<section class="catalog-content" aria-label="Produtos"><div class="catalog-controls"><select id="sort" aria-label="Ordenar produtos">${option("recentes","Mais recentes",params.get("ordenar")||"recentes")}${option("preco-asc","Menor preço",params.get("ordenar")||"recentes")}${option("preco-desc","Maior preço",params.get("ordenar")||"recentes")}${option("nome-asc","Nome A-Z",params.get("ordenar")||"recentes")}${option("nome-desc","Nome Z-A",params.get("ordenar")||"recentes")}</select><div class="view-controls"><span>Visualização</span><button data-action="view" data-view="grid" aria-label="Visualizar em grade" class="${view==="grid"?"active":""}">${icon.grid}</button><button data-action="view" data-view="list" aria-label="Visualizar em lista" class="${view==="list"?"active":""}">${icon.list}</button></div></div>
    ${products.length?`<div class="products-grid ${view==="list"?"list-view":""}">${products.map(card).join("")}</div>`:`<div class="no-results"><h2>Nenhum produto encontrado</h2><p>Tente ajustar os filtros ou buscar por outros termos.</p><a href="#/">Limpar filtros</a></div>`}
    </section></div></main>`;
}

function detail(id){
  const item=items.find(x=>x.id===id);
  if(!item) return catalog();
  return `<main class="container detail-page"><a href="#/" class="back-link">${icon.back} Voltar ao catálogo</a><div class="detail-layout"><div class="detail-photo">${image(item.image,item.name)}</div><div class="detail-content"><span class="eyebrow">${item.category} · CURADORIA MATSUMURA</span><h1>${item.name}</h1><div class="detail-price"><strong>${money(item.price)}</strong>${item.oldPrice?`<s>${money(item.oldPrice)}</s>`:""}</div><p>${item.description}</p><dl><div><dt>Cor</dt><dd>${item.color}</dd></div><div><dt>Tamanhos</dt><dd>${item.sizes.join(" · ")}</dd></div></dl><label class="detail-size-label">Tamanho para a simulação<select id="product-size">${item.sizes.map(size=>`<option value="${size}">${size}</option>`).join("")}</select></label><div class="detail-buttons"><button class="return-button" data-shop="add" data-id="${item.id}">Adicionar ao carrinho</button><button class="outline-button" data-shop="favorite" data-id="${item.id}">♡ Favorito</button></div><div class="catalog-notice">Produto e preço ilustrativos. A compra é apenas uma simulação.</div></div></div><section class="related"><h2>Você também pode gostar</h2><div class="products-grid">${items.filter(x=>x.id!==id).slice(0,3).map(card).join("")}</div></section></main>`;
}

function about(){
  return `<main class="about-page"><div class="about-hero"><div class="container"><span class="eyebrow">SOBRE A MATSUMURA</span><h1>Moda que começa<br>de dentro para <em>fora.</em></h1><p>Uma história de coragem, cuidado e da certeza de que toda mulher merece se sentir valorizada.</p></div></div><section class="container about-story"><div><span class="eyebrow">NOSSA HISTÓRIA</span><h2>Um sonho que abriu caminhos em Concórdia do Pará.</h2></div><div><p>Há cerca de 30 anos, Inalda Matsumura chegou a Concórdia do Pará trazendo de Belém um olhar sensível para a moda. Ela acreditava que viver no interior nunca deveria limitar o acesso ao estilo, à sofisticação e à autoestima.</p><p>Mesmo ouvindo que sua ideia não daria certo, transformou essa convicção em atitude. A primeira Matsumura nasceu dentro do supermercado de seu pai, com vitrine, curadoria de produtos e uma forma especial de receber cada pessoa.</p><p>Mais do que vender peças, Inalda queria criar um lugar onde mulheres pudessem se reconhecer, experimentar novas possibilidades e sair se sentindo melhor do que chegaram.</p></div></section><div class="about-quote"><div class="container"><span>“</span><blockquote>Elegância não está no excesso, mas no equilíbrio e na forma como a imagem comunica quem somos.</blockquote><small>ESSÊNCIA MATSUMURA</small></div></div><section class="container values"><span class="eyebrow">O QUE NOS MOVE</span><h2>Uma experiência além da compra</h2><div class="value-grid"><article><b>01</b><h3>Acolhimento</h3><p>Ouvir e cuidar de cada pessoa com atenção verdadeira.</p></article><article><b>02</b><h3>Autoestima</h3><p>Ajudar mulheres a reconhecer sua beleza, força e presença.</p></article><article><b>03</b><h3>Moda com propósito</h3><p>Escolhas que expressam identidade, harmonia e confiança.</p></article><article><b>04</b><h3>Elegância para todas</h3><p>Bom gosto e estilo também pertencem ao interior e à vida real.</p></article></div></section><div class="about-cta container"><h2>Conheça as peças da nossa curadoria.</h2><a href="#/" class="return-button">Voltar ao catálogo ${icon.arrow}</a></div></main>`;
}

function render(scroll=true){
  const current=path();
  const extra=window.extraPage?.(current);
  const page=extra??(current==="/sobre"?about():current.startsWith("/produto/")?detail(current.split("/")[2]):catalog());
  document.getElementById("app").innerHTML=header()+page+footer();
  document.title=(current==="/sobre"?"Nossa história":current.startsWith("/produto/")?"Produto":"Catálogo")+" | Matsumura Moda & Estilo";
  if(scroll) window.scrollTo(0,0);
}
function applyForm(){
  const form=document.getElementById("filter-form");
  if(!form) return;
  const params=new URLSearchParams(new FormData(form));
  for(const [key,value] of [...params]) if(!String(value).trim()) params.delete(key);
  const sort=document.getElementById("sort")?.value||"recentes";
  if(sort!=="recentes") params.set("ordenar",sort); else params.delete("ordenar");
  const query=params.toString();
  history.replaceState(null,"",query?"#/catalogo?"+query:"#/");
  render(false);
}
document.addEventListener("click",event=>{
  const control=event.target.closest("[data-action]");
  if(!control) return;
  const action=control.dataset.action;
  if(action==="menu"){showMenu=!showMenu;render(false)}
  if(action==="filters"){showFilters=!showFilters;render(false)}
  if(action==="view"){view=control.dataset.view;render(false)}
});
document.addEventListener("submit",event=>{if(event.target.id==="filter-form"){event.preventDefault();applyForm()}});
document.addEventListener("change",event=>{
  if(event.target.closest("#filter-form")) applyForm();
  if(event.target.id==="sort"){const params=qs();if(event.target.value==="recentes")params.delete("ordenar");else params.set("ordenar",event.target.value);history.replaceState(null,"",params.size?"#/catalogo?"+params.toString():"#/");render(false)}
});
window.addEventListener("hashchange",()=>{showMenu=false;render()});
render();
