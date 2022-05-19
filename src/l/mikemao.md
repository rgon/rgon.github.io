---
title: Happy birthday (with a 4000 euro delay)!
description: Me cago en la puta qué caro es el vivir.
tags: last step
coverImage: null
moto: Calla impaciente.
permalink: l/mikemao/
---

## Tanta espera?
Puto vago, hay pasos que tienes que cumplir.

## El gran wait:
<div class="widget" id="geofenced" data-target="39.051511478500004, 1.5292909591928503">
    <h3 class="info action">Haz clic para comprobar si estás en ibiza y poder ver los siguientes pasos.</h3>
    <div class="fenced">

## Pasos:
- [x] Abrir el link
- [] Imprimir el siguiente pdf: [pasos.pdf](example.com)
- [] Ir a Audiología Marbella el día xx/xx [añadir al calendario](cal)
- [] Ir inmediatamente después a Correos con dicho PDF e impresiones de oído.
- [] Esperar 2 semanas
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