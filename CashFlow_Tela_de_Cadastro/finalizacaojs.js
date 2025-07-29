document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const form = document.getElementById('cadastroForm');
    const voltarBtn = document.getElementById('voltarBtn');
    const finalizarBtn = document.getElementById('finalizarBtn');
    const rendaInput = document.getElementById('renda');
    const despesasInput = document.getElementById('despesas');

    // Máscara para campos monetários
    function formatCurrency(input) {
        let value = input.value.replace(/\D/g, '');
        value = (parseFloat(value) / 100).toFixed(2);
        value = value.replace('.', ',');
        value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
        input.value = 'R$ ' + value;
    }

    // Aplicar máscaras
    rendaInput.addEventListener('input', function() {
        formatCurrency(this);
    });

    despesasInput.addEventListener('input', function() {
        formatCurrency(this);
    });

    // Navegação entre passos
    voltarBtn.addEventListener('click', function() {
        alert('Voltando para o passo anterior...');
        window.location.href = 'endereco.html'; // Descomente para redirecionar
    });

    // Validação e finalização do cadastro
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const requiredFields = ['renda', 'despesas', 'tipo-investimento', 'faixa-investimento'];
        let isValid = true;
        
        // Validar campos obrigatórios
        requiredFields.forEach(field => {
            const element = document.getElementById(field);
            if (!element.value.trim()) {
                isValid = false;
                element.style.borderColor = '#ef4444';
            } else {
                element.style.borderColor = '#e5e7eb';
            }
        });

        // Validar textarea
        const objetivo = document.getElementById('objetivo');
        if (!objetivo.value.trim()) {
            isValid = false;
            objetivo.style.borderColor = '#ef4444';
        } else {
            objetivo.style.borderColor = '#e5e7eb';
        }
        
        if (!isValid) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        // Simular finalização do cadastro
        finalizarBtn.disabled = true;
        finalizarBtn.textContent = 'Finalizando...';
        
        setTimeout(() => {
            alert('🎉 Cadastro finalizado com sucesso!\n\nBem-vindo ao Cash Flow! Sua conta foi criada e você já pode começar a gerenciar suas finanças.');
            finalizarBtn.disabled = false;
            finalizarBtn.textContent = 'Finalizar Cadastro';
            
            // Redirecionar para a página inicial após cadastro
            window.location.href = '../CashFlow_Tela_de_Login/login.html';

        }, 2000);
    });

    // Limpar borda vermelha quando o campo for preenchido
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                this.style.borderColor = '#e5e7eb';
            }
        });
    });
});