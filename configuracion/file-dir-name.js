// Importación de File URL to Path
import { fileURLToPath } from 'url'
// Importación de dirname del Path
import { dirname } from 'path'

// Función para exportar la direccion del archivo
export default function fileDirName(meta) {
  const __filename = fileURLToPath(meta.url)

  const __dirname = dirname(__filename)

  return { __dirname, __filename }
}
