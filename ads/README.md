# Campanha Google Ads — passo a passo

Arquivos desta pasta:

- `palavras-chave.csv` — palavras-chave por grupo, em correspondência de frase e exata,
  mais a lista de negativas da campanha
- `anuncios.csv` — títulos e descrições de cada grupo, já dentro dos limites do Google
  (30 caracteres nos títulos, 90 nas descrições), com a URL de destino

## Antes de começar

Confirmar com a Comissão de Publicidade da OAB/DF. As fontes consultadas indicam que o
Provimento nº 205/2021 admite impulsionar **conteúdo informativo** e veda o anúncio que
ofereça serviços de forma ostensiva, prometa resultado ou mencione honorários. Os textos
desta pasta foram escritos nesse espírito — descrevem o que o leitor vai encontrar, não
oferecem contratação —, mas a responsabilidade disciplinar é dos advogados responsáveis.

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
