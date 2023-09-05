import fs from 'fs'
import { parse as csvParse } from 'csv-parse'
import { ICategoriesRepository } from '../../repositories/ICategoriesRepository'

interface IImportCategory {
  name: string
  description: string
}

export class ImportCategoryUseCase {
  constructor(private categoriesRepository: ICategoriesRepository) {}

  loadCategories(file: Express.Multer.File): Promise<IImportCategory[]> {
    return new Promise((resolve, reject) => {
      // Precisamos colocar tudo dentro de uma promisse, para retornar o array quando acabar de ler o arquivo.
      const stream = fs.createReadStream(file.path)

      const categories: IImportCategory[] = []

      const parseFile = csvParse() // Chamando a lib de parseCSVfile

      stream.pipe(parseFile) // A cada chunk lido o pipe irá envia-lo para a lib parseFile.

      parseFile
        .on('data', async (line) => {
          const [name, description] = line
          categories.push({ name, description })
        })
        .on('end', () => {
          fs.promises.unlink(file.path) // Removendo o arquivo que ficaria na pasta temporária
          resolve(categories)
        })
        .on('error', (err: any) => {
          reject(err)
        })
    })
  }

  async execute(file: Express.Multer.File): Promise<void> {
    const categories = await this.loadCategories(file)

    categories.map(async (category) => {
      const { name, description } = category

      const categoryAlreadyExists = this.categoriesRepository.findByName(name)

      if (categoryAlreadyExists) throw new Error('Category already exists!')

      this.categoriesRepository.create({
        name,
        description,
      })
    })
  }
}
