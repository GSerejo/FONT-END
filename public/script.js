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
    async function displayCountryFlag(countryCode, flagContainerId) {
        const flagContainer = document.getElementById(flagContainerId);
        flagContainer.innerHTML = ''; // Limpa o conteúdo anterior
        const flagUrl = await fetchCountryFlag(countryCode);
        if (flagUrl) {
            const flagImg = document.createElement('img');
            flagImg.src = flagUrl;
            flagImg.alt = 'Bandeira do país';
            flagContainer.appendChild(flagImg);
        } else {
            flagContainer.textContent = 'Bandeira não encontrada';
        }
    }

    // Função para configurar um contador
    function setupCounter(valueElement, plusButton, minusButton, resetButton, titleElement, countryInput, flagContainerId, selectedOptionElement) {
        let count = 0;

        const updateValue = () => {
            valueElement.textContent = count;
        };

        const togglePlayer2Input = (show) => {
            const player2Container = document.getElementById(`player2-container-${valueElement.id.split('-')[1]}`);
            if (show) {
                player2Container.style.display = 'block';
            } else {
                player2Container.style.display = 'none';
            }
        };

        plusButton.addEventListener('click', () => {
            count++;
            updateValue();
        });

        minusButton.addEventListener('click', () => {
            if (count > 0) {
                count--;
                updateValue();
            }
        });

        resetButton.addEventListener('click', () => {
            count = 0;
            updateValue();
        });

        titleElement.addEventListener('input', () => {
            titleElement.value = titleElement.value.trim(); // Remove espaços em branco extras
            titleElement.dataset.title = titleElement.value; // Atualiza o atributo "data-title"
        });

        countryInput.addEventListener('keyup', async (event) => {
            const countryCode = event.target.value.toUpperCase(); // Transforma o texto em maiúsculas
            if (countryCode.length === 2) { // Verifica se o código tem duas letras
                await displayCountryFlag(countryCode, flagContainerId);
            }
        });

        document.querySelectorAll('.menu-button').forEach(button => {
            button.addEventListener('click', (event) => {
                selectedOptionElement.textContent = `Selecionado: ${event.target.dataset.option}`;
                const option = event.target.dataset.option.toLowerCase();
                if (option === 'duplas') {
                    togglePlayer2Input(true);
                } else {
                    togglePlayer2Input(false);
                }
            });
        });
    }

    // Função de navegação
    // Removendo essa função porque não precisamos navegar para outra página
    // window.navigateTo = function(url) {
    //     window.location.href = url;
    // }

    // Configurando o contador da esquerda
    const valueElementLeft = document.getElementById('value-left');
    const plusButtonLeft = document.getElementById('plus-left');
    const minusButtonLeft = document.getElementById('minus-left');
    const resetButtonLeft = document.getElementById('reset-left');
    const titleElementLeft = document.getElementById('title-left');
    const countryInputLeft = document.getElementById('country-left');
    const selectedOptionLeft = document.getElementById('selected-option-left');
    setupCounter(valueElementLeft, plusButtonLeft, minusButtonLeft, resetButtonLeft, titleElementLeft, countryInputLeft, 'flag-container-left', selectedOptionLeft);

    // Configurando o contador da direita
    const valueElementRight = document.getElementById('value-right');
    const plusButtonRight = document.getElementById('plus-right');
    const minusButtonRight = document.getElementById('minus-right');
    const resetButtonRight = document.getElementById('reset-right');
    const titleElementRight = document.getElementById('title-right');
    const countryInputRight = document.getElementById('country-right');
    const selectedOptionRight = document.getElementById('selected-option-right');
    setupCounter(valueElementRight, plusButtonRight, minusButtonRight, resetButtonRight, titleElementRight, countryInputRight, 'flag-container-right', selectedOptionRight);
});
