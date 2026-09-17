# Soares Advocacia — site institucional

Site estático (HTML, CSS e JavaScript puros, sem build) de escritório de advocacia com atuação
em **remoção de servidor público** e **inventário extrajudicial e judicial**.

## Estrutura

```
index.html                     Página inicial (áreas, método, FAQ, contato)
remocao-servidor-publico.html  Remoção: modalidades, requisitos, prova, via judicial
inventario.html                Inventário: vias, prazos, documentos, ITCMD, comparativo
politica-de-privacidade.html   LGPD
robots.txt / sitemap.xml       SEO
assets/css/styles.css          Folha de estilos única
assets/js/main.js              Menu, FAQ, validação e envio do formulário
assets/img/favicon.svg         Ícone
```

## Como visualizar localmente

Abrir `index.html` no navegador já funciona. Para servir por HTTP:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## O que personalizar antes de publicar

Os dados abaixo estão como **espaços reservados** e aparecem em todas as páginas.
Um `grep` localiza cada ocorrência:

| Item | Valor atual | Onde |
|---|---|---|
| Nome do escritório | `Soares Advocacia` | todas as páginas |
| Número da OAB | `OAB/UF 00.000` | rodapé de todas as páginas |
| E-mail | `contato@soaresadvocacia.com.br` | páginas + `assets/js/main.js` |
| Telefone | `(00) 0000-0000` / `tel:+550000000000` | páginas |
| WhatsApp | `550000000000` | botão flutuante + `assets/js/main.js` |
| Endereço | `Rua Exemplo, 000, sala 00` | páginas |
| Domínio | `www.soaresadvocacia.com.br` | `canonical`, Open Graph, `sitemap.xml`, `robots.txt` |

Substituição em lote (revise antes de rodar):

```bash
grep -rl "soaresadvocacia.com.br" . --include="*.html" --include="*.xml" --include="*.txt" --include="*.js" \
  | xargs sed -i 's/soaresadvocacia\.com\.br/SEUDOMINIO.com.br/g'
```

## Formulário de contato

Sem back-end, o formulário valida os campos e monta a mensagem:

- **Enviar por e-mail** — abre o cliente de e-mail do visitante com o texto pronto (`mailto:`);
- **Enviar por WhatsApp** — abre o WhatsApp com a mesma mensagem.

Para receber as mensagens direto na caixa de entrada, preencha `endpoint` em
`assets/js/main.js` com a URL de um serviço de formulários (Formspree, Basin, Netlify Forms etc.).
Com o `endpoint` definido, o envio passa a ser feito por `fetch` em segundo plano, com mensagem de
confirmação na própria página.

```js
var CONFIG = {
  email: 'contato@seudominio.com.br',
  whatsapp: '5511999999999',
  endpoint: 'https://formspree.io/f/xxxxxxx'
};
```

## Publicação

Por ser estático, funciona em qualquer hospedagem: Netlify, Vercel, Cloudflare Pages, GitHub Pages
ou hospedagem tradicional via FTP. Basta subir os arquivos preservando a estrutura de pastas.

## Design

Paleta sóbria, apropriada ao setor:

| Token | Cor | Uso |
|---|---|---|
| `--ink` | `#0f1b26` | azul-petróleo escuro: topo, rodapé, títulos |
| `--graphite` | `#33414f` | textos de apoio |
| `--bronze` | `#8a6f45` | acento discreto (fios, ícones, foco) |
| `--sand` | `#f0ece4` | faixa alternada |
| `--bg` | `#f6f7f9` | fundo de seções |

Tipografia: *Source Serif 4* nos títulos e *Inter* no texto corrido, com fallback para fontes do
sistema. Sem animações chamativas, sem carrossel e sem imagens de banco de imagens — a sobriedade
é o próprio recurso visual.

Acessibilidade: navegação por teclado, link de pulo para o conteúdo, foco visível, rótulos
associados, `aria-live` no retorno do formulário e respeito a `prefers-reduced-motion`.

## Conformidade com as normas da OAB

O conteúdo foi redigido em tom informativo, sem promessa de resultado, sem menção a valores de
honorários e sem elementos de captação de clientela, observando o Código de Ética e Disciplina da
OAB e o Provimento nº 205/2021 do Conselho Federal da OAB. Os textos jurídicos são de caráter
geral — **revise-os com o advogado responsável antes de publicar**, especialmente os trechos sobre
regimes estaduais e municipais, alíquotas e prazos, que variam por localidade e mudam com
frequência.
