import { resource } from "./resource";
import { Article, People } from "./fixtures";

describe("resource()", () => {
  it("initialize article from known data", () => {
    const article = resource<Article>({
      type: "articles",
      id: "1",
      attributes: {
        title: "Test",
      },
      relationships: {
        author: resource<People>({
          type: "people",
          id: "9",
        }),
      },
    });

    expect(article.id).toBe("1");
    expect(article._type).toBe("articles");
    expect(article.relationshipNames).toEqual(["author"]);
    expect(article.title).toBe("Test");

    expect(article.author.id).toBe("9");
    expect(article.author._type).toBe("people");
    expect(article.author.relationshipNames).toEqual([]);
    expect(article.author.firstName).toBeUndefined();
    expect(article.author.lastName).toBeUndefined();
  });

  describe("no typings", () => {
    it("initialize resource not typed resource", () => {
      const notTypedResource = resource({
        type: "notTyped",
        id: "123",
        attributes: {
          name: "Example Model",
          description: "Sample description",
        },
        relationships: {
          someRelationship: resource({
            type: "relatedType",
            id: "456",
          }),
        },
      });

      expect(notTypedResource.id).toBe("123");
      expect(notTypedResource._type).toBe("notTyped");
      expect(notTypedResource.relationshipNames).toEqual(["someRelationship"]);
      expect(notTypedResource.name).toBe("Example Model");
      expect(notTypedResource.description).toBe("Sample description");

      expect(notTypedResource.someRelationship.id).toBe("456");
      expect(notTypedResource.someRelationship._type).toBe("relatedType");
      expect(notTypedResource.someRelationship.relationshipNames).toEqual([]);
    });
  });

  it("initialize resource without relationships", () => {
    const article = resource<Article>({
      type: "articles",
      id: "1",
      attributes: {
        title: "Test",
      },
    });

    expect(article.id).toBe("1");
    expect(article._type).toBe("articles");
    expect(article.relationshipNames).toEqual([]);
    expect(article.title).toBe("Test");
  });

  it("initialize resource without attributes", () => {
    const article = resource<Article>({
      type: "articles",
      id: "1",
      relationships: {
        author: resource<People>({
          type: "people",
          id: "9",
        }),
      },
    });

    expect(article.id).toBe("1");
    expect(article._type).toBe("articles");
    expect(article.relationshipNames).toEqual(["author"]);
    expect(article.title).toBeUndefined();
    expect(article.author).toBeDefined();
  });

  it("initialize resource without attributes and relationships", () => {
    const article = resource<Article>({
      type: "articles",
      id: "1",
    });

    expect(article.id).toBe("1");
    expect(article._type).toBe("articles");
    expect(article.relationshipNames).toEqual([]);
    expect(article.title).toBeUndefined();
  });
});
