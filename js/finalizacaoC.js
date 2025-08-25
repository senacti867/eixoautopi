const cartaoIcon = document.getElementById('cartao')
const container = document.getElementById('payment')

cartaoIcon.addEventListener('click', () => {
    cartaoIcon.classList.toggle('ativo')
    container.innerHTML = '';

    if (cartaoIcon.classList.contains('ativo')) {
        const div = document.createElement('div')
        div.classList.add('cartao-info')
        div.innerHTML = `
            <label for="numero-cartao">Número do Cartão:</label>
            <input type="text" id="numero-cartao" placeholder="0000 0000 0000 0000">
            <label for="validade">Validade:</label>
            <input type="text" id="validade" placeholder="MM/AA">
            <label for="cvv">CVV:</label>
            <input type="text" id="cvv" placeholder="123">
        `
        container.appendChild(div)
    }
});


const pixIcon = document.getElementById('pix')

pixIcon.addEventListener('click', () => {
    pixIcon.classList.toggle('ativo')
    container.innerHTML = '';

    if (pixIcon.classList.contains('ativo')) {
        const div = document.createElement('div')
        div.classList.add('pix-info')

        const randomPixCode = Math.random() *10
        div.innerHTML = `
        <img id="Pix-QR" src="/EixoAuto/img/Icons/QrCode-wts.jpeg" alt="Qr-Code Pix">
        <div class="Code-container">
            <div id="Pix-Code">${randomPixCode}</div>
            <button id="Copy-btn"><img src="/EixoAuto/img/Icons/Copy-icon.png" alt=""></button>
        </div>
        `
        container.appendChild(div)

        div.getElementById('Copy-btn').addEventListener('click', () =>{
            const PixCode = document.getElementById('Pix-Code').textContent
            navigator.clipboard.writeText(PixCode)
        })
    }
});


// Apresentar Produtos selecionados
function AprsentarProdutos() {
    const produto = JSON.parse(localStorage.getItem('produtos-compra')) || [];
    const container = document.getElementById('carrinho');
    container.innerHTML = '';

    produto.forEach(produto => {
        const div = document.createElement('div');
        div.classList.add('item-carrinho');
        div.innerHTML = `
      <input type="checkbox" name="select-product" class="select-product" data-id="${produto.id}">
      <img class="products" src="${produto.imagem}" alt="${produto.nome}">
      <h2>${produto.nome}</h2>
      <div class="quantity">
        <button class="btn"><img class="less" src="/EixoAuto/img/Icons/subtracao-Icon.png" alt=""></button>
        <div class="qtd">1</div>
        <button class="btn"><img class="more" src="/EixoAuto/img/Icons/adicao-Icon.png" alt=""></button>
      </div>
      <div class="prize">
        <h1>${produto.preco}</h1>
      </div>
    `;
        container.appendChild(div);
    });
}

function ProdutosValor() {
    let valorTotalCompra = JSON.parseFloat(localStorage.getItem('totalCompra')) || 0;
    const totalEl = document.getElementById('valor-total');
    const cupom = document.getElementById('cupom-input')
    totalEl.textContent = `Total: R$ ${valorTotalCompra.toFixed(2).replace('.', ',')}`;

    if (cupom.value === "10EIXOAUTO") {
        valorTotalCompra = valorTotalCompra - (valorTotalCompra * 0.1)
    } else if (cupom.value === "5EIXOAUTO") {
        valorTotalCompra = valorTotalCompra - (valorTotalCompra * 0.05)
    }

    totalEl.textContent = `Total: R$ ${valorTotalCompra.toFixed(2).replace('.', ',')}`;
}


// Endereço inicial
let enderecoAtual = "Rua Exemplo, 123 - Bairro - Cidade/UF";

function atualizarResumo() {
    const produtos = JSON.parse(localStorage.getItem('produtos-compra')) || [];
    const lista = document.getElementById('lista-produtos');
    const totalEl = document.getElementById('valor-total');
    let total = 0;

    lista.innerHTML = '';
    produtos.forEach(prod => {
        // Converte preço para número se necessário
        let precoNum = typeof prod.preco === 'string'
            ? parseFloat(prod.preco.replace('R$', '').replace(/\./g, '').replace(',', '.').trim())
            : prod.preco;

        total += precoNum * (prod.quantidade || 1);
        const item = document.createElement('div');
        item.classList.add('product');
        item.innerHTML = `
          <span>${prod.nome}</span>
          <span>Qtd: ${prod.quantidade || 1}</span>
          <span>R$ ${precoNum.toFixed(2).replace('.', ',')}</span>
        `;
        lista.appendChild(item);
    });

    totalEl.textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
}

function mostrarFormularioEndereco() {
    document.getElementById('form-endereco').style.display = 'block';
    document.getElementById('endereco').value = enderecoAtual;
    document.getElementById('endereco-exibicao').style.display = 'none';
}

function salvarNovoEndereco() {
    const novoEndereco = document.getElementById('endereco').value.trim();
    if (novoEndereco !== "") {
        enderecoAtual = novoEndereco;
        document.getElementById('texto-endereco').textContent = enderecoAtual;
        document.getElementById('form-endereco').style.display = 'none';
        document.getElementById('endereco-exibicao').style.display = 'block';
    } else {
        alert("Por favor, insira um endereço válido.");
    }
}

function finalizarCompra() {
    const pagamento = document.getElementById('pagamento').value;
    const total = produtos.reduce((soma, p) => soma + p.preco, 0).toFixed(2);

    alert(`Compra finalizada!\n\nEndereço: ${enderecoAtual}\nPagamento: ${pagamento}\nTotal: R$ ${total}`);
}
/*
document.getElementById('pagamento').addEventListener('change', function () {
    const tipo = this.value;
    document.getElementById('cartao-info').style.display = (tipo === 'cartao') ? 'block' : 'none';
});
*/
atualizarResumo();

function mostrarProdutosFinalizacao() {
    const produtos = JSON.parse(localStorage.getItem('produtos-compra')) || [];
    const lista = document.getElementById('produtos-finalizacao');
    lista.innerHTML = '';

    if (produtos.length === 0) {
        lista.innerHTML = '<p>Nenhum produto selecionado.</p>';
        return;
    }

    produtos.forEach(prod => {
        let precoNum = typeof prod.preco === 'string'
            ? parseFloat(prod.preco.replace('R$', '').replace(/\./g, '').replace(',', '.').trim())
            : prod.preco;

        const item = document.createElement('div');
        item.classList.add('produto-finalizacao');
        item.innerHTML = `
            <img src="${prod.imagem}" alt="${prod.nome}" style="width:60px;vertical-align:middle;">
            <span style="margin-left:10px;">${prod.nome}</span>
            <span style="margin-left:10px;">Qtd: ${prod.quantidade || 1}</span>
            <span style="margin-left:10px;">R$ ${precoNum.toFixed(2).replace('.', ',')}</span>
        `;
        lista.appendChild(item);
    });
}

document.addEventListener('DOMContentLoaded', mostrarProdutosFinalizacao);