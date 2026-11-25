# Campanha Google Ads — passo a passo

Arquivos desta pasta:

- `palavras-chave.csv` — palavras-chave por grupo, em correspondência de frase e exata,
  mais a lista de negativas da campanha
- `anuncios.csv` — títulos e descrições de cada grupo, já dentro dos limites do Google
  (30 caracteres nos títulos, 90 nas descrições), com a URL de destino

## Antes de começar — o que o Provimento 205/2021 permite

Texto conferido no site do Conselho Federal da OAB em novembro de 2026
(`oab.org.br/leisnormas/legislacao/provimentos/205-2021`). Anúncio pago **é
permitido**:

> **Art. 4º** No marketing de conteúdos jurídicos poderá ser utilizada a publicidade
> ativa ou passiva, desde que não esteja incutida a mercantilização, a captação de
> clientela ou o emprego excessivo de recursos financeiros, sendo admitida a utilização
> de anúncios, pagos ou não, nos meios de comunicação, exceto nos meios vedados pelo
> art. 40 do Código de Ética e Disciplina […]

> **Art. 5º** A publicidade profissional permite a utilização de anúncios, pagos ou não,
> nos meios de comunicação não vedados pelo art. 40 do Código de Ética e Disciplina.

Os limites que recaem sobre o texto do anúncio estão no **art. 3º**: a publicidade deve
ter "caráter meramente informativo" e primar "pela discrição e sobriedade", sendo vedados
(I) referência a honorários, forma de pagamento, gratuidade ou desconto; (II) informação
que possa induzir a erro; (III) anúncio de especialidade sem título certificado ou
notória especialização; (IV) **orações ou expressões persuasivas, de autoengrandecimento
ou de comparação**; (V) distribuição indiscriminada de material. O § 1º acrescenta que a
divulgação não pode **incitar diretamente ao litígio ou à contratação de serviços**.

O **art. 6º** veda informação sobre dimensões, qualidades ou estrutura física do
escritório, promessa de resultado e uso de casos concretos para oferta de atuação.

### Auditoria dos textos desta pasta

Conferidos contra os artigos acima:

| Item | Situação |
|---|---|
| Honorários, descontos, valores | Ausentes em todos os anúncios — art. 3º, I, atendido |
| Promessa de resultado | Ausente — art. 6º atendido |
| Caso concreto, estrutura do escritório | Ausentes — art. 6º atendido |
| Superlativo, comparação, autoelogio | Ausentes — art. 3º, IV, atendido |
| "Direito administrativo e civil" | Área de atuação, não especialidade certificada. É a linha a confirmar com a Comissão, por causa do art. 3º, III |
| "Notificado de um PAD?", "Pedido de remoção negado?" | **Pontos de atenção.** São perguntas dirigidas a quem tem o problema. Levam a página informativa, o que joga a favor; mas é onde um exame disciplinar olharia primeiro, pelo art. 3º, § 1º (não incitar à contratação). Alternativas mais neutras: "Prazos da defesa em PAD", "Remoção negada: o que diz a lei" |
| Orçamento | O art. 4º veda "emprego excessivo de recursos financeiros" sem definir limite. R$ 30 a 50 por dia é modesto para o padrão de mídia paga, mas o critério é discrição, e quem o aplica é a OAB |

**A confirmação com a Comissão de Publicidade da OAB/DF continua recomendada** — não
porque o anúncio seja proibido, mas porque os limites dos arts. 3º e 6º são avaliados
caso a caso, e a responsabilidade disciplinar é dos advogados responsáveis. Existe,
desde 2021, um Comitê Regulador do Marketing Jurídico no Conselho Federal (art. 9º).

## Antes de gastar o primeiro real

A campanha pode estar perfeita e ainda assim o dinheiro ser perdido, se o site não
registrar conversão nem capturar contato. Situação em 25/11/2026:

- [x] **Rótulos de conversão.** Resolvido em 22/11/2026. `assets/js/main.js` usa a conta
      `AW-737818455` com o rótulo `PZeUCOKbw70dENfu6N8C` nas três ações. Sem isso o Ads
      receberia cliques e nenhuma conversão.
- [ ] **Formulário sem destino.** `endpoint` continua vazio, e é a única coisa que falta
      para a medição ficar completa. Ele é a chave de duas funções ao mesmo tempo: o envio
      do formulário por `fetch` e a **captura de nome e telefone antes do WhatsApp**, que
      `capturaWhatsapp: true` já liga mas que fica desativada enquanto não houver onde
      gravar. Hoje, portanto, quem desiste no meio não deixa rastro e não existe lista de
      contatos.

      *O caminho do código foi testado de ponta a ponta em 25/11/2026*, com um endpoint
      local de mentira no lugar do serviço real. Os dois fluxos funcionaram, sem erro de
      JavaScript, e o servidor recebeu:

      ```json
      {"nome":"...","email":"...","telefone":"...","assunto":"...","mensagem":"..."}
      {"nome":"...","telefone":"...","assunto":"...","pagina":"/index.html",
       "url":"...","origem":"captura_whatsapp","enviadoEm":"..."}
      ```

      O visitante viu "Mensagem recebida. O escritório retorna em até dois dias úteis."
      Basta colar a URL do serviço em `endpoint` — não há mais nada a programar.

- [ ] **E-mail no domínio.** `CONFIG.email` ainda é um endereço `@gmail.com`. Ele **não
      aparece nas páginas**: serve ao botão "enviar por e-mail", que só é usado enquanto o
      `endpoint` estiver vazio. Resolvido o item acima, deixa de ser o caminho principal,
      mas continua valendo criar `contato@soareseribeiro.adv.br` — o MX entra no
      Registro.br e o endereço volta aqui.

## A conta que decide tudo

Antes de ativar, escrever o número que torna a campanha viável:

```
custo por clique × cliques necessários para um contato = custo por contato
custo por contato ÷ taxa de contatos que viram caso = custo por cliente
```

Com R$ 50 por dia (R$ 1.500 por mês) e CPC de R$ 8 a 15 nessas buscas, são 100 a 190
cliques por mês. A 5% de conversão em contato, 5 a 9 contatos. Se um em cada três vira
caso, 2 a 3 clientes por mês. **Esses números são estimativa, não medição** — o
Planejador de Palavras-Chave (passo 6) dá o CPC real em Brasília, e é ele que substitui
essa conta por uma de verdade.

## 1. Criar a conta

1. Entrar em ads.google.com com a conta Google do escritório.
2. Na primeira tela, procurar **"alternar para o modo especialista"**, em letra pequena.
   Sem isso o Google escolhe palavras-chave e lances sozinho.
3. Objetivo: **"Criar uma campanha sem orientação de meta"**.
4. Tipo: **Rede de Pesquisa**.
5. **Desmarcar** "Incluir Rede de Display" e "Incluir parceiros de pesquisa".

## 2. Configurar a campanha

| Campo | Valor |
|---|---|
| Nome | Soares e Ribeiro — Pesquisa |
| Local | Brasília e região |
| Opções de local | **Presença: pessoas que estão no local** (não o padrão) |
| Idioma | Português |
| Orçamento | R$ 30 a 50 por dia |
| Lances | Maximizar cliques **com limite de CPC**, no início |
| Conversões | Importar do Analytics (ver passo 5) |

Quando houver 15 a 30 conversões acumuladas, trocar a estratégia de lances para
**Maximizar conversões**. Antes disso não há dados suficientes e o Google gasta mal.

## 3. Criar os três grupos

Para cada grupo em `anuncios.csv`: criar o grupo com o nome indicado, colar a URL final,
colar os títulos e as descrições. Um anúncio responsivo por grupo basta.

Colar as palavras-chave de `palavras-chave.csv`, respeitando a correspondência:
`"entre aspas"` é frase, `[entre colchetes]` é exata. **Não usar correspondência ampla.**

As negativas vão em **Palavras-chave negativas da campanha**, não do grupo.

## 4. Recursos do anúncio

Preencher, porque ocupam mais espaço na tela e são gratuitos:

- **Sitelinks**: Remoção de servidor · PAD e sindicância · Inventário · Artigos
- **Frase de destaque**: Atendimento em Brasília · Atendimento por videoconferência
- **Chamada**: (61) 98192-0090
- **Local**: vincular à ficha do Google Meu Negócio, quando existir

## 5. Conversões — a parte que o site já tem pronta

1. No Google Ads: **Ferramentas → Conversões → Nova ação de conversão → Site**.
2. Criar três ações, uma para cada evento: contato por WhatsApp, formulário enviado,
   clique no telefone.
3. Cada ação gera um **ID de conversão** (`AW-XXXXXXXXX`) e um **rótulo**.
4. Preencher em `assets/js/main.js`:

```js
ads: 'AW-XXXXXXXXX',
adsConversoes: {
  contato_whatsapp:  'rotulo_do_whatsapp',
  envio_formulario:  'rotulo_do_formulario',
  contato_telefone:  'rotulo_do_telefone'
}
```

O disparo já está implementado: os mesmos eventos que alimentam o Analytics passam a
registrar conversão no Ads. **Com `ads` vazio, nada do Ads é carregado.**

**Limitação conhecida:** a medição só carrega depois que o visitante aceita o aviso de
cookies. Quem recusa não é contado, então as conversões aparecem subestimadas e o custo
por contato real é melhor que o exibido no painel.

## 6. Antes de ativar

- [ ] Rodar o **Planejador de Palavras-Chave** (dentro do Ads, gratuito) para ver o
      volume e o custo por clique reais em Brasília. É o que diz se a campanha é viável.
- [ ] Conferir se o teto diário está definido.
- [ ] Conferir se as negativas foram inseridas.
- [ ] Conferir se cada grupo aponta para a página certa, não para a home.

## 7. Depois de ativar

**Não mexer por 30 dias.** Ajuste diário impede o sistema de aprender e impede vocês de
saber o que funcionou. No fim do mês:

```
gasto ÷ contatos gerados = custo por contato
```

Comparar com o valor de um caso médio. É essa conta, e só ela, que decide se continua.

Em **Relatórios → Termos de pesquisa** aparecem as buscas reais que acionaram os
anúncios. Toda busca irrelevante que aparecer ali vira palavra-chave negativa nova.
