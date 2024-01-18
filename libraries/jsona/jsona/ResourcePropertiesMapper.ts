import { ModelPropertiesMapper as DefaultModelPropertiesMapper } from "jsona";
import { Resource, Attributes, InternalProps, Relationships, ExtractResourceType } from "../index";

export class ResourcePropertiesMapper extends DefaultModelPropertiesMapper {
  getType<
    TResource extends Resource,
    TResourceType extends ExtractResourceType<TResource> = ExtractResourceType<TResource>
  >(resource: TResource): TResourceType {
    if (!resource._type) {
      throw new Error("Provided resource missing type.");
    }

    return resource._type as TResourceType;
  }

  getAttributes<TResource extends Resource>(resource: TResource): Attributes<TResource> {
    const exceptProps: Array<keyof InternalProps | string> = [
      "id",
      "_type",
      "links",
      "meta",
      "relationshipNames",
      ...(resource["relationshipNames"] || []),
    ];

    return Object.keys(resource)
      .filter((k) => !exceptProps.includes(k))
      .reduce((acc, curr) => ({ ...acc, [curr]: resource[curr] }), {} as Attributes<TResource>);
  }

  getRelationships<TResource extends Resource>(resource: TResource): Relationships<TResource> {
    return super.getRelationships(resource) as Relationships<TResource>;
  }
}
