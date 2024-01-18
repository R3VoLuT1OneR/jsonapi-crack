import { Article, People } from "./fixtures";
import { setRelationship } from "./setRelationship";
import { create } from "./create";
import { resource } from "./resource";

describe("setRelationship()", () => {
  it("set author of article", () => {
    let article = create<Article>({ type: "articles" });
    const author = resource<People>({ type: "people", id: "9" });

    expect(article.relationshipNames).toEqual([]);

    article = setRelationship(article, "author", author);

    // @ts-expect-error
    setRelationship(article, "dfd", author);

    expect(article.relationshipNames).toEqual(["author", "dfd"]);

    expect(article.id).toBeUndefined();
    expect(article._type).toBe("articles");
    expect(article.author.id).toBe("9");
    expect(article.author._type).toBe("people");
  });

  it("should correctly set a relation to a resource", () => {
    const notTyped = create({ type: "exampleType" });
    const relation = create({ type: "relatedType" });

    expect(notTyped.relationshipNames).toEqual([]);

    const returnedNoTyped = setRelationship(notTyped, "someRelationship", relation);

    expect(notTyped.relationshipNames).toEqual(["someRelationship"]);
    expect(returnedNoTyped.relationshipNames).toEqual(["someRelationship"]);

    expect(notTyped.someRelationship).toBe(relation);
    expect(returnedNoTyped.someRelationship).toBe(relation);
  });
});
