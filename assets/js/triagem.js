/* =========================================================
   Triagem do inventário — indica a via provável, o prazo e
   os documentos a reunir. Roda só no navegador: nada é
   enviado ao escritório sem o visitante clicar no WhatsApp.

   Base normativa: CPC, arts. 610 e 611; Resolução CNJ 35/2007,
   com a redação da Resolução CNJ 571/2024 (arts. 12-A e 12-B).
   ========================================================= */
(function () {
  'use strict';

  var form = document.getElementById('triagem-form');
  var saida = document.getElementById('triagem-resultado');
  if (!form || !saida) return;

  var erro = document.getElementById('triagem-erro');
  var progresso = document.getElementById('triagem-progresso');
  var OBRIGATORIAS = ['consenso', 'menor', 'testamento', 'estadoCivil', 'dividas'];

  // Mesmo número do botão flutuante da página, para manter um só canal.
  function numeroWhatsapp() {
    var f = document.querySelector('.float-wa');
    var m = f && f.getAttribute('href').match(/wa\.me\/(\d+)/);
    return m ? m[1] : '5561981920090';
  }

  function rastrear(nome, params) {
    if (typeof window.gtag === 'function') window.gtag('event', nome, params || {});
  }

  function valor(nome) {
    var el = form.querySelector('input[name="' + nome + '"]:checked');
    return el ? el.value : '';
  }
  function marcados(nome) {
    return Array.prototype.map.call(
      form.querySelectorAll('input[name="' + nome + '"]:checked'),
      function (el) { return el.value; }
    );
  }

  /* ---------- Subpergunta e progresso ---------- */
  function atualiza() {
    Array.prototype.forEach.call(form.querySelectorAll('[data-show-when]'), function (el) {
      var regra = el.getAttribute('data-show-when').split('=');
      el.hidden = valor(regra[0]) !== regra[1];
    });
    var data = form.elements.data.value || form.elements.semData.checked;
    var feitas = OBRIGATORIAS.filter(valor).length + (data ? 1 : 0) +
      (marcados('bens').length ? 1 : 0);
    progresso.textContent = feitas + ' de 7 respondidas';
    form.querySelector('[data-q="obito"] input[type="date"]').disabled = form.elements.semData.checked;
  }
  form.addEventListener('change', atualiza);
  form.addEventListener('input', atualiza);
  atualiza();

  /* ---------- Prazo legal (CPC, art. 611) ---------- */
  function prazo(dataTxt) {
    if (!dataTxt) return null;
    var obito = new Date(dataTxt + 'T12:00:00');
    if (isNaN(obito)) return null;
    var hoje = new Date();
    var limite = new Date(obito);
    limite.setMonth(limite.getMonth() + 2);
    var dias = Math.round((limite - hoje) / 86400000);
    return { limite: limite, dias: dias, futuro: obito > hoje };
  }
  function dataBR(d) { return d.toLocaleDateString('pt-BR'); }

  /* ---------- Via provável ---------- */
  function diagnostico(r) {
    var bens = r.bens;
    var soPequenos = bens.length === 1 && bens[0] === 'pequenos';

    if (r.consenso === 'nao') {
      return {
        via: 'judicial', titulo: 'Via judicial',
        resumo: 'Sem acordo entre os herdeiros, o inventário precisa tramitar na Justiça, onde o juiz decide o que as partes não resolvem.',
        obs: ['É comum que o acordo surja durante o processo. Se isso acontecer, o caminho pode ficar mais curto.']
      };
    }
    if (r.menor === 'nascituro') {
      return {
        via: 'aguardar', titulo: 'Aguardar o nascimento, ou seguir em juízo',
        resumo: 'Com gestação em curso, a escritura em cartório só pode ser lavrada depois do registro de nascimento. Se houver urgência, a via judicial é o caminho.',
        obs: []
      };
    }
    if (r.menor === 'sim' && r.fracao === 'nao') {
      return {
        via: 'judicial', titulo: 'Via judicial',
        resumo: 'Com herdeiro menor ou incapaz, o cartório só admite a partilha em frações de cada bem. Para dividir bens específicos entre os herdeiros, é preciso um processo judicial.',
        obs: []
      };
    }

    var condicoes = [];
    if (r.menor === 'sim') {
      condicoes.push('Com herdeiro menor ou incapaz, a escritura é possível desde 2024 (Resolução CNJ 571/2024). As condições são: cada herdeiro recebe uma fração de cada bem, nenhum bem do menor pode ser vendido no ato, e o Ministério Público precisa se manifestar a favor.');
    }
    if (r.testamento === 'sim') {
      condicoes.push('Com testamento, o caminho tem duas etapas: primeiro, uma ação judicial de abertura e cumprimento do testamento, com autorização expressa do juiz para o inventário em cartório. Depois, a escritura. Se o testamento reconhecer um filho, o inventário tem de ser judicial.');
    }
    if (r.testamento === 'naosei') {
      condicoes.push('Vale confirmar se existe testamento. A certidão da Central de Testamentos (CENSEC) mostra isso e é exigida em qualquer caso.');
    }
    if (r.consenso === 'talvez') {
      condicoes.push('O cartório exige acordo de todos os herdeiros sobre a partilha. Vale conversar com a família antes de escolher a via.');
    }

    var obs = [];
    if (soPequenos) {
      obs.push('Se a herança se resume a FGTS, PIS ou pequenos saldos, um alvará judicial pode bastar, sem inventário completo.');
    }
    if (r.dividas === 'sim') {
      obs.push('Dívidas não impedem o cartório, mas precisam ser pagas com os bens da herança ou ressalvadas na escritura. Um levantamento prévio evita surpresas.');
    }
    if (bens.indexOf('exterior') !== -1) {
      obs.push('Bens no exterior seguem as regras do país onde estão. Em geral, exigem um procedimento separado lá fora.');
    }

    if (condicoes.length) {
      return {
        via: 'cartorio-condicoes', titulo: 'Cartório é possível, com condições',
        resumo: 'O seu caso pode ser resolvido por escritura pública, sem processo judicial, desde que atendidos os pontos abaixo.',
        condicoes: condicoes, obs: obs
      };
    }
    return {
      via: 'cartorio', titulo: 'Cartório: o caminho mais direto',
      resumo: 'Com herdeiros maiores e capazes, sem testamento e com acordo, o inventário pode ser feito por escritura pública em qualquer tabelionato de notas, com advogado. É a via mais rápida e, em regra, a mais econômica.',
      obs: obs
    };
  }

  /* ---------- Documentos ---------- */
  function documentos(r) {
    var falecido = [
      'Certidão de óbito',
      'RG, CPF e comprovante do último endereço',
      'Certidão negativa de testamento (CENSEC)',
      'Certidões negativas de débitos fiscais (Receita Federal, Estado e Município)'
    ];
    if (r.estadoCivil === 'casado') {
      falecido.push('Certidão de casamento atualizada, com averbações');
      falecido.push('Pacto antenupcial, se houver');
    } else if (r.estadoCivil === 'uniao') {
      falecido.push('Escritura ou sentença de união estável, ou outras provas da convivência');
    } else if (r.estadoCivil === 'divorciado') {
      falecido.push('Certidão de casamento com a averbação do divórcio');
    } else if (r.estadoCivil === 'viuvo') {
      falecido.push('Certidão de casamento e certidão de óbito do cônjuge anterior');
    } else {
      falecido.push('Certidão de nascimento atualizada');
    }

    var herdeiros = [
      'RG, CPF, comprovante de endereço e profissão de cada herdeiro',
      'Certidão de nascimento ou casamento de cada herdeiro, e documentos dos respectivos cônjuges'
    ];
    if (r.estadoCivil === 'casado' || r.estadoCivil === 'uniao') {
      herdeiros.unshift('Documentos do cônjuge ou companheiro(a) sobrevivente');
    }
    if (r.menor === 'sim') {
      herdeiros.push('Documentos do representante legal ou curador do herdeiro menor ou incapaz');
    }

    var mapaBens = {
      imovel: 'Imóvel urbano: matrícula atualizada, carnê do IPTU e certidão negativa de débitos do imóvel',
      rural: 'Imóvel rural: matrícula, CCIR, ITR dos últimos 5 anos e CAR',
      veiculo: 'Veículo: CRLV e consulta de débitos no Detran',
      contas: 'Contas e investimentos: extratos com o saldo na data do óbito',
      empresa: 'Empresa: contrato social consolidado, último balanço e certidões da junta comercial',
      exterior: 'Bens no exterior: documentos de propriedade, com tradução e apostila quando necessário',
      pequenos: 'FGTS e PIS: extratos e declaração de dependentes no INSS'
    };
    var bens = r.bens.map(function (b) { return mapaBens[b]; }).filter(Boolean);
    if (r.dividas === 'sim') bens.push('Dívidas: contratos, boletos e demonstrativos de saldo devedor');

    var extra = [];
    if (r.testamento === 'sim') extra.push('Cópia do testamento e certidão do registro');

    return { 'Do falecido': falecido, 'Dos herdeiros': herdeiros, 'Dos bens': bens, 'Testamento': extra };
  }

  /* ---------- Renderização ---------- */
  function esc(t) {
    return String(t).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function lista(itens) {
    return '<ul>' + itens.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul>';
  }

  function textoResumo(r, d, p) {
    var rotulos = {
      consenso: { sim: 'há acordo', talvez: 'acordo ainda indefinido', nao: 'há divergência' },
      menor: { sim: 'há herdeiro menor/incapaz', nao: 'sem herdeiro menor/incapaz', nascituro: 'há gestação em curso' },
      testamento: { sim: 'há testamento', nao: 'sem testamento', naosei: 'não sabe se há testamento' }
    };
    var linhas = [
      'Olá! Fiz a triagem de inventário no site.',
      '',
      'Resultado: ' + d.titulo,
      '• ' + rotulos.consenso[r.consenso],
      '• ' + rotulos.menor[r.menor],
      '• ' + rotulos.testamento[r.testamento]
    ];
    var nomesBens = { imovel: 'imóvel urbano', rural: 'imóvel rural', veiculo: 'veículo', contas: 'contas/investimentos', empresa: 'empresa', exterior: 'bens no exterior', pequenos: 'FGTS/PIS/pequenos saldos' };
    if (r.bens.length) linhas.push('• bens: ' + r.bens.map(function (b) { return nomesBens[b] || b; }).join(', '));
    if (p) linhas.push('• óbito em ' + dataBR(new Date(r.data + 'T12:00:00')));
    linhas.push('', 'Gostaria de conversar sobre o meu caso.');
    return linhas.join('\n');
  }

  function render(r) {
    var d = diagnostico(r);
    var p = prazo(r.data);
    var docs = documentos(r);
    var html = '';

    html += '<p class="eyebrow">Resultado da triagem</p>';
    html += '<div class="triagem__via triagem__via--' + d.via + '"><h2>' + esc(d.titulo) + '</h2><p>' + esc(d.resumo) + '</p></div>';

    if (d.condicoes && d.condicoes.length) {
      html += '<h3>Condições para o seu caso</h3>' + lista(d.condicoes);
    }
    if (d.obs && d.obs.length) {
      html += '<h3>Pontos de atenção</h3>' + lista(d.obs);
    }

    if (p && !p.futuro) {
      if (p.dias >= 0) {
        html += '<div class="note"><strong>Prazo:</strong> o inventário deve ser aberto até <strong>' +
          dataBR(p.limite) + '</strong>, daqui a ' + p.dias + ' dia' + (p.dias === 1 ? '' : 's') +
          '. Depois disso, a maioria dos estados cobra multa sobre o ITCMD.</div>';
      } else {
        html += '<div class="note"><strong>Prazo:</strong> o prazo de dois meses venceu em ' + dataBR(p.limite) +
          '. O inventário continua possível, mas pode haver multa sobre o ITCMD. Quanto antes começar, menor costuma ser o acréscimo. ' +
          '<a href="prazo-inventario-multa-itcd-df.html">Como funciona a multa no DF</a>.</div>';
      }
    }

    html += '<h3>Documentos para começar a reunir</h3><div class="triagem__docs">';
    Object.keys(docs).forEach(function (grupo) {
      if (!docs[grupo].length) return;
      html += '<div><h4>' + esc(grupo) + '</h4>' + lista(docs[grupo]) + '</div>';
    });
    html += '</div>';

    html += '<div class="triagem__acoes">' +
      '<a class="btn btn--primary" id="triagem-wa" target="_blank" rel="noopener" href="https://wa.me/' + numeroWhatsapp() +
      '?text=' + encodeURIComponent(textoResumo(r, d, p)) + '">Enviar este resumo pelo WhatsApp</a>' +
      '<button type="button" class="btn btn--ghost" id="triagem-imprimir">Salvar em PDF</button>' +
      '<button type="button" class="btn btn--ghost" id="triagem-refazer">Refazer</button>' +
      '</div>';

    html += '<p class="triagem__aviso">Triagem informativa e geral, baseada no CPC e na Resolução CNJ 35/2007 (com a redação da Resolução CNJ 571/2024). ' +
      'Exigências documentais variam conforme o tabelionato e o estado. Não substitui a análise individual do caso nem constitui promessa de resultado.</p>';

    saida.innerHTML = html;
    saida.hidden = false;
    form.hidden = true;
    saida.focus();
    saida.scrollIntoView({ behavior: 'smooth', block: 'start' });

    rastrear('triagem_concluida', { via: d.via });

    document.getElementById('triagem-wa').addEventListener('click', function () {
      rastrear('contato_whatsapp', { origem: 'triagem', via: d.via });
    });
    document.getElementById('triagem-imprimir').addEventListener('click', function () { window.print(); });
    document.getElementById('triagem-refazer').addEventListener('click', function () {
      saida.hidden = true;
      form.hidden = false;
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  form.addEventListener('submit', function (evento) {
    evento.preventDefault();
    var faltando = OBRIGATORIAS.filter(function (n) { return !valor(n); });
    if (valor('menor') === 'sim' && !valor('fracao')) faltando.push('fracao');
    if (!marcados('bens').length) faltando.push('bens');

    form.querySelectorAll('.triagem__q').forEach(function (q) { q.removeAttribute('data-faltando'); });
    if (faltando.length) {
      faltando.forEach(function (n) {
        var q = form.querySelector('[data-q="' + n + '"]') ||
          form.querySelector('input[name="' + n + '"]').closest('.triagem__q');
        if (q) q.setAttribute('data-faltando', 'true');
      });
      erro.textContent = 'Responda às perguntas destacadas para ver o resultado.';
      var primeira = form.querySelector('[data-faltando]');
      if (primeira) primeira.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    erro.textContent = '';

    render({
      data: form.elements.semData.checked ? '' : form.elements.data.value,
      consenso: valor('consenso'),
      menor: valor('menor'),
      fracao: valor('fracao'),
      testamento: valor('testamento'),
      estadoCivil: valor('estadoCivil'),
      bens: marcados('bens'),
      dividas: valor('dividas')
    });
  });
})();
