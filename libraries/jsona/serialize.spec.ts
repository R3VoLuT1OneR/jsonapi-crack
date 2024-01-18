import { serialize } from "./serialize";
import { create } from "./create";
import { resource } from "./resource";
import { collection } from "./collection";

describe("serialize()", () => {
  it("new resource without attributes & relationships", () => {
    const serialized = serialize(
      create({
        type: "articles",
      })
    );

    expect(serialized).toEqual({
      data: {
        type: "articles",
        attributes: {},
      },
    });
  });

  it("new resource with attributes", () => {
    const serialized = serialize(
      create({
        type: "articles",
        attributes: {
          title: "foo",
        },
      })
    );

    expect(serialized).toEqual({
      data: {
        type: "articles",
        attributes: {
          title: "foo",
        },
      },
    });
  });

  it("new resource with relationships", () => {
    const serialized = serialize(
      create({
        type: "articles",
        relationships: {
          author: resource({ type: "people", id: "1" }),
        },
      })
    );

    expect(serialized).toEqual({
      data: {
        type: "articles",
        attributes: {},
        relationships: {
          author: {
            data: {
              id: "1",
              type: "people",
            },
          },
        },
      },
    });
  });

  it("new resource with attributes & relationships", () => {
    const serialized = serialize(
      create({
        type: "articles",
        attributes: {
          title: "foo",
        },
        relationships: {
          author: resource({
            type: "people",
            id: "1",
          }),
        },
      })
    );

    expect(serialized).toEqual({
      data: {
        type: "articles",
        attributes: {
          title: "foo",
        },
        relationships: {
          author: {
            data: {
              id: "1",
              type: "people",
            },
          },
        },
      },
    });
  });

  it("existing resource with attributes & relationships", () => {
    const serialized = serialize(
      resource({
        type: "articles",
        id: "1",
        attributes: {
          title: "foo",
        },
        relationships: {
          author: resource({ type: "people", id: "1" }),
        },
      })
    );

    expect(serialized).toEqual({
      data: {
        id: "1",
        type: "articles",
        attributes: {
          title: "foo",
        },
        relationships: {
          author: {
            data: {
              id: "1",
              type: "people",
            },
          },
        },
      },
    });
  });

  describe("no typings", () => {
    it("new resource only with type", () => {
      const serialized = serialize(
        create({
          type: "articles",
        })
      );

      expect(serialized).toEqual({
        data: {
          type: "articles",
          attributes: {},
        },
      });
    });

    it("new resource with attributes", () => {
      const serialized = serialize(
        create({
          type: "articles",
          attributes: {
            title: "foo",
          },
        })
      );

      expect(serialized).toEqual({
        data: {
          type: "articles",
          attributes: {
            title: "foo",
          },
        },
      });
    });

    it("new resource with relationships", () => {
      const serialized = serialize(
        create({
          type: "notTyped",
          relationships: {
            rel: create({
              type: "notTypedRelationship",
            }),
          },
        })
      );

      expect(serialized).toEqual({
        data: {
          type: "notTyped",
          attributes: {},
          relationships: {
            rel: {
              data: {
                type: "notTypedRelationship",
              },
            },
          },
        },
      });
    });

    it("serialize collection", () => {
      const coll = collection({
        resources: [resource({ type: "articles", id: "1" }), resource({ type: "articles", id: "2" })],
      });

      const serialized = serialize(coll);

      expect(serialized).toEqual({
        data: [
          {
            type: "articles",
            id: "1",
            attributes: {},
          },
          {
            type: "articles",
            id: "2",
            attributes: {},
          },
        ],
      });
    });

    it("resource with attributes & relationships + included", () => {
      const serialized = serialize(
        {
          id: "1",
          _type: "articles",
          title: "Rails is Omakase",
          author: {
            id: "9",
            _type: "people",
            firstName: "John",
            lastName: "Doe",
          },
          relationshipNames: ["author"],
        },
        ["author"]
      );

      expect(serialized).toEqual({
        data: {
          type: "articles",
          id: "1",
          attributes: {
            title: "Rails is Omakase",
          },
          relationships: {
            author: {
              data: { type: "people", id: "9" },
            },
          },
        },
        included: [
          {
            id: "9",
            type: "people",
            attributes: {
              firstName: "John",
              lastName: "Doe",
            },
          },
        ],
      });
    });
  });
});
