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
    email: 'contato@soaresadvocacia.com.br',
    // WhatsApp em formato internacional, apenas dígitos (55 + DDD + número).
    whatsapp: '550000000000',
    // Opcional: URL de um serviço de formulários (Formspree, Basin, Netlify…).
    // Deixando vazio, o envio abre o cliente de e-mail do visitante.
    endpoint: ''
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
    window.location.href = url;
    defineStatus('Abrimos seu programa de e-mail com a mensagem pronta. Basta enviá-la.', 'ok');
  }

  function enviaPorWhatsapp(d) {
    var texto = 'Olá, vim pelo site.\n\n' + corpoTexto(d);
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
        form.reset();
        defineStatus('Mensagem recebida. O escritório retorna em até dois dias úteis.', 'ok');
      })
      .catch(function () {
        defineStatus('Não foi possível enviar agora. Tente novamente ou escreva para ' + CONFIG.email + '.', 'err');
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
    else enviaPorEmail(d);
  });

  var botaoWhats = form.querySelector('[data-send="whatsapp"]');
  if (botaoWhats) {
    botaoWhats.addEventListener('click', function () {
      if (!valida()) return;
      enviaPorWhatsapp(dados());
    });
  }
})();
