// cadastro.js
document.getElementById('cadastro-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o comportamento padrão do formulário

    // Coleta os valores dos campos de entrada
    var nome = document.getElementById('nome').value;
    var pais = document.getElementById('pais').value;

    // Verifica se os campos não estão vazios antes de enviar
    if (nome === '' || pais === '') {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    // Desativar o botão de envio
    var submitButton = document.getElementById('submit-button');
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';

    // Envia os dados para o servidor usando Fetch
    fetch('/cadastrar-atleta', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Define o tipo de conteúdo como JSON
        },
        body: JSON.stringify({ nome: nome, pais: pais }) // Converte os dados para JSON
    })
    .then(response => {
        submitButton.disabled = false;
        submitButton.textContent = 'Cadastrar';

        if (!response.ok) { // Verifica se a resposta não está OK
            throw new Error('Erro na resposta do servidor');
        }
        return response.text(); // Retorna o texto da resposta
    })
    .then(data => {
        alert('Cadastro realizado com sucesso: ' + data); // Exibe a resposta do servidor
        document.getElementById('cadastro-form').reset(); // Limpa o formulário
    })
    .catch(error => {
        console.error('Erro:', error); // Exibe qualquer erro no console
        alert('Ocorreu um erro ao cadastrar. Por favor, tente novamente.'); // Alerta o usuário sobre o erro
    });
});
