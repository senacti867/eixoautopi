// Função para carregar produtos do banco e renderizar nos containers
async function carregarProdutosDoBanco() {
  try {
    const resp1 = await fetch('/eixoauto/eixoautopi/pages/get_produtos.php?limit=3&offset=0');
    const produtos1 = await resp1.json();
    renderizarProdutos(produtos1, 'linear-container');

    const resp2 = await fetch('/eixoauto/eixoautopi/pages/get_produtos.php?limit=5&offset=3');
    const produtos2 = await resp2.json();
    renderizarProdutos(produtos2, 'lessfluid-linear-container');

    const resp3 = await fetch('/eixoauto/eixoautopi/pages/get_produtos.php?limit=7&offset=8');
    const produtos3 = await resp3.json();
    renderizarProdutos(produtos3, 'fluid-linear-container');
  } catch (e) {
    console.error('Erro ao carregar produtos do banco:', e);
  }
}

carregarProdutosDoBanco();

// Renderiza os produtos nos containers especificados
function renderizarProdutos(lista, containerClasse) {
  const containers = document.querySelectorAll(`.${containerClasse}`);
  if (!containers.length) return;

  containers.forEach(container => {
    lista.forEach(produto => {
      const div = document.createElement('div');
      div.classList.add('produto');
      div.innerHTML = `
        <img class="fav_heart" src="/eixoauto/eixoautopi/img/Icons/heart.png" alt="Ícone de favoritos" onclick="favoritar(${JSON.stringify(produto)}, event)">
        <img class="produtos" src="${produto.imagem}" alt="${produto.nome}">
        <a href="#">${produto.nome}</a>
        <h2>${produto.preco}</h2>
      `;

      div.style.cursor = 'pointer';

      div.addEventListener('click', (event) => {
        if (event.target.closest('img.fav_heart')) {
          favoritar(produto, event);
          return;
        } else {
          apresentar(produto);
        }
      });

      container.appendChild(div);
    });
  });
}

// Função para favoritar/desfavoritar produtos e alterar o ícone do coração
function favoritar(produto, event) {
  let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
  const coração = event.target; 

  if (!favoritos.find(p => p.id === produto.id)) {
    favoritos.push(produto);
    localStorage.setItem('favoritos', JSON.stringify(favoritos));

    coração.src = "/eixoauto/eixoautopi/img/Icons/heart-checked.png";
  } else {
    favoritos = favoritos.filter(p => p.id !== produto.id);
    localStorage.setItem('favoritos', JSON.stringify(favoritos));

    coração.src = "/eixoauto/eixoautopi/img/Icons/heart.png";
  }
}

// Função para exibir os produtos favoritados
function ProdutosFavoritados() {
  const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
  const container = document.getElementById('favoritos-container');
  container.innerHTML = '';

  if (favoritos.length === 0) {
    container.innerHTML = "<p>Nenhum produto favoritado.</p>";
    return;
  }

  favoritos.forEach((produto) => {
    const div = document.createElement('div');
    div.classList.add('produto');
    div.innerHTML = `
      <img class="fav_heart" src="/eixoauto/eixoautopi/img/Icons/heart-checked.png" alt="Ícone de favoritos" onclick="removerFavorito(${produto.id})">
      <div class='produtos'><img src='${produto.imagem}' alt='${produto.nome}'></div>
      <h3>${produto.nome}</h3>
      <div class='content'>
        <h2>${produto.preco}</h2>
        <img class="compras" src="/eixoauto/eixoautopi/img/Icons/carrinho-branco.png" alt="Ícone do carrinho">
      </div>
    `;

    div.addEventListener('click', (event) => {
      if (event.target.classList.contains('fav_heart')) {
        removerFavorito(produto.id);
        return;
      } else if (event.target.classList.contains('compras')) {
        adicionarNoCarrinho(produto);
        return;
      } else {
        apresentar(produto);
      }
    });

    container.appendChild(div);
  });
}

// Função para remover produto dos favoritos
function removerFavorito(id) {
  let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
  favoritos = favoritos.filter(p => p.id !== id);
  localStorage.setItem('favoritos', JSON.stringify(favoritos));
  ProdutosFavoritados();
}

// Função fictícia: adicionar no carrinho
function adicionarNoCarrinho(produto) {
  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  carrinho.push(produto);
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  console.log('Produto adicionado ao carrinho:', produto.nome);
}

// Inicializa os produtos favoritados na página
ProdutosFavoritados();
