"use strict"

let menuDesplegable = document.querySelector("#btnToggle").addEventListener("click", desplegar);

function desplegar() {
    let navbar = document.querySelector(".header_navbar").classList.toggle("show");
}