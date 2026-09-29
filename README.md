# Catálogo Matsumura Moda & Estilo

Protótipo navegável da Matsumura com as páginas do projeto Street Side. O catálogo permanece como entrada, com filtros na lateral, busca, ordenação e visualização em grade ou lista. O conteúdo institucional está em “Nossa história”.

## Visualizar

**Amostra online:** https://vcspc.github.io/catalogo-matsumura/

Abra `index.html` em um navegador ou sirva a pasta localmente:

```powershell
python -m http.server 4173
```

Depois acesse `http://localhost:4173`.

## Escopo

- Catálogo como página inicial, sem seção de início.
- Filtros por nome, categoria, faixa de preço, tamanho, cor e destaque.
- Ordenação e alternância entre grade e lista.
- Detalhe de produto, favoritos, carrinho, checkout, pedidos e estados de pagamento.
- Login, cadastro, recuperação de senha, perfil e chamados de atendimento.
- Central de ajuda, trocas, privacidade e página “Nossa história”.
- Painel administrativo com visão geral, produtos, categorias, pedidos e chamados.
- Produtos, preços e fotografias de demonstração.

Não há banco de dados, API, autenticação real nem pagamento. Os fluxos usam `localStorage` no navegador para manter favoritos, carrinho, perfil, pedidos, chamados e alterações demonstrativas no painel. As rotas usam `#`, então o protótipo funciona mesmo aberto como arquivo local.

## Arquivos principais

- `index.html`: estrutura base.
- `catalog.css`: visual responsivo com a identidade Matsumura.
- `shop.css`: estilos das páginas de compra, conta, suporte e administração.
- `catalog.js`: catálogo, produtos, identidade visual e filtros.
- `shop.js`: páginas adicionais e interações locais.
- `assets/`: logo extraído do PDF fornecido e fotografias ilustrativas geradas para o protótipo.
