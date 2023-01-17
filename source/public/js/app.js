import axios from "axios";
import Swal from "sweetalert2"
// Cuando el html cargue
document.addEventListener("DOMContentLoaded", () => {
    const skills = document.querySelector(".lista-conocimientos");
    // Limpiar las alertas de los errores de campos vacio de formulario
    let alertas = document.querySelector(".alertas");
    if (alertas) {
        limpiarAlertas();
    }

    // Si las skills estan seleccionadas
    if (skills) {
        skills.addEventListener("click", agregarSkill);

        // Llamar ala funcion cuando estemos en editar
        skillsSeleccionados();
    }
    // 
    const listaVacantes = document.querySelector(".panel-administracion");

    if (listaVacantes) {
        listaVacantes.addEventListener("click", e => {
            e.preventDefault();

            if (e.target.dataset.eliminar) {
                // eliminar con axios
                Swal.fire({
                    title: 'Deseas eliminar tu vacante publicada?',
                    text: "Una vez eliminado, no se podra recuperar",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, Eliminar!',
                    cancelButtonText: "No,Cancelar!"
                }).then((result) => {
                    if (result.value) {
                        // Enviar la peticion con axios
                        const url = `${location.origin}/vacantes/eliminar/${e.target.dataset.eliminar}`
                        // Eliminar con axios
                        axios.delete(url, { params: { url } })
                            .then(response => {
                                if (response.status === 200) {
                                    // Alert sweetalert
                                    Swal.fire(
                                        'Eliminado!',
                                        response.data,
                                        'success'
                                    );

                                    // Eliminar todo
                                    e.target.parentElement.parentElement.parentElement.removeChild(e.target.parentElement.parentElement)
                                }
                            })
                            .catch(() => {
                                Swal.fire({
                                    type: "error",
                                    title: "Hubo un error",
                                    text: "No se pudo eliminar la vacante"
                                })
                            })


                    }
                })
            } else if (e.target.tagName === "A") {
                window.location.href = e.target.href
            }
        })
    }
})

// 
const skills = new Set();
const agregarSkill = (e) => {
    if (e.target.tagName === "LI") {
        if (e.target.classList.contains("activo")) {
            skills.delete(e.target.textContent);
            e.target.classList.remove("activo");
        } else {
            skills.add(e.target.textContent)
            e.target.classList.add("activo")
        }
    }
    const arraySkills = [...skills]
    document.querySelector("#skills").value = arraySkills
}
// 
const skillsSeleccionados = () => {
    const seleccionados = Array.from(document.querySelectorAll(".lista-conocimientos .activo"));

    seleccionados.forEach(skill => skills.add(skill.textContent))

    // Inyectarlo en el hidden
    const skillsArray = [...skills]
    document.querySelector("#skills").value = skillsArray
}
// 
const limpiarAlertas = () => {
    const alertas = document.querySelector(".alertas");
    const interval = setInterval(() => {
        if (alertas.children.length > 0) {
            alertas.removeChild(alertas.children[0]);
        } else if (alertas.children.length === 0) {
            alertas.parentElement.removeChild(alertas);
            clearInterval(interval);
        }
    }, 4000);
}