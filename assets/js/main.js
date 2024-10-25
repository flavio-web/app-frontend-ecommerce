let paginacion = {
    paginaActual: 0,
    isLoading: false
}

window.addEventListener('load', function(){
    getCategoriaProductos();
    getProductosPaginados();
});

document.addEventListener('scroll', function(){
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && !paginacion.isLoading ) {
        getProductosPaginados( 12, paginacion.paginaActual );    
    }
});


const getCategoriaProductos = () =>{
    fetch('https://dummyjson.com/products/categories')
    .then( (respuesta) => respuesta.json() )
    .then( (datos) =>{
        console.log( datos );

        const categoriasAleatorias = seleccionarCategoriasAleatorias( datos, 7 );
        generarHtmlCategoriasProductos( categoriasAleatorias );
        generarHtmlOpcionesCategorias( datos );
        generarHtmlOptionsSearch( datos );

    }).catch( (error) =>{
        console.log( error );
    })
}

const getProductosPaginados = ( limite = 12, skip = 0 ) =>{
    fetch(`https://dummyjson.com/products?limit=${limite}&skip=${skip}&select=title,price,rating,thumbnail,images`)
    //fetch(`https://dummyjson.com/products?limit=0`)
    .then( (respuesta) => respuesta.json() )
    .then( datos =>{
        console.log( datos );

        const { products } = datos;

        generarHtmlTarjetaProductos( products );

        paginacion.paginaActual = products[ products.length - 1].id;

    }).catch( (error) =>{
        console.log( error );
    });
}

const generarHtmlTarjetaProductos = ( productos = [] ) =>{

    const favoritos = getProductsFavoritos();

    let htmlProductos = '';

    productos.forEach( ({ id, title, price, rating, thumbnail }) =>{
       
        const existeFavorito = favoritos.find( ( favorito ) => favorito == id );

        let claseFavorito = 'bi-heart';

        if( existeFavorito ){
            claseFavorito = 'bi-heart-fill text-danger';
        }

        const htmlEstrellas = generarEstrellas( rating );

        htmlProductos += `
            <div id="producto-${id}" class="card border-0 rounded-0 shadow m-2" style="width: 18rem;">
                <img src="${thumbnail}" class="card-img-top rounded-0" alt="${title}">
                <div class="card-body mt-3 mb-3">
                    <div class="row">
                        <div class="col-10">
                            <h4 class="card-title">${title}</h4>
                            <p class="card-text">
                                ${htmlEstrellas}
                                (${rating})
                            </p>
                        </div>
                        <div class="col-2">
                            <i class="bi ${claseFavorito} fs-3 favorito" onclick="toggleFavorito('${id}')"></i>
                        </div>
                    </div>
                </div>
                <div class="row align-items-center text-center g-0">
                    <div class="col-4">
                        <h5>$${price}</h5>
                    </div>
                    <div class="col-8">
                        <a href="#" class="btn btn-primary w-100 p-3 rounded-0 text-dark" onclick="seleccionarProducto('${id}')">ADD TO CART</a>
                    </div>
                </div>
            </div>
        `;
    });

    const nodoProductos = document.getElementById('productos');
    nodoProductos.innerHTML += htmlProductos;
}

const generarHtmlCategoriasProductos = ( categorias = [] ) =>{

    let htmlCategorias = '';

    categorias.forEach( ( { name, slug } ) =>{
        htmlCategorias += `
            <div class="my-2">
                <div class="tarjetaCategoria card bg-light text-dark">
                    <div class="card-body">
                        <h5 class="card-title">${ name }</h5>
                        <a href="#" class="btn btn-primary">Ver Mas...</a>
                    </div>
                </div>
            </div>
        `
    });

    const nodoCategoria = document.querySelector('#categorias .d-flex');
    nodoCategoria.innerHTML = htmlCategorias;
}

const generarHtmlOpcionesCategorias = ( categorias = [] ) =>{

    let htmlCategorias = '';
    categorias.forEach( ( { name, slug } ) =>{
        htmlCategorias += `
            <li><a class="dropdown-item" href="#">${name}</a></li>
        `;
    });

    const nodoCategoria = document.querySelector('#menuCategoria');
    nodoCategoria.innerHTML = htmlCategorias;
}

const generarHtmlOptionsSearch = ( categorias = [] ) =>{

    let htmlCategoriasSearch = '<option value="">Seleccionar Categoria</option>';
    categorias.forEach( ({ name, slug }) =>{
        htmlCategoriasSearch += `
            <option value="${slug}">${ name }</option>
        `;
    })

    const nodoSearchCategoria = document.querySelector('#searchOptions');
    nodoSearchCategoria.innerHTML = htmlCategoriasSearch;
    
}

const seleccionarCategoriasAleatorias = ( categorias = [], cantidad = 7 ) =>{
    
    const categoriasSeleccionadas = [];

    while( categoriasSeleccionadas.length < cantidad  ){
        const categoria = categorias[(Math.floor(Math.random() * categorias.length))];

        const existeCategoria = categoriasSeleccionadas.find( ( category ) => category.slug === categoria.slug );

        if( !existeCategoria ){
            categoriasSeleccionadas.push( categoria );
        }

    }

    return categoriasSeleccionadas;
}

const seleccionarProducto = ( id ) =>{
    const url = `http://127.0.0.1:5500/producto.html?producto=${id}`;
    window.location.href = url;
}

const btnSearch = document.getElementById('btnSearch');
btnSearch.addEventListener('click', async function(){

    const search = document.getElementById('search').value;
    if( !search ){
        paginacion.isLoading = false;
        paginacion.paginaActual = 0;
        const nodoProductos = document.getElementById('productos');
        nodoProductos.innerHTML = '';
        getProductosPaginados();
        return;
    }

    await activarLoading();
    await searchProducto( search );
    setTimeout(() => {
        desactivarLoading();
    }, 1500);
    console.log('siguiente paso');
});


const searchProducto = async ( search = '' ) =>{
    await fetch(`https://dummyjson.com/products/search?q=${search}`)
    .then(res => res.json())
    .then( (datos) =>{
        console.log( datos );

        const nodoProductos = document.getElementById('productos');
        nodoProductos.innerHTML = '';
        const { products } = datos;
        if( products.length === 0 ){
            nodoProductos.innerHTML = '<p class="fs-3 fst-italic text-center">No existen resultados</p>';
            return;
        }
        generarHtmlTarjetaProductos( products );
        paginacion.isLoading = true;
    }).catch( error => {
        console.log( error );
    })
}
/* const searchProducto = async ( search = '' ) =>{
    
    const peticion  = await fetch(`https://dummyjson.com/products/search?q=${search}`);
    const datos     = await peticion.json();
    console.log({ search: datos });

} */