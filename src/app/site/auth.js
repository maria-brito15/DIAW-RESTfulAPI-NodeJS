const AUTH_URL = "/auth";

// elementos

const loginForm = document.getElementById("login-form");
const loginMsg = document.getElementById("login-msg");
const nomeUsuarioEl = document.getElementById("nome-usuario");
const logoutBtn = document.getElementById("logout-btn");
const registerForm = document.getElementById("register-form");
const registerMsg = document.getElementById("register-msg");

// helpers

function mostrarMensagem(el, texto, tipo) {
  if (!el) return;

  el.textContent = texto;
  el.className = `msg ${tipo}`;
}

// login

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const senha = document.getElementById("senha").value;

    try {
      const resp = await fetch(`${AUTH_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ usuario, senha }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data.mensagem || "Falha no login");
      }

      mostrarMensagem(
        loginMsg,
        "Login realizado! Redirecionando...",
        "success",
      );
      window.location.href = "/home";
    } catch (err) {
      mostrarMensagem(loginMsg, err.message, "error");
    }
  });
}

// registro

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmar-senha").value;

    if (senha !== confirmarSenha) {
      mostrarMensagem(registerMsg, "As senhas não coincidem", "error");
      return;
    }

    try {
      const resp = await fetch(`${AUTH_URL}/registrar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ usuario, senha }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data.mensagem || "Falha no registro");
      }

      mostrarMensagem(
        registerMsg,
        "Conta criada! Redirecionando...",
        "success",
      );
      window.location.href = "/home";
    } catch (err) {
      mostrarMensagem(registerMsg, err.message, "error");
    }
  });
}

// usuário atual

if (nomeUsuarioEl) {
  (async function carregarUsuario() {
    try {
      const resp = await fetch(`${AUTH_URL}/me`, { credentials: "include" });

      if (!resp.ok) {
        window.location.href = "/login";
        return;
      }

      const data = await resp.json();
      nomeUsuarioEl.textContent = `, ${data.usuario.usuario}`;
    } catch (err) {
      window.location.href = "/login";
    }
  })();
}

// logout

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      await fetch(`${AUTH_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      window.location.href = "/login";
    }
  });
}
