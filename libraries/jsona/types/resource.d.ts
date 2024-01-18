import { TupleOfKeys, UnionToTuple } from "./helpers";
import { Collection } from "../collection";

export interface Resource<
  TResourceType extends ResourceType = ResourceType,
  TRelationshipsNames extends string[] = string[]
> {
  readonly _type: TResourceType;
  readonly relationshipNames: TRelationshipsNames;
  readonly id?: string;

  links?: {
    self: string;
    [prop: string]: unknown | never;
  };

  meta?: Record<string, unknown>;
}

export type Attributes<
  TResource extends Resource<any, any>,
  TAttributesKeys extends AttributesKeys<TResource> = AttributesKeys<TResource>
> = TResource extends DefaultResource<TResource>
  ? Record<TAttributesKeys, unknown>
  : Pick<Required<TResource>, TAttributesKeys>;

export type AttributesKeys<TResource extends Resource> = Exclude<
  keyof Required<TResource>,
  InternalProps | RelationshipsKeys<TResource>
>;

export type AttributesNamesTuple<TResource extends Resource> = UnionToTuple<AttributesKeys<TResource>>;

export type Relationships<
  TResource extends Resource<any, any>,
  TRelationshipsKeys extends RelationshipsKeys<TResource> = RelationshipsKeys<TResource>
> = TResource extends DefaultResource<TResource>
  ? Record<TRelationshipsKeys, RelationshipValue>
  : Pick<Required<TResource>, TRelationshipsKeys>;

export type RelationshipsKeys<TResource extends Resource<any, any>> = Required<TResource>["relationshipNames"][number];

export type RelationshipsNamesTuple<TResource extends Resource> = UnionToTuple<RelationshipsKeys<TResource>>;

export type BuildResource<
  TResource extends Resource,
  TResourceType extends ExtractResourceType<TResource> = ExtractResourceType<TResource>,
  TResourceAttributes extends Record<string, unknown> = Record<string, never>,
  TResourceRelationships extends Record<string, unknown> = Record<string, never>
> = TResource extends DefaultResource<TResource>
  ? Resource<TResourceType, RelationshipsToNamesTuple<TResourceRelationships>> &
      TResourceAttributes &
      TResourceRelationships
  : TResource;

export type InternalProps = keyof Resource<any, any>;

export type DefaultResource<TResource extends Resource> = TResource extends Resource
  ? Resource extends TResource
    ? Resource
    : never
  : Resource;

export type RelationshipValue = Resource | Collection | null;

export type ResourceType = string;

export type ExtractResourceType<TResource extends Resource<any, any>> = TResource extends Resource<infer Type>
  ? Type
  : ResourceType;

export type RelationshipsToNamesTuple<T extends Record<string, unknown>> = TupleOfKeys<T> & string[];
