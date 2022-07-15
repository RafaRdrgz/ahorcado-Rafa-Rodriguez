
//Secciones del DOM:

let pantalla_inicio = document.getElementById("inicio");
let pantalla_juego = document.getElementById("juego");
let pantalla_fin = document.getElementById("fin");


//Botones e inputs:
//Inicio

let in_nombre = document.getElementById("in_nombre");
let in_frase = document.getElementById("in_frase");
let in_intentos = document.getElementById("in_intentos");
let comenzar = document.getElementById("btn_comenzar");

//Pantalla de juego

let in_letra = document.getElementById("in_letra");
let buscar = document.getElementById("btn_buscar");

//Casillero

let casillero = document.getElementById("casillero");

//Marcador

let out_nombre = document.getElementById("out_nombre");
let out_num_letras = document.getElementById("out_num_letras")
let out_intentos = document.getElementById("out_num_intentos");
let out_erroneas = document.getElementById("out_erroneas");


//Variables globales de juego

let nombre = "";
let frase_oculta = "";
let frase_limpia = "";
let frase_ahorcado = "";
let num_letras = 0;
let intentos = 0;
let letras_falladas = [];
let letras_acertadas = [];
let juego_ganado = false;




window.onload= inicio; //Inicio del juego cuando carga la página

function inicio(){

    //Reseteo todos los inputs y variables del juego y muestro la pantalla inicial

    nombre = "";
    frase_oculta = "";
    frase_limpia = "";
    num_letras = 0;
    intentos = 0;
    letras_acertadas = [];
    letras_falladas = [];

    in_nombre.value = "";
    in_frase.value = "";
    in_intentos.value = "";
    in_letra.value = "";

    out_nombre.textContent = "";
    out_num_letras.textContent = "";
    out_intentos.textContent = "";
    out_erroneas.innerHTML = "";

    casillero.innerHTML = "";
    fin.innerHTML= "";

    //Se reestablecen los estilos del marcador

    out_intentos.parentElement.style.backgroundColor = "whitesmoke";
    out_num_letras.parentElement.style.backgroundColor = "whitesmoke";
    out_intentos.parentElement.style.fontWeight = "400";
    out_num_letras.parentElement.style.fontWeight = "400";


    //Muestro únicamente la pantalla de inicio
    pantalla_inicio.style.display= "block";
    pantalla_juego.style.display= "none";
    pantalla_fin.style.display= "none";


    //Cuando le damos al botón comenzar, se comprueban los inputs de inicio y se comienza la partida

    comenzar.onclick = function (){

        nombre = limpiaTexto(in_nombre.value);
        frase_oculta = limpiaTexto(in_frase.value); //Quita espacios
        frase_limpia = limpiaPalabra(frase_oculta); //Quita acentos
        intentos = parseInt(in_intentos.value);
        num_letras = cuentaLetras(frase_oculta);

        //Compruebo el valor de las variables y se procede según el caso

        if(nombre.length <1 || nombre == " " || frase_limpia.length <=1 || frase_limpia == " " || isNaN(intentos) || intentos <= 0){

            //Mando un aviso y reseteo los inputs

            let dialogo = document.createElement("dialog");
                dialogo.className = "dialog-inicio";

            let texto = document.createElement("p");
                texto.innerHTML =`Introduce un nombre y una frase no vacíos. <br> 
                Los intentos deben ser un dato numérico no negativo. <br>
                Tu frase debe contener al menos más de un carácter.`;


            let cerrar_dialog = document.createElement("button");
                cerrar_dialog.className = "btn";
                cerrar_dialog.textContent = "Entendido";

                dialogo.append(texto , cerrar_dialog);
                document.body.append(dialogo);
                dialogo.showModal();


                cerrar_dialog.onclick = function(){

                    in_nombre.value = "";
                    in_frase.value = "";
                    in_intentos.value = ""; 
                    
                    dialogo.close();
                    dialogo.remove();
                }


        } else { //Comenzamos a jugar

            pantalla_inicio.style.display = "none";
            pantalla_juego.style.display = "block";

            ahorcado(nombre, frase_oculta, frase_limpia, intentos, num_letras);
        }

    }

}



//Función principal del juego

function ahorcado(id , fraseOculta, fraseLimpia, intentos, nLetras){


    out_nombre.textContent = id;
    out_intentos.textContent = intentos;
    out_num_letras.textContent = nLetras;

    if(num_letras <= 3){ //Si el número de letras a acertar es <=3 el marcador se muestra en verde

        out_num_letras.parentElement.style.backgroundColor = "lightgreen";
        out_num_letras.parentElement.style.fontWeight = "700";
    }

    if(intentos<= 3){ //Si el número de intentos es <=3 el marcador se muestra en amarillo

        out_intentos.parentElement.style.backgroundColor = "yellow";
        out_intentos.parentElement.style.fontWeight = "700";
    }

    if(intentos <= 1){ //Si el número de intentos es <=1 el marcador se muestra en rojo

        out_intentos.parentElement.style.backgroundColor = "lightcoral";
        out_intentos.parentElement.style.fontWeight = "700";
    }

    out_nombre.parentElement.style.fontWeight = "700";

    //Rellenamos el casillero con la frase a buscar
    casillero.innerHTML = montaPalabra(fraseOculta);


    buscar.onclick = function(){

        let letra = limpiaLetra(limpiaTexto(in_letra.value)); //Se quita los acentos a la letra

        if(letra.length == 1 && letra != " "){ //Si se cumple, se realiza la comprobación

            compruebaLetra(letra, fraseLimpia);
            in_letra.value= "";

        } else { //Si no, se alerta al usuario

            let dialogo = document.createElement("dialog");
            dialogo.className = "dialog-busqueda";

            let texto = document.createElement("p");
                texto.innerHTML =`Introduce un carácter que sea una única letra no vacía.`;


            let cerrar_dialog = document.createElement("button");
                cerrar_dialog.className = "btn";
                cerrar_dialog.textContent = "Entendido";

                dialogo.append(texto , cerrar_dialog);
                document.body.append(dialogo);
                dialogo.showModal();

                cerrar_dialog.onclick = function(){

                    dialogo.close();
                    dialogo.remove();
                    in_letra.value= "";

                }

        }
    }

}


//Función para comprobar una letra en la frase
function compruebaLetra(letra, frase){


    if(frase.indexOf(letra) != -1){ //Si la letra existe en la cadena, se comprueba que no esté en acertadas

        if(letras_acertadas.indexOf(letra)!= -1){//Si está en letras acertadas se comunica al usuario

            let dialogo = document.createElement("dialog");
            dialogo.className = "dialog-info-letra";

            let texto = document.createElement("p");
                texto.innerHTML =`La letra <strong>${letra}</strong> ya se ha acertado antes.`;


            let cerrar_dialog = document.createElement("button");
                cerrar_dialog.className = "btn";
                cerrar_dialog.textContent = "Entendido";

                dialogo.append(texto , cerrar_dialog);
                document.body.append(dialogo);
                dialogo.showModal();

                cerrar_dialog.onclick = function(){

                    dialogo.close();
                    dialogo.remove();
                }

        } else { //Si no, letra acertada

            letraAcertada(letra);

        }


    } else { //Si la letra no existe en la cadena, se comprueba si existe en letras falladas

        if(letras_falladas.indexOf(letra)!= -1){

            let dialogo = document.createElement("dialog");
            dialogo.className = "dialog-info-letra";

            let texto = document.createElement("p");
                texto.innerHTML = `La letra <strong>${letra}</strong> ya se ha fallado antes.`;


            let cerrar_dialog = document.createElement("button");
                cerrar_dialog.className = "btn";
                cerrar_dialog.textContent = "Entendido";

                dialogo.append(texto , cerrar_dialog);
                document.body.append(dialogo);
                dialogo.showModal();

                cerrar_dialog.onclick = function(){

                    dialogo.close();
                    dialogo.remove();
                }

        }else { //Si no, letra fallada

            letraFallada(letra);

        }

    }

}


//Pasos a realizar si se acierta una letra
function letraAcertada(letra){

    let spans = document.querySelectorAll(".oculto");

    for(let i= 0; i<frase_limpia.length; i++){

        if(frase_limpia[i] == letra){

            spans[i].textContent = frase_oculta[i]; //Cambiamos el carácter oculto por la letra acertada
            spans[i].classList.add("acertado");
            num_letras--;
            letras_acertadas.push(letra); //Añado la letra acertada al array de aciertos

        }
    }

    if(num_letras == 0){ juego_ganado = true; juegoFin();} //Se comprueba si es el final del juego
    else{ out_num_letras.textContent = num_letras; //Actualizamos el valor de num letras restante
    
        if(num_letras <= 3){ //Si el número de letras a acertar es <=3 el marcador se muestra en verde

            out_num_letras.parentElement.style.backgroundColor = "lightgreen";
            out_num_letras.parentElement.style.fontWeight = "700";
        }
    
    } 
}


//Pasos a realizar si se falla una letra
function letraFallada(letra){

    letras_falladas.push(letra);
    intentos--; //Se resta un intento por fallo

    if(intentos<= 3){ //Si el número de intentos es <=3 el marcador se muestra en amarillo

        out_intentos.parentElement.style.backgroundColor = "yellow";
        out_intentos.parentElement.style.fontWeight = "700";
    }

    if(intentos <= 1){ //Si el número de intentos es <=1 el marcador se muestra en rojo

        out_intentos.parentElement.style.backgroundColor = "lightcoral";
        out_intentos.parentElement.style.fontWeight = "700";
    }

    if(intentos == 0){ out_intentos.textContent = intentos; juego_ganado = false;  juegoFin(); } //Se comprueba si es el final del juego, según los intentos restantes
    else{ out_intentos.textContent = intentos;
            out_erroneas.innerHTML += `<span class="error">${letra}</span>`;} //En caso que no, se actualizan los intentos y se muestran los errores

}


//Pasos a realizar cuando ha terminado el juego, posibilidad de volver a empezar
function juegoFin(){

    let dialogo = document.createElement("dialog");
        dialogo.className = "dialogo-fin";

    let div = document.createElement("div");
    let div_interior = document.createElement("div");
    let p = document.createElement("p");
    let reset = document.createElement("button");
    let cerrar = document.createElement("button");

    if(juego_ganado){ //Si se ha ganado el juego

        div.className = "victoria";
        p.textContent = `Has ganado, ${nombre}: ¡ENHORABUENA!`;

    }else{

        div.className = "derrota";
        p.textContent = `Has perdido, ${nombre}: ¡Vuelve a intentarlo!`;
    }


    reset.className = "btn";
    reset.textContent = "Volver a jugar";
    cerrar.className = "btn";
    cerrar.textContent = "Fin";
    div_interior.className= "botones-fin";

    div_interior.append(reset, cerrar);
    div.append(p, div_interior);
    dialogo.append(div);
    document.body.append(dialogo);

    //Muestro la pantalla de diálogo de fin de partida

    dialogo.showModal();

    reset.onclick = function(){ dialogo.close(); dialogo.remove(); inicio()}; //Al hacer click en el botón de volver a empezar, reiniciamos el juego
    cerrar.onclick = function(){ dialogo.close(); dialogo.remove(); alert(`Hasta luego ${nombre}!`); window.close(); muestraMensajeFin();} //Se cierra el juego

}


//Funciones auxiliares

        //Quita acentos de una letra y la retorna;
        function limpiaLetra(letra) {
            letra = letra.toLowerCase();
            let letra_s = '';
            switch (letra) {
                    case 'á':
                    case 'à':
                        letra_s = 'a';
                        break;
                    case 'é':
                    case 'è':
                        letra_s = 'e';
                        break;
                    case 'í':
                    case 'ì':
                        letra_s = 'i';
                        break;
                    case 'ó':
                    case 'ò':
                        letra_s = 'o';
                        break;
                    case 'ú':
                    case 'ù':
                    case 'ü':
                        letra_s = 'u';
                        break;
                    default:
                        letra_s = letra;
                        break;
                }
                return letra_s;
        }

        //Quita los acentos de una palabra entera y la retorna;
        function limpiaPalabra(entrada){

            let salida = "";

            for(let letra of entrada){

                salida += limpiaLetra(letra);
            }

            return salida;
        }

        //Quita los espacios redundantes de las frases
        function limpiaTexto(txt){

            let texto = txt.trim();

            while(texto.indexOf("  ") != -1 ){

                texto = texto.replaceAll('  ', ' '); //mientras haya espacios dobles, los reemplaza por espacios sencillos

            }

            return texto;
        }

        //Cuenta las letras de una cadena sin tener en cuenta los espacios
        function cuentaLetras(text){

            let num = 0;

            for( let letra of text){

                if(letra != " "){ num++;}
            }
            
            return num;
        }

        //Transforma la palabra oculta por la cadena a mostrar en el casillero
        function montaPalabra(text){

            let spans = "";

            for(let i = 0; i < text.length; i++){



                if(text[i] == " "){

                    spans += `<span class="oculto espacio"> - </span>`;
                    

                } else{

                    spans += `<span class="oculto"> * </span>`;

                }
            }

            return spans;

        }


    //Avisa al usuario de que cierre la ventana en caso de que al terminar el juego no se haya podido cerrar
    function muestraMensajeFin(){

        pantalla_fin.style.display = "block";
        pantalla_inicio.style.display = "none";
        pantalla_juego.style.display = "none";

        pantalla_fin.innerHTML = "";

        let div = document.createElement("div");
        div.className = "div-mensaje";

        let texto = document.createElement("p");
        texto.className = "div-mensaje-texto";
        texto.innerHTML = "<strong>¡Juego finalizado!</strong> Por favor, cierra la ventana.";

        div.append(texto);
        pantalla_fin.append(div);

    }