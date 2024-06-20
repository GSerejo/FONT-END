document.addEventListener('DOMContentLoaded', function() {
    // Função para buscar a bandeira de um país
    async function fetchCountryFlag(countryCode) {
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

    // Função para configurar um contador
    function setupCounter(config) {
        let count = 0;

        const updateValue = () => {
            config.valueElement.textContent = count;
        };

        const togglePlayer2Input = (show) => {
            const player2Container = document.getElementById(`player2-container-${config.idSuffix}`);
            player2Container.style.display = show ? 'block' : 'none';
        };

        config.plusButton.addEventListener('click', () => {
            count++;
            updateValue();
        });

        config.minusButton.addEventListener('click', () => {
            if (count > 0) {
                count--;
                updateValue();
            }
        });

        config.resetButton.addEventListener('click', () => {
            count = 0;
            updateValue();
        });

        config.titleElement.addEventListener('input', () => {
            config.titleElement.value = config.titleElement.value.trim(); // Remove espaços em branco extras
            config.titleElement.dataset.title = config.titleElement.value; // Atualiza o atributo "data-title"
        });

        config.countryInput.addEventListener('keyup', async (event) => {
            const countryCode = event.target.value.toUpperCase(); // Transforma o texto em maiúsculas
            if (countryCode.length === 2) { // Verifica se o código tem duas letras
                await displayCountryFlag(countryCode, config.flagContainer);
            }
        });

        document.querySelectorAll('.menu-button').forEach(button => {
            button.addEventListener('click', (event) => {
                // Atualiza o texto do elemento selecionado
                document.querySelector(`#${config.selectedOptionElement.id}`).textContent = `Selecionado: ${event.target.dataset.option}`;

                // Atualiza a visibilidade do segundo jogador conforme necessário
                const option = event.target.dataset.option.toLowerCase();
                togglePlayer2Input(option === 'duplas');
            });
        });

        // Inicializa o valor do contador
        updateValue();
    }

    // Função para enviar os dados da partida
    async function submitGameData() {
        const player1 = {
            name: document.getElementById('title-left').value.trim(),
            country: document.getElementById('country-left').value.trim(),
            points: parseInt(document.getElementById('value-left').textContent)
        };

        const player2 = {
            name: document.getElementById('title-right').value.trim(),
            country: document.getElementById('country-right').value.trim(),
            points: parseInt(document.getElementById('value-right').textContent)
        };

        // Verifica se todos os campos obrigatórios estão preenchidos
        if (!player1.name || !player1.country || !player2.name || !player2.country) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        // Seleciona o modo da partida
        const selectedButton = document.querySelector('.menu-button.selected');
        const mode = selectedButton ? selectedButton.getAttribute('data-option').toLowerCase() : '';

        const winner = player1.points > player2.points ? player1.name : player2.name;

        const gameData = {
            player1,
            player2,
            winner,
            mode
        };

        try {
            const response = await fetch('/submit-game-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(gameData)
            });

            if (!response.ok) {
                throw new Error('Erro ao enviar os dados da partida');
            }

            alert('Dados da partida enviados com sucesso');
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao enviar os dados da partida');
        }
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
            selectedOptionElement: document.getElementById('selected-option-right')
        }
    ];

    // Inicializar todos os contadores
    counterConfigs.forEach(config => setupCounter(config));

    // Adicionar evento ao botão de envio de dados da partida
    document.getElementById('submit-game-data').addEventListener('click', submitGameData);
});
