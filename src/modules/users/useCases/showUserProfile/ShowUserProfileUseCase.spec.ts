import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

import { ShowUserProfileError } from "./ShowUserProfileError";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    showUserProfileUseCase = new ShowUserProfileUseCase(
      usersRepositoryInMemory
    );
  });

  it("Should be possible to show a user's profile", async () => {
    const user = {
      name: "John Doe",
      email: "johndoe@mail.com",
      password: "fake_pass",
    };
    const createdUser = await createUserUseCase.execute(user);

    const findUser = await showUserProfileUseCase.execute(
      createdUser.id as string
    );
    expect(findUser.email).toEqual("johndoe@mail.com");
  });

  it("Shouldn't be able to show the profile of a non-existent user", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("fake_id");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
