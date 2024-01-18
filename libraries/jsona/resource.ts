import { BuildResource, ExtractResourceType, Resource } from "./types";
import { Attributes, Relationships, create } from "./index";

export interface ResourceOptions<TResourceType, TAttributes, TRelationships> {
  id: string;
  type: TResourceType;
  attributes?: TAttributes;
  relationships?: TRelationships;
}

export function resource<
  TResource extends Resource<any, any>,
  TResourceType extends ExtractResourceType<TResource> = ExtractResourceType<TResource>,
  TAttributes extends Partial<Attributes<TResource>> = Partial<Attributes<TResource>>,
  TRelationships extends Partial<Relationships<TResource>> = Partial<Relationships<TResource>>,
  RResource extends Resource<any, any> = BuildResource<TResource, TResourceType, TAttributes, TRelationships>
>(options: ResourceOptions<TResourceType, TAttributes, TRelationships>): RResource {
  const resource: RResource = create(options);

  if (typeof options.id !== "undefined") {
    Object.defineProperty(resource, "id", { value: String(options.id) });
  }

  return resource;
}
