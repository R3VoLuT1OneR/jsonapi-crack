import { create } from "./create";
import { clone } from "./clone";
import { resource } from "./resource";
import { Article } from "./fixtures";

describe("clone()", () => {
  describe("article", () => {
    const article = create<Article>({
      type: "articles",
      attributes: {
        title: "Example title",
      },
      relationships: {
        author: resource({
          type: "people",
          id: "1",
        }),
      },
    });

    it("fail on missing attribute or relationships", () => {
      const missingTitle = create<Article>({
        type: "articles",
        attributes: {},
        relationships: {},
      });

      expect(() =>
        clone({
          resource: missingTitle,
          attributes: ["title"],
        })
      ).toThrowError('Attribute "title" is missing on resource "articles:new".');

      expect(() =>
        clone({
          resource: missingTitle,
          relationships: ["author"],
        })
      ).toThrowError('Relationship "author" is missing on resource "articles:new".');

      const missingTitleWithID = resource<Article>({
        id: "1",
        type: "articles",
        attributes: {},
        relationships: {},
      });

      expect(() =>
        clone({
          resource: missingTitleWithID,
          attributes: ["title"],
        })
      ).toThrowError('Attribute "title" is missing on resource "articles:1".');

      expect(() =>
        clone({
          resource: missingTitleWithID,
          relationships: ["author"],
        })
      ).toThrowError('Relationship "author" is missing on resource "articles:1".');
    });

    it("only attributes", () => {
      const clonedArticleOnlyTitle = clone({ resource: article, attributes: ["title"], relationships: [] });

      expect(clonedArticleOnlyTitle).not.toBe(article);
      expect(clonedArticleOnlyTitle.id).toBe(article.id);
      expect(clonedArticleOnlyTitle._type).toBe(article._type);
      expect(clonedArticleOnlyTitle.title).toBe(article.title);

      // Verify not cloned
      expect(clonedArticleOnlyTitle.author).toBeUndefined();
      expect(clonedArticleOnlyTitle.editor).toBeUndefined();
    });

    it("only relationships", () => {
      const clonedArticleOnlyAuthor = clone({ resource: article, attributes: [], relationships: ["author"] });

      expect(clonedArticleOnlyAuthor).not.toBe(article);
      expect(clonedArticleOnlyAuthor.id).toBe(article.id);
      expect(clonedArticleOnlyAuthor._type).toBe(article._type);

      // Verify not cloned
      expect(clonedArticleOnlyAuthor.title).toBeUndefined();
      expect(clonedArticleOnlyAuthor.editor).toBeUndefined();

      expect(clonedArticleOnlyAuthor.author).toBe(article.author);
      expect(clonedArticleOnlyAuthor.author.id).toBe(article.author.id);
      expect(clonedArticleOnlyAuthor.author._type).toBe(article.author._type);
    });

    it("attributes & relationships", () => {
      const clonedArticle = clone({
        resource: article,
      });

      expect(clonedArticle).not.toBe(article);
      expect(clonedArticle.id).toBe(article.id);
      expect(clonedArticle._type).toBe(article._type);
      expect(clonedArticle.title).toBe(article.title);

      // Validate that relationship is same
      expect(clonedArticle.author).toBe(article.author);
      expect(clonedArticle.author.id).toBe(article.author.id);
      expect(clonedArticle.author._type).toBe(article.author._type);
    });
  });

  describe("not typed resource", () => {
    const notTyped = create({
      type: "exampleType",
      attributes: {
        name: "Example Model",
        description: "Sample description",
        obj: {
          test: "deepClone",
        },
      },
      relationships: {
        rel: resource({
          type: "relType",
          id: "2",
        }),
      },
    });

    it("only attributes", () => {
      const clonedResourceOnlyName = clone({
        resource: notTyped,
        attributes: ["name"],
        relationships: [],
      });

      expect(clonedResourceOnlyName).not.toBe(notTyped);
      expect(clonedResourceOnlyName.id).toBe(notTyped.id);
      expect(clonedResourceOnlyName._type).toBe(notTyped._type);
      expect(clonedResourceOnlyName.name).toBe(notTyped.name);

      // Verify not cloned
      expect(clonedResourceOnlyName.description).toBeUndefined();
      expect(clonedResourceOnlyName.obj).toBeUndefined();
      expect(clonedResourceOnlyName.rel).toBeUndefined();
    });

    it("only relationships", () => {
      const clonedResourceOnlyRel = clone({
        resource: notTyped,
        attributes: [],
        relationships: ["rel"],
      });

      expect(clonedResourceOnlyRel).not.toBe(notTyped);
      expect(clonedResourceOnlyRel.id).toBe(notTyped.id);
      expect(clonedResourceOnlyRel._type).toBe(notTyped._type);

      // Verify not cloned
      expect(clonedResourceOnlyRel.name).toBeUndefined();
      expect(clonedResourceOnlyRel.description).toBeUndefined();
      expect(clonedResourceOnlyRel.obj).toBeUndefined();

      expect(clonedResourceOnlyRel.rel).toBe(notTyped.rel);
      expect(clonedResourceOnlyRel.rel.id).toBe(notTyped.rel.id);
      expect(clonedResourceOnlyRel.rel._type).toBe(notTyped.rel._type);
    });

    it("attributes & relationships", () => {
      const clonedResource = clone({ resource: notTyped });

      expect(clonedResource).not.toBe(notTyped);
      expect(clonedResource.id).toBe(notTyped.id);
      expect(clonedResource._type).toBe(notTyped._type);
      expect(clonedResource.name).toBe(notTyped.name);
      expect(clonedResource.description).toBe(notTyped.description);

      // Validate object actually copied
      expect(clonedResource.obj).not.toBe(notTyped.obj);
      expect(clonedResource.obj.test).toBe(notTyped.obj.test);

      // Validate that relationship is same
      expect(clonedResource.rel).toBe(notTyped.rel);
      expect(clonedResource.rel.id).toBe(notTyped.rel.id);
      expect(clonedResource.rel._type).toBe(notTyped.rel._type);
    });

    it("should copy only specified data", () => {
      const exampleResource = create({
        type: "exampleType",
        attributes: {
          name: "Example Model",
          description: "Sample description",
          obj: {
            test: "deepClone",
          },
        },
        relationships: {
          rel: resource({
            type: "relType",
            id: "2",
          }),
        },
      });

      const clonedResource = clone({
        resource: exampleResource,
        attributes: [],
        relationships: [],
      });

      expect(clonedResource).not.toBe(exampleResource);
      expect(clonedResource.id).toBe(exampleResource.id);
      expect(clonedResource._type).toBe(exampleResource._type);

      expect(clonedResource.name).toBeUndefined();
      expect(clonedResource.description).toBeUndefined();
      expect(clonedResource.obj).toBeUndefined();
      expect(clonedResource.rel).toBeUndefined();

      const clonedOnlyName = clone({ resource: exampleResource, attributes: ["name"], relationships: [] });

      expect(clonedOnlyName).not.toBe(exampleResource);
      expect(clonedOnlyName.id).toBe(exampleResource.id);
      expect(clonedOnlyName._type).toBe(exampleResource._type);
      expect(clonedOnlyName.name).toBe(exampleResource.name);

      expect(clonedResource.description).toBeUndefined();
      expect(clonedResource.obj).toBeUndefined();
      expect(clonedResource.rel).toBeUndefined();

      const clonedOnlyRel = clone({ resource: exampleResource, attributes: [], relationships: ["rel"] });

      expect(clonedOnlyRel).not.toBe(exampleResource);
      expect(clonedOnlyRel.id).toBe(exampleResource.id);
      expect(clonedOnlyRel._type).toBe(exampleResource._type);

      expect(clonedOnlyRel.rel).toBe(exampleResource.rel);
      expect(clonedOnlyRel.rel.id).toBe(exampleResource.rel.id);
      expect(clonedOnlyRel.rel._type).toBe(exampleResource.rel._type);

      expect(clonedOnlyRel.name).toBeUndefined();
      expect(clonedOnlyRel.description).toBeUndefined();
      expect(clonedOnlyRel.obj).toBeUndefined();
    });
  });

  it('should copy "links" and "meta" properties', () => {
    const article = create<Article>({
      type: "articles",
      attributes: {
        title: "Example title",
      },
    });

    article.meta = { test: "test" };
    article.links = { self: "http://example.com" };

    const cloned = clone({ resource: article });

    expect(cloned.meta).toEqual({ test: "test" });
    expect(cloned.links).toEqual({ self: "http://example.com" });
  });
});
