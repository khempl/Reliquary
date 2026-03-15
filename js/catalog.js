document.addEventListener('DOMContentLoaded', function () {
    const grid = document.getElementById('catalog-grid');
    const noResults = document.getElementById('no-results');
    const countEl = document.getElementById('results-count');
    const sortSelect = document.getElementById('sort-select');
    const resetBtn = document.getElementById('filter-reset');
    const searchInput = document.querySelector('.searchi');
    const searchBtn = document.querySelector('.searchb');

    const originalItems = Array.from(grid.children).map(a => a.cloneNode(true));

    function getChecked(selector) {
        return Array.from(document.querySelectorAll(selector + ':checked')).map(el => el.value);
    }

    function getRadio() {
        const checked = document.querySelector('input[name="universe"]:checked');
        return checked ? checked.value : '';
    }

    function getQuery() {
        return searchInput.value.toLowerCase().trim();
    }

    function addCartButtonListeners() {
        document.querySelectorAll('.catalog-grid article button, .product-card button').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const article = this.closest('article');
                const name = article.dataset.name || article.querySelector('.center:first-child')?.textContent.trim() || 'Товар';
                const price = parseInt(article.dataset.price) || 0;
                const img = article.querySelector('img')?.src || '';
                
                if (window.addToCart) {
                    window.addToCart(name, price, img);
                } else {
                    console.log('Добавлено в корзину:', name, price, img);
                    alert(` ${name} добавлен в корзину`);
                }
            });
        });
    }

    function applyFilters() {
        const types = getChecked('.filter-checkboxes input[type="checkbox"]');
        const universe = getRadio();
        const query = getQuery();
        const sort = sortSelect.value;

        grid.innerHTML = '';

        let visible = originalItems.filter(function (item) {
            const article = item.querySelector('article');
            const aType = article.dataset.type || '';
            const aUniverse = article.dataset.universe || '';
            const aName = (article.dataset.name || '').toLowerCase();
            const aDesc = article.querySelector('i') ? article.querySelector('i').textContent.toLowerCase() : '';

            if (types.length > 0 && !types.includes(aType)) return false;
            if (universe && aUniverse !== universe) return false;
            if (query && !aName.includes(query) && !aDesc.includes(query)) return false;

            return true;
        });

        visible.sort(function (a, b) {
            const aPrice = parseInt(a.querySelector('article').dataset.price);
            const bPrice = parseInt(b.querySelector('article').dataset.price);
            const aName = a.querySelector('article').dataset.name || '';
            const bName = b.querySelector('article').dataset.name || '';

            if (sort === 'price-asc') return aPrice - bPrice;
            if (sort === 'price-desc') return bPrice - aPrice;
            if (sort === 'name') return aName.localeCompare(bName, 'ru');
            return 0;
        });

        visible.forEach(item => {
            const clone = item.cloneNode(true);
            grid.appendChild(clone);
        });

        addCartButtonListeners();

        countEl.textContent = 'Показано товаров: ' + visible.length;
        noResults.style.display = visible.length === 0 ? 'block' : 'none';
    }

    document.querySelectorAll('.filter-checkboxes input, .filter-radios input').forEach(input => {
        input.addEventListener('change', applyFilters);
    });

    sortSelect.addEventListener('change', applyFilters);

    searchBtn.addEventListener('click', function (e) {
        e.preventDefault();
        applyFilters();
    });

    searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            applyFilters();
        }
    });

    searchInput.addEventListener('input', applyFilters);

    resetBtn.addEventListener('click', function () {
        document.querySelectorAll('.filter-checkboxes input').forEach(i => i.checked = false);
        document.querySelectorAll('.filter-radios input').forEach(i => i.checked = false);
        sortSelect.value = 'default';
        searchInput.value = '';

        grid.innerHTML = '';
        originalItems.forEach(item => {
            const clone = item.cloneNode(true);
            grid.appendChild(clone);
        });
        addCartButtonListeners();
        applyFilters(); 
    });

    addCartButtonListeners();
    applyFilters();
});