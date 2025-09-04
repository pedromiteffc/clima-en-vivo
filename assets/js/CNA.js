const TEAMS = ["River Plate", "APV", "Ciudad", "Sportivo Pilar", "Derqui", "Vecinal de Munro", "Obras", "Velez", "San Fernando", "Nolting"]

const STORAGE_KEY = 'resultados-centronorte-a'

const $local = document.getElementById('local')
const $visit = document.getElementById('visitante')
const $pL = document.getElementById('pLocal')
const $pV = document.getElementById('pVisitante')
const $form = document.getElementById('form-partido')
const $msg = document.getElementById('mensaje')
const $tbodyTabla = document.getElementById('tbody-tabla')
const $tbodyRes = document.getElementById('tbody-resultados')
const $juegos = document.getElementById('juegos')
const $btnReset = document.getElementById('btn-reset')

let resultados = JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]')

function initSelectors(){

    TEAMS.forEach(t=>{
        const o1=document.createElement('option')
        o1.value=o1.textContent=t
        $local.appendChild(o1)

        const o2=document.createElement('option')
        o2.value=o2.textContent=t
        $visit.appendChild(o2)
    })

    $local.selectedIndex=0;$visit.selectedIndex=1

}

function showMsg(text, type='error')
{

    if(!text)
    {
        $msg.innerHTML=''
        return
    }

    $msg.innerHTML = `<div class="alert ${type}">${text}</div>`

}

function renderResultados()
{
    $tbodyRes.innerHTML=''

    resultados.forEach((r,idx) => {
        const tr=document.createElement('tr')
        tr.innerHTML=`<td>${idx+1}</td> <td class="left">${r.local} vs ${r.visitante}</td> <td>${r.pLocal} - ${r.pVisitante}</td> <td><button class='btn danger' onclick='eliminar(${idx})'>Eliminar</button></td>`
        $tbodyRes.appendChild(tr)
    })

    $juegos.textContent=`${resultados.length} partidos cargados`

}

function eliminar(idx)
{
    resultados.splice(idx,1)
    actualizar()
}

function statsVacias()
{
    const base={}
    TEAMS.forEach(t => base[t] ={ Equipo:t, PJ:0, PG:0, PP:0, PF:0, PC:0, get DG(){return this.PF - this.PC}, get Pts(){return this.PG*2 + this.PP*1}})
    return base
}

function calcularTabla()
{

    const s=statsVacias()

    resultados.forEach(r => {
        
        const L=s[r.local]
        const V=s[r.visitante]

        L.PJ++
        V.PJ++;
        L.PF+= r.pLocal
        L.PC+=r.pVisitante
        V.PF+=r.pVisitante
        V.PC+=r.pLocal
        if(r.pLocal>r.pVisitante)
        {   
            L.PG++
            V.PP++
        } 
        else 
        {
            V.PG++
            L.PP++
        
        }

    })

    return Object.values(s).sort((a,b) => {

        if(b.Pts!==a.Pts) return b.Pts-a.Pts
        if(b.DG!==a.DG) return b.DG-a.DG
        if(b.PF!==a.PF) return b.PF-a.PF

        return a.Equipo.localeCompare(b.Equipo,'es')

    }).map((row,i)=>({...row,Posicion:i+1}))

}

function renderTabla()
{
    const tabla=calcularTabla()
    $tbodyTabla.innerHTML=''

    tabla.forEach(r => {

        const tr=document.createElement('tr')
        const posClass = r.Posicion <= 4 ? 'top4' : ''
        tr.innerHTML=`<td class='${posClass}'>${r.Posicion}</td><td class='left'>${r.Equipo}</td><td>${r.PJ}</td><td>${r.PG}</td><td>${r.PP}</td><td>${r.PF}</td><td>${r.PC}</td><td>${r.DG}</td>`
        $tbodyTabla.appendChild(tr)

    })

}

function actualizar()
{
    renderResultados()
    renderTabla()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resultados))
}

$form.addEventListener('submit',e => {

    e.preventDefault()
    const local=$local.value, visitante=$visit.value
    const pLocal=parseInt($pL.value,10), pVisitante=parseInt($pV.value,10)

    if(local===visitante)
    {
        showMsg('No puede jugar el mismo equipo contra sí.')
        return
    }

    if(isNaN(pLocal)||isNaN(pVisitante))
    {
        showMsg('Completá los puntos.')
        return
    }

    if(pLocal===pVisitante)
    {
        showMsg('No se permiten empates.')
        return
    }

    resultados.push({local,visitante,pLocal,pVisitante})
    actualizar()
    $form.reset()
})

$btnReset.addEventListener('click', () => {
    if(confirm('¿Seguro que querés borrar todos los resultados?'))
    {
        resultados=[]
        actualizar()
    }
})

initSelectors()
actualizar()
