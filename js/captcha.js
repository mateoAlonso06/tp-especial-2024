"use strict"

// nodos DOM
const form = document.querySelector("#formulario").addEventListener("submit", enviar);
const mostrarCaptcha = document.querySelector("#mostrarCaptcha");

let captchaAleatorio = generarCaptcha(8);
mostrarCaptcha.innerHTML = captchaAleatorio;

function enviar(e) {
    e.preventDefault();
    // con el prevent default evitamos que el formulario se envie
    validarCaptcha(captchaAleatorio);
}   

function validarCaptcha(captchaAleatorio) {
    const valorUsuario = document.querySelector("#captcha").value;

    if (valorUsuario == captchaAleatorio) {
        alert("valido");
        console.log("valido");
    }

    else {
        alert("invalido");
        console.log("invalido");
    }
}

function generarCaptcha(cant) {
    let valores = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let resultado = "";

    for (let i = 0; i < cant; i++) {
        let indice = Math.floor(Math.random() * valores.length);
        resultado += valores.charAt(indice);
    }

    return resultado;
}