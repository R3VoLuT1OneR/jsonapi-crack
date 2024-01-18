import { resource } from "./resource";
import { Article, ArticleCollection } from "./fixtures";
import { collection } from "./collection";
import { isCollection } from "./helpers";

function article(id: string): Article {
  return resource({
    id,
    type: "articles",
    attributes: {
      title: "My article",
      description: "My article description",
    },
    relationships: {
      author: resource({
        id: "1",
        type: "people",
        attributes: {
          firstName: "John",
          lastName: "Doe",
        },
      }),
    },
  });
}

describe("collection()", () => {
  it('should fail if "resources" is not an array', () => {
    // @ts-expect-error
    expect(() => collection({ type: "articles", resources: "invalid" })).toThrowError();
    expect(() => collection({ type: "articles", resources: null })).toThrowError();
    // @ts-expect-error
    expect(() => collection({ type: "articles", resources: 0 })).toThrowError();
  });

  it('should fail if "resources" contains invalid resources', () => {
    // @ts-expect-error
    expect(() => collection({ type: "articles", resources: [article("1"), "invalid"] })).toThrowError();
    // @ts-expect-error
    expect(() => collection({ resources: [article("1"), "invalid"] })).toThrowError();
  });

  it('should fail if "type" is not a string', () => {
    // @ts-expect-error
    expect(() => collection({ type: 0, resources: [article("1")] })).toThrowError();
    expect(() => collection({ type: null, resources: [article("1")] })).toThrowError();
    // @ts-expect-error
    expect(() => collection({ type: {}, resources: [article("1")] })).toThrowError();
  });

  it('should fail if "type" is not the same as resources type', () => {
    // expect(() => collection({ type: "articles", resources: [article("1")] })).not.toThrowError();
    // expect(() => collection({ type: "articles", resources: [article("1"), article("2")] })).not.toThrowError();
    expect(() =>
      collection({ type: "articles", resources: [article("1"), resource({ type: "example", id: "2" })] })
    ).toThrowError();
  });

  it('should fail if "meta" is not an object', () => {
    // @ts-expect-error
    expect(() => collection({ type: "articles", resources: [article("1")], meta: "invalid" })).toThrowError();
    // @ts-expect-error
    expect(() => collection({ type: "articles", resources: [article("1")], meta: 0 })).toThrowError();
  });

  it('should fail if "links" is not an object', () => {
    // @ts-expect-error
    expect(() => collection({ type: "articles", resources: [article("1")], links: "invalid" })).toThrowError();
    // @ts-expect-error
    expect(() => collection({ type: "articles", resources: [article("1")], links: 0 })).toThrowError();
  });

  it('should fail if "type", "links" or "meta" is already set', () => {
    const coll = collection({
      type: "articles",
      resources: [article("1")],
      meta: {
        total: 1,
      },
      links: {
        self: "/articles",
      },
    });

    expect(() => (coll.type = "articles")).toThrowError();
    expect(() => (coll.links = { self: "/articles" })).toThrowError();
    expect(() => (coll.meta = { total: 1 })).toThrowError();
  });

  it("should be able to be created", () => {
    const coll = collection({
      type: "articles",
      resources: [article("1"), article("2")],
    });

    expect(coll).toBeDefined();
    expect(coll).toHaveLength(2);
    expect(coll.type).toBe("articles");
    expect(coll.meta).toBeUndefined();
    expect(coll.links).toBeUndefined();

    const fullColl = collection({
      type: "articles",
      resources: [article("1"), article("2")],
      meta: {
        total: 2,
      },
      links: {
        self: "/articles",
      },
    });

    expect(fullColl).toBeDefined();
    expect(fullColl).toHaveLength(2);
    expect(fullColl.meta).toBeDefined();
    expect(fullColl.meta).toHaveProperty("total", 2);
    expect(fullColl.links).toBeDefined();
    expect(fullColl.links).toHaveProperty("self", "/articles");
  });

  it("should be posible to find by id", () => {
    const coll = collection({
      type: "articles",
      resources: [article("1"), article("2")],
    });

    expect(coll.findById("1")).toBeDefined();
    expect(coll.findById("1")).toHaveProperty("id", "1");
    expect(coll.findById("2")).toBeDefined();
    expect(coll.findById("2")).toHaveProperty("id", "2");
    expect(coll.findById("3")).toBeUndefined();
  });

  it('should fail if "push" is called with invalid resources', () => {
    const coll = collection({
      type: "articles",
      resources: [article("1")],
    });

    expect(() => coll.push(article("2"))).not.toThrowError();
    expect(() => coll.push(resource({ type: "example", id: "2" }))).toThrowError();
  });

  it('should fail if "unshift" is called with invalid resources', () => {
    const coll = collection({
      type: "articles",
      resources: [article("1")],
    });

    expect(() => coll.unshift(article("2"))).not.toThrowError();
    expect(() => coll.unshift(resource({ type: "example", id: "2" }))).toThrowError();
  });

  it('should fail if "splice" is called', () => {
    const coll = collection({
      type: "articles",
      resources: [article("1")],
    });

    const removed = coll.splice(0, 0, article("2"));
    expect(removed).toHaveLength(0);

    expect(coll).toHaveLength(2);
    expect(coll[0]).toHaveProperty("id", "2");
    expect(coll[1]).toHaveProperty("id", "1");

    expect(() => coll.splice(0, 0, resource({ type: "example", id: "2" }))).toThrowError(
      'Object is not proper resource expected type "articles" at index 0'
    );
  });

  it("map should work", () => {
    const coll = collection({
      type: "articles",
      resources: [article("1"), article("2")],
    });

    const mapped = coll.map(({ id }) => id);
    expect(mapped).toHaveLength(2);
    expect(mapped).toEqual(["1", "2"]);
  });

  it("filter should work", () => {
    const coll = collection({
      type: "articles",
      resources: [article("1"), article("2")],
    });

    const filtered = coll.filter((resource) => resource.id === "1");
    expect(filtered).toHaveLength(1);
    expect(filtered[0]).toHaveProperty("id", "1");
    expect(isCollection(filtered)).toBe(true);
  });

  it("forEach should work", () => {
    const coll = collection({
      type: "articles",
      resources: [article("1"), article("2")],
    });

    const ids: string[] = [];
    coll.forEach(({ id }) => ids.push(id));
    expect(ids).toHaveLength(2);
    expect(ids).toEqual(["1", "2"]);
  });

  it("reduce should work", () => {
    const coll = collection({
      type: "articles",
      resources: [article("1"), article("2")],
    });

    const reduced = coll.reduce((acc, { id }) => acc + id, "");
    expect(reduced).toBe("12");
  });

  it("should be iterable", () => {
    const coll = collection({
      type: "articles",
      resources: [article("1"), article("2")],
    });

    const ids: string[] = [];
    for (const { id } of coll) {
      ids.push(id);
    }
    expect(ids).toHaveLength(2);
    expect(ids).toEqual(["1", "2"]);
  });

  it('should be able to "push" resources', () => {
    const coll = collection({
      type: "articles",
      resources: [article("1")],
    });

    expect(coll).toHaveLength(1);
    expect(coll[0]).toHaveProperty("id", "1");

    coll.push(article("2"));

    expect(coll).toHaveLength(2);
    expect(coll[0]).toHaveProperty("id", "1");
    expect(coll[1]).toHaveProperty("id", "2");
  });

  it('should be able to "unshift" resources', () => {
    const coll = collection({
      type: "articles",
      resources: [article("1")],
    });

    expect(coll).toHaveLength(1);
    expect(coll[0]).toHaveProperty("id", "1");

    coll.unshift(article("2"));

    expect(coll).toHaveLength(2);
    expect(coll[0]).toHaveProperty("id", "2");
    expect(coll[1]).toHaveProperty("id", "1");
  });

  it('should be able to "splice" resources', () => {
    const coll = collection({
      type: "articles",
      resources: [article("1"), article("2")],
    });

    expect(coll).toHaveLength(2);
    expect(coll[0]).toHaveProperty("id", "1");
    expect(coll[1]).toHaveProperty("id", "2");

    const removed = coll.splice(0, 1, article("3"));

    expect(removed).toHaveLength(1);
    expect(removed[0]).toHaveProperty("id", "1");

    expect(coll).toHaveLength(2);
    expect(coll[0]).toHaveProperty("id", "3");
    expect(coll[1]).toHaveProperty("id", "2");
  });

  it('should be able to "pop" resources', () => {
    const coll = collection({
      type: "articles",
      resources: [article("1"), article("2")],
    });

    expect(coll).toHaveLength(2);
    expect(coll[0]).toHaveProperty("id", "1");
    expect(coll[1]).toHaveProperty("id", "2");

    const removed = coll.pop();

    expect(removed).toBeDefined();
    expect(removed).toHaveProperty("id", "2");

    expect(coll).toHaveLength(1);
    expect(coll[0]).toHaveProperty("id", "1");
  });

  it("should clone collection", () => {
    const coll = collection<ArticleCollection>({
      type: "articles",
      resources: [article("1")],
      meta: {
        total: 1,
      },
      links: {
        self: "/articles",
      },
    });

    const cloned = coll.clone();
    expect(cloned).not.toBe(coll);
    expect(cloned).toHaveLength(1);
    expect(cloned.type).toBe("articles");
    expect(cloned.meta).toBeDefined();
    expect(cloned.meta).toHaveProperty("total", 1);
    expect(cloned.links).toBeDefined();
    expect(cloned.links).toHaveProperty("self", "/articles");
    expect(cloned[0]).not.toBe(coll[0]);
    expect(cloned[0]).toHaveProperty("id", "1");
    expect(cloned[0]).toHaveProperty("_type", "articles");
    expect(cloned[0]).toHaveProperty("title", "My article");
    expect(cloned[0]).toHaveProperty("description", "My article description");
    expect(cloned[0]).toHaveProperty("author");
    expect(cloned[0].author).toHaveProperty("id", "1");
    expect(cloned[0].author).toHaveProperty("_type", "people");
    expect(cloned[0].author).toHaveProperty("firstName", "John");
    expect(cloned[0].author).toHaveProperty("lastName", "Doe");

    const clonedAttributesOnly = coll.clone({ attributes: ["title"] });

    expect(clonedAttributesOnly).not.toBe(coll);
    expect(clonedAttributesOnly).toHaveLength(1);
    expect(clonedAttributesOnly.type).toBe("articles");
    expect(cloned.meta).toBeDefined();
    expect(cloned.meta).toHaveProperty("total", 1);
    expect(cloned.links).toBeDefined();
    expect(cloned.links).toHaveProperty("self", "/articles");
    expect(clonedAttributesOnly[0]).not.toBe(coll[0]);
    expect(clonedAttributesOnly[0]).toHaveProperty("id", "1");
    expect(clonedAttributesOnly[0]).toHaveProperty("_type", "articles");
    expect(clonedAttributesOnly[0]).toHaveProperty("title");
    expect(clonedAttributesOnly[0]).not.toHaveProperty("description");
    expect(cloned[0].author).toHaveProperty("id", "1");
    expect(cloned[0].author).toHaveProperty("_type", "people");
    expect(cloned[0].author).toHaveProperty("firstName", "John");
    expect(cloned[0].author).toHaveProperty("lastName", "Doe");
  });
});
