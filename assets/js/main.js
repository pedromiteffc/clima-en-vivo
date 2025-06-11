let categorias = JSON.parse(localStorage.getItem('categorias')) || [

    'Comida',
    'Transporte Publico',
    'Auto',
    'Otros',

]

let registros = JSON.parse(localStorage.getItem('registros')) || []

const categoriaSelect = document.getElementById('categoria')
const tablaRegistros = document.getElementById('tabla-registros')

function renderCategorias()
{
    
    categoriaSelect.innerHTML = '<option value="" disabled selected> Selecciona la categoría ... </option>'

    categorias.forEach((cat) => {

        const option = document.createElement('option')
        option.value = cat
        option.textContent = cat
        categoriaSelect.appendChild(option)

    })

    localStorage.setItem('categorias', JSON.stringify(categorias))

}

function agregarCategoria()
{

    const nueva = document.getElementById('nuevaCategoria').value.trim()

    if (nueva && !categorias.includes(nueva))
    {

        categorias.push(nueva)
        renderCategorias()
        document.getElementById('nuevaCategoria').value = ""

    }

}

function formatearFecha(date) 
{
    const d = new Date(date)
    const dia = d.getDate().toString().padStart(2, "0")
    const mes = (d.getMonth() + 1).toString().padStart(2, "0")
    const anio = d.getFullYear()
    const hora = d.getHours().toString().padStart(2, "0")
    const minutos = d.getMinutes().toString().padStart(2, "0")
    return `${dia}/${mes}/${anio} - ${hora}:${minutos}`
}

function agregarRegistro() 
{
    const descripcion = document.getElementById("descripcion").value.trim()
    const monto = parseFloat(document.getElementById("monto").value)
    const categoria = document.getElementById("categoria").value
    const tipo = document.getElementById("tipo").value
    
    if(descripcion && !isNaN(monto) && categoria && tipo)
    {
        const registro = 
        {
            descripcion,
            monto,
            categoria,
            tipo,
            fecha: new Date().toISOString(),
        }

        registros.push(registro)
        localStorage.setItem("registros", JSON.stringify(registros))
        renderRegistros()
        document.getElementById("descripcion").value = ""
        document.getElementById("monto").value = ""
        document.getElementById("categoria").selectedIndex = 0
        document.getElementById("tipo").selectedIndex = 0

    }
}

function editarRegistro(index) 
{
    const r = registros[index]
    document.getElementById("descripcion").value = r.descripcion
    document.getElementById("monto").value = r.monto
    document.getElementById("categoria").value = r.categoria
    document.getElementById("tipo").value = r.tipo
    eliminarRegistro(index)
}

function eliminarRegistro(index)
{
    registros.splice(index, 1)
    localStorage.setItem("registros", JSON.stringify(registros))
    renderRegistros()
}

function renderRegistros() 
{
    tablaRegistros.innerHTML = ""
    let totalIngresos = 0,
    totalGastos = 0;
      
    registros.forEach((r, index) => 
    {
        const tr = document.createElement("tr");
        const clase = r.tipo === "ingreso" ? "ingreso" : "gasto";

        tr.innerHTML = `
            <td class="${clase}">${r.descripcion}</td>
            <td class="${clase}">$${r.monto.toFixed(0)}</td>
            <td>${r.categoria}</td>
            <td>${formatearFecha(r.fecha)}</td>
            <td><button onclick="editarRegistro(${index})">Editar</button></td>
            <td><button onclick="eliminarRegistro(${index})">Eliminar</button></td>
        `

        tablaRegistros.appendChild(tr)
        if (r.tipo === "ingreso") totalIngresos += r.monto
        else totalGastos += r.monto

    })

    document.getElementById("totalIngresos").textContent = totalIngresos.toFixed(0)
    document.getElementById("totalGastos").textContent = totalGastos.toFixed(0)

}

renderCategorias()
renderRegistros()
