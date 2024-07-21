# Estándares de Nomenclatura para Ramas y Commits

Este documento define los estándares que se deben seguir para nombrar las ramas y los mensajes de commits en este proyecto. El objetivo es mantener un historial claro y coherente que facilite la colaboración y el seguimiento del desarrollo.

## Estructura de las Ramas

Todas las ramas deben seguir la siguiente estructura:

```
[Iniciales]/[Tipo de rama]-[Descripción breve]
```

### Iniciales

Las iniciales deben ser las dos primeras letras de tu nombre y apellido en mayúsculas. Por ejemplo, para Gary Campusano, las iniciales serían `GC`.

### Tipos de Ramas

- `feature`: Para el desarrollo de nuevas funcionalidades.
- `fix`: Para la corrección de errores o bugs.
- `hotfix`: Para correcciones urgentes en la rama principal (e.g., `main` o `master`).
- `release`: Para preparar una nueva versión.
- `docs`: Para cambios en la documentación.

### Ejemplos de Nombres de Ramas

- **Nueva funcionalidad**: `GC/feature-login-system`
- **Corrección de error**: `GC/fix-login-bug`
- **Hotfix**: `GC/hotfix-crash-on-login`
- **Preparación de release**: `GC/release-1.0.0`
- **Documentación**: `GC/docs-update-readme`

## Estructura de los Mensajes de Commits

Los mensajes de commits deben seguir la siguiente estructura:

```
[Iniciales] - [Tipo de cambio] - [Descripción breve]
```

### Iniciales

Al igual que con las ramas, utiliza las dos primeras letras de tu nombre y apellido en mayúsculas.

### Tipo de Cambio

- `Feature`: Para agregar nuevas funcionalidades.
- `Fix`: Para corrección de errores.
- `Hotfix`: Para correcciones urgentes.
- `Docs`: Para cambios en la documentación.
- `Refactor`: Para refactorización del código sin cambiar la funcionalidad.
- `Test`: Para agregar o modificar tests.
- `Style`: Para cambios que no afectan el código (e.g., formateo, estilos de código).

### Ejemplos de Mensajes de Commits

- **Nueva funcionalidad**: `GC - Feature - Added login system`
- **Corrección de error**: `GC - Fix - Corrected login bug`
- **Hotfix**: `GC - Hotfix - Fixed crash on login`
- **Documentación**: `GC - Docs - Updated README`
- **Refactorización**: `GC - Refactor - Improved login logic`
- **Tests**: `GC - Test - Added tests for login`
- **Estilo**: `GC - Style - Formatted login code`

## Buenas Prácticas

1. **Commits frecuentes**: Realiza commits con frecuencia para evitar grandes cambios de una sola vez.
2. **Commits claros y concisos**: Los mensajes deben ser claros y describir el cambio realizado de manera concisa.
3. **Ramas descriptivas**: Los nombres de las ramas deben describir claramente el propósito de la rama.
4. **Sin códigos ambiguos**: Evita el uso de códigos ambiguos o acrónimos no estándar en los nombres de ramas y mensajes de commits.
5. **Uso de camelCase**: En todo el programa utilizamos camelCase para nombrar variables, funciones, y otros identificadores. Ejemplo: `homeControllers`, `userLogin`, `fetchData`.

Siguiendo estos estándares, aseguramos que el proyecto sea mantenible y comprensible para todos.
