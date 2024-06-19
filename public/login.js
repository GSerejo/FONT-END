// Função para lidar com a submissão do formulário de login
document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('login-form');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  
  if (loginForm) {
      loginForm.addEventListener('submit', function(event) {
          event.preventDefault();
          const username = usernameInput.value;
          const password = passwordInput.value;

          if (username === 'juiz' && password === '123') {
              alert('Login bem-sucedido!');
              window.location.href = 'home.html'; 
          } else {
              alert('Nome de usuário ou senha incorretos.');
              usernameInput.classList.add('invalid');
              passwordInput.classList.add('invalid');
          }
      });

      // Remover a classe 'invalid' ao focar no input
      usernameInput.addEventListener('input', () => usernameInput.classList.remove('invalid'));
      passwordInput.addEventListener('input', () => passwordInput.classList.remove('invalid'));
  }

  // Variáveis para a física da bola
  const bola = document.getElementById('bola');
  let mouseX, mouseY, lastMouseX, lastMouseY;
  let bolaX = 0, bolaY = 0;
  let vx = 0, vy = 0;
  const friction = 0.98;
  const gravity = 0.5;
  let isDragging = false;

  if (bola) {
      // Event listeners para arrastar a bola
      bola.addEventListener('mousedown', startDrag);
      bola.addEventListener('mouseup', endDrag);
      bola.addEventListener('touchstart', startDrag);
      bola.addEventListener('touchend', endDrag);
      document.addEventListener('mousemove', moveBola);
      document.addEventListener('touchmove', moveBola);
      document.addEventListener('mouseleave', endDrag);

      // Função para iniciar o arrasto da bola
      function startDrag(event) {
          isDragging = true;
          const clientX = event.clientX || event.touches[0].clientX;
          const clientY = event.clientY || event.touches[0].clientY;
          lastMouseX = clientX;
          lastMouseY = clientY;
      }

      // Função para terminar o arrasto da bola
      function endDrag() {
          isDragging = false;
      }

      // Função para mover a bola enquanto arrastada
      function moveBola(event) {
          if (isDragging) {
              const clientX = event.clientX || event.touches[0].clientX;
              const clientY = event.clientY || event.touches[0].clientY;
              mouseX = clientX;
              mouseY = clientY;
              const dx = mouseX - lastMouseX;
              const dy = mouseY - lastMouseY;
              bolaX += dx;
              bolaY += dy;
              lastMouseX = mouseX;
              lastMouseY = mouseY;
              updateBolaPosition();
          }
      }

      // Função para atualizar a posição da bola na tela
      function updateBolaPosition() {
          bola.style.left = bolaX + 'px';
          bola.style.top = bolaY + 'px';
      }

      // Função para atualizar a física da bola
      function updatePhysics() {
          if (!isDragging) {
              // Aplicando atrito
              vx *= friction;
              vy *= friction;

              // Aplicando gravidade
              vy += gravity;

              // Atualizando posição da bola
              bolaX += vx;
              bolaY += vy;

              // Limitando a bola dentro da janela
              if (bolaX < 0) {
                  bolaX = 0;
                  vx *= -1; // Rebate na parede
              }
              if (bolaY < 0) {
                  bolaY = 0;
                  vy *= -1; // Rebate no teto
              }
              if (bolaX > window.innerWidth - bola.offsetWidth) {
                  bolaX = window.innerWidth - bola.offsetWidth;
                  vx *= -1; // Rebate na parede direita
              }
              if (bolaY > window.innerHeight - bola.offsetHeight) {
                  bolaY = window.innerHeight - bola.offsetHeight;
                  vy *= -1; // Rebate no chão
              }

              // Atualizando a posição da bola na tela
              updateBolaPosition();
          }

          // Solicitação de nova animação
          requestAnimationFrame(updatePhysics);
      }

      updatePhysics(); // Iniciar a física da bola
  }
});
