export default {
    seleccionarSkills: (seleccionados = [], opciones) => {
        const skills = ["HTML5", "CSS", "Apollo", "Node", "React JS",
            "CSSGRID", "FlexBox", "JavaScript",
            "React Hooks", "Redux", "GraphQL", "TypeScript",
            "Django", "ORM", "Sass", "Laravel", "Sequelize",
            "Mongoose", "SQL", "MVC", "PHP", "Phyton", "VueJs", "Angular", "WordPress"];

        let html = "";
        skills.forEach(skill => {
            html += `<li ${seleccionados.includes(skill) ? 'class="activo"' : ''}>${skill}</li>`;
        });
        return opciones.fn = html;
    },
    tipoContrato: (seleccionado, opciones) => {
        return opciones.fn(this).replace(
            new RegExp(`value="${seleccionado}"`), '$& selected="selected"'
        )
    },
    mostrarAlertas: (errores = {}, alertas) => {
        const categoria = Object.keys(errores)
        let html = ""
        if (categoria.length) {
            errores[categoria].forEach(error => {
                html += `<div class="${categoria} alerta"> ${error}</div>`
            })
        }
        return alertas.fn = html
    }
}

