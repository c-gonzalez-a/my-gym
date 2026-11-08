# 💗 Mi Gym 2.0

Aplicación personal **instalable como PWA** para registrar entrenamientos, alimentación, hábitos, peso y medidas. Diseño responsive, con temas claro, oscuro y automático. **Sin cuentas, sin servidor, sin dependencia de servicios externos para funcionar y usable offline** después de la primera visita por HTTPS.

## 🚨 Antes de actualizar desde la versión 1

**Hacé una copia de seguridad en la aplicación vieja antes de reemplazar los archivos del repositorio.**

1. Abrí tu versión actual, en **Gym → Gestionar → Backup → Exportar**.
2. Guardá el archivo `.json` en un lugar seguro, fuera del navegador.
3. Actualizá tu repositorio de GitHub como se explica más abajo.
4. Abrí la app nueva desde **el mismo enlace de GitHub Pages y el mismo navegador/dispositivo**. Mi Gym 2.0 intentará migrar automáticamente los datos guardados bajo la clave antigua `gymapp1`.
5. Verificá tus rutinas, alimentación, pesajes y entrenamientos. Si no aparecen porque cambiaste de navegador, URL o dispositivo, abrí **Ajustes → Importar backup JSON** y seleccioná el respaldo que descargaste.
6. Cuando estés conforme, elegí **Ajustes → Nueva etapa**. La anterior quedará archivada y la nueva empezará con su propio historial. El botón no elimina información previa.

> La actualización **no borra la clave original** `gymapp1`. La versión nueva guarda sus datos en una clave separada, `migym-v2`. Esto no reemplaza la recomendación de exportar un backup real.

## Actualizar GitHub Pages

1. Descomprimí `Mi-Gym-2.0.zip`.
2. Subí **los archivos que están dentro** del ZIP a la **raíz** del mismo repositorio que ya publica tu app. Reemplazá `index.html`, `manifest.webmanifest`, `sw.js` y los íconos. Agregá los nuevos `app.js`, `styles.css`, `README.md` y `CHANGELOG.md`.
3. Confirmá el commit en la rama publicada (por ejemplo `main`). Si no tenés Pages configurado: **Settings → Pages → Deploy from a branch → `main` → `/ (root)`**.
4. Abrí tu URL de GitHub Pages. Esperá la publicación y recargá la página. Si ves la versión vieja, cerrá y abrí nuevamente la app; el Service Worker antiguo guardaba una versión en caché.
5. **No borres los datos del sitio** como método de actualización: eso sí podría eliminar tus registros locales.

Si no querés publicar todavía, `index.html` puede abrirse en una computadora junto a `app.js` y `styles.css`; sin embargo, algunos navegadores restringen el almacenamiento local en archivos `file://`, y el modo offline instalable necesita HTTPS. La prueba recomendada es desde GitHub Pages.

## ¿Qué incluye la versión 2.0?

### Inicio

- Dashboard con balance energético de la etapa, días con gym, último peso y progreso hacia el siguiente control.
- Actividades previstas para hoy, checklist y calendario de **días efectivamente anotados**.
- Los días sin carga son simplemente **sin registro**; no cuentan automáticamente como incumplimientos.

### Gym

- Rutinas existentes y ejercicios migrados sin perder sus configuraciones.
- Inicio, seguimiento y finalización de sesiones; guardado de ejercicios ya realizados, incluso cuando se cierra la app.
- Edición de series, ejercicios, grupos musculares y rutinas, más alternativas adicionales durante la sesión.
- Evolución de cargas por ejercicio y fechas reales; se distinguen intervalos largos sin medición.
- Historial por día, con edición o borrado de un ejercicio histórico registrado por error.

### Alimentación

- Carga y corrección de días, macros y gasto energético estimado.
- Importación desde Gemini mediante bloques JSON (un día o una lista de días).
- Gráficos de balance, comidas vs. gasto y macronutrientes, con escalas basadas en **fechas reales**.
- Vista de 7, 30, 90 días o hasta 730 días de historial.
- Un día **sin gasto registrado** queda **incompleto**; no se interpreta como `0 kcal` de gasto.
- Las estimaciones de gasto que recibís de Gemini no son mediciones objetivas ni deben considerarse precisas.

### Peso y progreso

- Gráficos de peso y medidas con fechas proporcionales al calendario.
- Dos recordatorios: un control periódico los días **1 y 15**, y otro al alcanzar cada múltiplo de **7.700 kcal de déficit neto registrado**.
- Comparación entre equivalente teórico de grasa y cambio de peso observado, si tenés un peso inicial registrado.
- El peso en la balanza puede variar por agua, ciclo, glucógeno, contenido intestinal y errores en estimaciones; el cálculo **no predice exactamente** la pérdida de peso.

### Etapas y privacidad

- **Nueva etapa**: archiva la actual, crea una nueva desde hoy, te deja ingresar un peso inicial y conserva las rutinas.
- Los objetivos/calorías diarios antiguos se desactivan al iniciar una etapa nueva para que puedas revisarlos antes de volver a usarlos.
- Se puede consultar una etapa archivada desde Ajustes, en modo lectura.
- Los datos se guardan **solamente en el navegador actual** (`localStorage`). No existe sincronización entre dispositivos.
- Exportación e importación JSON, compatible con respaldo v1 y v2. **Importar reemplaza los datos actuales** después de mostrar confirmación.

## Gemini: formato de importación

Abrí **Comidas → Pegar de Gemini → Copiar instrucción para Gemini**. Pegá la instrucción en Gemini, que devuelve un objeto por día:

```json
{
  "fecha": "2026-11-07",
  "kcal": 1850,
  "prot": 115,
  "carb": 178,
  "grasa": 58,
  "gasto": 2350
}
```

Se puede pegar una lista (`[ {...}, {...} ]`) con varios días. `kcal` corresponde a lo **comido**. `gasto` debe corresponder al **gasto diario total estimado**, no solamente al gasto del gym. Si Gemini no tiene suficiente información, debería responder `null` para los valores desconocidos; esos días no contribuirán al cálculo del déficit hasta completarlos. El usuario decide qué pegar y **la app no se conecta automáticamente a Gemini**.

## Archivos

| Archivo | Uso |
|---|---|
| `index.html` | Estructura de la app |
| `styles.css` | Diseño responsive, claro y oscuro |
| `app.js` | Estado, migración, rutinas, registros, gráficos, etapas |
| `manifest.webmanifest` | Instalación de la PWA |
| `sw.js` | Caché para uso offline y actualizaciones |
| `icon-192.png`, `icon-512.png` | Íconos existentes, conservados |
| `.gitattributes` | Normalización de finales de línea |

## Alcance y limitaciones

- Sin dependencias npm ni build: los archivos se publican tal cual en GitHub Pages.
- No integra servicios médicos, balanzas, relojes ni Gemini mediante API.
- Las fechas y cálculos usan la zona horaria local del dispositivo.
- El almacenamiento local puede borrarse si se borran los datos del navegador; exportá backups regularmente.
- Una corrección retrospectiva del balance puede modificar o retirar hitos **pendientes**. Los controles ya confirmados mediante un pesaje permanecen en el historial.
- No se recomienda basar decisiones de nutrición o salud exclusivamente en cálculos de una app o estimaciones de IA.

## Pruebas realizadas

Se comprobó en navegador headless con anchos de celular y escritorio: navegación, cambio de temas, carga de alimentación, días incompletos, importación de JSON de Gemini, registro de medidas, inicio y registro de ejercicios, creación de nueva etapa y consulta del historial archivado. También se comprobó que no haya errores JavaScript y que no aparezca desplazamiento horizontal en esos tamaños. **Conviene hacer una prueba en tu propio teléfono antes de dar por terminada la migración.**
