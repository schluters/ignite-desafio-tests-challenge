import { GetBalanceError } from "./GetBalanceError";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";

let statementsRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;

let getBalanceUseCase: GetBalanceUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Get Balance", () => {
  beforeEach(() => {
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepositoryInMemory,
      usersRepositoryInMemory
    );
  });
  it("Should be able to get the balance", async () => {
    const user = {
      name: "John Doe",
      email: "johndoe@mail.com",
      password: "fake_pass",
    };
    const createdUser = await usersRepositoryInMemory.create(user);

    const statementDTO = {
      user_id: createdUser.id as string,
      type: OperationType.DEPOSIT,
      description: "teste de deposito",
      amount: 300,
    };
    const createdStatement = await statementsRepositoryInMemory.create(
      statementDTO
    );

    const response = await getBalanceUseCase.execute({
      user_id: createdUser.id as string,
    });

    expect(response.balance).toBe(300);
  });

  it("Shouldn't be able to get balance of a non-existent user", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: "fake_id" });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
