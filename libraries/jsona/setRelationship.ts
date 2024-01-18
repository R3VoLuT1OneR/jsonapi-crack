import { DefaultResource, Relationships, RelationshipsKeys, RelationshipValue, Resource } from "./types";
import { verifyResource } from "./helpers";
import { jsonPropertiesMapper } from "./jsona";

type RResourceType<
  TResource extends Resource<any, any>,
  TRelationshipName extends RelationshipsKeys<TResource>,
  TRelationshipValue extends RelationshipValue,
  TAppendRelationships = { [K in TRelationshipName]: TRelationshipValue }
> = TResource extends DefaultResource<TResource> ? TResource & TAppendRelationships : TResource;

export function setRelationship<
  TResource extends Resource<any, any>,
  TRelationshipName extends RelationshipsKeys<TResource> = RelationshipsKeys<TResource>,
  TRelationshipValue extends RelationshipValue = Relationships<TResource>[TRelationshipName],
  RResource extends TResource = RResourceType<TResource, TRelationshipName, TRelationshipValue>
>(resource: TResource, relation: TRelationshipName, value: TRelationshipValue): RResource {
  verifyResource(resource);
  verifyResource(value);

  jsonPropertiesMapper.setRelationships(resource, { [relation]: value });

  return resource as RResource;
}
