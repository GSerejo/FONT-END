document.addEventListener('DOMContentLoaded', function() {
    const partidasContainer = document.getElementById('partidas-container');

    async function fetchPartidas() {
        try {
            const response = await fetch('/partidas');
            if (!response.ok) {
                throw new Error('Erro ao buscar as partidas');
            }
            const partidas = await response.json();
            console.log('Partidas recebidas:', partidas); // Verifique no console do navegador se as partidas estão sendo recebidas
            return partidas;
        } catch (error) {
            console.error('Erro:', error);
            return [];
        }
    }

    async function displayPartidas() {
        const partidas = await fetchPartidas();
        partidasContainer.innerHTML = ''; // Limpar o conteúdo anterior

        partidas.forEach(partida => {
            const partidaElement = document.createElement('div');
            partidaElement.classList.add('partida');

            // Exibir os dados da partida conforme necessário
            partidaElement.innerHTML = `
                <h2>${partida.equipe1.jogador1.nome} vs ${partida.equipe2.jogador1.nome}</h2>
                <p>Modo: ${partida.modo}</p>
                <p>Vencedor: ${partida.vencedor}</p>
                <p>Pontuação: ${partida.pontuacao.equipe1} x ${partida.pontuacao.equipe2}</p>
            `;
            
            partidasContainer.appendChild(partidaElement);
        });
    }

    displayPartidas(); // Chama a função para exibir as partidas ao carregar a página
});
