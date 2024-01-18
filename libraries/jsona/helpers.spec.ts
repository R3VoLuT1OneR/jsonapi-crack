import { compare, verifyCollection, verifyResource } from "./helpers";
import { collection } from "./collection";
import { resource } from "./resource";

describe("verifyResource()", () => {
  it("should correctly verify a Resource", () => {
    // Valid JsonaModel
    const validModel = {
      _type: "exampleType",
      id: "123",
    };

    // Valid JsonaCollection
    const validCollection = collection({
      resources: [
        resource({
          type: "exampleType",
          id: "123",
        }),
      ],
    });

    // Invalid JsonaModel (missing _type)
    const invalidModel = {
      id: "123",
    };

    expect(() => verifyResource(validModel)).not.toThrow();
    expect(() => verifyResource(validCollection)).not.toThrow();

    expect(() => verifyResource(validModel, "exampleType")).not.toThrow();
    expect(() => verifyResource(validModel, "exampleType2")).toThrow();

    expect(() => verifyResource(invalidModel)).toThrowError();

    expect(() => verifyResource([invalidModel])).toThrowError();
  });
});

describe("verifyCollection()", () => {
  it("should correctly verify a Collection", () => {
    // Valid JsonaCollection
    const validCollection = collection({
      type: "exampleType",
      resources: [
        resource({
          type: "exampleType",
          id: "123",
        }),
      ],
    });

    // Invalid JsonaCollection (missing resources)
    const invalidCollection = {
      id: "123",
    };

    expect(() => verifyResource(validCollection)).not.toThrow();
    expect(() => verifyCollection(validCollection)).not.toThrow();

    expect(() => verifyCollection(validCollection, "exampleType")).not.toThrow();
    expect(() => verifyCollection(validCollection, "exampleType2")).toThrow();

    expect(() => verifyCollection(invalidCollection)).toThrowError();

    expect(() => verifyCollection([invalidCollection])).toThrowError();
  });
});

describe("compare()", () => {
  it("should correctly compare two resources", () => {
    const expected = resource({
      type: "exampleType",
      id: "123",
      attributes: {
        name: "exampleName",
      },
      relationships: {
        exampleRelationship: resource({
          type: "exampleRelationshipType",
          id: "456",
        }),
      },
    });

    const actual = resource({
      type: "exampleType",
      id: "123",
      attributes: {
        name: "exampleName",
      },
      relationships: {
        exampleRelationship: resource({
          type: "exampleRelationshipType",
          id: "456",
        }),
      },
    });

    const result = compare(expected, actual);

    expect(result.equal).toBe(true);
    expect(result.differences).toEqual([]);
  });

  it("should correctly compare resources without relationships", () => {
    const expected = resource({
      type: "exampleType",
      id: "123",
      attributes: {
        name: "exampleName",
      },
    });

    const actual = resource({
      type: "exampleType",
      id: "123",
      attributes: {
        name: "exampleName",
      },
    });

    const result = compare(expected, actual);

    expect(result.equal).toBe(true);
    expect(result.differences).toEqual([]);
  });

  it("should correctly compare two resources with different attributes", () => {
    const expected = resource({
      type: "exampleType",
      id: "123",
      attributes: {
        name: "exampleName",
      },
      relationships: {
        exampleRelationship: resource({
          type: "exampleRelationshipType",
          id: "456",
        }),
      },
    });

    const actual = resource({
      type: "exampleType",
      id: "123",
      attributes: {
        name: "exampleName2",
      },
      relationships: {
        exampleRelationship: resource({
          type: "exampleRelationshipType",
          id: "456",
        }),
      },
    });

    const result = compare(expected, actual);

    expect(result.equal).toBe(false);
    expect(result.differences).toEqual([
      {
        path: "attributes/name",
        expected: "exampleName",
        actual: "exampleName2",
      },
    ]);

    const result2 = compare(expected, actual, {
      attributes: ["name"],
    });

    expect(result2.equal).toBe(false);
    expect(result2.differences).toEqual([
      {
        path: "attributes/name",
        expected: "exampleName",
        actual: "exampleName2",
      },
    ]);
  });

  it('should compare properly when comparing with "null" relationships', () => {
    const expected = resource({
      type: "exampleType",
      id: "123",
      attributes: {
        name: "exampleName",
      },
      relationships: {
        exampleRelationship: null,
      },
    });

    const actual = resource({
      type: "exampleType",
      id: "123",
      attributes: {
        name: "exampleName",
      },
      relationships: {
        exampleRelationship: resource({
          type: "exampleRelationshipType",
          id: "456",
        }),
      },
    });

    expect(compare(expected, actual).equal).toBeFalsy();

    actual.exampleRelationship = null;

    expect(compare(expected, actual).equal).toBeTruthy();
  });

  it("should correctly compare two resources with different relationships", () => {
    const expected = resource({
      type: "exampleType",
      id: "123",
      attributes: {
        name: "exampleName",
      },
      relationships: {
        exampleRelationship: resource({
          type: "exampleRelationshipType",
          id: "456",
        }),
      },
    });

    const actual = resource({
      type: "exampleType",
      id: "123",
      attributes: {
        name: "exampleName",
      },
      relationships: {
        exampleRelationship: resource({
          type: "exampleRelationshipType",
          id: "4567",
        }),
      },
    });

    const result = compare(expected, actual);

    expect(result.equal).toBe(false);
    expect(result.differences).toEqual([
      {
        path: "relationships/exampleRelationship",
        expected: expected.exampleRelationship,
        actual: actual.exampleRelationship,
      },
    ]);

    const result2 = compare(expected, actual, {
      relationships: ["exampleRelationship"],
    });

    expect(result2.equal).toBe(false);
    expect(result2.differences).toEqual([
      {
        path: "relationships/exampleRelationship",
        expected: expected.exampleRelationship,
        actual: actual.exampleRelationship,
      },
    ]);
  });
});
