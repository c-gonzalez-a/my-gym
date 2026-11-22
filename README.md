# 💗 Mi Gym 2.6

Aplicación personal **instalable como PWA** para registrar entrenamientos, alimentación, hábitos, peso y medidas. Diseño responsive, con temas claro, oscuro y automático. **Sin cuentas, sin servidor, sin dependencia de servicios externos para funcionar y usable offline** después de la primera visita por HTTPS.

## 🚨 Antes de actualizar desde la versión 1

**Hacé una copia de seguridad en la aplicación vieja antes de reemplazar los archivos del repositorio.**

1. Abrí tu versión actual, en **Gym → Gestionar → Backup → Exportar**.
2. Guardá el archivo `.json` en un lugar seguro, fuera del navegador.
3. Actualizá tu repositorio de GitHub como se explica más abajo.
4. Abrí la app nueva desde **el mismo enlace de GitHub Pages y el mismo navegador/dispositivo**. Mi Gym 2.6 intentará migrar automáticamente los datos guardados bajo la clave antigua `gymapp1`.
5. Verificá tus rutinas, alimentación, pesajes y entrenamientos. Si no aparecen porque cambiaste de navegador, URL o dispositivo, abrí **Ajustes → Importar backup JSON** y seleccioná el respaldo que descargaste.
6. **No inicies una etapa nueva por el solo hecho de actualizar.** Mantené la etapa actual. Si algún día querés archivarla, usá **Ajustes → Nueva etapa**, que conserva el historial anterior.

> La actualización **no borra la clave original** `gymapp1`. La versión nueva guarda sus datos en una clave separada, `migym-v2`. Esto no reemplaza la recomendación de exportar un backup real.

## Actualizar GitHub Pages

1. Descomprimí `Mi-Gym-2.6-completo.zip`.
2. Subí **los archivos que están dentro** del ZIP a la **raíz** del mismo repositorio que ya publica tu app. Reemplazá `index.html`, `manifest.webmanifest`, `sw.js` y los íconos. Agregá los nuevos `app.js`, `styles.css`, `README.md` y `CHANGELOG.md`.
3. Confirmá el commit en la rama publicada (por ejemplo `main`). Si no tenés Pages configurado: **Settings → Pages → Deploy from a branch → `main` → `/ (root)`**.
4. Abrí tu URL de GitHub Pages. Esperá la publicación y recargá la página. Si ves la versión vieja, cerrá y abrí nuevamente la app; el Service Worker antiguo guardaba una versión en caché.
5. **No borres los datos del sitio** como método de actualización: eso sí podría eliminar tus registros locales.

Si no querés publicar todavía, `index.html` puede abrirse en una computadora junto a `app.js` y `styles.css`; sin embargo, algunos navegadores restringen el almacenamiento local en archivos `file://`, y el modo offline instalable necesita HTTPS. La prueba recomendada es desde GitHub Pages.

## ¿Qué incluye Mi Gym 2.6?

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
- Vista de 7, 30, 90 días o todo el historial de la etapa, sin límite artificial de dos años.
- Un día **sin gasto registrado** queda **incompleto**; no se interpreta como `0 kcal` de gasto.
- Las estimaciones de gasto que recibís de Gemini no son mediciones objetivas ni deben considerarse precisas.

### Peso y progreso

- Gráficos de peso y medidas con fechas proporcionales al calendario.
- Dos recordatorios: un control periódico los días **1 y 15**, y otro al alcanzar cada múltiplo de **7.700 kcal de déficit neto registrado**.
- Comparación entre equivalente teórico de grasa y cambio de peso observado, si tenés un peso inicial registrado.
- El peso en la balanza puede variar por agua, ciclo, glucógeno, contenido intestinal y errores en estimaciones; el cálculo **no predice exactamente** la pérdida de peso.

### Etapas y privacidad

- **Nueva etapa**: archiva la actual, permite elegir una fecha de inicio que no oculte registros, ingresar un peso inicial y conserva las rutinas.
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

Se comprobó en Chromium headless con ancho de celular (390 px): notas de siguiente sesión y su persistencia, edición y deshacer series completadas, historial, comparación de medidas, importación JSON por lotes sin guardado parcial, compatibilidad con datos v2 anteriores y almacenamiento inválido sin sobrescritura. También se verificaron ausencia de errores JS y desplazamiento horizontal. Falta probar la actualización del Service Worker y el comportamiento en un Android real. En versiones anteriores se había comprobado en navegador headless con anchos de celular y escritorio: navegación, cambio de temas, carga de alimentación, días incompletos, importación de JSON de Gemini, registro de medidas, inicio y registro de ejercicios, creación de nueva etapa y consulta del historial archivado. También se comprobó que no haya errores JavaScript y que no aparezca desplazamiento horizontal en esos tamaños. **Conviene hacer una prueba en tu propio teléfono antes de dar por terminada la migración.**

## Nuevo en 2.1 — IMC, TMB y avisos discretos

- En **Ajustes → Mi perfil corporal → Editar perfil** podés cargar tu **estatura en cm**, **fecha de nacimiento** y el **parámetro de la fórmula de metabolismo en reposo** (referencia femenina o masculina). Todos los campos son opcionales, quedan exclusivamente en este dispositivo y se incluyen en el backup JSON.
- El **peso** se registra en **Progreso → Cargar peso / medidas**. Se usa el último pesaje de la etapa; si todavía no hay uno, se utiliza el peso inicial de la etapa si existe. No se arrastran pesajes de otras etapas.
- En **Progreso → Indicadores corporales** se muestra el **IMC = peso (kg) / altura (m)²**. No necesita género ni edad. Se muestra **Pendiente de carga** si falta peso o altura. Es un indicador de referencia, no una medición directa de grasa corporal.
- La **TMB** se presenta como una estimación del gasto en reposo utilizando la ecuación **Mifflin–St Jeor** para adultos desde los 20 años (10 × peso kg + 6,25 × altura cm − 5 × edad + 5 para la referencia masculina; −161 para la femenina). No es lo mismo que el gasto diario total y no sustituye el gasto estimado en Gemini. Si faltan datos aparece **Pendiente de carga**, indicando exactamente qué cargar. La ecuación predice gasto metabólico en reposo y se usa como aproximación práctica de TMB.
- El aviso de **Progreso** de la barra de navegación es ahora un **puntito rosa superpuesto en la esquina del ícono**, sin ocupar lugar ni mover otros elementos. Desaparece cuando no hay controles de peso pendientes, según las reglas de recordatorios existentes.
- **Compatibilidad:** la misma clave `migym-v2` y el mismo esquema de backup; las instalaciones 2.0 se completan con un perfil vacío sin alterar su historial. Actualizar `sw.js` obliga a usar la nueva caché 2.1.

Referencias generales de los cálculos: [CDC — Body Mass Index](https://www.cdc.gov/bmi/about/) y [NIH / Endotext — Mifflin–St Jeor](https://www.ncbi.nlm.nih.gov/books/NBK278991/).

### Novedades 2.2–2.4

- Tarjetas de rutina adaptadas al celular con acciones apiladas y series en dos columnas (carga y repeticiones).
- Temporizador visible durante el entrenamiento, con resumen y prompt para IA al finalizar.
- IMC con escala visual, aguja, categorías y aclaración del rango de referencia 18,5–24,9.
- Aviso pendiente de Progreso superpuesto sobre el ícono de navegación.

### Novedades de la versión 2.5

- Corrección del resumen final: cuando una sesión termina con ejercicios pendientes, el diálogo de confirmación ya no cierra el resumen inmediatamente.
- Acciones de **Copiar resumen** y **Copiar prompt IA** al finalizar, y también al abrir **Gym → Días de entrenamiento → Ver**. Se mantiene la opción de seleccionar manualmente el texto si el navegador bloquea el portapapeles.
- Las sesiones nuevas conservan rutina, fecha, duración, inicio y finalización, además de vincular los ejercicios efectivamente registrados. Los respaldos existentes de la versión 2 siguen siendo compatibles.
- El historial anterior sigue disponible; como las versiones previas no guardaban la duración de cada sesión finalizada, allí aparece **No registrada**, nunca una duración inventada.
- Una sesión iniciada antes de medianoche puede finalizarse sin que desaparezca de Gym al cambiar el día.
- El JSON sugerido para IA distingue calorías del gimnasio de **gasto energético total diario**; los campos desconocidos son `null`.

**Importante:** guardá un backup antes de actualizar. No borres los datos de la aplicación ni inicies una etapa nueva para instalar esta versión. El almacenamiento conserva la clave `migym-v2` y las etapas existentes.

**Protección de datos:** si el almacenamiento contiene datos inválidos, Mi Gym muestra una advertencia y no los reemplaza por registros vacíos. Se puede recuperar desde un respaldo JSON válido.

### Novedades de la versión 2.6

- **Notas para la Cami del futuro:** durante una rutina, tocá **Nota para mi próxima vez** en la tarjeta del ejercicio. Escribí el mensaje y guardalo. Aparece destacado cuando ese ejercicio vuelve a incluirse en una sesión posterior. Al entrar en esa sesión el mensaje deja de estar pendiente y queda visible solo durante esa sesión, incluso tras recargar. Podés dejar otra nota o ninguna. Las notas que ya existían antes de 2.6 se entregan una vez; no se borran en la instalación. Si arrancás una rutina y quitás un ejercicio, su nota se habrá considerado mostrada al aparecer la tarjeta.
- **Corregir series y deshacer:** podés editar un ejercicio después de marcar «Hecho», o deshacerlo. Las correcciones no crean registros duplicados.
- **Fuerza y récords:** Gym muestra máximo registrado, comparaciones con el registro anterior y gráficos por carga/repeticiones/volumen. El resumen final indica los récords de carga si existen registros previos comparables.
- **Inicio:** accesos rápidos, proteína consumida y meta opcional editable en Ajustes → Objetivos personales.
- **Progreso:** comparación de medidas de dos fechas reales y media de los tres últimos pesajes, sin inventar días ni rellenar huecos.
- **Respaldo:** aviso cada 14 días sin solicitar un backup. La fecha se refiere al intento de descarga, por lo que debés comprobar que el archivo existe realmente.
- **Historial:** paginación de todos los días con entrenamientos y acceso desde los días marcados en el calendario.
- **Etapas:** elegí una fecha de inicio que no coincida ni sea anterior a registros existentes en la etapa que se archiva. No se permite empezar otra etapa con un entrenamiento en curso.
- **Gemini:** valida todos los días y macros de un lote antes de modificar los registros. El error de un día no deja la importación a medias.

**Protección de registros existentes:** actualizar los archivos del mismo repositorio no ejecuta ninguna acción de borrado de localStorage ni reinicia etapas. Sin embargo, la conservación real depende de abrir la misma URL y del mismo perfil de navegador/PWA; descargá un backup JSON **antes** de publicar, verificá que existe y no borres los datos del sitio.

### Novedades de la versión 2.6

- **Notas para la Cami del futuro:** durante una rutina, tocá **Nota para mi próxima vez** en la tarjeta del ejercicio. Escribí el mensaje y guardalo. Aparece destacado cuando ese ejercicio vuelve a incluirse en una sesión posterior. Al entrar en esa sesión el mensaje deja de estar pendiente y queda visible solo durante esa sesión, incluso tras recargar. Podés dejar otra nota o ninguna. Las notas que ya existían antes de 2.6 se entregan una vez; no se borran en la instalación. Si arrancás una rutina y quitás un ejercicio, su nota se habrá considerado mostrada al aparecer la tarjeta.
- **Corregir series y deshacer:** podés editar un ejercicio después de marcar «Hecho», o deshacerlo. Las correcciones no crean registros duplicados.
- **Fuerza y récords:** Gym muestra máximo registrado, comparaciones con el registro anterior y gráficos por carga/repeticiones/volumen. El resumen final indica los récords de carga si existen registros previos comparables.
- **Inicio:** accesos rápidos, proteína consumida y meta opcional editable en Ajustes → Objetivos personales.
- **Progreso:** comparación de medidas de dos fechas reales y media de los tres últimos pesajes, sin inventar días ni rellenar huecos.
- **Respaldo:** aviso cada 14 días sin solicitar un backup. La fecha se refiere al intento de descarga, por lo que debés comprobar que el archivo existe realmente.
- **Historial:** paginación de todos los días con entrenamientos y acceso desde los días marcados en el calendario.
- **Etapas:** elegí una fecha de inicio que no coincida ni sea anterior a registros existentes en la etapa que se archiva. No se permite empezar otra etapa con un entrenamiento en curso.
- **Gemini:** valida todos los días y macros de un lote antes de modificar los registros. El error de un día no deja la importación a medias.

**Protección de registros existentes:** actualizar los archivos del mismo repositorio no ejecuta ninguna acción de borrado de localStorage ni reinicia etapas. Sin embargo, la conservación real depende de abrir la misma URL y del mismo perfil de navegador/PWA; descargá un backup JSON **antes** de publicar, verificá que existe y no borres los datos del sitio.

### Novedades de la versión 2.6

- **Notas para la Cami del futuro:** durante una rutina, tocá **Nota para mi próxima vez** en la tarjeta del ejercicio. Escribí el mensaje y guardalo. Aparece destacado cuando ese ejercicio vuelve a incluirse en una sesión posterior. Al entrar en esa sesión el mensaje deja de estar pendiente y queda visible solo durante esa sesión, incluso tras recargar. Podés dejar otra nota o ninguna. Las notas que ya existían antes de 2.6 se entregan una vez; no se borran en la instalación. Si arrancás una rutina y quitás un ejercicio, su nota se habrá considerado mostrada al aparecer la tarjeta.
- **Corregir series y deshacer:** podés editar un ejercicio después de marcar «Hecho», o deshacerlo. Las correcciones no crean registros duplicados.
- **Fuerza y récords:** Gym muestra máximo registrado, comparaciones con el registro anterior y gráficos por carga/repeticiones/volumen. El resumen final indica los récords de carga si existen registros previos comparables.
- **Inicio:** accesos rápidos, proteína consumida y meta opcional editable en Ajustes → Objetivos personales.
- **Progreso:** comparación de medidas de dos fechas reales y media de los tres últimos pesajes, sin inventar días ni rellenar huecos.
- **Respaldo:** aviso cada 14 días sin solicitar un backup. La fecha se refiere al intento de descarga, por lo que debés comprobar que el archivo existe realmente.
- **Historial:** paginación de todos los días con entrenamientos y acceso desde los días marcados en el calendario.
- **Etapas:** elegí una fecha de inicio que no coincida ni sea anterior a registros existentes en la etapa que se archiva. No se permite empezar otra etapa con un entrenamiento en curso.
- **Gemini:** valida todos los días y macros de un lote antes de modificar los registros. El error de un día no deja la importación a medias.

**Protección de registros existentes:** actualizar los archivos del mismo repositorio no ejecuta ninguna acción de borrado de localStorage ni reinicia etapas. Sin embargo, la conservación real depende de abrir la misma URL y del mismo perfil de navegador/PWA; descargá un backup JSON **antes** de publicar, verificá que existe y no borres los datos del sitio.
