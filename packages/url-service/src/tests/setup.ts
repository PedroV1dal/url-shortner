jest.mock("reflect-metadata", () => ({}));

jest.mock("@mikro-orm/core", () => {
  const mockDecorator = () => () => {};
  return {
    Entity: mockDecorator,
    Filter: mockDecorator,
    PrimaryKey: mockDecorator,
    Property: mockDecorator,
    Unique: mockDecorator,
    EntityManager: jest.fn().mockImplementation(() => ({
      findOne: jest.fn(),
      persistAndFlush: jest.fn(),
    })),
  };
});
