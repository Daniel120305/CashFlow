document.addEventListener('DOMContentLoaded', function () {
    // Máscara para o campo CEP
    const cepInput = document.getElementById('cep');
    cepInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
        e.target.value = value;
    });

    // Buscar CEP
    const buscarCepBtn = document.querySelector('.btn-buscar-cep');
    buscarCepBtn.addEventListener('click', function () {
        const cep = cepInput.value.replace(/\D/g, '');

        if (cep.length !== 8) {
            alert('Por favor, digite um CEP válido com 8 dígitos.');
            return;
        }

        // Simulação de busca de CEP usando a API ViaCEP
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('CEP não encontrado');
                }
                return response.json();
            })
            .then(data => {
                if (data.erro) {
                    throw new Error('CEP não encontrado');
                }

                document.getElementById('logradouro').value = data.logradouro || '';
                document.getElementById('bairro').value = data.bairro || '';
                document.getElementById('cidade').value = data.localidade || '';
                document.getElementById('estado').value = data.uf || '';

                // Focar no complemento após preencher os dados
                document.getElementById('complemento').focus();
            })
            .catch(error => {
                console.error('Erro ao buscar CEP:', error);
                alert(error.message || 'Erro ao buscar CEP. Tente novamente.');
            });
    });

    // Navegação entre passos
    const btnAnterior = document.querySelector('.btn-secondary');
    btnAnterior.addEventListener('click', function () {
        // Aqui você pode redirecionar para a página anterior ou modificar o DOM
        window.location.href = '../CashFlow_Tela_de_Cadastro/dadospessoais.html'; // Exemplo de redirecionamento
    });

    // Validação do formulário
    const form = document.querySelector('form');
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const requiredFields = ['cep', 'logradouro', 'bairro', 'cidade', 'estado'];
        let isValid = true;

        // Limpar todos os erros antes de validar novamente
        document.querySelectorAll('.error-message').forEach(msg => msg.remove());
        document.querySelectorAll('.form-control').forEach(field => {
            field.style.borderColor = '#e5e7eb';
        });

        // Validar campos obrigatórios
        requiredFields.forEach(field => {
            const element = document.getElementById(field);
            const parentDiv = element.closest('.form-group') || element.parentElement;

            if (!element.value.trim()) {
                isValid = false;
                element.style.borderColor = '#ef4444';

                // Verificar se já existe mensagem de erro
                if (!parentDiv.querySelector('.error-message')) {
                    const errorMsg = document.createElement('p');
                    errorMsg.className = 'error-message';
                    errorMsg.textContent = 'Este campo é obrigatório';
                    errorMsg.style.color = '#ef4444';
                    errorMsg.style.fontSize = '12px';
                    errorMsg.style.marginTop = '5px';
                    errorMsg.style.marginBottom = '0';

                    // Inserir após o container do campo, não diretamente após o input
                    parentDiv.insertAdjacentElement('beforeend', errorMsg);
                }
            }
        });

        if (!isValid) {
            // Rolar até o primeiro erro
            const firstError = document.querySelector('.error-message');
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        // Se tudo estiver válido, prosseguir
        alert('Endereço salvo com sucesso! Redirecionando para a finalização...');
        window.location.href = 'finalizacao.html';
    });

    // Adicionar máscara para o CEP
    document.getElementById('cep').addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/^(\d{5})(\d)/, '$1-$2');
        e.target.value = value;
    });

    // Adicionar evento para buscar CEP (exemplo)
    document.querySelector('.btn-buscar-cep').addEventListener('click', function () {
        const cep = document.getElementById('cep').value.replace(/\D/g, '');
        if (cep.length === 8) {
            // Aqui você pode implementar a busca de CEP via API
            console.log('Buscando CEP:', cep);
        } else {
            alert('CEP inválido! Digite 8 números.');
        }
    });

    // Adicionar máscara para o CEP ao carregar a página
    if (cepInput.value) {
        const event = new Event('input');
        cepInput.dispatchEvent(event);
    }
});