const generarEstrellas = ( rating = 0 ) =>{

    const puntaje = rating.toString();
    const [ entero, decimales ] = puntaje.split('.');
    let totalEstrellas = entero;
    let htmlEstrellas = '';

    for (let index = 1; index <= entero; index++) {
        htmlEstrellas += `
            <i class="bi bi-star-fill text-primary"></i>
        `;
    }

    const decimalesEntero = parseInt( decimales )

    if( decimalesEntero >= 50 ){
        totalEstrellas++;
        htmlEstrellas += `
            <i class="bi bi-star-half text-primary"></i>
        `;
    }


    while( totalEstrellas < 5 ){
        totalEstrellas++;
        htmlEstrellas += `
            <i class="bi bi-star text-light"></i>
        `;
    }

    return htmlEstrellas;
}

const activarLoading = () =>{
    document.getElementById('loading').style.display = 'block';
}

const desactivarLoading = () =>{
    document.getElementById('loading').style.display = 'none';
}