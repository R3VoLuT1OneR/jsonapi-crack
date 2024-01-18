import { deserialize } from "./deserialize";
import { Article, ArticleCollection, JSONAPIArticle1, JSONAPIMainPageCollectionExample } from "./fixtures";
import { isCollection } from "./helpers";

describe("deserialize()", () => {
  it("article deserialization", () => {
    const article: Article = deserialize<Article>(JSONAPIArticle1);

    expect(article).not.toBeNull();
    expect(article.id).toBe("1");
    expect(article._type).toBe("articles");
    expect(article.relationshipNames).toEqual(["author"]);
    expect(article.title).toBe("Rails is Omakase");

    expect(article.author).not.toBeNull();
    expect(article.author?.id).toBe("9");
    expect(article.author?._type).toBe("people");
    expect(article.author?.relationshipNames).toBeUndefined();
    expect(article.author?.firstName).toBe("John");
    expect(article.author?.lastName).toBe("Doe");
  });

  it("deserialization of a collection", () => {
    const coll = deserialize<ArticleCollection>(JSONAPIMainPageCollectionExample);

    expect(coll).toBeDefined();
    expect(coll).toHaveLength(1);

    const deserializedArticle = coll[0];

    expect(deserializedArticle).not.toBeNull();
    expect(deserializedArticle.id).toBe("1");
    expect(deserializedArticle._type).toBe("articles");
    expect(deserializedArticle.relationshipNames).toEqual(["author", "comments"]);
    expect(deserializedArticle.title).toBe("JSON:API paints my bikeshed!");

    expect(deserializedArticle.author).toBeDefined();
    const articleAuthor = deserializedArticle.author;

    expect(articleAuthor).not.toBeNull();
    expect(articleAuthor?.id).toBe("9");
    expect(articleAuthor?._type).toBe("people");
    expect(articleAuthor?.relationshipNames).toBeUndefined();
    expect(articleAuthor?.firstName).toBe("Dan");
    expect(articleAuthor?.lastName).toBe("Gebhardt");

    expect(deserializedArticle.comments).toBeDefined();
    expect(deserializedArticle.comments).toHaveLength(2);
    expect(isCollection(deserializedArticle.comments)).toBe(true);
    const articleComment1 = deserializedArticle.comments[0];
    const articleComment2 = deserializedArticle.comments[1];

    expect(articleComment1).not.toBeNull();
    expect(articleComment1?.id).toBe("5");
    expect(articleComment1?._type).toBe("comments");
    expect(articleComment1?.relationshipNames).toEqual(["author"]);
    expect(articleComment1?.body).toBe("First!");
    expect(articleComment1?.author).toBeDefined();
    expect(articleComment1?.author?.id).toBe("2");
    expect(articleComment1?.author?._type).toBe("people");
    expect(articleComment1?.author?.relationshipNames).toBeUndefined();
    expect(articleComment1?.author?.firstName).toBeUndefined();
    expect(articleComment1?.author?.lastName).toBeUndefined();

    expect(articleComment2).not.toBeNull();
    expect(articleComment2?.id).toBe("12");
    expect(articleComment2?._type).toBe("comments");
    expect(articleComment2?.relationshipNames).toEqual(["author"]);
    expect(articleComment2?.body).toBe("I like XML better");
    expect(articleComment2?.author).toBeDefined();
    expect(articleComment2?.author?.id).toBe("9");
    expect(articleComment2?.author?._type).toBe("people");
    expect(articleComment2?.author?.relationshipNames).toBeUndefined();
    expect(articleComment2?.author?.firstName).toBe("Dan");
    expect(articleComment2?.author?.lastName).toBe("Gebhardt");

    expect(coll.meta).toBeDefined();
    expect(coll.meta).toHaveProperty("total", 1);

    expect(coll.links).toBeDefined();
    expect(coll.links).toHaveProperty("self", "http://example.com/articles");
    expect(coll.links).toHaveProperty("next", "http://example.com/articles?page[offset]=2");
    expect(coll.links).toHaveProperty("last", "http://example.com/articles?page[offset]=10");
  });
});
