import { jsonPropertiesMapper } from "./jsona";
import { Attributes, ExtractResourceType, Relationships, Resource, BuildResource } from "./types";

export interface CreateOptions<TResourceType, TAttributes, TRelationships> {
  type: TResourceType;
  attributes?: TAttributes;
  relationships?: TRelationships;
}

export function create<
  TResource extends Resource = Resource,
  TResourceType extends ExtractResourceType<TResource> = ExtractResourceType<TResource>,
  TAttributes extends Partial<Attributes<TResource>> = Partial<Attributes<TResource>>,
  TRelationships extends Partial<Relationships<TResource>> = Partial<Relationships<TResource>>,
  RResource extends Resource<any, any> = BuildResource<TResource, TResourceType, TAttributes, TRelationships>
>(options: CreateOptions<TResourceType, TAttributes, TRelationships>): RResource {
  if (typeof options.type !== "string") {
    throw new Error("Type must be a string");
  }

  const resource = { _type: options.type } as unknown as RResource;

  jsonPropertiesMapper.setAttributes(resource, options.attributes || {});
  jsonPropertiesMapper.setRelationships(resource, options.relationships || {});

  return resource;
}
