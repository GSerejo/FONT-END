document.addEventListener('DOMContentLoaded', function() {
    // Função para buscar jogadores do banco de dados
    async function fetchPlayers() {
        try {
            const response = await fetch('/get-players'); // Rota a ser implementada no servidor para buscar os jogadores
            if (!response.ok) {
                throw new Error('Não foi possível obter a lista de jogadores');
            }
            return response.json();
        } catch (error) {
            console.error('Erro ao buscar jogadores:', error.message);
            return [];
        }
    }

    // Função para preencher um <select> com opções de jogadores
    function fillPlayerOptions(selectElement, players) {
        selectElement.innerHTML = '<option value="">Selecione um jogador</option>';
        players.forEach(player => {
            const option = document.createElement('option');
            option.value = player.id; // Assume que cada jogador tem um ID único no banco de dados
            option.textContent = player.nome; // Nome do jogador
            selectElement.appendChild(option);
        });
    }

    // Inicialização dos <select> com os jogadores disponíveis
    async function initializePlayerSelects() {
        const players = await fetchPlayers(); // Busca os jogadores do servidor
        const playerSelects = document.querySelectorAll('.player-select');
        playerSelects.forEach(select => fillPlayerOptions(select, players));
    }

    initializePlayerSelects(); // Chama a função de inicialização ao carregar a página

    // Função para exibir a bandeira na tela
    async function fetchCountryFlag(countryCode, flagContainer) {
        try {
            const response = await fetch(`https://flagcdn.com/64x48/${countryCode.toLowerCase()}.png`);
            if (!response.ok) {
                throw new Error('Não foi possível encontrar a bandeira');
            }
            return response.url;
        } catch (error) {
            console.error('Erro ao buscar a bandeira:', error.message);
            return null;
        }
    }

    // Função para exibir a bandeira na tela
    async function displayCountryFlag(countryCode, flagContainer) {
        flagContainer.innerHTML = ''; // Limpa o conteúdo anterior
        const flagUrl = await fetchCountryFlag(countryCode);
        if (flagUrl) {
            const flagImg = document.createElement('img');
            flagImg.src = flagUrl;
            flagImg.alt = `Bandeira de ${countryCode}`;
            flagContainer.appendChild(flagImg);
        } else {
            flagContainer.textContent = 'Bandeira não encontrada';
        }
    }

    // Função para atualizar a interface com base no modo de jogo selecionado
    function updateGameMode(mode) {
        const isDoubles = mode === 'duplas';
        const player2Containers = document.querySelectorAll('.player2-container');
        player2Containers.forEach(container => {
            container.style.display = isDoubles ? 'block' : 'none';
        });
    }

    // Configurações para os contadores
    const counterConfigs = [
        {
            idSuffix: 'left',
            valueElement: document.getElementById('value-left'),
            plusButton: document.getElementById('plus-left'),
            minusButton: document.getElementById('minus-left'),
            resetButton: document.getElementById('reset-left'),
            titleElement: document.getElementById('title-left'),
            countryInput: document.getElementById('country-left'),
            flagContainer: document.getElementById('flag-container-left'),
            player2TitleElement: document.getElementById('title-left-player2'),
            player2CountryInput: document.getElementById('country-left-player2'),
            selectedOptionElement: document.getElementById('selected-option-left')
        },
        {
            idSuffix: 'right',
            valueElement: document.getElementById('value-right'),
            plusButton: document.getElementById('plus-right'),
            minusButton: document.getElementById('minus-right'),
            resetButton: document.getElementById('reset-right'),
            titleElement: document.getElementById('title-right'),
            countryInput: document.getElementById('country-right'),
            flagContainer: document.getElementById('flag-container-right'),
            player2TitleElement: document.getElementById('title-right-player2'),
            player2CountryInput: document.getElementById('country-right-player2'),
            selectedOptionElement: document.getElementById('selected-option-right')
        }
    ];

    // Inicializar todos os contadores
    counterConfigs.forEach(config => setupCounter(config));

    // Adicionar evento ao botão de envio de dados da partida
    document.getElementById('submit-game-data').addEventListener('click', submitGameData);

    // Adicionar evento aos botões do menu para mudar o modo de jogo
    document.querySelectorAll('.menu-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const mode = event.target.dataset.option.toLowerCase();
            updateGameMode(mode);
            // Atualizar o texto do elemento selecionado
            document.querySelectorAll('.selected-option').forEach(element => {
                element.textContent = `Selecionado: ${event.target.textContent}`;
            });
        });
    });

    // Função para configurar um contador específico
    function setupCounter(config) {
        const {
            idSuffix,
            valueElement,
            plusButton,
            minusButton,
            resetButton,
            titleElement,
            countryInput,
            flagContainer,
            player2TitleElement,
            player2CountryInput,
            selectedOptionElement
        } = config;

        // Exemplo de função para incrementar e decrementar o contador
        function increment() {
            let currentValue = parseInt(valueElement.textContent);
            valueElement.textContent = currentValue + 1;
        }

        function decrement() {
            let currentValue = parseInt(valueElement.textContent);
            if (currentValue > 0) {
                valueElement.textContent = currentValue - 1;
            }
        }

        // Limpar contador
        function reset() {
            valueElement.textContent = '0';
            titleElement.value = '';
            countryInput.value = '';
            flagContainer.innerHTML = '';
            player2TitleElement.value = '';
            player2CountryInput.value = '';
            selectedOptionElement.textContent = `Selecionado: Nenhum`;
        }

        // Adicionar eventos aos botões
        plusButton.addEventListener('click', increment);
        minusButton.addEventListener('click', decrement);
        resetButton.addEventListener('click', reset);
    }

    // Função para enviar dados da partida
    async function submitGameData() {
        // Coletar dados dos contadores e campos de entrada
        const equipe1Jogador1Nome = document.getElementById('title-left').value;
        const equipe1Jogador1Pais = document.getElementById('country-left').value;
        const equipe1Jogador2Nome = document.getElementById('title-left-player2').value;
        const equipe1Jogador2Pais = document.getElementById('country-left-player2').value;

        const equipe2Jogador1Nome = document.getElementById('title-right').value;
        const equipe2Jogador1Pais = document.getElementById('country-right').value;
        const equipe2Jogador2Nome = document.getElementById('title-right-player2').value;
        const equipe2Jogador2Pais = document.getElementById('country-right-player2').value;

        const equipe1Pontuacao = parseInt(document.getElementById('value-left').textContent);
        const equipe2Pontuacao = parseInt(document.getElementById('value-right').textContent);

        const mode = document.querySelector('.selected-option').textContent.toLowerCase();
        const winner = determineWinner(equipe1Pontuacao, equipe2Pontuacao);

        // Montar objeto com os dados da partida
        const data = {
            equipe1: {
                jogador1: {
                    nome: equipe1Jogador1Nome,
                    pais: equipe1Jogador1Pais
                },
                jogador2: {
                    nome: equipe1Jogador2Nome,
                    pais: equipe1Jogador2Pais
                }
            },
            equipe2: {
                jogador1: {
                    nome: equipe2Jogador1Nome,
                    pais: equipe2Jogador1Pais
                },
                jogador2: {
                    nome: equipe2Jogador2Nome,
                    pais: equipe2Jogador2Pais
                }
            },
            pontuacao: {
                equipe1: equipe1Pontuacao,
                equipe2: equipe2Pontuacao
            },
            mode: mode,
            winner: winner
        };

        try {
            // Enviar os dados da partida para o servidor
            const response = await fetch('/submit-game-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Erro ao enviar os dados da partida');
            }

            console.log('Dados da partida enviados com sucesso');

            // Aqui você pode adicionar lógica para mostrar mensagem de sucesso, reiniciar campos, etc.

        } catch (error) {
            console.error('Erro ao enviar os dados da partida:', error.message);
        }
    }

    // Função para determinar o vencedor da partida
    function determineWinner(pontuacaoEquipe1, pontuacaoEquipe2) {
        if (pontuacaoEquipe1 > pontuacaoEquipe2) {
            return 'equipe1';
        } else if (pontuacaoEquipe2 > pontuacaoEquipe1) {
            return 'equipe2';
        } else {
            return 'empate'; // Em caso de empate, você pode ajustar conforme necessário
        }
    }
});
