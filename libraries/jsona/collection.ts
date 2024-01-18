import { AttributesKeys, ExtractResourceType, RelationshipsKeys, Resource } from "./types";
import { verifyResource } from "./helpers";
import { clone, CloneOptions } from "./clone";

export type CollectionMeta = Record<string, unknown | never>;

export type CollectionLinks = Record<string, string> & {
  self: string;
  next?: string;
  prev?: string;
  first?: string;
  last?: string;
};

export class Collection<
  TResource extends Resource = Resource,
  TResourceType extends ExtractResourceType<TResource> = ExtractResourceType<TResource>,
  TLinks extends CollectionLinks = CollectionLinks,
  TMeta extends CollectionMeta = CollectionMeta
> extends Array<TResource> {
  _type: TResourceType;
  _links?: TLinks;
  _meta?: TMeta;

  constructor(...resources: TResource[]) {
    super(...resources);
    resources.forEach((resource, index) => this.verifyResource(resource, index));
  }

  set type(type: TResourceType) {
    if (typeof this._type !== "undefined") {
      throw new Error("Type already set");
    }

    if (typeof type !== "string") {
      throw new Error("Collection type must be a string");
    }

    this._type = type;
    this.forEach((resource, index) => this.verifyResource(resource, index));
  }

  get type(): TResourceType {
    return this._type;
  }

  set links(links: TLinks) {
    if (typeof this._links !== "undefined") {
      throw new Error("Links already set");
    }

    if (typeof links !== "object") {
      throw new Error("Collection links must be an object");
    }

    this._links = links;
  }

  get links(): TLinks {
    return this._links;
  }

  set meta(meta: TMeta) {
    if (typeof this._meta !== "undefined") {
      throw new Error("Meta already set");
    }

    if (typeof meta !== "object") {
      throw new Error("Collection meta must be an object");
    }

    this._meta = meta;
  }

  get meta(): TMeta {
    return this._meta;
  }

  findById(id: string): TResource | undefined {
    return this.find((resource) => resource.id === id);
  }

  clone<
    TCollection = Collection<TResource, TResourceType, TLinks, TMeta>,
    TAttributesKeys extends AttributesKeys<TResource>[] = AttributesKeys<TResource>[],
    TRelationshipsKeys extends RelationshipsKeys<TResource>[] = RelationshipsKeys<TResource>[]
  >(options?: Omit<CloneOptions<TResource, TAttributesKeys, TRelationshipsKeys>, "resource">): TCollection {
    const resources = this.map<TResource>((resource) =>
      clone({
        ...options,
        resource,
      })
    );

    return collection({
      type: this.type,
      resources,
      links: this.links,
      meta: this.meta,
    }) as TCollection;
  }

  pop(): TResource | undefined {
    return super.pop();
  }

  push(...items: TResource[]): number {
    items.forEach((item, index) => this.verifyResource(item, index));

    return super.push(...items);
  }

  unshift(...items: TResource[]): number {
    items.forEach((item, index) => this.verifyResource(item, index));

    return super.unshift(...items);
  }

  map<U>(callbackfn: (value: TResource, index: number, array: TResource[]) => U, thisArg?: any): U[] {
    return Array.from([...this]).map<U>(callbackfn, thisArg);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  splice(start: number, deleteCount?: number, ...items: TResource[]): TResource[] {
    const newArray = Array.from<TResource>([...this]);
    const removed = newArray.splice(start, deleteCount, ...items);

    this.length = 0;
    this.push(...newArray);

    return removed;
  }

  filter(predicate: (value: TResource, index: number, array: TResource[]) => unknown, thisArg?: any): TResource[] {
    return new Collection(...Array.from([...this]).filter(predicate, thisArg));
  }

  private verifyResource(resource: unknown, index: number) {
    try {
      verifyResource(resource, this.type);
    } catch (e) {
      throw new Error(`${e.message} at index ${index} resource`);
    }
  }
}

interface CollectionOptions<TCollection extends Collection> {
  type?: ExtractResourceType<TCollection extends Collection<infer T> ? T : never>;
  resources?: TCollection extends Collection<infer T> ? T[] : never;
  links?: TCollection["links"];
  meta?: TCollection["meta"];
}

export function collection<TCollection extends Collection = Collection>({
  type,
  resources,
  links,
  meta,
}: CollectionOptions<TCollection>): TCollection {
  const coll = new Collection(...resources) as TCollection;

  if (typeof type !== "undefined") {
    coll.type = type;
  }

  if (typeof links !== "undefined") {
    coll.links = links;
  }

  if (typeof meta !== "undefined") {
    coll.meta = meta;
  }

  return coll;
}
