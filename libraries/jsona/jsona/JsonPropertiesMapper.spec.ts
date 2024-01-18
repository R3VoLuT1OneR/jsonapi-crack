import { JsonPropertiesMapper } from "./JsonPropertiesMapper";

describe("JsonPropertiesMapper", () => {
  it("should correctly create a model with the specified type", () => {
    const mapper = new JsonPropertiesMapper();
    const model = mapper.createModel("exampleType");

    expect(model._type).toBe("exampleType");
  });
});
