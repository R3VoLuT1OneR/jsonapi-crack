import type {
  TJsonaDenormalizedIncludeNames,
  TJsonaNormalizedIncludeNamesTree,
  TJsonApiBody,
} from "jsona/lib/JsonaTypes";
import { Resource } from "./types";
import { Jsona } from "./jsona";
import { Collection } from "./collection";

export function serialize<
  TResource extends Resource | Collection,
  TIncludeNames extends string[] | TJsonaNormalizedIncludeNamesTree =
    | TJsonaDenormalizedIncludeNames
    | TJsonaNormalizedIncludeNamesTree
>(stuff: TResource, includeNames?: TIncludeNames): TJsonApiBody {
  return Jsona.serialize({ stuff, includeNames });
}
