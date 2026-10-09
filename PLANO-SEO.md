# Plano de posicionamento no Google

Última revisão: outubro de 2026.

## O que significa "primeiro lugar"

Não existe primeiro lugar no Google em abstrato: existe primeiro lugar **para uma
busca específica**. A estratégia inteira depende de escolher buscas que o escritório
pode vencer, em vez de disputar termos genéricos com quem tem dez anos de site.

**Alvos realistas (3 a 6 meses)** — busca específica, pouca concorrência boa,
e quem busca já tem o problema na mão:

| Busca | Página responsável |
|---|---|
| remoção de servidor negada ausência de interesse | `remocao-negada-interesse-da-administracao.html` |
| remoção para acompanhar cônjuge servidor | `remocao-servidor-publico.html` |
| defesa em processo administrativo disciplinar | `pad-sindicancia-defesa-servidor.html` |
| sindicância ou PAD diferença | `pad-sindicancia-defesa-servidor.html` |
| prazo inventário DF multa ITCD | `prazo-inventario-multa-itcd-df.html` |
| pagamento ITCMD inventário cartório | `pagamento-itcmd-inventario-judicial-extrajudicial.html` |

**Alvos de médio prazo (6 a 12 meses)** — exigem autoridade acumulada:
advogado servidor público Brasília; advogado inventário Brasília;
advogado direito administrativo DF.

**Fora do alcance, e tudo bem**: "advogado", "advogado Brasília". São disputados
por bancas com orçamento de marketing e anos de histórico. Perseguir isso é gastar
energia onde não há retorno.

## Fase 0 — Esta semana

Nada aqui depende de tempo de maturação. É o que está parado e destrava o resto.

- [ ] **Google Meu Negócio** — cadastrar com o endereço do Lago Norte, categoria
      principal coerente com a atuação (procurar `direito administrativo`,
      `inventário`, `sucessões`; "Advogado" genérico se nenhuma específica existir).
      **Nunca** categorias que o escritório não atende. Marcar "atende no endereço"
      e avaliar ocultar o endereço no mapa, por ser residencial.
- [ ] **Search Console** — confirmar que o sitemap foi lido; solicitar indexação das
      páginas principais pela barra "Inspecionar qualquer URL".
- [ ] **Analytics** — marcar `contato_whatsapp`, `envio_formulario` e
      `contato_telefone` como conversão, em Administrador → Eventos.
- [ ] **E-mail no domínio** — criar `contato@soareseribeiro.adv.br`; o MX entra no
      Registro.br e o endereço volta ao formulário do site.

## Fase 1 — Meses 1 e 2: conteúdo

O que ranqueia é a página, não o site. Cada texto novo é mais uma busca disputada.

- [ ] Rotina semanal rodando (já ativa, às quartas) — 8 artigos no período.
- [ ] Publicar o artigo do Jornal de Brasília, com crédito e link para a edição.
- [ ] Revisar os artigos automáticos quando a notificação chegar. Texto errado
      sob a inscrição de vocês é risco disciplinar, não só erro de marketing.

## Fase 2 — Meses 2 a 4: links de outros sites

É o sinal mais forte que existe e o único que depende de esforço, não de espera.

- [ ] Perfil completo no JusBrasil, com link para o site.
- [ ] Republicar artigos em portais jurídicos (JusBrasil, Migalhas, ConJur), sempre
      com link de volta para a página correspondente aqui.
- [ ] Perfil na OAB/DF e em comissões de que participem.
- [ ] Assinatura de e-mail e perfis profissionais com o endereço do site.
- [ ] **Nunca comprar links.** É violação das diretrizes do Google e derruba o site.

## Fase 3 — Meses 3 a 6: medir e concentrar

A partir daqui as decisões deixam de ser palpite.

- [ ] No Search Console, abrir **Desempenho** e listar as buscas em que o site já
      aparece, com posição média.
- [ ] Para cada busca entre a 5ª e a 20ª posição, aprofundar a página existente em
      vez de criar outra: é mais barato subir do 8º para o 3º do que nascer do zero.
- [ ] Reordenar a fila de `CONTEUDO.md` conforme o que a busca real mostrar.

## Como saber se está funcionando

Olhar uma vez por mês, nesta ordem:

1. **Search Console → Desempenho**: número de buscas em que aparece, e posição
   média. É o indicador que se move primeiro.
2. **Analytics → conversões**: quantos contatos o site gerou. É o que importa.
3. **Google Meu Negócio**: quantas pessoas pediram rota ou ligaram pela ficha.

Visitas totais são o indicador menos útil. Dez visitas de quem teve remoção negada
valem mais que mil de curiosos.

## Links patrocinados (Google Ads)

### O que anúncio faz e o que não faz

Anúncio e resultado orgânico são espaços separados no Google. Pagar **não** melhora
a posição natural de nenhuma página, não acelera a indexação e não acumula nada:
no dia em que o investimento para, a visibilidade acaba. Anúncio aluga presença;
o trabalho das fases acima constrói posição que permanece.

Isso também o distingue de tráfego artificial — bots ou visitas compradas —, que
não é publicidade, não funciona, polui a medição e pode gerar penalização. Essa
prática está vedada na seção anterior e assim permanece.

### A questão disciplinar

**Confirmar com a Comissão de Publicidade da OAB/DF antes de investir.** As fontes
consultadas convergem no sentido de que o Provimento nº 205/2021 do CFOAB admite o
impulsionamento de **conteúdo informativo**, com moderação e discrição, e veda o
anúncio que ofereça serviços de forma ostensiva, prometa resultado, mencione
honorários ou configure captação direta de clientela. Não foi possível conferir o
texto oficial do provimento na fonte primária, e a responsabilidade disciplinar é
dos advogados responsáveis.

Regra prática que decorre disso: **o anúncio pode levar a um texto que informa; não
pode ser uma oferta de serviço.**

### Critérios, se a decisão for anunciar

- **Destino**: os artigos, nunca a página inicial com chamada para contratação.
- **Buscas**: específicas e de alta intenção — "remoção de servidor negada",
  "defesa em PAD", "prazo de inventário DF" —, nunca termos genéricos como
  "advogado Brasília", disputados por bancas com orçamento muito maior e onde o
  clique é caro e desqualificado.
- **Orçamento**: limitado e com teto diário definido desde o primeiro dia.
- **Medição**: já instalada. Os eventos `contato_whatsapp`, `envio_formulario` e
  `contato_telefone` permitem apurar quantos contatos cada real gerou. Sem isso,
  não há como saber se a campanha se paga.
- **Texto do anúncio**: informativo, sem superlativo, sem promessa, sem valores.

### Ordem recomendada

1. **Google Meu Negócio antes de qualquer anúncio.** É gratuito e, para advocacia,
   costuma render mais que mídia paga.
2. **Esperar 60 dias de Search Console.** Anunciar sabendo em quais buscas o site já
   aparece é muito mais eficiente do que apostar no escuro.
3. **Só então avaliar a campanha**, com os critérios acima e a confirmação da OAB/DF.

## O que não fazer

- **Tráfego artificial** — bots ou visitas compradas não melhoram posição, poluem a
  medição e podem gerar penalização.
- **Comprar links.**
- **Repetir palavra-chave** artificialmente nos textos.
- **Copiar conteúdo** de outros sites, inclusive de escritórios maiores.
- **Prometer resultado** nos textos — além de ineficaz, contraria o Provimento
  205/2021 do CFOAB.

## Prazo honesto

Domínio registrado em outubro de 2026. Indexação completa: dias a semanas.
Primeiras posições nas buscas específicas: 3 a 6 meses de trabalho constante.
Buscas de médio prazo: 6 a 12 meses. Não há atalho, e quem vender atalho está
vendendo risco.
