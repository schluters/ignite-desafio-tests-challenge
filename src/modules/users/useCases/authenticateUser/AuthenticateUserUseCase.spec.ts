import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
  });

  it("Should be able to authenticate a user", async () => {
    const user: ICreateUserDTO = {
      name: "John Doe",
      email: "johndoe@mail.com",
      password: "fake_pass",
    };
    await createUserUseCase.execute(user);
    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    console.log(result);

    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "johndoe@mail.com",
        password: "fake_pass",
      });
    }).toHaveProperty("token");
  });

  it("Shouldn't be possible to authenticate a non-existent user", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "johndoe@mail.com",
        password: "fake_pass",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("Shouldn't be possible to authenticate a user with the wrong password", async () => {
    const user: ICreateUserDTO = {
      name: "John Doe",
      email: "johndoe@mail.com",
      password: "fake_pass",
    };
    await createUserUseCase.execute(user);

    expect(async () => {
      await authenticateUserUseCase.execute({
        email: user.email,
        password: "fail_pass",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
