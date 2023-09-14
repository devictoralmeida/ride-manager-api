import fs from 'fs'

export const deleteFile = async (filename: string) => {
  try {
    await fs.promises.stat(filename) // O método stat verifica se existe algum arquivo no diretório que ele receberá
  } catch {
    return
  }

  await fs.promises.unlink(filename) // O método unlink remove o arquivo que está nesse diretório
}
