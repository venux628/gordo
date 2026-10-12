# MEMEBOX — Catálogo de memes

Site estático feito em HTML, CSS e JavaScript, preparado para publicação no GitHub Pages.

## Páginas

- `index.html` — tela de entrada com as opções **SIM** e **NÃO**.
- `catalog.html` — galeria de imagens e vídeos, com pesquisa.
- `detail.html` — visualizador individual, com opções de baixar e imprimir imagens.

## Tela de entrada e áudio

- **SIM:** tenta tocar `audio/hino-corinthians.mp3`; quando o áudio termina, abre o catálogo.
- **NÃO:** mostra a mensagem de reação e tenta tocar `audio/fase-corinthians.mp3`; depois segue para o hino e abre o catálogo.
- A trilha de fundo da entrada é carregada de `audio/intro-video-audio.mp3`. Alguns navegadores bloqueiam reprodução automática com som; nesse caso, interaja com a página para liberar o áudio.
- O vídeo do mascote usado atualmente pela tela de entrada é `intro-mascote.mp4`, na raiz do projeto. O arquivo WebM transparente só será usado se o HTML apontar explicitamente para ele.

## Como adicionar imagens e vídeos

1. Coloque os arquivos na pasta `images/`.
2. Edite `js/images.js` e adicione uma entrada em `window.MEME_IMAGES`.

Exemplo de imagem:

```js
{ src: 'images/meu-meme.jpg', title: 'Meu meme', type: 'image' }
```

Exemplo de vídeo:

```js
{ src: 'images/meu-video.mp4', title: 'Meu vídeo', type: 'video' }
```

Os nomes e caminhos precisam corresponder exatamente aos arquivos publicados, incluindo espaços, letras maiúsculas e extensão. O editor PINTE! é destinado a imagens, não a vídeos.

## Estrutura principal

- `css/` — folhas de estilo.
- `js/images.js` — lista de mídia exibida.
- `js/gallery.js` — galeria e pesquisa.
- `js/detail.js` — página individual, downloads e ferramentas de imagem.
- `js/intro.js` — sequência de entrada e controle de áudio.
- `js/sidekick.js` — mascote falante.
- `audio/` — trilhas e efeitos sonoros.
- `gifs/` — GIFs usados pelo mascote.
- `images/` — imagens e vídeos da galeria.

## Publicação

No GitHub, abra **Settings → Pages** e configure a publicação a partir da branch principal (`main`) e da pasta raiz (`/ (root)`). Depois de salvar, aguarde a publicação do GitHub Pages.

O projeto é estático: não possui banco de dados nem upload de arquivos pelo próprio site. Para adicionar mídia, envie os arquivos ao repositório e atualize `js/images.js`.

## Observações

- Confira se todos os arquivos referenciados pelo HTML e JavaScript realmente existem no repositório.
- Se trocar o vídeo do mascote, atualize o caminho em `index.html` para corresponder ao nome real do arquivo.
- Mantenha os diretórios `audio/`, `gifs/`, `images/`, `css/` e `js/` ao publicar o site.
