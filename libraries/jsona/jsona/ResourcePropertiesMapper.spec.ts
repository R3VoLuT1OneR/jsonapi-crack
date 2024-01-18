import { ResourcePropertiesMapper } from "./ResourcePropertiesMapper";
import { Resource } from "../index";

// Define a sample JsonaModel for testing
const sampleResource: Resource<"exampleType"> & {
  name: string;
  description: string;
} = {
  _type: "exampleType",
  id: "123",
  name: "Example Model",
  description: "Sample description",
  relationshipNames: [],
  // Add other properties as needed for testing
};

const mapper = new ResourcePropertiesMapper();

describe("ModelPropertiesMapper", () => {
  it("fail on wrong resource provided", () => {
    const wrongResource = { title: "Title" } as unknown as Resource;
    expect(() => mapper.getType(wrongResource)).toThrowError();
  });
  it("should correctly get the type", () => {
    const type = mapper.getType(sampleResource);
    expect(type).toBe("exampleType");
  });

  it("should correctly get the attributes", () => {
    const attributes = mapper.getAttributes(sampleResource);
    // Define expected attributes without the excluded properties
    const expectedAttributes = {
      name: "Example Model",
      description: "Sample description",
    };
    expect(attributes).toEqual(expectedAttributes);
  });

  // Add more tests for getMeta and getLinks if needed
});
