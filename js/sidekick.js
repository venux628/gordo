(() => {
  const root = document.getElementById('memeSidekick');
  if (!root) return;
  const bubble = root.querySelector('.sidekick-bubble');
  const gif = root.querySelector('.sidekick-gif');

  const phrases = [
    "que que tu tá aprontando aí 💀",
    "isso aí vai pro grupo, certeza",
    "meu advogado pediu pra eu não comentar",
    "tá procurando o quê, criatura?",
    "calma calabreso, é só um site",
    "isso tem cheiro de ideia ruim",
    "eu vi isso. infelizmente.",
    "vai com fé (mas sem garantia)",
    "o fiscal de meme chegou",
    "KKKKKKKK não é possível",
    "clicou com convicção, gostei",
    "isso aqui tá ficando suspeito",
    "se der ruim, eu nem tava aqui",
    "mais um dia normal na internet",
    "tua curiosidade ainda vai te levar longe",
    "não julgo… só observo 👁️",
    "isso foi muito específico, hein",
    "alguém precisa tirar teu mouse de você",
    "aí tu me quebra",
    "fazendo história ou passando vergonha?",
    "Vitor online: a dignidade offline",
    "esse site foi feito com 3 neurônios e um sonho",
    "KKKKKKKKKKKKKKKKKK",
    "não era pra tu ver isso",
    "conteúdo de qualidade duvidosa",
    "isso aqui tem cheiro de ban temporário",
    "o cachorro olheira aprovaria essa atrocidade",
    "olheira nível: atualização do Windows às 3 da manhã",
    "essa imagem precisa de terapia",
    "isso não é meme, é evidência",
    "meu humor foi de base e deixou uma carta",
    "alguém chama o mod, mas não explica por quê",
    "isso foi tão ruim que ficou bom",
    "é bait? é arte? é um pedido de ajuda?",
    "me recuso a elaborar",
    "se entendeu, procure ajuda (brincadeira… talvez)",
    "o algoritmo vai fingir que não viu",
    "KKKKKKKK que desgraça é essa",
    "mais um patrimônio cultural da internet",
    "essa pasta devia ter classificação indicativa",
    "um meme por dia afasta a produtividade",
    "produtividade detectada: encerrando processo",
    "teu histórico de pesquisa tá suando frio",
    "isso merece ser impresso e escondido no sótão",
    "meu último neurônio acabou de pedir demissão",
    "essa é a definição de “não tankei”",
    "não tankei nem o carregamento",
    "carregou e piorou tudo",
    "pior que eu ri, vou negar em juízo",
    "não mostra isso pra tua família",
    "manda no grupo e silencia as notificações",
    "esse meme tem energia de 2014",
    "voltamos ao auge da internet ruim",
    "nostalgia desbloqueada, vergonha também",
    "parece feito no Paint com raiva",
    "isso foi editado com os pés?",
    "foi o que tinha pra hoje, família",
    "administração pública do caos",
    "bem-vindo ao museu do mau gosto",
    "não encosta, é peça histórica",
    "olha o estado dessa relíquia",
    "isso aqui tem mais camadas que cebola",
    "cada clique piora a situação",
    "não existe contexto que salve isso",
    "contexto: não tinha contexto",
    "perdi 4 pontos de QI e ganhei um meme",
    "meu psicólogo vai ouvir sobre isso",
    "meu terapeuta acabou de fechar o aplicativo",
    "isso é entre você, eu e o algoritmo",
    "finge naturalidade e continua rolando",
    "rolagem infinita rumo ao arrependimento",
    "um abismo olhando para outro abismo",
    "os dois neurônios discutiram e escolheram isso",
    "cérebro em modo economia de energia",
    "modo avião para a consciência",
    "meu bom senso tá sem sinal",
    "meu senso crítico foi tomar água e não voltou",
    "KKKKKKKK alguém me interna no grupo da família",
    "não compartilha isso às 2 da manhã",
    "às 2 da manhã tudo fica 30% mais engraçado",
    "humor de quem dormiu 2 horas",
    "isso tem cheiro de madrugada e energético",
    "madrugada: quando o bom senso sai do servidor",
    "seu sono foi sacrificado por essa obra",
    "o travesseiro tá decepcionado contigo",
    "vai dormir, campeão",
    "não vai dormir? então toma mais um meme",
    "só mais um scroll, confia",
    "último meme antes de virar a noite (mentira)",
    "amanhã tu explica isso pro teu chefe",
    "se perguntarem, foi pesquisa acadêmica",
    "estudo de campo sobre a falta de noção",
    "pesquisadores ainda tentam entender essa imagem",
    "fonte: vozes da minha cabeça",
    "fonte: confia no pai",
    "argumento impecável, evidência nenhuma",
    "opinião forte, argumento em manutenção",
    "discordo e vou continuar errado com confiança",
    "ragebait de qualidade artesanal",
    "bait fraco, tenta de novo",
    "caí no bait? jamais (caí)",
    "eu não caio em bait, só tropeço nele",
    "vou responder só pra aumentar o engajamento",
    "comentário polêmico em 3, 2, 1…",
    "hoje eu escolhi o caos nos comentários",
    "falei besteira e saí correndo",
    "se ficou bravo, o plano funcionou",
    "não alimenta o troll (me dá comida)",
    "regebaiter trabalhando em horário comercial",
    "ragebait com carteira assinada",
    "provocação premium, entrega grátis",
    "opinião feita pra irritar até uma parede",
    "essa discussão não paga meu aluguel",
    "ganhou o debate e perdeu o sábado",
    "argumento tão torto que fez curva",
    "não é opinião, é teste de paciência",
    "vou fingir que isso faz sentido",
    "comentário escrito com os cotovelos",
    "um especialista em absolutamente nada",
    "certificado pela Universidade do Achismo",
    "doutorado em falar sem pensar",
    "pós-graduação em meme duvidoso",
    "professor titular de coisa nenhuma",
    "me chamaram pra opinar e eu piorei tudo",
    "minha contribuição foi atrapalhar",
    "essa ideia veio sem manual e sem freio",
    "freio moral: não encontrado",
    "consciência carregando… erro 404",
    "bom senso indisponível no momento",
    "atualização de bom senso falhou",
    "reinicie o cérebro e tente novamente",
    "sistema emocional encontrou um erro",
    "Windows da mente: tela azul",
    "RAM mental esgotada",
    "processador rodando a 2% de dignidade",
    "GPU renderizando vergonha em 4K",
    "internet rápida, decisões lentas",
    "latência alta entre ideia e arrependimento",
    "ping 999 no bom senso",
    "servidor de dignidade fora do ar",
    "os mods estão dormindo, postem tudo",
    "não sou eu, é o personagem",
    "isso é lore, não é crime de gosto",
    "lore tão confusa que precisa de wiki",
    "arco de personagem questionável",
    "plot twist: era ruim desde o começo",
    "final alternativo: fechar a aba",
    "cena pós-créditos: mais vergonha",
    "isso parece side quest de um jogo amaldiçoado",
    "NPC com diálogo de procedência duvidosa",
    "missão secundária: recuperar o respeito próprio",
    "objetivo atualizado: parar de clicar",
    "conquista desbloqueada: que perda de tempo",
    "achievement: humor inexplicável",
    "troféu de bronze em falta de noção",
    "speedrun de perder a dignidade",
    "recorde mundial de contexto perdido",
    "categoria any% sem bom senso",
    "isso não estava no tutorial",
    "o tutorial também desistiu",
    "jogo salvo antes da decisão ruim",
    "checkpoint da vergonha alcançado",
    "respawn em outro grupo do Discord",
    "banido do bom gosto por 30 dias",
    "seu meme foi reprovado pelo conselho",
    "comitê de memes pediu uma pausa",
    "jurados estão deliberando e rindo",
    "veredito: infelizmente engraçado",
    "pena: 200 horas de scroll",
    "serviço comunitário: mandar meme bom",
    "multa por excesso de internet",
    "isso devia vir com aviso de conteúdo",
    "aviso: pode causar risada involuntária",
    "efeitos colaterais incluem mandar no grupo",
    "não usar antes de conversar com humanos",
    "mantenha fora do alcance dos adultos",
    "produto não recomendado para reuniões",
    "use em ambiente ventilado e sem supervisores",
    "não ingerir o conteúdo deste meme",
    "este meme pode conter traços de absurdo",
    "100% meme, 0% responsabilidade",
    "qualidade artesanal, vergonha industrial",
    "feito à mão por um goblin cansado",
    "feito com carinho e nenhum planejamento",
    "parece caro, mas custou minha sanidade",
    "orçamento: três reais e um sonho",
    "patrocinado por decisões ruins",
    "aprovado por ninguém em particular",
    "selo de qualidade: confiança duvidosa",
    "nota 10 em causar perguntas",
    "nota 0 em explicar o contexto",
    "essa imagem explica tudo e nada",
    "se eu explicar, perde a graça (não tem graça)",
    "risada nervosa detectada",
    "isso me fez soltar ar pelo nariz",
    "sorri por fora, questionei por dentro",
    "KKKKK parei, agora fiquei preocupado",
    "ri alto e olhei pros lados",
    "riso proibido em ambiente silencioso",
    "silêncio na sala, caos na mente"
  ];
  const gifs = [
    '3dgifmaker00789.gif','3dgifmaker08093.gif','3dgifmaker15183.gif',
    '3dgifmaker28205.gif','3dgifmaker46279.gif','3dgifmaker57028.gif',
    '3dgifmaker05126.gif','3dgifmaker24875.gif','3dgifmaker35259.gif',
    '3dgifmaker44477.gif','3dgifmaker53860.gif','3dgifmaker63357.gif',
    '3dgifmaker73933.gif','3dgifmaker82958.gif','3dgifmaker93362.gif',
    '3dgifmaker03289.gif','3dgifmaker09231.gif','3dgifmaker25945.gif',
    '3dgifmaker32289.gif'
  ];

  // O navegador só libera áudio depois de uma interação do usuário.
  const voice = new Audio('audio/voice_sans.mp3');
  voice.preload = 'auto';
  voice.volume = 0.42;
  let audioUnlocked = false;
  let lastPhrase = -1, lastGif = -1, lastSpoke = 0, hideTimer, typingTimer;
  let audioTick = 0;

  function unlockAudio() {
    if (audioUnlocked) return;
    audioUnlocked = true;
    // Inicia e pausa silenciosamente para preparar a reprodução após interação.
    const oldVolume = voice.volume;
    voice.volume = 0;
    const p = voice.play();
    if (p && typeof p.then === 'function') {
      p.then(() => { voice.pause(); voice.currentTime = 0; voice.volume = oldVolume; })
        .catch(() => { voice.volume = oldVolume; audioUnlocked = false; });
    } else {
      voice.pause(); voice.currentTime = 0; voice.volume = oldVolume;
    }
  }
  document.addEventListener('pointerdown', unlockAudio, { once: true });
  document.addEventListener('keydown', unlockAudio, { once: true });

  function randomIndex(length, previous) {
    if (length < 2) return 0;
    let n;
    do { n = Math.floor(Math.random() * length); } while (n === previous);
    return n;
  }

  function playTextBlip(char) {
    if (!audioUnlocked || !char || /\s/.test(char)) return;
    // Toca o som enviado em pequenas batidas, no ritmo da escrita.
    const blip = voice.cloneNode();
    blip.volume = 0.32;
    blip.playbackRate = 1.12;
    blip.currentTime = 0;
    const promise = blip.play();
    if (promise && promise.catch) promise.catch(() => {});
  }

  function typeText(text) {
    clearInterval(typingTimer);
    bubble.textContent = '';
    let i = 0;
    audioTick = 0;
    typingTimer = setInterval(() => {
      if (i >= text.length) {
        clearInterval(typingTimer);
        return;
      }
      const char = text[i++];
      bubble.textContent += char;
      // O som é alternado entre letras para manter o efeito retrô sem ficar estridente.
      if (!/[.,!?…💀👁️]/u.test(char)) {
        audioTick++;
        if (audioTick % 2 === 1) playTextBlip(char);
      }
    }, 34);
  }

  function speak(force = false) {
    const now = Date.now();
    if (!force && now - lastSpoke < 3500) return;
    lastSpoke = now;
    lastPhrase = randomIndex(phrases.length, lastPhrase);
    lastGif = randomIndex(gifs.length, lastGif);
    typeText(phrases[lastPhrase]);
    gif.src = `gifs/${gifs[lastGif]}`;
    root.classList.add('is-talking');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => root.classList.remove('is-talking'), 6500);
  }

  // Primeira fala aparece ao abrir o site; o som começa após a primeira interação.
  speak(true);
  document.addEventListener('click', (event) => {
    if (root.contains(event.target)) return;
    speak();
  });
  document.addEventListener('input', (event) => {
    if (event.target.matches('input, textarea, select')) speak();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' || event.key.startsWith('Arrow')) return;
    speak();
  });
  let scrollTick = false;
  window.addEventListener('scroll', () => {
    if (scrollTick) return;
    scrollTick = true;
    setTimeout(() => { speak(); scrollTick = false; }, 250);
  }, { passive: true });
  gif.addEventListener('error', () => { root.classList.add('gif-missing'); });
})();
