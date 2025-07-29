// Elementos
const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const errorMsg = document.getElementById('errorMessage');
const successMsg = document.getElementById('successMessage');

// Credenciais de teste
const testCredentials = [
    { email: 'admin@cashflow.com', password: '123456' },
    { email: 'usuario@demo.com', password: 'demo123' },
    { email: 'teste@cashflow.com', password: 'teste123' }
];

// Alternar visibilidade da senha
function togglePassword() {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    
    const toggle = document.querySelector('.password-toggle');
    toggle.textContent = type === 'password' ? 'icone senha.png' : '🙈';
}

// Mostrar mensagem
function showMessage(element, message, duration = 4000) {
    hideMessages();
    element.textContent = message;
    element.style.display = 'block';
    setTimeout(() => element.style.display = 'none', duration);
}

// Esconder mensagens
function hideMessages() {
    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';
}

// Estado de loading
function setLoading(isLoading) {
    if (isLoading) {
        loginBtn.textContent = '';
        loginBtn.classList.add('loading');
        loginBtn.disabled = true;
    } else {
        loginBtn.textContent = 'Entrar na conta';
        loginBtn.classList.remove('loading');
        loginBtn.disabled = false;
    }
}

// Validar email
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Autenticar usuário
async function authenticate(email, password) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return testCredentials.some(cred => 
        cred.email === email && cred.password === password
    );
}

// Manipular submit do formulário
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    hideMessages();
    
    // Validações
    if (!email || !password) {
        showMessage(errorMsg, '📧 Por favor, preencha todos os campos.');
        return;
    }
    
    if (!isValidEmail(email)) {
        showMessage(errorMsg, '❌ Por favor, digite um e-mail válido.');
        emailInput.focus();
        return;
    }
    
    if (password.length < 6) {
        showMessage(errorMsg, '🔒 A senha deve ter pelo menos 6 caracteres.');
        passwordInput.focus();
        return;
    }
    
    try {
        setLoading(true);
        
        const isAuth = await authenticate(email, password);
        
        if (isAuth) {
            showMessage(successMsg, '🎉 Login realizado com sucesso! Redirecionando...');
            
            setTimeout(() => {
                alert(`🚀 Bem-vindo ao Cash Flow!\n\n✨ Redirecionando para o dashboard...\n\n💡 Credenciais de teste disponíveis:\n• admin@cashflow.com / 123456\n• usuario@demo.com / demo123\n• teste@cashflow.com / teste123`);
                window.location.href = '../CashFlow_Tela_HomePage/home.html';
            }, 1500);
            
        } else {
            showMessage(errorMsg, '❌ E-mail ou senha incorretos. Verifique suas credenciais.');
            passwordInput.focus();
        }
        
    } catch (error) {
        showMessage(errorMsg, '⚠️ Erro no servidor. Tente novamente em alguns instantes.');
    } finally {
        setLoading(false);
    }
});

// Animações nos inputs
document.querySelectorAll('.input-field').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
});

// Funcões de navegação
function showForgotPassword() {
    alert('🔐 Recuperação de Senha\n\n📧 Em breve você receberá as instruções por e-mail!\n\n💡 Para demonstração, use:\n• admin@cashflow.com / 123456\n• usuario@demo.com / demo123\n• teste@cashflow.com / teste123');
}

function goToSignup() {
    alert('📝 Redirecionando para cadastro...\n\n✨ Página de criação de conta será carregada!');
}

// Demo rápido
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'q') {
        e.preventDefault();
        emailInput.value = 'admin@cashflow.com';
        passwordInput.value = '123456';
        showMessage(successMsg, '⚡ Demo preenchido! Pressione Enter para entrar.');
    }
});
// Dicas no console
console.log('%c🚀 Cash Flow Login', 'background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 12px 24px; border-radius: 8px; font-size: 16px; font-weight: bold;');
console.log('%c💡 Pressione Ctrl+Q para demo rápido!', 'background: #1a1a3e; color: #4facfe; padding: 8px 16px; border-radius: 6px; font-weight: bold;');