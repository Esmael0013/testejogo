const playArea = document.getElementById('play-area');
const scoreDisplay = document.getElementById('score');
const missedDisplay = document.getElementById('missed');
const startButton = document.getElementById('start-btn');
const gameOverContainer = document.getElementById('game-over');
const gameOverText = document.getElementById('game-over-text');
const restartButton = document.getElementById('restart-btn');

let score = 0;
let missed = 0;
let gameInterval;
let speed = 3000; // Velocidade inicial
let gameRunning = false; // Para controle de estado do jogo
let currentObjects = []; // Para manter o controle dos objetos em queda

const phrases = [
  "Que pena! Você perdeu! 💔",
  "Jogo finalizado! Até a próxima! 👋",
  "Ops! Tente de novo! 🔄",
  "Fim de jogo! Bom trabalho! 💪"
];

// Carregar os sons
const clickSound = new Audio('Click - Sound Effect (HD).mp3'); // Som de clique
const victorySound = new Audio('vitória ｜ 🔊 efeito sonoro para vídeo🔊.mp3'); // Som de vitória
const backgroundMusic = new Audio('Undertale OST： 051 - Another Medium.mp3'); // Música de fundo

// Pré-carregar os sons (garante que o som está pronto antes de ser tocado)
clickSound.load();
victorySound.load();
backgroundMusic.loop = true; // Configura a música para tocar em loop
backgroundMusic.volume = 0.1; // Define o volume bem baixo
backgroundMusic.load(); // Carrega a música

function startGame() {
  score = 0;
  missed = 0;
  speed = 3000; // Reset da velocidade
  gameRunning = true; // Marca o jogo como ativo
  updateStats();
  startButton.style.display = 'none';
  gameOverContainer.style.display = 'none';
  currentObjects = []; // Limpar lista de objetos
  
  backgroundMusic.play(); // Inicia a música de fundo
  spawnObjects();
}

function spawnObjects() {
  gameInterval = setInterval(() => {
    if (!gameRunning) return; // Não cria novos objetos se o jogo acabou

    const object = document.createElement('div');
    object.classList.add('falling-object');

    // Randomiza o tipo de item
    const type = Math.random();
    if (type < 0.6) {
      object.classList.add('object1');
    } else if (type < 0.9) {
      object.classList.add('object2');
    } else if (type < 0.97) {
      object.classList.add('object3');
    } else {
      object.classList.add('special-item'); // Item especial
    }

    // Define a posição inicial aleatória
    object.style.left = Math.random() * (playArea.offsetWidth - 60) + 'px';
    playArea.appendChild(object);
    currentObjects.push(object); // Adiciona o objeto à lista de objetos

    // Detecta clique no objeto
    object.addEventListener('click', () => {
      // Tocar o som de forma consistente
      clickSound.currentTime = 0; // Reinicia o som, garantindo que não sobreponha
      clickSound.play();

      // Lógica de pontuação
      if (object.classList.contains('special-item')) {
        score += 5; // Pontuação maior para o item especial
      } else {
        score++;
      }
      updateStats();
      object.remove();
      currentObjects = currentObjects.filter(item => item !== object); // Remove da lista
    });

    // Detecta quando o objeto atinge o final da tela
    object.addEventListener('animationend', () => {
      if (object.parentElement) {
        // Só adiciona erro se o objeto ainda não foi removido
        if (currentObjects.includes(object)) {
          missed++; // Incrementa erros se o objeto atingir o final
          updateStats();
        }
        object.remove(); // Remove o objeto ao atingir o final
        currentObjects = currentObjects.filter(item => item !== object); // Remove da lista
        checkGameOver();
      }
    });
  }, 800);

  // Aumenta a dificuldade com o tempo
  setInterval(() => {
    if (gameRunning && speed > 1500) speed -= 50; // Reduz a velocidade de forma mais gradual
  }, 5000);
}

function updateStats() {
  scoreDisplay.textContent = `Pontuação: ${score}`;
  missedDisplay.textContent = `Erros: ${missed} / 2`;
}

function checkGameOver() {
  if (missed >= 2) {
    gameRunning = false; // Para o estado do jogo
    clearInterval(gameInterval); // Para criação de objetos
    removeFallingObjects(); // Remove objetos restantes em queda
    endGame();
  }
}

function endGame() {
  // Atualiza a frase aleatória de Game Over
  gameOverText.textContent = `${phrases[Math.floor(Math.random() * phrases.length)]} Sua pontuação: ${score}`;
  gameOverContainer.style.display = 'block';

  // Tocar o som de vitória se o jogo terminar com sucesso (pontuação >= 0)
  if (score > 0) {
    victorySound.play();
  }

  backgroundMusic.pause(); // Pausa a música de fundo quando o jogo termina
  backgroundMusic.currentTime = 0; // Reseta a posição da música
}

function removeFallingObjects() {
  // Remove todos os objetos que estão caindo
  currentObjects.forEach(object => {
    object.remove();
  });
  currentObjects = []; // Limpa a lista de objetos
}

restartButton.addEventListener('click', startGame);
startButton.addEventListener('click', startGame);
