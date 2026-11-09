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
