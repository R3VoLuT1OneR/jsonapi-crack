import { Resource } from "./types";
import { Jsona } from "./jsona";
import { Collection, CollectionLinks, CollectionMeta } from "./collection";

export interface JSONAPIBody {
  data?: object | object[];
  included?: object[];
  meta?: CollectionMeta;
  links?: CollectionLinks;
}

export function deserialize<T extends Resource>(body: JSONAPIBody): T;
export function deserialize<T extends Collection>(body: JSONAPIBody): T;

export function deserialize<
  T extends Resource | Collection,
  TResult = T extends Resource ? T : T extends Collection ? T : never
>(body: JSONAPIBody): TResult {
  const resource = Jsona.deserialize(body as any);

  if (Array.isArray(resource)) {
    return resource as TResult extends Collection ? TResult : never;
  }

  return resource as TResult extends Resource ? TResult : never;
}
