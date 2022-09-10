import { GetStatementOperationError } from "./GetStatementOperationError";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";

let statementsRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;

let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Get Statement Operation", () => {
  beforeEach(() => {
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    );
  });
  it("Should be able to get a statement operation", async () => {
    const user = {
      name: "John Doe",
      email: "johndoe@mail.com",
      password: "fake_pass",
    };
    const createdUser = await usersRepositoryInMemory.create(user);

    const statement = {
      user_id: createdUser.id as string,
      type: OperationType.DEPOSIT,
      description: "teste de deposito",
      amount: 300,
    };
    const createdStatement = await statementsRepositoryInMemory.create(statement);

    const response = await getStatementOperationUseCase.execute({
      user_id: createdUser.id as string,
      statement_id: createdStatement.id as string,
    });

    expect(response.amount).toBe(300);
    expect(response.description).toBe("teste de deposito");
  });

  it("Shouldn't be able to get statement operation of a non-existent user", async () => {
    expect(async () => {
      const user = {
        name: "John Doe",
        email: "johndoe@mail.com",
        password: "fake_pass",
      };
      const createdUser = await usersRepositoryInMemory.create(user);

      const statement = {
        user_id: createdUser.id as string,
        type: OperationType.DEPOSIT,
        description: "teste de deposito",
        amount: 300,
      };
      const createdStatement = await statementsRepositoryInMemory.create(statement);
      await getStatementOperationUseCase.execute({
        user_id: "fake_id",
        statement_id: createdStatement.id as string,
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });
  it("Shouldn't be able to get statement operation of a non-existent statement", async () => {
    expect(async () => {
      const user = {
        name: "John Doe",
        email: "johndoe@mail.com",
        password: "fake_pass",
      };
      const createdUser = await usersRepositoryInMemory.create(user);

      const statement = {
        user_id: createdUser.id as string,
        type: OperationType.DEPOSIT,
        description: "teste de deposito",
        amount: 300,
      };
      const createdStatement = await statementsRepositoryInMemory.create(statement);
      await getStatementOperationUseCase.execute({
        user_id: createdUser.id as string,
        statement_id: "fake_id",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
