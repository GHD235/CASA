# Apps casa (repo CASA)

Versión web (GitHub Pages: https://ghd235.github.io/CASA/) de las apps de casa: inicio, Menú semanal, Lista de ocio, Tareas de casa y Segundo cerebro. Los datos viven en una hoja de Google con un proyecto de Apps Script (`Code.gs`, que **no** está en este repo: se pega en el editor de Apps Script y se publica como «Nueva versión» de la implementación «Ejecutar como: Yo · Cualquier usuario»).

- `index.html` es el contenedor: guarda la clave de cada persona, habla con Apps Script (`doPost`) y carga cada app en su marco.
- `config.js` tiene la URL `/exec` de Apps Script. **Nunca se sobrescribe** en las actualizaciones.
- `sw.js` guarda las pantallas en el móvil y recibe las notificaciones; su versión cambia en cada entrega.

## Skills

- **google-apps-script** (`.claude/skills/google-apps-script/`): guía para escribir y depurar Apps Script (servicios, triggers, cuotas, V8, `UrlFetchApp`, errores típicos). Úsala al tocar `Code.gs`. Copiada sin cambios de [jezweb/claude-skills](https://github.com/jezweb/claude-skills/tree/main/plugins/integrations/skills/google-apps-script) (commit `1260fa7`, licencia MIT en la misma carpeta).
  - Ojo, en este proyecto: las pantallas no usan diálogos ni barras laterales de la hoja; todo pasa por `api(b)` (Apps Script) o `doPost` (GitHub). Las funciones con `_` final son privadas a propósito: no se llaman desde las páginas.
