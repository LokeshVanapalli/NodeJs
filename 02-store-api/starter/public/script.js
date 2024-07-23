document.addEventListener('DOMContentLoaded', () => {
    const productsGrid = document.querySelector('.products-grid');
    const companyFilter = document.getElementById('company-filter');
    const ratingFilter = document.getElementById('rating-filter');
    const searchBar = document.getElementById('search-bar');
    const priceFilter = document.getElementById('price-filter');
    const priceValue = document.getElementById('price-value');
    const sortOptions = document.getElementById('sort-options');

    let currentPage = 1;
    let totalPages = 1;


    // Fetch products from the backend server
    const fetchProducts = async (filters = {}, page = 1, limit = 12) => {
        try {
            const totalNumberOfProducts = await fetch(`/api/v1/products`)
            const overallData = await totalNumberOfProducts.json()
            // console.log(overallData.nbHits)
            filters.page = page;
            filters.limit = limit;
            const queryParams = new URLSearchParams(filters).toString();
            console.log('Query Params:', queryParams); // Debugging line to check final query params
            const response = await fetch(`/api/v1/products?${queryParams}`);
            const data = await response.json();
            console.log(data); // Debugging line to check fetched data
            console.log(data.nbHits);
            displayProducts(data.products);
            updatePaginationControls(overallData.nbHits, limit, page);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };
    
    const updatePaginationControls = (totalProducts, limit, page) => {
        const paginationContainer = document.querySelector('.pagination');
        paginationContainer.innerHTML = '';
    
        totalPages = Math.ceil(totalProducts / limit);
        console.log("Total Pages: ",totalPages, "total products",totalProducts)
        const prevPageItem = document.createElement('li');
        prevPageItem.classList.add('page-item');
        prevPageItem.innerHTML = `
            <a class="page-link" href="#" id="prev-page" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
            </a>
        `;
        paginationContainer.appendChild(prevPageItem);
    
        for (let i = 1; i <= totalPages; i++) {
            const pageItem = document.createElement('li');
            pageItem.classList.add('page-item');
            if (i === page) pageItem.classList.add('active');
            pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            pageItem.addEventListener('click', () => {
                currentPage = i;
                applyFilters();
            });
            paginationContainer.appendChild(pageItem);
        }
    
        const nextPageItem = document.createElement('li');
        nextPageItem.classList.add('page-item');
        nextPageItem.innerHTML = `
            <a class="page-link" href="#" id="next-page" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
            </a>
        `;
        paginationContainer.appendChild(nextPageItem);
    
        document.getElementById('prev-page').addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                applyFilters();
            }
        });
    
        document.getElementById('next-page').addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                applyFilters();
            }
        });
    };
    

    // Display products in the grid
    const displayProducts = (products) => {
        productsGrid.innerHTML = '';
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product', 'col-md-3');
            productElement.style.maxWidth = '24%';
            productElement.innerHTML = `
                <div class="card mb-4 shadow-sm" style="margin-top:24px; margin-bottom:24px">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title" style="text-align: center;">${product.name}</h5>
                        <p class="card-text">Company: ${product.company}</p>
                        <div class="text-container" style=" display: flex; justify-content: space-between; gap: 1rem; margin:0  ">
                            <p class="card-text" style="width: fit-content;">Rating: ${product.rating}</p>
                            <p class="card-text" style="width: fit-content;">$${product.price}</p>
                        </div>
                        
                    </div>
                </div>
            `;
            productsGrid.appendChild(productElement);
        });
    };

    // Apply filters and fetch filtered products
    const applyFilters = () => {
        const company = companyFilter.value;
        const rating = ratingFilter.value;
        const search = searchBar.value.toLowerCase();
        const price = priceFilter.value;
    
        // Prepare filters object
        const filters = {};
        if (company) filters.company = company;
        if (rating) filters.numericFilters = `rating>${rating}`;
        if (search) filters.name = search;
        if (price) {
            filters.numericFilters = filters.numericFilters
                ? `${filters.numericFilters},price<${price}`
                : `price<${price}`;
        }
        
        // Apply sorting
        const sortValue = sortOptions.value;
        if (sortValue) {
            // Sort format is "field-order", e.g., "price-desc" or "name-asc"
            const [field, order] = sortValue.split('-');
            filters.sort = order === 'desc' ? `-${field}` : field;
        }
        
        fetchProducts(filters, currentPage);
    };
    
    // Initial fetch
    fetchProducts();
    

    // Event listeners for user interactions
    companyFilter.addEventListener('change', applyFilters);
    ratingFilter.addEventListener('change', applyFilters);
    searchBar.addEventListener('input', applyFilters);
    priceFilter.addEventListener('input', () => {
        priceValue.textContent = `Max Price $${priceFilter.value}`;
        applyFilters(); 
    });
    sortOptions.addEventListener('change', applyFilters);

    // Initial fetch
    fetchProducts();
});
