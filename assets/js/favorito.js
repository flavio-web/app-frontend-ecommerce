
const toggleFavorito = ( id ) =>{

    const nodoFavorito = document.querySelector(`#producto-${id} .favorito`);
    console.log({ nodoFavorito })

    if( nodoFavorito.classList.contains('bi-heart') ){

        nodoFavorito.classList.remove('bi-heart');
        nodoFavorito.classList.add('bi-heart-fill', 'text-danger');
        addFavorito( id );
        return;
    }

    nodoFavorito.classList.add('bi-heart');
    nodoFavorito.classList.remove('bi-heart-fill', 'text-danger');
    removeFavorito( id );

}

const addFavorito = ( id ) =>{
    const favoritos = getProductsFavoritos();
    favoritos.push( id );

    setProductsFavoritos( favoritos );
}

const removeFavorito = ( id ) =>{
    const favoritos = getProductsFavoritos();
    const indexFavorito = favoritos.findIndex( ( favorito) => favorito == id );
    
    favoritos.splice( indexFavorito, 1 );
    setProductsFavoritos( favoritos );
}

const setProductsFavoritos = ( productos = [] ) => {
    localStorage.setItem('favoritos', JSON.stringify(productos) );
}

const getProductsFavoritos = () => {
    return JSON.parse(localStorage.getItem('favoritos')) || []; 
}