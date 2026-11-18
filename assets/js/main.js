/* =========================================================
   Soares Advocacia — comportamentos do site
   Sem dependências externas.
   ========================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     CONFIGURAÇÃO — ajuste estes valores ao publicar o site.
     --------------------------------------------------------- */
  var CONFIG = {
    // E-mail que recebe as mensagens do formulário.
    // Provisório: trocar por contato@soareseribeiro.adv.br quando a caixa existir.
    email: 'marcosnior@gmail.com',
    // WhatsApp em formato internacional, apenas dígitos (55 + DDD + número).
    whatsapp: '5561981920090',
    // Opcional: URL de um serviço de formulários (Formspree, Basin, Netlify…).
    // Deixando vazio, o envio abre o cliente de e-mail do visitante — e a
    // captura antes do WhatsApp fica desligada, porque não haveria onde gravar.
    endpoint: '',
    // Pedir nome e telefone antes de abrir o WhatsApp. Só tem efeito com
    // endpoint preenchido. Pôr false desliga a captura e mantém o botão direto.
    capturaWhatsapp: true,
    // Google Analytics 4: cole aqui o ID de medição (formato G-XXXXXXXXXX).
    // Vazio = nenhuma medição é carregada e nenhum cookie é gravado.
    analytics: 'G-1T85GQZYMC',
    // Google Ads: ID de conversão (AW-XXXXXXXXX) e rótulos de cada conversão.
    // Vazio = nada do Ads é carregado.
    ads: 'AW-18517354407',
    adsConversoes: {
      contato_whatsapp:  '',   // rótulo da conversão "contato por WhatsApp"
      envio_formulario:  '',   // rótulo da conversão "formulário enviado"
      contato_telefone:  ''    // rótulo da conversão "clique no telefone"
    }
  };

  /* ---------------------------------------------------------
     Menu de navegação (telas pequenas)
     --------------------------------------------------------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav-principal');

  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      nav.setAttribute('data-open', String(open));
      toggle.setAttribute('aria-label', open ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
    };

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* ---------------------------------------------------------
     Ano corrente no rodapé
     --------------------------------------------------------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-ano]'), function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------------------------------------------------------
     Detalhes do FAQ: apenas um aberto por vez
     --------------------------------------------------------- */
  var detalhes = document.querySelectorAll('.faq details');
  Array.prototype.forEach.call(detalhes, function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;
      Array.prototype.forEach.call(detalhes, function (outro) {
        if (outro !== item) outro.open = false;
      });
    });
  });


  /* ---------------------------------------------------------
     Medição de audiência (Google Analytics 4)

     Só carrega depois que o visitante aceita. Sem aceite, nenhum
     script de terceiro é baixado e nenhum cookie é gravado.
     --------------------------------------------------------- */
  var CHAVE_CONSENTIMENTO = 'sr_consentimento_medicao';

  function leConsentimento() {
    try { return localStorage.getItem(CHAVE_CONSENTIMENTO); }
    catch (e) { return null; }   // navegação privada, cookies bloqueados
  }

  function gravaConsentimento(valor) {
    try { localStorage.setItem(CHAVE_CONSENTIMENTO, valor); } catch (e) {}
  }

  function carregaAnalytics() {
    var idPrincipal = CONFIG.analytics || CONFIG.ads;
    if (!idPrincipal || window.gtag) return;
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + idPrincipal;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    if (CONFIG.analytics) window.gtag('config', CONFIG.analytics, { anonymize_ip: true });
    if (CONFIG.ads) window.gtag('config', CONFIG.ads);
  }

  // Registra um evento. Sem consentimento ou sem ID configurado, não faz nada.
  // Havendo rótulo de conversão do Ads para esse evento, dispara a conversão junto.
  function rastrear(nome, parametros) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', nome, parametros || {});
    var rotulo = CONFIG.ads && CONFIG.adsConversoes && CONFIG.adsConversoes[nome];
    if (rotulo) window.gtag('event', 'conversion', { send_to: CONFIG.ads + '/' + rotulo });
  }

  function mostraAvisoDeCookies() {
    var aviso = document.createElement('div');
    aviso.className = 'aviso-cookies';
    aviso.setAttribute('role', 'dialog');
    aviso.setAttribute('aria-live', 'polite');
    aviso.setAttribute('aria-label', 'Aviso sobre medição de audiência');
    aviso.innerHTML =
      '<p>Usamos uma ferramenta de medição de audiência para entender como o site é ' +
      'utilizado. Os dados são estatísticos e não identificam você. Veja a ' +
      '<a href="politica-de-privacidade.html">Política de Privacidade</a>.</p>' +
      '<div class="aviso-cookies__acoes">' +
      '<button type="button" class="btn btn--primary" data-consent="aceito">Aceitar</button>' +
      '<button type="button" class="btn btn--ghost" data-consent="recusado">Recusar</button>' +
      '</div>';
    document.body.appendChild(aviso);
    aviso.addEventListener('click', function (evento) {
      var botao = evento.target.closest('[data-consent]');
      if (!botao) return;
      var escolha = botao.getAttribute('data-consent');
      gravaConsentimento(escolha);
      if (escolha === 'aceito') carregaAnalytics();
      aviso.remove();
    });
  }

  if (CONFIG.analytics) {
    var consentimento = leConsentimento();
    if (consentimento === 'aceito') carregaAnalytics();
    else if (consentimento !== 'recusado') mostraAvisoDeCookies();
  }

  /* ---------------------------------------------------------
     Eventos de contato — é o que permite saber o que converte
     --------------------------------------------------------- */
  /* ---------------------------------------------------------
     WhatsApp com contexto

     O site é estático: a conversa acontece dentro do WhatsApp e
     não há como guardá-la aqui. O que dá para fazer é cada
     contato chegar já dizendo de onde veio — assim o escritório
     identifica o assunto, etiqueta a conversa no WhatsApp
     Business e consegue retomá-la depois.
     --------------------------------------------------------- */
  function ehPaginaInicial() {
    return /(^\/$|index\.html$)/.test(location.pathname);
  }

  function paginaDeOrigem() {
    // Na home o <h1> é um slogan, não serve como nome de página.
    if (ehPaginaInicial()) return 'p\u00e1gina inicial';
    var titulo = document.querySelector('.page-head h1') || document.querySelector('h1');
    var nome = titulo ? titulo.textContent : document.title.split('\u2014')[0];
    return nome.replace(/\s+/g, ' ').trim().slice(0, 90);
  }

  function origemPorExtenso() {
    return ehPaginaInicial()
      ? 'pela p\u00e1gina inicial'
      : 'pela p\u00e1gina "' + paginaDeOrigem() + '"';
  }

  function mensagemDeContato() {
    return 'Ol\u00e1! Vim ' + origemPorExtenso() + ' do site de voc\u00eas.'
         + '\n\nGostaria de falar com o escrit\u00f3rio sobre esse assunto.';
  }

  function linkWhatsapp(texto) {
    return 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(texto);
  }

  Array.prototype.forEach.call(document.querySelectorAll('a[href*="wa.me/"]'), function (link) {
    link.setAttribute('href', link.getAttribute('href').split('?')[0]
      + '?text=' + encodeURIComponent(mensagemDeContato()));
  });

  /* ---------------------------------------------------------
     Captura antes do WhatsApp

     Quem clica e desiste de mandar a mensagem some sem deixar
     rastro. Este passo pede nome e telefone, grava no serviço
     configurado em CONFIG.endpoint e só então abre o WhatsApp,
     já com os dados na mensagem.

     Sem endpoint não há onde gravar, então a captura nem
     aparece: seria atrito sem contrapartida.
     --------------------------------------------------------- */
  var capturaAtiva = !!(CONFIG.endpoint && CONFIG.capturaWhatsapp);

  if (capturaAtiva) (function () {
    var caixa = null, destinoDireto = '', devolveFoco = null;

    function monta() {
      var el = document.createElement('div');
      el.className = 'captura';
      el.setAttribute('hidden', '');
      el.innerHTML =
        '<div class="captura__caixa" role="dialog" aria-modal="true" aria-labelledby="captura-titulo">' +
          '<button type="button" class="captura__fechar" aria-label="Fechar">&times;</button>' +
          '<p class="captura__rot">Antes de continuar</p>' +
          '<h2 id="captura-titulo">Como podemos te chamar?</h2>' +
          '<p class="captura__sub">Assim o escrit\u00f3rio j\u00e1 sabe com quem fala e consegue retomar o contato se a conversa se perder.</p>' +
          '<p class="captura__assunto">Assunto: <strong data-captura-assunto></strong></p>' +
          '<form novalidate>' +
            '<div class="field"><label for="captura-nome">Nome</label>' +
              '<input id="captura-nome" name="nome" type="text" autocomplete="name" required></div>' +
            '<div class="field"><label for="captura-tel">WhatsApp com DDD</label>' +
              '<input id="captura-tel" name="telefone" type="tel" inputmode="tel" autocomplete="tel" placeholder="(61) 99999-9999" required></div>' +
            '<p class="captura__erro" role="alert" hidden></p>' +
            '<label class="captura__consent"><input type="checkbox" name="consentimento" required>' +
              '<span>Autorizo o escrit\u00f3rio a guardar meu nome e telefone para retornar este contato, nos termos da ' +
              '<a href="politica-de-privacidade.html" target="_blank" rel="noopener">Pol\u00edtica de Privacidade</a>.</span></label>' +
            '<div class="captura__acoes">' +
              '<button type="submit" class="btn btn--primary">Continuar no WhatsApp</button>' +
              '<button type="button" class="captura__direto">Prefiro ir direto, sem informar</button>' +
            '</div>' +
          '</form>' +
        '</div>';
      document.body.appendChild(el);

      el.querySelector('.captura__fechar').addEventListener('click', fecha);
      el.querySelector('.captura__direto').addEventListener('click', function () {
        rastrear('contato_whatsapp', { origem: 'captura_pulada', pagina: paginaDeOrigem() });
        segue(destinoDireto);
      });
      el.addEventListener('click', function (ev) { if (ev.target === el) fecha(); });
      el.querySelector('form').addEventListener('submit', envia);
      return el;
    }

    function mostraErro(texto) {
      var p = caixa.querySelector('.captura__erro');
      p.textContent = texto || '';
      if (texto) p.removeAttribute('hidden'); else p.setAttribute('hidden', '');
    }

    function abre(destino, gatilho) {
      if (!caixa) caixa = monta();
      destinoDireto = destino;
      devolveFoco = gatilho || null;
      caixa.querySelector('[data-captura-assunto]').textContent = paginaDeOrigem();
      mostraErro('');
      caixa.removeAttribute('hidden');
      document.addEventListener('keydown', escapa);
      setTimeout(function () { caixa.querySelector('#captura-nome').focus(); }, 30);
      rastrear('captura_aberta', { pagina: paginaDeOrigem() });
    }

    function fecha() {
      if (!caixa) return;
      caixa.setAttribute('hidden', '');
      document.removeEventListener('keydown', escapa);
      if (devolveFoco && devolveFoco.focus) devolveFoco.focus();
    }

    function escapa(ev) { if (ev.key === 'Escape') fecha(); }

    function segue(url) {
      fecha();
      window.open(url, '_blank', 'noopener');
    }

    function grava(dados) {
      // Disparo sem espera: o WhatsApp abre no mesmo gesto do clique,
      // senão o navegador bloqueia a aba. sendBeacon não é cancelado
      // quando a página perde o foco.
      var corpo = JSON.stringify(dados);
      try {
        if (navigator.sendBeacon) {
          navigator.sendBeacon(CONFIG.endpoint, new Blob([corpo], { type: 'application/json' }));
          return;
        }
      } catch (e) { /* cai no fetch abaixo */ }
      try {
        fetch(CONFIG.endpoint, {
          method: 'POST', keepalive: true,
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: corpo
        }).catch(function () {});
      } catch (e) { /* nada a fazer: o contato segue para o WhatsApp */ }
    }

    function envia(ev) {
      ev.preventDefault();
      var f = ev.target;
      var nome = f.nome.value.trim();
      var tel = f.telefone.value.trim();
      var digitos = tel.replace(/\D/g, '');

      if (nome.length < 2) return mostraErro('Escreva seu nome.');
      if (digitos.length < 10) return mostraErro('Informe o telefone com DDD.');
      if (!f.consentimento.checked) return mostraErro('\u00c9 preciso autorizar o contato posterior.');

      grava({
        nome: nome,
        telefone: tel,
        assunto: paginaDeOrigem(),
        pagina: location.pathname,
        url: location.href,
        origem: 'captura_whatsapp',
        enviadoEm: new Date().toISOString()
      });
      rastrear('contato_whatsapp', { origem: 'captura', pagina: paginaDeOrigem() });

      var texto = 'Ol\u00e1! Sou ' + nome + '. Vim ' + origemPorExtenso() + ' do site de voc\u00eas.'
                + '\n\nGostaria de falar com o escrit\u00f3rio sobre esse assunto.';
      segue(linkWhatsapp(texto));
      f.reset();
    }

    document.addEventListener('click', function (ev) {
      var link = ev.target.closest && ev.target.closest('a[href*="wa.me/"]');
      // A triagem monta o próprio resumo e já identifica quem é: não interceptar.
      if (!link || link.id === 'triagem-wa' || link.hasAttribute('data-direto')) return;
      ev.preventDefault();
      abre(link.getAttribute('href'), link);
    });
  })();

  var flutuante = document.querySelector('.float-wa');
  if (flutuante) {
    flutuante.addEventListener('click', function () {
      rastrear('contato_whatsapp', { origem: 'botao_flutuante', pagina: paginaDeOrigem() });
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll('a[href^="tel:"]'), function (link) {
    link.addEventListener('click', function () {
      rastrear('contato_telefone', { numero: link.getAttribute('href').replace('tel:', '') });
    });
  });

  Array.prototype.forEach.call(document.querySelectorAll('a[data-material]'), function (link) {
    link.addEventListener('click', function () {
      rastrear('download_material', { material: link.getAttribute('data-material') });
    });
  });

  /* ---------------------------------------------------------
     Formulário de contato
     --------------------------------------------------------- */
  var form = document.getElementById('form-contato');
  if (!form) return;

  var status = document.getElementById('form-status');

  var REGRAS = {
    nome: {
      valida: function (v) { return v.trim().length >= 3; },
      erro: 'Informe seu nome completo.'
    },
    email: {
      valida: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); },
      erro: 'Informe um e-mail válido.'
    },
    telefone: {
      valida: function (v) { return v.replace(/\D/g, '').length >= 10; },
      erro: 'Informe um telefone com DDD.'
    },
    assunto: {
      valida: function (v) { return v.trim() !== ''; },
      erro: 'Selecione o tema do seu caso.'
    },
    mensagem: {
      valida: function (v) { return v.trim().length >= 20; },
      erro: 'Descreva o caso em pelo menos 20 caracteres.'
    },
    consentimento: {
      valida: function (v, campo) { return campo.checked; },
      erro: 'É necessário autorizar o contato para prosseguir.'
    }
  };

  function mostraErro(nome, mensagem) {
    var campo = form.elements[nome];
    var alvo = form.querySelector('[data-error-for="' + nome + '"]');
    if (alvo) alvo.textContent = mensagem || '';
    if (campo) {
      if (mensagem) campo.setAttribute('aria-invalid', 'true');
      else campo.removeAttribute('aria-invalid');
    }
  }

  function valida() {
    var primeiroInvalido = null;

    Object.keys(REGRAS).forEach(function (nome) {
      var campo = form.elements[nome];
      if (!campo) return;
      var ok = REGRAS[nome].valida(campo.value || '', campo);
      mostraErro(nome, ok ? '' : REGRAS[nome].erro);
      if (!ok && !primeiroInvalido) primeiroInvalido = campo;
    });

    if (primeiroInvalido) {
      primeiroInvalido.focus();
      defineStatus('Revise os campos destacados antes de enviar.', 'err');
      return false;
    }
    return true;
  }

  // Limpa o erro assim que o visitante corrige o campo.
  Object.keys(REGRAS).forEach(function (nome) {
    var campo = form.elements[nome];
    if (!campo) return;
    campo.addEventListener('input', function () { mostraErro(nome, ''); });
    campo.addEventListener('change', function () { mostraErro(nome, ''); });
  });

  function defineStatus(texto, estado) {
    if (!status) return;
    status.textContent = texto;
    if (estado) status.setAttribute('data-state', estado);
    else status.removeAttribute('data-state');
  }

  function dados() {
    return {
      nome: form.elements.nome.value.trim(),
      email: form.elements.email.value.trim(),
      telefone: form.elements.telefone.value.trim(),
      assunto: form.elements.assunto.value,
      mensagem: form.elements.mensagem.value.trim()
    };
  }

  function corpoTexto(d) {
    return [
      'Nome: ' + d.nome,
      'E-mail: ' + d.email,
      'Telefone: ' + d.telefone,
      'Assunto: ' + d.assunto,
      '',
      'Descrição do caso:',
      d.mensagem,
      '',
      '— Mensagem enviada pelo formulário do site.'
    ].join('\n');
  }

  function enviaPorEmail(d) {
    var url = 'mailto:' + CONFIG.email +
      '?subject=' + encodeURIComponent('[Site] ' + d.assunto + ' — ' + d.nome) +
      '&body=' + encodeURIComponent(corpoTexto(d));
    rastrear('envio_formulario', { canal: 'email', assunto: d.assunto });
    window.location.href = url;
    defineStatus('Abrimos seu programa de e-mail com a mensagem pronta. Basta enviá-la.', 'ok');
  }

  function enviaPorWhatsapp(d) {
    var texto = 'Olá, vim ' + origemPorExtenso() + ' do site.\n\n' + corpoTexto(d);
    rastrear('contato_whatsapp', { origem: 'formulario', assunto: d.assunto });
    window.open('https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(texto), '_blank', 'noopener');
    defineStatus('Abrimos o WhatsApp com a mensagem pronta em outra aba.', 'ok');
  }

  function enviaParaEndpoint(d, botao) {
    var rotuloOriginal = botao ? botao.textContent : '';
    if (botao) { botao.disabled = true; botao.textContent = 'Enviando…'; }
    defineStatus('Enviando sua mensagem…');

    fetch(CONFIG.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(d)
    })
      .then(function (resposta) {
        if (!resposta.ok) throw new Error('Falha no envio');
        rastrear('envio_formulario', { canal: 'endpoint', assunto: d.assunto });
        form.reset();
        defineStatus('Mensagem recebida. O escritório retorna em até dois dias úteis.', 'ok');
      })
      .catch(function () {
        defineStatus('Não foi possível enviar agora. Tente novamente ou fale pelo WhatsApp.', 'err');
      })
      .then(function () {
        if (botao) { botao.disabled = false; botao.textContent = rotuloOriginal; }
      });
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!valida()) return;
    var d = dados();
    if (CONFIG.endpoint) enviaParaEndpoint(d, form.querySelector('button[type="submit"]'));
    else if (CONFIG.email) enviaPorEmail(d);
    else enviaPorWhatsapp(d);
  });

  var botaoWhats = form.querySelector('[data-send="whatsapp"]');
  if (botaoWhats) {
    botaoWhats.addEventListener('click', function () {
      if (!valida()) return;
      enviaPorWhatsapp(dados());
    });
  }
})();
