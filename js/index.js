// Função para renderizar resultados de busca
function renderizarBusca(produtos) {
  const container = document.getElementById('busca-resultados');
  if (!container) return;
  container.innerHTML = '';
  if (!produtos.length) {
    container.innerHTML = '<div> Nenhum produto encontrado.</div>';
    container.style.display = 'block';
    return;
  }
  container.innerHTML = produtos.map(prod =>
    `<div class="item-busca" data-id="${prod.id}">
      <span>${prod.nome}</span>
    </div>`
  ).join('');
  container.style.display = 'block';
}

// Evento de busca
const inputBusca = document.getElementById('input-busca');
const btnBusca = document.getElementById('btn-busca');
const buscaResultados = document.getElementById('busca-resultados')
buscaResultados.style.display = 'none'

inputBusca.addEventListener('input', function() {
    const termo = this.value.trim();
    if (termo.length < 2) {
        buscaResultados.innerHTML = '';
        return;
    }
    fetch('/eixoauto/eixoautopi/pages/search_produtos.php?q=' + encodeURIComponent(termo))
        .then(r => r.json())
        .then(data => {
            renderizarBusca(data);
        });
});

buscaResultados.addEventListener('click', function(event) {
    buscaResultados.classList.toggle('ativo')
    if (event.target.closest('.item-busca') && buscaResultados.classList.contains('ativo')) {
        const id = e.target.closest('.item-busca').getAttribute('data-id');
        window.location.href = '/eixoauto/eixoautopi/pages/compra.php?id=' + id;
    }
});

const carrossels = document.querySelectorAll('.container-slide');
carrossels.forEach(container => {
    const slide = container.querySelector('.carousel-slide');
    const images = slide.querySelectorAll('.img-slides');
    const totalImages = images.length; //Não está reconhecendo o totalImages
    let i = 0;


    function updateSlide() {
        slide.style.transform = `translateX(-${i * 100}%)`;
    }

    document.addEventListener("click", (event) => {
        if (event.target.id === "next") {
            i = (i + 1) % totalImages;
            updateSlide();
        }
    });

    document.addEventListener("click", (event) => {
        if (event.target.id === "prev") {
            i = (i - 1 + totalImages) % totalImages;
            updateSlide();
        }
    });

    // Auto avançar a cada 3 segundos dos slides

    setInterval(() => {
        if (i == totalImages - 1) {
            i = 0;
        } else {
            i++;
        }
        updateSlide()
    }, 5000);
});


// Auto avançar a cada 3 segundos do banner
const banner = document.getElementById("banner");
const img = banner.querySelectorAll(".img-banner");
const banner_img = img.length;
let j = 0;

function Banner() {
    banner.style.transform = `translateX(-${j * 100}%)`;
}

setInterval(() => {
    if (j == banner_img - 1) {
        j = 0;
    } else {
        j++;
    }
    Banner()
}, 3000);

//Icon "Favoritar" ação de click
renderizarProdutos(produtos1, 'linear-container');
renderizarProdutos(produtos2, 'lessfluid-linear-container');
renderizarProdutos(produtos3, 'fluid-linear-container');

function selectContainer(containerClasse) {
    const containers = document.querySelectorAll(`.${containerClasse}`);
    if (!containers.length) return;

    containers.forEach(container => {
        const favIcons = container.querySelectorAll('.fav_heart');

        favIcons.forEach(icon => {
            icon.addEventListener("click", () => {
                if (icon.src.includes("/EixoAuto/img/Icons/heart.png")) {
                    icon.src = "/EixoAuto/img/Icons/heart-checked.png";
                } else {
                    icon.src = "/EixoAuto/img/Icons/heart.png";
                }
            });
        });
    });
}