import { JsonPropertiesMapper as DefaultJsonPropertiesMapper } from "jsona";
import { ExtractResourceType, Resource, ResourceType } from "../index";
export class JsonPropertiesMapper extends DefaultJsonPropertiesMapper {
  createModel<TResource extends Resource = Resource, TType extends ResourceType = ExtractResourceType<TResource>>(
    type: TType
  ): TResource {
    return {
      _type: type,
    } as unknown as TResource;
  }
}
