// Carrega produtos do banco e renderiza nos containers
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

      // Cria o coração
      const imgHeart = document.createElement('img');
      imgHeart.classList.add('fav_heart');
      imgHeart.alt = 'Ícone de favoritos';

      // Define src inicial conforme localStorage
      const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
      imgHeart.src = favoritos.find(p => p.id === produto.id)
        ? "/eixoauto/eixoautopi/img/Icons/heart-checked.png"
        : "/eixoauto/eixoautopi/img/Icons/heart.png";

      // Evento de clique no coração
      imgHeart.addEventListener('click', (e) => {
        e.stopPropagation(); // evita abrir o produto
        favoritar(produto, imgHeart);
      });

      div.appendChild(imgHeart);

      // Adiciona a imagem do produto
      const imgProduto = document.createElement('img');
      imgProduto.classList.add('produtos');
      imgProduto.src = produto.imagem;
      imgProduto.alt = produto.nome;
      div.appendChild(imgProduto);

      // Nome e preço
      const nome = document.createElement('a');
      nome.href = "#";
      nome.textContent = produto.nome;
      div.appendChild(nome);

      const preco = document.createElement('h2');
      preco.textContent = produto.preco;
      div.appendChild(preco);

      div.style.cursor = 'pointer';

      // Clique no container abre a página do produto
      div.addEventListener('click', () => {
        apresentar(produto);
      });

      container.appendChild(div);
    });
  });
}

// Função para favoritar/desfavoritar produtos
function favoritar(produto, imgElement) {
  let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
  const index = favoritos.findIndex(p => p.id === produto.id);

  if (index === -1) {
    favoritos.push(produto);
    imgElement.src = "/eixoauto/eixoautopi/img/Icons/heart-checked.png";
  } else {
    favoritos.splice(index, 1);
    imgElement.src = "/eixoauto/eixoautopi/img/Icons/heart.png";
  }

  localStorage.setItem('favoritos', JSON.stringify(favoritos));

  // Atualiza a lista de favoritos se estiver na página de favoritos
  if (document.getElementById('favoritos-container')) {
    ProdutosFavoritados();
  }
}

function apresentar(produto) {
  if (!produto || !produto.id) {
    console.warn('Produto inválido ao tentar apresentar:', produto);
    return;
  }

  localStorage.setItem('compra', JSON.stringify([produto]));
  window.location.href = '/eixoauto/eixoautopi/pages/compra.php';
}

// Exibe os produtos favoritados
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

    // Coração para remover favorito
    const imgHeart = document.createElement('img');
    imgHeart.classList.add('fav_heart');
    imgHeart.src = "/eixoauto/eixoautopi/img/Icons/heart-checked.png";
    imgHeart.alt = "Ícone de favoritos";
    imgHeart.addEventListener('click', (e) => {
      e.stopPropagation();
      removerFavorito(produto.id);
    });

    div.appendChild(imgHeart);

    // Imagem do produto
    const imgProduto = document.createElement('div');
    imgProduto.classList.add('produtos');
    imgProduto.innerHTML = `<img src='${produto.imagem}' alt='${produto.nome}'>`;
    div.appendChild(imgProduto);

    // Nome e preço
    const nome = document.createElement('h3');
    nome.textContent = produto.nome;
    div.appendChild(nome);

    const content = document.createElement('div');
    content.classList.add('content');

    const preco = document.createElement('h2');
    preco.textContent = produto.preco;
    content.appendChild(preco);

    const imgCarrinho = document.createElement('img');
    imgCarrinho.classList.add('compras');
    imgCarrinho.src = "/eixoauto/eixoautopi/img/Icons/carrinho-branco.png";
    imgCarrinho.alt = "Ícone do carrinho";
    imgCarrinho.addEventListener('click', (e) => {
      e.stopPropagation();
      adicionarNoCarrinho(produto);
    });

    content.appendChild(imgCarrinho);
    div.appendChild(content);

    div.addEventListener('click', () => {
      apresentar(produto);
    });

    container.appendChild(div);
  });
}

// Remove produto dos favoritos
function removerFavorito(id) {
  let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
  favoritos = favoritos.filter(p => p.id !== id);
  localStorage.setItem('favoritos', JSON.stringify(favoritos));
  ProdutosFavoritados();
}

// Adiciona produto ao carrinho
function adicionarNoCarrinho(produto) {
  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  carrinho.push(produto);
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  console.log('Produto adicionado ao carrinho:', produto.nome);
}

// Inicializa os produtos favoritados na página
ProdutosFavoritados();
