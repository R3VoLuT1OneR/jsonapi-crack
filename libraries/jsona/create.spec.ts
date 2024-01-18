import { create } from "./create";
import { Article, People } from "./fixtures";
import { expectAssignable, expectNotType, expectType } from "tsd";
import { Resource } from "./types";

describe("create()", () => {
  it('should fail if "type" is not a string', () => {
    // @ts-expect-error
    expect(() => create({ type: 0 })).toThrowError();
    expect(() => create({ type: null })).toThrowError();
    // @ts-expect-error
    expect(() => create({ type: {} })).toThrowError();
  });

  it("create new article without attributes", () => {
    const newArticle: Article = create<Article>({
      type: "articles",
    });

    expectType<typeof newArticle._type>("articles");

    expect(newArticle.id).toBeUndefined();
    expect(newArticle._type).toBe("articles");
    expect(newArticle.relationshipNames).toEqual([]);
    expect(newArticle.title).toBeUndefined();
    expect(newArticle.editor).toBeUndefined();
  });

  it("create new article with attributes", () => {
    const newArticle: Article = create<Article>({
      type: "articles",
      attributes: {
        title: "foo",
      },
    });

    expectType<typeof newArticle._type>("articles");

    expect(newArticle.id).toBeUndefined();
    expect(newArticle._type).toBe("articles");
    expect(newArticle.relationshipNames).toEqual([]);
    expect(newArticle.title).toBe("foo");
    expect(newArticle.editor).toBeUndefined();
  });

  it("create new article only with relationships", () => {
    const newArticle: Article = create<Article>({
      type: "articles",
      relationships: {
        author: create<People>({
          type: "people",
        }),
      },
    });

    expectType<typeof newArticle._type>("articles");
    expectType<typeof newArticle.author._type>("people");

    expect(newArticle.id).toBeUndefined();
    expect(newArticle._type).toBe("articles");
    expect(newArticle.relationshipNames).toEqual(["author"]);
    expect(newArticle.title).toBeUndefined();

    expect(newArticle.author.id).toBeUndefined();
    expect(newArticle.author._type).toBe("people");
    expect(newArticle.author.firstName).toBeUndefined();
    expect(newArticle.author.lastName).toBeUndefined();

    expect(newArticle.editor).toBeUndefined();
  });

  it("create new article with attributes & relationships", () => {
    const newArticle: Article = create<Article>({
      type: "articles",
      attributes: {
        title: "foo",
      },
      relationships: {
        author: create<People>({
          type: "people",
        }),
      },
    });

    expectType<typeof newArticle._type>("articles");
    expectType<typeof newArticle.author._type>("people");

    expect(newArticle.id).toBeUndefined();
    expect(newArticle._type).toBe("articles");
    expect(newArticle.relationshipNames).toEqual(["author"]);
    expect(newArticle.title).toBe("foo");

    expect(newArticle.author.id).toBeUndefined();
    expect(newArticle.author._type).toBe("people");
    expect(newArticle.author.firstName).toBeUndefined();
    expect(newArticle.author.lastName).toBeUndefined();

    expect(newArticle.editor).toBeUndefined();
  });

  describe("without types", () => {
    it("new resource without attributes & relationships", () => {
      const newNotTypedResource = create({
        type: "notTyped",
      });

      expectAssignable<{
        _type: "notTyped";
        id?: string;
        relationshipNames: string[];
      }>(newNotTypedResource);

      expectType<typeof newNotTypedResource._type>("notTyped");

      expect(newNotTypedResource.id).toBeUndefined();
      expect(newNotTypedResource._type).toBe("notTyped");
      expect(newNotTypedResource.relationshipNames).toEqual([]);
    });

    it("new resource with attributes", () => {
      const newNotTypedResource = create({
        type: "notTyped",
        attributes: {
          name: "test",
        },
      });

      expectAssignable<{
        _type: "notTyped";
        name: string;
        relationshipNames: string[];
      }>(newNotTypedResource);

      expectType<typeof newNotTypedResource._type>("notTyped");

      expect(newNotTypedResource.id).toBeUndefined();
      expect(newNotTypedResource._type).toBe("notTyped");
      expect(newNotTypedResource.name).toBe("test");
      expect(newNotTypedResource.relationshipNames).toEqual([]);
    });

    it("new resource with relationships only", () => {
      const newNotTypedResource = create({
        type: "notTyped",
        relationships: {
          rel: create({
            type: "notTypedRelationship",
          }),
        },
      });

      expectNotType<any>(newNotTypedResource);

      expectAssignable<{
        _type: "notTyped";
        relationshipNames: ["rel"];
        rel: Resource<"notTypedRelationship">;
      }>(newNotTypedResource);

      expectType<typeof newNotTypedResource._type>("notTyped");

      expect(newNotTypedResource.id).toBeUndefined();
      expect(newNotTypedResource._type).toBe("notTyped");
      expect(newNotTypedResource.relationshipNames).toEqual(["rel"]);

      expectType<typeof newNotTypedResource.rel._type>("notTypedRelationship");

      expect(newNotTypedResource.rel.id).toBeUndefined();
      expect(newNotTypedResource.rel._type).toBe("notTypedRelationship");
      expect(newNotTypedResource.rel.relationshipNames).toEqual([]);
    });

    it("new resource with attributes & relationships", () => {
      const newNotTypedResource = create({
        type: "notTyped",
        attributes: {
          name: "test",
        },
        relationships: {
          rel: create({
            type: "notTypedRelationship",
          }),
        },
      });

      expectAssignable<{
        _type: "notTyped";
        name: string;
        relationshipNames: ["rel"];
        rel: Resource<"notTypedRelationship">;
      }>(newNotTypedResource);

      expectType<typeof newNotTypedResource._type>("notTyped");

      expect(newNotTypedResource.id).toBeUndefined();
      expect(newNotTypedResource._type).toBe("notTyped");
      expect(newNotTypedResource.name).toBe("test");
      expect(newNotTypedResource.relationshipNames).toEqual(["rel"]);

      expectType<typeof newNotTypedResource.rel._type>("notTypedRelationship");

      expect(newNotTypedResource.rel.id).toBeUndefined();
      expect(newNotTypedResource.rel._type).toBe("notTypedRelationship");
      expect(newNotTypedResource.rel.relationshipNames).toEqual([]);
    });
  });
});
