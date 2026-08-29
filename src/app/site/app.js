const API_URL = "/produtos";

const form = document.getElementById("produto-form");
const idInput = document.getElementById("produto-id");
const descricaoInput = document.getElementById("descricao");
const categoriaInput = document.getElementById("categoria");
const precoInput = document.getElementById("preco");
const estoqueInput = document.getElementById("estoque");

const formTitle = document.getElementById("form-title");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");
const formMsg = document.getElementById("form-msg");

const listaEl = document.getElementById("lista-produtos");
const refreshBtn = document.getElementById("refresh-btn");

function mostrarMensagem(texto, tipo) {
  formMsg.textContent = texto;
  formMsg.className = `msg ${tipo}`;

  if (texto) {
    setTimeout(() => {
      formMsg.textContent = "";
      formMsg.className = "msg";
    }, 3500);
  }
}

function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function entrarModoEdicao(produto) {
  idInput.value = produto.id;
  descricaoInput.value = produto.descricao;
  categoriaInput.value = produto.categoria;
  precoInput.value = produto.preco;
  estoqueInput.value = produto.estoque;

  formTitle.textContent = `Editando: ${produto.descricao}`;
  submitBtn.textContent = "Salvar Alterações";
  cancelBtn.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function sairModoEdicao() {
  form.reset();
  idInput.value = "";
  formTitle.textContent = "Novo Produto";
  submitBtn.textContent = "Adicionar Produto";
  cancelBtn.classList.add("hidden");
}

async function carregarProdutos() {
  listaEl.innerHTML = '<p class="loading">Carregando produtos...</p>';

  try {
    const resp = await fetch(API_URL);
    if (!resp.ok) throw new Error("Falha ao buscar produtos");

    const produtos = await resp.json();

    renderizarLista(produtos);
  } catch (err) {
    listaEl.innerHTML = `<p class="empty">Erro ao carregar produtos: ${err.message}</p>`;
  }
}

function renderizarLista(produtos) {
  if (!produtos || produtos.length === 0) {
    listaEl.innerHTML = '<p class="empty">Nenhum produto cadastrado ainda.</p>';
    return;
  }

  listaEl.innerHTML = "";

  produtos.forEach((produto) => {
    const item = document.createElement("div");

    item.className = "produto-item";

    item.innerHTML = `
      <div class="produto-info">
        <h3>${escapeHtml(produto.descricao)}</h3>
        <p>${escapeHtml(produto.categoria)} · Estoque: ${produto.estoque} · <span class="preco">${formatarPreco(produto.preco)}</span></p>
      </div>
      <div class="produto-actions">
        <button class="btn-edit" data-id="${produto.id}">Editar</button>
        <button class="btn-delete" data-id="${produto.id}">Excluir</button>
      </div>
    `;

    listaEl.appendChild(item);
  });

  document.querySelectorAll(".btn-edit").forEach((btn) => {
    btn.addEventListener("click", () => {
      const produto = produtos.find((p) => p.id === Number(btn.dataset.id));
      if (produto) entrarModoEdicao(produto);
    });
  });

  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", () => excluirProduto(Number(btn.dataset.id)));
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;

  return div.innerHTML;
}

async function excluirProduto(id) {
  if (!confirm("Tem certeza que deseja excluir este produto?")) return;

  try {
    const resp = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

    if (!resp.ok) {
      const erro = await resp.json();
      throw new Error(erro.mensagem || "Falha ao excluir produto");
    }

    mostrarMensagem("Produto excluído com sucesso!", "success");
    carregarProdutos();
  } catch (err) {
    mostrarMensagem(err.message, "error");
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const dados = {
    descricao: descricaoInput.value.trim(),
    categoria: categoriaInput.value.trim(),
    preco: Number(precoInput.value),
    estoque: Number(estoqueInput.value),
  };

  const id = idInput.value;
  const editando = Boolean(id);

  try {
    const resp = await fetch(editando ? `${API_URL}/${id}` : API_URL, {
      method: editando ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    const resultado = await resp.json();

    if (!resp.ok) {
      throw new Error(resultado.mensagem || "Falha ao salvar produto");
    }

    mostrarMensagem(
      editando
        ? "Produto atualizado com sucesso!"
        : "Produto adicionado com sucesso!",
      "success",
    );

    sairModoEdicao();
    carregarProdutos();
  } catch (err) {
    mostrarMensagem(err.message, "error");
  }
});

cancelBtn.addEventListener("click", sairModoEdicao);
refreshBtn.addEventListener("click", carregarProdutos);

carregarProdutos();
