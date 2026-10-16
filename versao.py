#!/usr/bin/env python3
"""Carimba CSS e JS com a versão do próprio conteúdo.

Sem isso, o navegador segue usando a folha de estilo antiga depois de um
deploy — o arquivo tem o mesmo nome, então ele não busca de novo. Com o
carimbo, cada alteração gera um endereço novo e o navegador é obrigado a
buscar. Rodar antes de cada commit que mexa em assets/css ou assets/js.
"""
import hashlib, pathlib, re

RAIZ = pathlib.Path(__file__).resolve().parent

def versao(caminho):
    return hashlib.sha256((RAIZ / caminho).read_bytes()).hexdigest()[:8]

ALVOS = {
    'assets/css/styles.css': versao('assets/css/styles.css'),
    'assets/js/main.js':     versao('assets/js/main.js'),
}

mudadas = 0
for pagina in sorted(RAIZ.glob('*.html')):
    texto = original = pagina.read_text()
    for arquivo, v in ALVOS.items():
        texto = re.sub(
            re.escape(arquivo) + r'(\?v=[0-9a-f]+)?(?=")',
            f'{arquivo}?v={v}',
            texto,
        )
    if texto != original:
        pagina.write_text(texto)
        mudadas += 1

for arquivo, v in ALVOS.items():
    print(f'  {arquivo}  ->  ?v={v}')
print(f'páginas carimbadas: {mudadas}')
