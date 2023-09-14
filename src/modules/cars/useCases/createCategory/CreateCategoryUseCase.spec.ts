import AppError from "@shared/errors/AppError";
import { InMemoryCategoriesRepository } from "@modules/cars/repositories/in-memory/InMemoryCategoriesRepository";
import { CreateCategoryUseCase } from "./CreateCategoryUseCase";

let categoriesRepositoryInMemory: InMemoryCategoriesRepository;
let createCategoryUseCase: CreateCategoryUseCase;

describe("Create Category Use Case", () => {
  beforeEach(() => {
    // Aqui vamos instanciar as nossas variáveis
    categoriesRepositoryInMemory = new InMemoryCategoriesRepository();
    createCategoryUseCase = new CreateCategoryUseCase(
      categoriesRepositoryInMemory,
    );
  });

  it("should be able to create a new category", async () => {
    const newCategory = await createCategoryUseCase.execute({
      name: "Category Test",
      description: "Category Description Test",
    });

    expect(newCategory).toHaveProperty("id");
    expect(newCategory.name).toEqual("Category Test");
    expect(newCategory.description).toEqual("Category Description Test");
  });

  it("should NOT be able to create a new category with name in duplicity", async () => {
    expect(async () => {
      await createCategoryUseCase.execute({
        name: "Category Test",
        description: "Category Description Test",
      });

      await createCategoryUseCase.execute({
        name: "Category Test",
        description: "Category Description Test",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
