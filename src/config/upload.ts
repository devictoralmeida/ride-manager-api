import crypto from 'node:crypto'
import multer from 'multer'
import { resolve } from 'path'

export default {
  upload(folder: string) {
    return {
      storage: multer.diskStorage({
        destination: resolve(__dirname, '..', '..', folder), // Voltando 2 arquivos do atual diretório para acessar a raiz do documento.
        filename: (request, file, callback) => {
          const fileHash = crypto.randomBytes(16).toString('hex') // Vamos sobrescrever o filename por um hash para não termos arquivos com nomes duplicados
          const fileName = `${fileHash}-${file.originalname}`
          return callback(null, fileName) // O 1º parâmetro é o erro que ela deixou como null, e o seguindo é o fileName
        },
      }),
    }
  },
}
