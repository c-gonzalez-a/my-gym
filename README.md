# Mi gym

App personal para llevar rutinas de gimnasio, alimentación y medidas del cuerpo. Funciona como un chat con botones, se instala en el celu como una app (PWA) y **funciona sin internet**. Los datos se guardan solo en el dispositivo.

## Qué hace

**Gym**
- Detecta el día y te da la rutina que corresponde. Si hay dos rutinas para el mismo día, las alterna semana a semana.
- Elegís con botones por qué ejercicio arrancar y ves series, reps y peso.
- Registrás cambios (más peso, más reps) y dejás notas para la próxima vez. La nota se muestra una sola vez.
- Ejercicios opcionales y límite de ejercicios del mismo músculo. Si no hay máquina, ofrece alternativas del mismo músculo.
- Cada ejercicio tiene su propia info: si está en varias rutinas, el peso y las notas valen para todas.
- Stats mensuales: días entrenados, veces por ejercicio y evolución del peso.
- Se pueden crear ejercicios y rutinas nuevos, incluso en plena rutina.

**Alimentación**
- Registro diario de kcal comidas, proteínas, carbohidratos, grasas y kcal gastadas. El déficit se calcula solo.
- Seguimiento por día, semana y mes con gráficos y KPIs.
- Importación desde un chat de IA (ver más abajo).

**Control**
- Peso y medidas del cuerpo con gráfico de evolución.
- Recordatorio pendiente los días 1 y 15 de cada mes.

## Usarla en la compu

Abrí `index.html` con doble clic. No necesita instalar nada.

## Instalarla en el celu

1. Publicá el repositorio con GitHub Pages (Settings › Pages › branch `main`, carpeta `/ (root)`).
2. Abrí el link en el celu con internet, una vez.
3. Android (Chrome): menú ⋮ › *Instalar app*. iPhone (Safari): Compartir › *Agregar a inicio*.

Después se abre desde el ícono y funciona sin conexión. Al subir una versión nueva de `index.html`, se actualiza la segunda vez que abrís la app.

## Datos y backup

Todo se guarda en el `localStorage` del navegador, en el propio dispositivo, sin servidor. Para no perder datos al cambiar de celu o borrar el navegador, usá **Gym › Gestionar › Backup › Exportar** (y *Importar* para restaurar).

## Importar el día desde un chat de IA

En **Alimentación › Pegar de Gemini** se pega un bloque JSON con este formato (también acepta una lista de días):

```json
{"fecha":"AAAA-MM-DD","kcal":0,"prot":0,"carb":0,"grasa":0,"gasto":0}
```

`kcal` son las calorías comidas, `prot`, `carb` y `grasa` van en gramos, y `gasto` son las kcal totales gastadas en el día. El botón *Instrucción para Gemini* muestra el texto listo para pedirle el bloque a la IA.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La app completa (HTML, CSS y JS en un solo archivo) |
| `manifest.webmanifest` | Datos para instalarla como app |
| `sw.js` | Service worker: cache y uso sin internet |
| `icon-192.png`, `icon-512.png` | Ícono de la app |

## Tecnología

HTML, CSS y JavaScript sin dependencias ni paso de compilación.
