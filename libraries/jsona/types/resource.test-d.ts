import { expectAssignable, expectNotAssignable, expectNotType, expectType } from "tsd";

import {
  Attributes,
  AttributesKeys,
  AttributesNamesTuple,
  BuildResource,
  create,
  Relationships,
  RelationshipsNamesTuple,
  Resource,
} from "../index";
import type { RelationshipsKeys } from "./resource";
import { Article, People } from "../fixtures";
import { TupleOfKeys } from "./helpers";
import { resource } from "../resource";

const notTyped = create({
  type: "notTyped",
  attributes: {
    attr1: "test",
    attr2: "test",
  },
  relationships: {
    rel: resource<People>({ type: "people", id: "1" }),
    rel2: resource<Article>({ type: "articles", id: "1" }),
  },
});

/* ------------------------ Relationships ------------------------ */

type DArticleRelationshipsKeys = RelationshipsKeys<Article>;
let EArticleRelationshipsKeys: "author" | "editor";

expectType<DArticleRelationshipsKeys>(EArticleRelationshipsKeys);
expectAssignable<DArticleRelationshipsKeys>("author");
expectAssignable<DArticleRelationshipsKeys>("editor");

expectNotAssignable<DArticleRelationshipsKeys>("title");
expectNotAssignable<DArticleRelationshipsKeys>("_type");
expectNotAssignable<DArticleRelationshipsKeys>("relationshipNames");
expectNotAssignable<DArticleRelationshipsKeys>("id");

type DArticleRelationshipsNamesTuple = RelationshipsNamesTuple<Article>;

expectAssignable<DArticleRelationshipsNamesTuple>(["author", "editor"]);

type DArticleRelationships = Relationships<Article>;

expectType<DArticleRelationships>({
  author: {} as People | null,
  editor: {} as People | null,
});

type DNotTypedRelationshipsKeys = RelationshipsKeys<typeof notTyped>;
let ENotTypedRelationshipsKeys: "rel" | "rel2";

expectType<DNotTypedRelationshipsKeys>(ENotTypedRelationshipsKeys);
expectAssignable<DNotTypedRelationshipsKeys>("rel");
expectAssignable<DNotTypedRelationshipsKeys>("rel2");

expectNotAssignable<DNotTypedRelationshipsKeys>("attr1");
expectNotAssignable<DNotTypedRelationshipsKeys>("attr2");
expectNotAssignable<DNotTypedRelationshipsKeys>("_type");
expectNotAssignable<DNotTypedRelationshipsKeys>("relationshipNames");
expectNotAssignable<DNotTypedRelationshipsKeys>("id");

type DNotTypedRelationshipsNamesTuple = RelationshipsNamesTuple<typeof notTyped>;

expectAssignable<DNotTypedRelationshipsNamesTuple>(["rel", "rel2"]);

type DNotTypedRelationships = Relationships<typeof notTyped>;

expectAssignable<DNotTypedRelationships>({
  rel: {} as People | null,
  rel2: {} as Article | null,
});

/* ------------------------ Attributes ------------------------ */

type DArticleAttributesKeys = AttributesKeys<Article>;
let EArticleAttributesKeys: "title";

expectType<DArticleAttributesKeys>(EArticleAttributesKeys);

type DArticleAttributesNamesTuple = AttributesNamesTuple<Article>;

expectType<DArticleAttributesNamesTuple>(["title"]);

type DArticleAttributes = Attributes<Article>;

expectType<DArticleAttributes>({
  title: "",
});

type DNotTypedAttributesKeys = AttributesKeys<typeof notTyped>;
let DNotTypedAttributesKeys: "attr1" | "attr2";

expectType<DNotTypedAttributesKeys>(DNotTypedAttributesKeys);

type DNotTypedAttributesNamesTuple = AttributesNamesTuple<typeof notTyped>;

expectType<DNotTypedAttributesNamesTuple>(["attr1", "attr2"]);

type DNotTypedAttributes = Attributes<typeof notTyped>;

expectType<DNotTypedAttributes>({
  attr1: "",
  attr2: "",
});

// type DNotTypedAttributesNamesTuple = AttributesNamesTuple<typeof notTyped>;
//
// expectType<DNotTypedAttributesNamesTuple>(["obj", "name", "description"]);
//
// // export type ArticleKeys<TResource extends Resource> =
// //   Exclude<keyof Required<TResource>, InternalProps | RelationshipsKeys<TResource>>;
// type DNotTypedAttributesKeys = AttributesKeys<typeof notTyped>;
//
// // type DNotTypedAttributesKeys = Exclude<keyof Required<typeof notTyped>, RelationshipsKeys<typeof notTyped>>;
// // type DNotTypedAttributesKeys = keyof Required<typeof notTyped>;
//
// let ENotTypedAttributesKeys: "name" | "obj" | "description";
//
// expectType<DNotTypedAttributesKeys>(ENotTypedAttributesKeys);

/* ------------------------ Helpers ------------------------ */

type DBuildResource = BuildResource<
  Resource,
  "notTyped",
  Partial<Attributes<Resource>>,
  Partial<Relationships<Resource>>
>;
let EBuildResource: any;

expectNotType<DBuildResource>(EBuildResource);

type DRelationshipsToTypes = TupleOfKeys<{
  author: People;
  editor: People;
}>;
let ERelationshipsToTypes: ["author", "editor"];

expectType<DRelationshipsToTypes>(ERelationshipsToTypes);
