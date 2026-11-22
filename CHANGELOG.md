# Mi Gym 2.6 — 22/11/2026

- **Nota para mi próxima vez:** durante la sesión podés crear o editar una nota específica para ese ejercicio. Aparece la próxima vez que ese ejercicio está incluido en una sesión y no se vuelve a mostrar en sesiones posteriores. Una copia se mantiene visible durante la sesión de entrega, incluso si se recarga la app. Las notas antiguas pendientes se conservan hasta su siguiente presentación.
- **Edición de ejercicios ya completados:** corregir series desde la rutina activa y deshacer un «Hecho» accidental, con actualización del registro de esa sesión sin duplicarlo.
- **Entrenamientos con récords:** el resumen final destaca cargas que superan los máximos históricos registrados; Gym permite ver carga máxima, mejor serie por repeticiones y volumen estimado.
- **Inicio más práctico:** accesos directos al gym, pesajes y comidas; información de proteínas y objetivo diario opcional editable en Ajustes.
- **Peso y medidas:** comparación de dos controles y tendencia de 3 pesajes (solo fechas efectivamente registradas).
- **Seguridad:** recordatorio local de respaldo cada 14 días (sin afirmar que el archivo se descargó correctamente); la importación por lotes de Gemini valida todos los valores antes de reemplazar los días involucrados.
- **Historial y etapas:** páginas de 20 días de entrenamiento para consultar todo el historial, calendario clicable para los días con gym y elección de fecha de inicio de una etapa. Impide fechas que ocultarían registros de la etapa anterior.
- **Compatibilidad:** se conserva la clave `migym-v2` y el esquema `version: 2`; se incorporan solo campos opcionales. Sin sincronización externa, sin borrado de localStorage, sin inicio de etapas automático. El Service Worker utiliza la caché `mi-gym-2-v2.6.0`.
- **Hábitos:** los ejemplos por defecto de instalaciones nuevas usan formulaciones positivas. Los checklist ya guardados se conservan sin modificar.

# Mi Gym 2.6 — 22/11/2026

- **Nota para mi próxima vez:** durante la sesión podés crear o editar una nota específica para ese ejercicio. Aparece la próxima vez que ese ejercicio está incluido en una sesión y no se vuelve a mostrar en sesiones posteriores. Una copia se mantiene visible durante la sesión de entrega, incluso si se recarga la app. Las notas antiguas pendientes se conservan hasta su siguiente presentación.
- **Edición de ejercicios ya completados:** corregir series desde la rutina activa y deshacer un «Hecho» accidental, con actualización del registro de esa sesión sin duplicarlo.
- **Entrenamientos con récords:** el resumen final destaca cargas que superan los máximos históricos registrados; Gym permite ver carga máxima, mejor serie por repeticiones y volumen estimado.
- **Inicio más práctico:** accesos directos al gym, pesajes y comidas; información de proteínas y objetivo diario opcional editable en Ajustes.
- **Peso y medidas:** comparación de dos controles y tendencia de 3 pesajes (solo fechas efectivamente registradas).
- **Seguridad:** recordatorio local de respaldo cada 14 días (sin afirmar que el archivo se descargó correctamente); la importación por lotes de Gemini valida todos los valores antes de reemplazar los días involucrados.
- **Historial y etapas:** páginas de 20 días de entrenamiento para consultar todo el historial, calendario clicable para los días con gym y elección de fecha de inicio de una etapa. Impide fechas que ocultarían registros de la etapa anterior.
- **Compatibilidad:** se conserva la clave `migym-v2` y el esquema `version: 2`; se incorporan solo campos opcionales. Sin sincronización externa, sin borrado de localStorage, sin inicio de etapas automático. El Service Worker utiliza la caché `mi-gym-2-v2.6.0`.
- **Hábitos:** los ejemplos por defecto de instalaciones nuevas usan formulaciones positivas. Los checklist ya guardados se conservan sin modificar.

# Mi Gym 2.6 — 22/11/2026

- **Nota para mi próxima vez:** durante la sesión podés crear o editar una nota específica para ese ejercicio. Aparece la próxima vez que ese ejercicio está incluido en una sesión y no se vuelve a mostrar en sesiones posteriores. Una copia se mantiene visible durante la sesión de entrega, incluso si se recarga la app. Las notas antiguas pendientes se conservan hasta su siguiente presentación.
- **Edición de ejercicios ya completados:** corregir series desde la rutina activa y deshacer un «Hecho» accidental, con actualización del registro de esa sesión sin duplicarlo.
- **Entrenamientos con récords:** el resumen final destaca cargas que superan los máximos históricos registrados; Gym permite ver carga máxima, mejor serie por repeticiones y volumen estimado.
- **Inicio más práctico:** accesos directos al gym, pesajes y comidas; información de proteínas y objetivo diario opcional editable en Ajustes.
- **Peso y medidas:** comparación de dos controles y tendencia de 3 pesajes (solo fechas efectivamente registradas).
- **Seguridad:** recordatorio local de respaldo cada 14 días (sin afirmar que el archivo se descargó correctamente); la importación por lotes de Gemini valida todos los valores antes de reemplazar los días involucrados.
- **Historial y etapas:** páginas de 20 días de entrenamiento para consultar todo el historial, calendario clicable para los días con gym y elección de fecha de inicio de una etapa. Impide fechas que ocultarían registros de la etapa anterior.
- **Compatibilidad:** se conserva la clave `migym-v2` y el esquema `version: 2`; se incorporan solo campos opcionales. Sin sincronización externa, sin borrado de localStorage, sin inicio de etapas automático. El Service Worker utiliza la caché `mi-gym-2-v2.6.0`.
- **Hábitos:** los ejemplos por defecto de instalaciones nuevas usan formulaciones positivas. Los checklist ya guardados se conservan sin modificar.

# Mi Gym 2.5

- Corregido el cierre involuntario del resumen al confirmar la finalización con ejercicios pendientes.
- Portapapeles robusto y opciones Copiar resumen / Copiar prompt en sesión finalizada y en Ver historial.
- Persistencia no destructiva de metadatos de sesión (fecha, rutina, duración, inicio y fin) y asociación de series registradas.
- Compatibilidad con backups anteriores sin inventar duraciones históricas.
- Sesiones iniciadas el día anterior recuperables en Gym.
- Evita sobrescribir registros locales cuando falla su lectura; permite restaurarlos mediante backup.
- Prompt de IA con valores desconocidos `null` y distinción entre gasto de gym y total diario.
- UI responsive del resumen histórico, documentación y caché PWA a 2.5.0.
- El Service Worker sólo limpia cachés anteriores de Mi Gym; no elimina cachés de otras aplicaciones del mismo origen.
- El filtro «Todo» abarca ahora la etapa completa, sin recortar el historial a 730 días.

# Mi Gym 2.4

- Se agrega nota orientativa del IMC de referencia entre 18,5 y 24,9 para adultos.
- Incluye y consolida los cambios 2.2 y 2.3.

# Mi Gym 2.3

- Indicador visual de IMC con barra de colores y aguja
- Categoría textual del IMC: bajo peso, normal, sobrepeso u obesidad

# Mi Gym 2.2

- Vista de rutina rediseñada para celular
- Botones de acción reordenados en cada ejercicio
- Series mostradas en tarjetas de kg / reps, sin numeración de serie visible
- Timer en la rutina activa
- Resumen final del entrenamiento con copia rápida para IA

# Cambios de Mi Gym

## 2.1.0 — Perfil corporal y navegación
- Perfil corporal opcional: estatura, fecha de nacimiento y parámetro de fórmula Mifflin–St Jeor.
- Nuevos indicadores de IMC y TMB (gasto basal estimado) en Progreso, con “Pendiente de carga” y explicación de datos faltantes.
- Se usa el último peso registrado en la etapa actual o su peso inicial.
- Aviso discreto: puntito rosa superpuesto al ícono de Progreso, sin alterar la distribución de la barra.
- Compatibilidad de datos y backups con 2.0 sin perder historial.
- Caché offline actualizada a 2.1.0.

# Cambios — Mi Gym 2.0

## 2.0.0

- Renovación visual completa, con temas automático, oscuro y claro.
- Navegación con pestañas para Inicio, Gym, Comidas, Progreso y Ajustes.
- Migración automática no destructiva desde el almacenamiento local anterior (`gymapp1`) a `migym-v2`.
- Inicio de nuevas etapas, archivo de etapas anteriores y consulta de historial.
- Edición y eliminación puntual de registros de comida, peso y ejercicios históricos.
- Gráficos de calendario real para déficit, comidas/gasto, macros, cargas y peso.
- Indicador de cobertura y separación explícita de días sin registros.
- Cálculo de déficit sólo con ingesta y gasto total disponibles.
- Umbrales energéticos orientativos de 7.700 kcal y pesajes de seguimiento, además de controles quincenales.
- Importación compatible con JSON de Gemini y backups de la versión anterior.
- PWA offline actualizada con estrategia network-first y limpieza de cachés anteriores.
- Código separado en HTML, CSS y JavaScript sin dependencias externas.
