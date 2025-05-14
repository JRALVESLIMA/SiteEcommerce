document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const menuOverlay = document.getElementById('menuOverlay');
  const submenuToggle = document.querySelector('.submenu-toggle');
  const menuItem = document.querySelector('.menu-item.has-submenu');

  // === MENU RESPONSIVO ===
  menuToggle?.addEventListener('click', () => {
    menuOverlay?.classList.toggle('active');
  });

  submenuToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    menuItem?.classList.toggle('active');
    const expanded = submenuToggle.getAttribute('aria-expanded') === 'true';
    submenuToggle.setAttribute('aria-expanded', (!expanded).toString());
  });

  document.addEventListener('click', (e) => {
    if (!menuOverlay.contains(e.target) && !menuToggle.contains(e.target)) {
      menuOverlay?.classList.remove('active');
      menuItem?.classList.remove('active');
      submenuToggle?.setAttribute('aria-expanded', 'false');
    }
  });

  // === SCROLL SUAVE PELO MENU ===
  const navLinks = document.querySelectorAll('.menu-item a');

  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');

      if (href.startsWith('index.html#') || href.startsWith('#')) {
        const id = href.split('#')[1];
        const target = document.getElementById(id);

        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });

          menuOverlay?.classList.remove('active');
          menuItem?.classList.remove('active');
          submenuToggle?.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });


  // === CARROSSEL ===
  const slidesContainer = document.querySelector('.carousel__slides');
  const slides = slidesContainer?.children;
  const totalSlides = slides?.length || 0;
  let slideIndex = 0;
  const slideDelay = 4000;

  const showSlide = (index) => {
    if (slidesContainer) {
      slidesContainer.style.transition = 'transform 0.8s ease-in-out';
      slidesContainer.style.transform = `translateX(-${index * 100}vw)`;
    }
  };

  const nextSlide = () => {
    slideIndex++;
    if (slideIndex >= totalSlides) {
      slideIndex = 0;
    }
    showSlide(slideIndex);
  };

  let slideInterval = setInterval(nextSlide, slideDelay);

  slidesContainer?.addEventListener('mouseenter', () => clearInterval(slideInterval));
  slidesContainer?.addEventListener('mouseleave', () => {
    slideInterval = setInterval(nextSlide, slideDelay);
  });

  // === ADICIONAR AO CARRINHO ===
  document.querySelectorAll('.btn-add-cart').forEach(botao => {
    botao.addEventListener('click', () => {
      const card = botao.closest('.product-card');
      const nome = card.querySelector('.product-title')?.textContent;
      const precoTexto = card.querySelector('.product-price')?.textContent || '0';
      const preco = parseFloat(precoTexto.replace(/[^\d,]/g, '').replace(',', '.'));

      let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

      const indexExistente = carrinho.findIndex(p => p.nome === nome);

      if (indexExistente !== -1) {
        carrinho[indexExistente].quantidade += 1;
      } else {
        carrinho.push({ nome, preco, quantidade: 1 });
      }

      localStorage.setItem('carrinho', JSON.stringify(carrinho));



    });
  });

  // === COMPRAR AGORA ===
  document.querySelectorAll('.btn-buy-now').forEach(botao => {
    botao.addEventListener('click', () => {
      const card = botao.closest('.product-card');
      const nome = card.querySelector('.product-title')?.textContent;
      const precoTexto = card.querySelector('.product-price')?.textContent || '0';
      const preco = parseFloat(precoTexto.replace(/[^\d,]/g, '').replace(',', '.'));

      const produto = { nome, preco, quantidade: 1 };
      localStorage.setItem('carrinho', JSON.stringify([produto]));

      window.location.href = 'pagamento.html';
    });
  });

  // === PAGAMENTO: CARREGAR PRODUTOS ===
  if (window.location.pathname.includes('pagamento.html')) {
    carregarCarrinho();
  }

  function carregarCarrinho() {
    const carrinhoItens = document.getElementById('carrinho-itens');
    const valorTotalSpan = document.getElementById('valor-total');
    
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    const btnEsvaziar = document.getElementById('btn-esvaziar-carrinho');
    if (btnEsvaziar) {
      btnEsvaziar.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja esvaziar o carrinho?')) {
          localStorage.removeItem('carrinho');
          carregarCarrinho();
        } 
    });
}


    carrinhoItens.innerHTML = '';
    let total = 0;

    if (carrinho.length === 0) {
      carrinhoItens.innerHTML = '<p>Seu carrinho está vazio.</p>';
      valorTotalSpan.textContent = '0,00';
      return;
    }

    carrinho.forEach((item, index) => {
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('carrinho-item');

      const nome = document.createElement('span');
      nome.textContent = item.nome;

      const precoUnitario = document.createElement('span');
      precoUnitario.textContent = `Unit: R$ ${item.preco.toFixed(2)}`;

      const quantidadeInput = document.createElement('input');
      quantidadeInput.type = 'number';
      quantidadeInput.min = '1';
      quantidadeInput.value = item.quantidade;
      quantidadeInput.classList.add('quantidade-input');
      quantidadeInput.addEventListener('change', () => {
        const novaQtd = parseInt(quantidadeInput.value);
        if (novaQtd >= 1) {
          carrinho[index].quantidade = novaQtd;
          localStorage.setItem('carrinho', JSON.stringify(carrinho));
          carregarCarrinho(); 
        }
      });

      const subtotal = document.createElement('span');
      subtotal.textContent = `Subtotal: R$ ${(item.preco * item.quantidade).toFixed(2)}`;

      const btnRemover = document.createElement('button');
      btnRemover.textContent = 'Remover';
      btnRemover.classList.add('btn-remover');
      btnRemover.addEventListener('click', () => {
        carrinho.splice(index, 1);
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        carregarCarrinho();
      });

      itemDiv.appendChild(nome);
      itemDiv.appendChild(precoUnitario);
      itemDiv.appendChild(quantidadeInput);
      itemDiv.appendChild(btnRemover);
      carrinhoItens.appendChild(itemDiv);

      total += item.preco * item.quantidade;
    });

    valorTotalSpan.textContent = total.toFixed(2);
  }
});