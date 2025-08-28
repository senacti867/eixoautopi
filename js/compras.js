
// INICIALIZAÇÃO 
document.addEventListener('DOMContentLoaded', () => {
  PaginaDeProdutos();
  carregarProdutosDoBanco();
});


function apresentar(produto) {
  if (!produto || !produto.id) {
    console.warn('Produto inválido ao tentar apresentar:', produto);
    return;
  }

  localStorage.setItem('compra', JSON.stringify([produto]));
  console.log('Produto salvo com sucesso no localStorage');

  window.location.href = `/eixoauto/eixoautopi/pages/compra.php?id=${produto.id}`;
}



// Página de Compras
function PaginaDeProdutos() {

  const compra = JSON.parse(localStorage.getItem('compra')) || [];
  const container = document.getElementById('produto-compra');
  container.innerHTML = '';

  if (!compra.length) {
    container.innerHTML = '<p>Produto não encontrado.</p>';
    return;
  }

  const produto = compra[0];
  console.log("Produto imagem recebido:", produto.imagem);

  // Normalizar caminho da imagem
  let imgPath = produto.imagem;
  if (imgPath.startsWith("/eixoauto/eixoautopi/")) {
    // já vem completo -> não mexe
  } else if (imgPath.startsWith("img/")) {
    imgPath = "/eixoauto/eixoautopi/" + imgPath;
  } else {
    imgPath = "/eixoauto/eixoautopi/img/Produtos/" + imgPath;
  }

  const div = document.createElement('div');
  div.classList.add('product-container');
  div.innerHTML = `
      <button class="btn" id="prev">&#10094;</button>
      <div class="img-box">
        <div class="icon"><img id="fav-heart" src="/eixoauto/eixoautopi/img/Icons/heart.png" alt="Icone de Favoritos" onclick="favoritar(${JSON.stringify(produto)}, event)"></div>
        <img src="/eixoauto/eixoautopi/${produto.imagem}" alt="${produto.nome}">
        <h2 class="product-prize">${produto.preco}</h2>

        <div class="btn-container">
          <button class="product">Comprar</button>
          <button onclick='adicionarNoCarrinho(${JSON.stringify(produto)})'>Adicionar ao carrinho</button>
        </div>
      </div>
      <button class="btn" id="next">&#10095;</button>

      <div class="info-section">
        <div class="top-row">
          <img class="logo" src="" alt="">
          <h2 class="name">${produto.nome}</h2>
        </div>
        <div class="desc">
          <h3>Descrição</h3>
          <p>${produto.descricao}</p>
        </div>
      </div> 
    `;
  container.appendChild(div);
}


//Botão Adicionar ao carrinho
function adicionarNoCarrinho(produto) { //Essa função está funcionando corretamente

  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  if (!carrinho.find(p => p.id === produto.id)) {
    carrinho.unshift(produto);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
  } else {
    alert('Produto já está no carrinho!');
  }
};

// Buscar ofertas do mesmo produto em outros fornecedores
if (typeof produto !== "undefined" && produto && produto.codigo) {
  fetch(`/eixoauto/eixoautopi/pages/get_ofertas_produto.php?codigo=${encodeURIComponent(produto.codigo)}`)
    .then(res => res.json())
    .then(ofertas => {
      const section = document.getElementById('product-section');
      if (!section) return;
      if (ofertas.length > 1) {
        let html = '<h3>Ofertas de outros fornecedores:</h3>';
        ofertas.forEach(oferta => {
          if (oferta.id != produto.id) {
            html += `
                <div class="oferta-item" style="margin-bottom:10px;">
                  <span><b>${oferta.fornecedor}</b></span> - 
                  <span>R$ ${oferta.preco}</span>
                  <a href="${oferta.link_fornecedor}" target="_blank" style="margin-left:10px;">Ver na loja</a>
                </div>
              `;
          }
        });
        section.innerHTML += html;
      }
    });
}


document.addEventListener('click', (event) => {
  if (event.target.classList.contains('product')) {
    // Seleciona o produto e salva no localStorage
    const produto = JSON.parse(localStorage.getItem('compra'))[0];  // Pega o produto atual
    if (!produto) {
      alert('Produto não encontrado!');
      return;
    }
    // Salva o produto no localStorage para a finalização
    localStorage.setItem('produtos-compra', JSON.stringify(produto));


    if (produto.length > 0) {
      window.location.href = '/eixoauto/eixoautopi/pages/finalizacaoC.php';
    } else {
      alert('Selecione ao menos um produto para finalizar a compra.');
    }
  }
});
