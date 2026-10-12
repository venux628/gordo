# MEME BOX — Catálogo de memes

Site estático em HTML, CSS e JavaScript. A galeria só mostra as imagens listadas em `js/images.js`.

## Como colocar suas imagens
1. Copie os arquivos de imagem para a pasta `images/`.
2. Abra `js/images.js` em um editor de texto.
3. Dentro de `window.MEME_IMAGES`, adicione uma linha por imagem:

```js
window.MEME_IMAGES = [
  { src: "images/meme-1.jpg", title: "Meme 1" },
  { src: "images/print-engracado.png", title: "Print engraçado" },
];
```

4. Salve e abra `index.html` no navegador. Clique em uma imagem para abrir `detail.html` em outra aba.

## Ferramentas da página de imagem
- Baixar no formato original.
- Converter e baixar como PNG ou JPEG.
- Abrir uma versão própria para impressão.
- PINTE!: editor de desenho por cima da imagem, com pincel, carimbo cômico estilizado, borracha, tamanho, cor, desfazer, limpar e exportar para PNG.

## Importante sobre publicação
Para usar publicamente, envie a pasta inteira para uma hospedagem de site estático (por exemplo, GitHub Pages ou Netlify). Os arquivos em `images/` precisam ser publicados junto com o site. Esta versão não faz upload automático de imagens e não precisa de banco de dados.

## Estrutura
- `index.html` — catálogo.
- `detail.html` — página de imagem, abre em nova aba.
- `css/style.css` — estilo geral.
- `css/detail.css` — estilos do visualizador e editor.
- `js/images.js` — lista de imagens a exibir.
- `js/gallery.js` — pesquisa e catálogo.
- `js/detail.js` — downloads, impressão e editor PINTE!.
- `images/` — coloque suas imagens aqui.


### Mascote falante
O projeto inclui um mascote no canto inferior esquerdo que mostra GIFs aleatórios e comentários quando você interage com a página. Os GIFs ficam na pasta `gifs/`; mantenha essa pasta junto do restante do projeto.


O mascote inclui 200 falas variadas de shitpost, memes, ironia e ragebait. Edite `js/sidekick.js` para personalizar as frases.


## Tela de entrada (nova)
O `index.html` agora é a tela inicial com as opções SIM e NÃO.
- **SIM:** toca `audio/hino-corinthians.mp3` e mostra a tela de carregamento até o áudio acabar; depois abre `catalog.html`.
- **NÃO:** mostra “VAI SE FUDER, VITOR”, toca `audio/fase-corinthians.mp3`; quando esse áudio termina, toca o hino e mostra o carregamento até o fim, depois abre `catalog.html`.
- O vídeo `intro-mascote.mp4` aparece na tela de entrada e o JavaScript tenta remover o fundo verde em tempo real.
- O catálogo foi movido para `catalog.html`; os links de retorno da página do meme apontam para ele.

Se quiser preservar seus memes cadastrados, mantenha/copie seu `js/images.js` atual para esta versão. Mantenha também as pastas `audio/` e o arquivo `intro-mascote.mp4`.


### Vídeo do mascote com fundo removido
O arquivo `intro-mascote-transparent.webm` já está com o fundo verde removido e transparência embutida. Ele é usado na tela de entrada. Mantenha esse arquivo na pasta raiz do projeto.


## Mídia importada
As imagens e vídeos do ZIP enviado foram adicionados à pasta `images/` e cadastrados automaticamente em `js/images.js`. Vídeos aparecem com prévia no catálogo e podem ser assistidos/baixados na página individual. O editor PINTE! é desativado para vídeos. A música de fundo do catálogo continua em looping.
