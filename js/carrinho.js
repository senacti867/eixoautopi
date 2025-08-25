document.addEventListener('DOMContentLoaded', () => {
  CarrinhodeProdutos();
})

function adicionarNoCarrinho(produto) {
  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  if (!carrinho.find(p => p.id === produto.id)) {
    carrinho.unshift(produto); //Push do produto no início da array
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
  }
};

// Função para exibir os produtos no carrinho
function CarrinhodeProdutos() {
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  const container = document.getElementById('carrinho');
  container.innerHTML = '';

  if (carrinho.length === 0) {
    container.innerHTML = "<p>Seu carrinho está vazio.</p>";
    return;
  }

  carrinho.forEach(produto => {
    const div = document.createElement('div');
    div.classList.add('item-carrinho');
    div.innerHTML = `
      <input type="checkbox" name="select-product" class="select-product" data-id="${produto.id}">
      <img class="products" src="${produto.imagem}" alt="${produto.nome}">
      <h2>${produto.nome}</h2>
      <div class="quantity">
        <button class="btn"><img class="less" src="/eixoauto/eixoautopi/img/Icons/subtracao-Icon.png" alt=""></button>
        <div class="qtd">1</div>
        <button class="btn"><img class="more" src="/eixoauto/eixoautopi/img/Icons/adicao-Icon.png" alt=""></button>
      </div>
      <div class="prize">
        <h1>${produto.preco}</h1>
      </div>
    `;

    div.style.cursor = 'pointer';

    div.addEventListener('click', (event) => {
      if (event.target.closest('.select-product')) {
        event.stopPropagation();
        SelectProducts();
        return;
      } else if (event.target.closest('.btn')) {
        QtdPreco();
        return;
      } else {
        apresentar(produto);
      }
    });

    container.appendChild(div);
  });
}

// Função para navegar para a página de compra
function apresentar(produto) {
  if (!produto) return;
  localStorage.setItem('compra', JSON.stringify([produto]));
  console.log('Produto salvo com sucesso no localStorage');
  window.location.href = '/eixoauto/eixoautopi/pages/compra.php';
}

// Função para selecionar produtos no carrinho
function SelectProducts() {
  const container = document.getElementById('select-menu-container');
  container.innerHTML = '';

  const div = document.createElement('div');
  div.classList.add('select-menu');
  div.innerHTML = `
    <ul>
      <li id="selectAll">Selecionar todos</li>
      <li id="exclude">Excluir</li>
    </ul>
  `;

  container.appendChild(div);

  function VisibilidadeMenu() {
    const checkboxes = document.querySelectorAll('.select-product');
    const algumMarcado = Array.from(checkboxes).some(cb => cb.checked);
    div.style.display = algumMarcado ? 'block' : 'none';
  }

  document.addEventListener('click', (event) => {
    if (event.target.id === 'selectAll') {
      const checkboxes = document.querySelectorAll('.select-product');
      const AllcheckboxesSelected = Array.from(checkboxes).every(cb => cb.checked);

      if (AllcheckboxesSelected) {
        checkboxes.forEach(cb => cb.checked = false);
      } else {
        checkboxes.forEach(cb => cb.checked = true);
      }

      FinalizacaoCompra();
      VisibilidadeMenu();
    }
  });

  document.addEventListener('change', (event) => {
    if (event.target.classList.contains('select-product')) {
      FinalizacaoCompra();
      VisibilidadeMenu();
    }
  });

  document.addEventListener('click', (event) => {
    if (event.target.id === 'exclude') {
      let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
      const checkboxesSelected = document.querySelectorAll('.select-product:checked');
      const idsToExclude = Array.from(checkboxesSelected).map(cbs => parseInt(cbs.dataset.id));
      carrinho = carrinho.filter(p => !idsToExclude.includes(p.id));
      localStorage.setItem('carrinho', JSON.stringify(carrinho));
      location.reload();
    }
  });
}

// Função para ajustar a quantidade e preço
function QtdPreco() {
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

  document.getElementById('carrinho').addEventListener('click', (event) => {
    const more = event.target.closest('.more');
    const less = event.target.closest('.less');

    if (more || less) {
      const item = event.target.closest('.item-carrinho');
      if (!item) return;

      const qtd = item.querySelector('.qtd');
      const preco = item.querySelector('.prize h1');
      const nome = item.querySelector('h2').textContent;

      const produto = carrinho.find(p => p.nome === nome);
      if (!produto) return;

      const precoInicial = parsePreco(produto.preco);

      let quantidadeAtual = parseInt(qtd.textContent);
      if (more) {
        quantidadeAtual++;
      } else if (less && quantidadeAtual > 1) {
        quantidadeAtual--;
      }

      qtd.textContent = quantidadeAtual;

      const total = quantidadeAtual * precoInicial;
      preco.textContent = total.toFixed(2).replace('.', ',');

      FinalizacaoCompra();
    }
  });
}

// Função para calcular o valor total da compra
function FinalizacaoCompra() {
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  const checkboxes = document.querySelectorAll('.select-product:checked');
  let valorTotalCompra = 0;

  checkboxes.forEach(cb => {
    const container = cb.closest('.item-carrinho');
    if (!container) return;

    const nome = container.querySelector('h2').textContent.trim();
    const produto = carrinho.find(p => p.nome === nome);
    if (!produto) return;

    const qtd = parseInt(container.querySelector('.qtd').textContent.trim(), 10) || 1;

    const precoUnitario = parsePreco(produto.preco);
    valorTotalCompra += qtd * precoUnitario;
  });

  const PrecoFinal = document.getElementById('Preco-Final');
  PrecoFinal.textContent = valorTotalCompra.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  localStorage.setItem('totalCompra', valorTotalCompra.toFixed(2));
  return valorTotalCompra;
}

// Exemplo: ao clicar no botão "Finalizar Compra"
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('buy')) {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const produtosAcomprar = Array.from(document.querySelectorAll('.select-product:checked'))
      .map(cb => {
        const container = cb.closest('.item-carrinho');
        if (!container) return;

        const nome = container.querySelector('h2').textContent.trim();
        const produto = carrinho.find(p => p.nome === nome);
        if (!produto) return;
        const qtd = parseInt(container.querySelector('.qtd').textContent.trim(), 10) || 1;
        return { ...produto, quantidade: qtd };
      }).filter(p => p !== undefined);

    // Salva os produtos selecionados para finalizar
    localStorage.setItem('produtos-compra', JSON.stringify(produtosAcomprar));

    if (produtosAcomprar.length > 0) {
      window.location.href = '/eixoauto/eixoautopi/pages/finalizacaoC.php';
    } else {
      alert('Selecione ao menos um produto para finalizar a compra.');
    }
  }
});

function parsePreco(precoStr) {
  // Remove "R$" e espaços, troca ponto de milhar e vírgula decimal
  return parseFloat(
    precoStr.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()
  );
}
