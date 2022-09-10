import { CreateUserError } from "./CreateUserError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
describe("Create User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("Should be able to create a user", async () => {
    const user = {
      name: "John Doe",
      email: "johndoe@mail.com",
      password: "fake_pass",
    };
    const createdUser = await createUserUseCase.execute(user);

    expect(createdUser).toHaveProperty("id");
  });

  it("Shouldn't be able to create a usar with the same email", async () => {
    expect(async () => {
      const user = {
        name: "John Doe",
        email: "johndoe@mail.com",
        password: "fake_pass",
      };
      await createUserUseCase.execute(user);
      await createUserUseCase.execute(user);
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
