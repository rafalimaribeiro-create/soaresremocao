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
    // Deixando vazio, o envio abre o cliente de e-mail do visitante.
    endpoint: '',
    // Google Analytics 4: cole aqui o ID de medição (formato G-XXXXXXXXXX).
    // Vazio = nenhuma medição é carregada e nenhum cookie é gravado.
    analytics: 'G-TESTE12345'
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
    if (!CONFIG.analytics || window.gtag) return;
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + CONFIG.analytics;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', CONFIG.analytics, { anonymize_ip: true });
  }

  // Registra um evento. Sem consentimento ou sem ID configurado, não faz nada.
  function rastrear(nome, parametros) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', nome, parametros || {});
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
  var flutuante = document.querySelector('.float-wa');
  if (flutuante) {
    flutuante.addEventListener('click', function () {
      rastrear('contato_whatsapp', { origem: 'botao_flutuante' });
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll('a[href^="tel:"]'), function (link) {
    link.addEventListener('click', function () {
      rastrear('contato_telefone', { numero: link.getAttribute('href').replace('tel:', '') });
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
    var texto = 'Olá, vim pelo site.\n\n' + corpoTexto(d);
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
