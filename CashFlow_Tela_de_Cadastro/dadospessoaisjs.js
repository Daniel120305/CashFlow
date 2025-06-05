document.getElementById('cpf').addEventListener('input', function(e) {
    // Remove todos os caracteres não numéricos
    let value = e.target.value.replace(/\D/g, '');
    
    // Aplica a máscara: XXX.XXX.XXX-XX
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    
    // Atualiza o valor do campo
    e.target.value = value;
  });

  document.getElementById('telefone').addEventListener('input', function(e) {
    // Remove tudo que não for dígito
    let value = e.target.value.replace(/\D/g, '');
    
    // Limita a 11 dígitos (DDD + 9 dígitos)
    if (value.length > 11) {
      value = value.substring(0, 11);
    }
    
    // Aplica a máscara: (00) 00000-0000
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
    
    // Atualiza o valor do campo
    e.target.value = value;
  });

// Validação do formulário
document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Campos obrigatórios
    const requiredFields = [
        'nome', 'cpf', 'nascimento', 'telefone', 
        'email', 'senha', 'confirmar-senha'
    ];
    
    let isValid = true;
    
    // Limpar todos os erros antes de validar novamente
    document.querySelectorAll('.error-message').forEach(msg => msg.remove());
    document.querySelectorAll('.form-group input').forEach(field => {
        field.style.borderColor = '#e5e7eb';
    });
    
    // Validar campos obrigatórios
    requiredFields.forEach(field => {
        const element = document.getElementById(field);
        const parentDiv = element.closest('.form-group');
        
        if (!element.value.trim()) {
            isValid = false;
            element.style.borderColor = '#ef4444';
            
            if (!parentDiv.querySelector('.error-message')) {
                const errorMsg = document.createElement('p');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'Este campo é obrigatório';
                errorMsg.style.color = '#ef4444';
                errorMsg.style.fontSize = '12px';
                errorMsg.style.marginTop = '5px';
                errorMsg.style.marginBottom = '0';
                
                parentDiv.insertAdjacentElement('beforeend', errorMsg);
            }
        }
    });
    
    // Validação específica para data de nascimento
    const dataNascimento = document.getElementById('nascimento').value;
    if (dataNascimento) {
        const dataNasc = new Date(dataNascimento);
        const hoje = new Date();
        const anoMinimo = new Date('1900-01-01');
        
        if (dataNasc > hoje) {
            isValid = false;
            const nascimentoGroup = document.getElementById('nascimento').closest('.form-group');
            
            const errorMsg = document.createElement('p');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'Data de nascimento inválida!';
            errorMsg.style.color = '#ef4444';
            errorMsg.style.fontSize = '12px';
            errorMsg.style.marginTop = '5px';
            errorMsg.style.marginBottom = '0';
            
            nascimentoGroup.insertAdjacentElement('beforeend', errorMsg);
            document.getElementById('nascimento').style.borderColor = '#ef4444';
        } else if (dataNasc < anoMinimo) {
            isValid = false;
            const nascimentoGroup = document.getElementById('nascimento').closest('.form-group');
            
            const errorMsg = document.createElement('p');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'Data de nascimento inválida!';
            errorMsg.style.color = '#ef4444';
            errorMsg.style.fontSize = '12px';
            errorMsg.style.marginTop = '5px';
            errorMsg.style.marginBottom = '0';
            
            nascimentoGroup.insertAdjacentElement('beforeend', errorMsg);
            document.getElementById('nascimento').style.borderColor = '#ef4444';
        }
    }
    
    // Validação de senhas
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmar-senha').value;
    
    if (senha && confirmarSenha && senha !== confirmarSenha) {
        isValid = false;
        const confirmGroup = document.getElementById('confirmar-senha').closest('.form-group');
        
        const errorMsg = document.createElement('p');
        errorMsg.className = 'error-message';
        errorMsg.textContent = 'As senhas não coincidem';
        errorMsg.style.color = '#ef4444';
        errorMsg.style.fontSize = '12px';
        errorMsg.style.marginTop = '5px';
        errorMsg.style.marginBottom = '0';
        
        confirmGroup.insertAdjacentElement('beforeend', errorMsg);
        document.getElementById('senha').style.borderColor = '#ef4444';
        document.getElementById('confirmar-senha').style.borderColor = '#ef4444';
    }
    
    // Validação dos termos
    const termos1 = document.getElementById('termos1');
    if (!termos1.checked) {
        isValid = false;
        const termosGroup = termos1.closest('.checkbox-container');
        
        const errorMsg = document.createElement('p');
        errorMsg.className = 'error-message';
        errorMsg.textContent = 'Você deve aceitar os termos para continuar';
        errorMsg.style.color = '#ef4444';
        errorMsg.style.fontSize = '12px';
        errorMsg.style.marginTop = '5px';
        errorMsg.style.marginBottom = '0';
        
        termosGroup.insertAdjacentElement('afterend', errorMsg);
    }

    const termos2 = document.getElementById('termos2');
    if (!termos2.checked) {
        isValid = false;
        const termosGroup = termos2.closest('.checkbox-container');
        
        const errorMsg = document.createElement('p');
        errorMsg.className = 'error-message';
        errorMsg.textContent = 'Você deve aceitar os termos para continuar';
        errorMsg.style.color = '#ef4444';
        errorMsg.style.fontSize = '12px';
        errorMsg.style.marginTop = '5px';
        errorMsg.style.marginBottom = '0';
        
        termosGroup.insertAdjacentElement('afterend', errorMsg);
    }
    
    if (!isValid) {
        const firstError = document.querySelector('.error-message');
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    
    alert('Dados pessoais salvos com sucesso! Redirecionando para o próximo passo...');
    window.location.href = 'endereco.html';
});