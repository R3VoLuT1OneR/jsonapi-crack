import deepClone from "lodash.clonedeep";
import { Attributes, Relationships, verifyResource, BuildResource, AttributesKeys, RelationshipsKeys } from "./index";
import type { ExtractResourceType, Resource } from "./types";
import { resource as initResource } from "./resource";
import { ResourcePropertiesMapper } from "./jsona/ResourcePropertiesMapper";

const propertyMapper = new ResourcePropertiesMapper();

export interface CloneOptions<TResource extends Resource, TAttributesKeys, TRelationshipsKeys> {
  resource: TResource;
  attributes?: TAttributesKeys;
  relationships?: TRelationshipsKeys;
}

export function clone<
  TResource extends Resource,
  TResourceType extends ExtractResourceType<TResource> = ExtractResourceType<TResource>,
  TAttributesKeys extends AttributesKeys<TResource>[] = AttributesKeys<TResource>[],
  TRelationshipsKeys extends RelationshipsKeys<TResource>[] = RelationshipsKeys<TResource>[],
  RResource extends Resource<any, any> = BuildResource<
    TResource,
    TResourceType,
    Attributes<TResource, TAttributesKeys extends undefined ? AttributesKeys<TResource> : TAttributesKeys[number]>,
    Relationships<
      TResource,
      TRelationshipsKeys extends undefined ? RelationshipsKeys<TResource> : TRelationshipsKeys[number]
    >
  >
>(options: CloneOptions<TResource, TAttributesKeys, TRelationshipsKeys>): RResource {
  const { resource } = options;
  verifyResource(resource);

  const id = resource.id;
  const type: TResourceType = resource._type as TResourceType;
  const attributes: Partial<Attributes<TResource>> = cloneAttributes(resource, options.attributes);
  const relationships: Partial<Relationships<TResource>> = cloneRelationships(resource, options.relationships);

  const cloned: RResource = initResource({ type, id, attributes, relationships });

  if (resource.links) {
    cloned.links = resource.links;
  }

  if (resource.meta) {
    cloned.meta = resource.meta;
  }

  return cloned;
}

export function cloneAttributes<
  TResource extends Resource<any, any>,
  TOnlyAttributes extends AttributesKeys<TResource>[] = AttributesKeys<TResource>[]
>(resource: TResource, attributes?: TOnlyAttributes): Partial<Attributes<TResource>> {
  const attributesNow: Attributes<TResource> = propertyMapper.getAttributes(resource);

  return Array.isArray(attributes)
    ? attributes.reduce((acc, curr) => {
        if (typeof attributesNow[curr] === "undefined") {
          const identifier = `${resource._type}:${resource.id ? resource.id : "new"}`;
          throw new Error(`Attribute "${String(curr)}" is missing on resource "${identifier}".`);
        }

        return { ...acc, [curr]: deepClone(attributesNow[curr]) };
      }, {} as Partial<Attributes<TResource>>)
    : { ...deepClone(attributesNow) };
}

export function cloneRelationships<
  TResource extends Resource<any, any>,
  TOnlyRelationships extends RelationshipsKeys<TResource>[] = RelationshipsKeys<TResource>[]
>(resource: TResource, relationships?: TOnlyRelationships): Partial<Relationships<TResource>> {
  const relationshipsNow = propertyMapper.getRelationships(resource) || ({} as Relationships<TResource>);

  return Array.isArray(relationships)
    ? relationships.reduce((acc, curr) => {
        if (typeof relationshipsNow[curr] === "undefined") {
          const identifier = `${resource._type}:${resource.id ? resource.id : "new"}`;
          throw new Error(`Relationship "${curr}" is missing on resource "${identifier}".`);
        }

        return { ...acc, [curr]: relationshipsNow[curr] };
      }, {} as Partial<Relationships<TResource>>)
    : { ...relationshipsNow };
}
