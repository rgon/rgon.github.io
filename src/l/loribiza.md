---
title: Happy birthday!
description: The real deal.
tags: last step
coverImage: null
moto: Now help me build this.
permalink: l/loribiza/
---

## Vale vale, ya llegamos al final.
Existen 2 grandes problemas en el mundo: la pobreza mundial y los psicópatas. No voy a decir a quién me refiero.

## Progreso de la solución:
- [x] Ganas de solucionar
- [] Medida de la apertura de cada hoja del biombo (*largo* * *ancho* en *cm*)
- [] Medida de la altura del rodapié
- [] Altura aproximada de Octavio
- [] Estar en ibiza

## Resultado:
<div class="widget" id="geofenced" data-target="39.051511478500004, 1.5292909591928503">
    <h3 class="info action">Haz clic para comprobar si estás en ibiza y puedes ver el resultado.</h3>
    <div class="fenced">
## Soluciones de ingeniería:
Vas a tener que elegir dos de estas tres opciones:
+ Cierre magnético (lo suficientemente fuerte como para que Casper no lo abra)
+ Cierre de péndulo con una 
+ Solución para los bajos del biombo: contra la napia [tm] de Octavio.

Unos días de diseño 3D y la impresora lo deberían solucionar.

## Lo que necesito de tí:

Y ya estaría!
    </div>
</div>

<style>
    .widget {
        text-align: center;
    }
    .widget h3 {
        font-family: 'DejaVu Sans Mono', monospace;
        font-weight: bold;
    }
    .widget .action {
        cursor: pointer;
    }
    #geofenced .fenced {
        display: none;
    }
</style>
<script>
function measureDistance(a, b) {
    a = [parseFloat(a[0]), parseFloat(a[1])]
    b = [parseFloat(b[0]), parseFloat(b[1])]
    console.log(a, b)

    // No crow distance, no haversine formula, nothing yet. The earth is flat (for this function, at least)
    return Math.sqrt(Math.pow((b[0] - a[0]), 2) + Math.pow((b[1] - a[1]), 2))
}
function checkGeofence () {
    // Ask for location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((location) => {
            var lat = location.coords.latitude
            var long = location.coords.longitude
            console.log(lat, long)
            let d = measureDistance([lat, long], document.querySelector("#geofenced").dataset.target.split(','))
            if (d <= 1.0) {
                document.querySelector("#geofenced .info").innerHTML = 'Pos me has pillado. Todavía no me ha dado tiempo a terminarlo.'
            } else {
                document.querySelector("#geofenced .info").innerHTML = 'Todavía no estás en Ibiza!'
            }
        }, (e) => { 
            console.error(e)
            document.querySelector("#geofenced .info").innerHTML = 'Error obteniendo la ubicación.'
        })
    } else {
        document.querySelector("#geofenced .info").innerHTML = 'Error obteniendo la ubicación.'
    }
}
document.querySelector("#geofenced .action").addEventListener('click', checkGeofence)
</script>