import { expectAssignable } from "tsd";
import { Article, People } from "../fixtures";
import { RelationshipsToNamesTuple } from "./resource";
import { TupleOfKeys } from "./helpers";

type DRelationshipsToKeysTuple = RelationshipsToNamesTuple<{
  rel: Article;
  rel2: People;
}>;

expectAssignable<DRelationshipsToKeysTuple>(["rel", "rel2"]);

type DTupleOfKeys = TupleOfKeys<{
  rel: string;
  rel2: number;
}>;

expectAssignable<DTupleOfKeys>(["rel", "rel2"]);
