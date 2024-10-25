window.addEventListener('load', function(){

    const codigoProducto = recuperarCodigoProducto();
    if( !codigoProducto ){
        alert('El codigo del producto no existe');
        return;
    }

    getProductoById( codigoProducto );
});

const recuperarCodigoProducto = () =>{
    const parametros = window.location.search;

    const urlParametros = new URLSearchParams(parametros);
    const existeCodigo = urlParametros.has('producto');
    if( !existeCodigo ){
        return null;
    }

    return urlParametros.get('producto');
}

const getProductoById = ( id ) =>{
    fetch(`https://dummyjson.com/products/${id}`)
    .then(res => res.json())
    .then( datos =>{
        console.log( datos );

        showProducto( datos );
    })
    .catch( error =>{
        console.log( error );
    })
}

const showProducto = ({ title, rating, brand, sku, price, tags, description, category, stock, warrantyInformation, images, dimensions, weight, reviews }) =>{
    const nombreProducto = document.getElementById('nombreProducto');
    nombreProducto.textContent = title;

    const estrellas = generarEstrellas( rating );
    document.getElementById("estrellasProducto").innerHTML = estrellas;

    document.getElementById('categoriaProducto').textContent = category.toUpperCase();
    document.getElementById('skuProducto').textContent = sku;
    document.getElementById('precioProducto').textContent = price;

    if( tags ){
        let htmlTags = '';
        tags.forEach( ( tag ) =>{
            htmlTags += `<span class="badge bg-success py-1 px-3 mx-1"><strong>${tag.toUpperCase()}</strong></span>`;
        });
        document.getElementById('tagsProducto').innerHTML = htmlTags; 
    }

    document.getElementById('descripcionProducto').textContent = description;
    document.getElementById('marcaProducto').textContent = brand;
    document.getElementById('stockProducto').textContent = stock;
    document.getElementById('garantiaProducto').textContent = warrantyInformation;

    //imagenes
    let htmlListaImagenes = '';
    let htmlListaImagenesPeques = '';
    images.forEach( ( imagen, index ) =>{
        htmlListaImagenes += `
            <li>
                <img src="${imagen}" loading="lazy">
            </li>
        `;

        htmlListaImagenesPeques += `
            <li>
                <img src="${imagen}" loading="lazy" onmouseover="thumbHover(${index})">
            </li>
        `;

        
    });

    document.querySelector('#pgallery ul').innerHTML = htmlListaImagenes;
    document.querySelector('#pgallerythumbs').innerHTML = htmlListaImagenesPeques;


    //detalle

    let htmlDetalleProducto = `
        <div class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseDescripcion" aria-expanded="true" aria-controls="collapseDescripcion">
                   <b>Descripcion</b>
                </button>
            </h2>
            <div id="collapseDescripcion" class="accordion-collapse collapse show" data-bs-parent="#detalle">
                <div class="accordion-body">
                    ${ description }
                </div>
            </div>
        </div>
    `;

    if( dimensions ){
        const { depth, height, width } = dimensions;

        htmlDetalleProducto += `
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseCaracteristica" aria-expanded="false" aria-controls="collapseCaracteristica" aria-controls="collapseCaracteristica">
                        <b>Caracteristicas</b>
                    </button>
                </h2>
                <div id="collapseCaracteristica" class="accordion-collapse collapse" data-bs-parent="#detalle">
                    <div class="accordion-body">
                        <ul class="list-group">
                            <li class="list-group-item">
                                <h6>Ancho:</h6>
                                <span>${width}</span>
                            </li>
                            <li class="list-group-item">
                                <h6>Alto:</h6>
                                <span>${height}</span>
                            </li>
                            <li class="list-group-item">
                                <h6>Profundidad:</h6>
                                <span>${depth}</span>
                            </li>
                            <li class="list-group-item">
                                <h6>Peso:</h6>
                                <span>${weight}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    //comentarios
    if( reviews ){
        const comentarios = generarHtmlComentarios( reviews );
        htmlDetalleProducto += `
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseComentario" aria-expanded="false" aria-controls="collapseComentario" aria-controls="collapseComentario">
                        <b>Comentarios</b>
                    </button>
                </h2>
                <div id="collapseComentario" class="accordion-collapse collapse" data-bs-parent="#detalle">
                    <div class="accordion-body">
                        ${ comentarios }
                    </div>
                </div>
            </div>
        `;
    }

    document.getElementById('detalle').innerHTML = htmlDetalleProducto;
}

const generarHtmlComentarios = ( comentarios = [] ) => {

    let htmlComentarios = '';

    comentarios.forEach( ({ comment, date, rating, reviewerEmail, reviewerName }) =>{
        const estrellas = generarEstrellas( rating );
        htmlComentarios += `
            <div class="card cardComment p-3 m-3">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="user d-flex flex-row align-items-center">
                        <img src="https://i0.wp.com/digitalhealthskills.com/wp-content/uploads/2022/11/3da39-no-user-image-icon-27.png" width="30" class="user-img rounded-circle mr-4">
                        <span>
                            <small class="fw-medium text-dark ms-2">${reviewerName}</small> <small class="font-weight-bold">${comment}</small>
                        </span>
                                    
                    </div>

                    <small>${ (new Date(date)).toLocaleDateString('es-ES') }</small>

                </div>

                <div class="action d-flex justify-content-between mt-2 align-items-center">
                    <div class="reply px-4">
                        <small>${reviewerEmail}</small>      
                    </div>

                    <div class="icons align-items-center">
                        ${ estrellas }        
                    </div>
                                
                </div> 
            </div>
        `;
    });

    return htmlComentarios;
}