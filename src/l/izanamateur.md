---
title: Happy birthday!
description: 22 years, when entrepreneurshit really begins.
tags: 
coverImage: null
moto: Venga, no seas impaciente.
permalink: l/izanamateur/
---

## Dedicatoria begins: Fotos de la clase de Judo: 
<div class="widget" id="geofenced" data-target="36.71930125227884, -4.453076704007021">
    <h3 class="info action">Haz clic para comprobar si estás en Málaga y poder verla.</h3>
    <div class="fenced">

## Foto judo:
![rickrolled](http://25.media.tumblr.com/tumblr_li9nogR9Wv1qhjikro1_500.gif)

Ha ha troliado.

Vale ahora mira el [código](https://github.com/rgon/rgon.github.io/blob/master/src/l/izanamateur.md) y me dices por qué la fórmula que me he inventado para calcular si estás en málaga es una mierda lol. Entertainment 4 you.
A estudiar.
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

            let d = measureDistance([lat, long], document.querySelector("#geofenced").dataset.target.split(','))
            if (d <= 1.0) {
                document.querySelector("#geofenced .fenced").classList.remove('fenced')
            } else {
                document.querySelector("#geofenced .info").innerHTML = 'Todavía no estás en Málaga!'
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