// --- Dropdown de usuário ---
const userIcon = document.getElementById("userIcon");
const userDropdown = document.getElementById("userDropdown");
const userName = document.getElementById("userName");

// Mostra/esconde o dropdown ao clicar no ícone
userIcon.addEventListener("click", () => {
    userDropdown.style.display =
        userDropdown.style.display === "block" ? "none" : "block";
});

// Fecha dropdown se clicar fora
document.addEventListener("click", (event) => {
    if (!userIcon.contains(event.target) && !userDropdown.contains(event.target)) {
        userDropdown.style.display = "none";
    }
});

function loadUserName() {
    const userNameElement = document.getElementById("userName");
    const username = localStorage.getItem("username");

    if (userNameElement && username) {
        userNameElement.textContent = username;
        userNameElement.style.color = "#333";
        userNameElement.style.display = "block";
        userNameElement.style.opacity = "1";
        userNameElement.style.visibility = "visible";
    }
}

document.addEventListener("DOMContentLoaded", loadUserName);


// --- Opções do menu ---
document.getElementById("settingsBtn").onclick = () => {
    alert("Abrir Configurações...");
};

document.getElementById("editProfileBtn").onclick = () => {

};

document.getElementById("logoutBtn").onclick = () => {
    localStorage.clear();
    window.location.href = "login.html";
};

async function carregarPerfil() {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    try {
        const response = await fetch(`perfil.php?id=${userId}`);
        const result = await response.json();

        if (result.status === "success") {
            const d = result.dados;

            document.querySelector('input[name="nome"]').value = d.nome || "";
            document.querySelector('input[name="cpf"]').value = d.cpf || "";
            document.querySelector('input[name="nascimento"]').value = d.nascimento || "";
            document.querySelector('input[name="telefone"]').value = d.telefone || "";
            document.querySelector('input[name="email"]').value = d.email || "";

            document.querySelector('input[name="cep"]').value = d.cep || "";
            document.querySelector('input[name="logradouro"]').value = d.logradouro || "";
            document.querySelector('input[name="complemento"]').value = d.complemento || "";
            document.querySelector('input[name="bairro"]').value = d.bairro || "";
            document.querySelector('input[name="cidade"]').value = d.cidade || "";
            document.querySelector('select[name="estado"]').value = d.estado || "";
            document.querySelector('select[name="tipo_residencia"]').value = d.tipo_residencia || "";
            document.querySelector('input[name="tempo_residencia"]').value = d.tempo_residencia || "";

            // Função para formatar número em R$ 6.000,00
            function formatarReal(valor) {
                if (!valor) return "";
                return "R$ " + Number(valor).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            }

            // Preenche os campos
            document.querySelector('input[name="renda"]').value = formatarReal(d.renda);
            document.querySelector('input[name="despesas"]').value = formatarReal(d.despesas);

            document.querySelector('select[name="tipo_investimento"]').value = d.tipo_investimento || "";
            document.querySelector('select[name="faixa_investimento"]').value = d.faixa_investimento || "";
        } else {
            console.log("Erro ao carregar perfil:", result.message);
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadUserName();
    carregarPerfil();
});

const rendaInput = document.getElementById("renda");
const despesasInput = document.getElementById("despesas");

// Máscara BR de moeda (simples)
function maskMoney(el) {
    el.addEventListener("input", () => {
        let v = el.value.replace(/\D/g, "");
        if (!v) { el.value = ""; return; }
        v = (parseInt(v, 10) / 100).toFixed(2);
        v = v.replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        el.value = "R$ " + v;
    });
}
maskMoney(rendaInput);
maskMoney(despesasInput);

// Normaliza "R$ 1.234,56" -> "1234.56"
function brToDecimal(str) {
    if (!str) return "";
    return str.toString()
        .replace(/[^0-9,.-]/g, "")  // tira tudo que não é número/virgula/ponto/sinal
        .replace(/\./g, "")         // remove separador de milhar
        .replace(",", ".");         // troca decimal
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".profile-form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // evita reload da página

        const formData = new FormData(form);

        // Converte os valores formatados para decimal antes de enviar
        formData.set("renda", brToDecimal(formData.get("renda")));
        formData.set("despesas", brToDecimal(formData.get("despesas")));


        try {
            const response = await fetch("update_perfil.php", {
                method: "POST",
                body: formData
            });

            const result = await response.json();
            if (result.status === "success") {
                alert("Dados atualizados com sucesso!");

                // Atualiza o nome no localStorage
                const novoNome = document.querySelector('input[name="nome"]').value;
                localStorage.setItem("username", novoNome);

                // Atualiza o dropdown imediatamente
                const userNameElement = document.getElementById("userName");
                if (userNameElement) {
                    const dropdownName = novoNome // pega só o primeiro nome
                    userNameElement.textContent = dropdownName;
                }
            }
            else {
                alert("Erro: " + result.message);
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Erro ao salvar informações.");
        }
    });
});


