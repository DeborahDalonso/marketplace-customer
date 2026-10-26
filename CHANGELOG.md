# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).
Versionamento semântico.

## [1.0.0] - 2026-10-26

### Added

- Home como landing: busca no hero, categorias, destaques e "como funciona".
- Lista de produtos com busca, filtro por categoria, paginação, estado vazio e skeleton; parâmetros na URL.
- Detalhe do produto com seletor de quantidade e registro de visualização (`POST /products/:id/views`) sem bloquear a tela.
- Carrinho em localStorage com drawer, página própria e totais em BRL.
- Login e cadastro contra o `marketplace-auth`, com validação no cliente e erro por campo.
- Checkout restrito a quem está logado, Pix ou cartão, `POST /orders` e tela do pedido pendente.
- Meus pedidos com badge de status e detalhe que consulta a cada 5 s enquanto a saga não termina.
- Toasts, tema claro e escuro com toggle persistido, layout responsivo até 360 px.
- Todo texto da interface em `src/i18n/pt-BR.ts`.
- Modo mock (`VITE_USE_MOCKS=true`) com catálogo, auth e pedidos em memória que avançam sozinhos na saga.
- Testes com Vitest e Testing Library para format, validate, useCart, http, ProductCard e Checkout.
- Dockerfile multi-stage com Nginx e fallback de SPA; workflow de CI com lint, testes e build.
