import { Jsona as JsonaBase } from "jsona";
import { ResourcePropertiesMapper } from "./ResourcePropertiesMapper";
import { JsonPropertiesMapper } from "./JsonPropertiesMapper";
import { JsonDeserializer } from "./JsonDeserializer";

export const modelPropertiesMapper = new ResourcePropertiesMapper();
export const jsonPropertiesMapper = new JsonPropertiesMapper();

export class LocalJsona extends JsonaBase {
  public modelPropertiesMapper = new ResourcePropertiesMapper();
  public jsonPropertiesMapper = new JsonPropertiesMapper();
}

export const Jsona = new LocalJsona({
  modelPropertiesMapper,
  jsonPropertiesMapper,
  JsonDeserializer,
});
