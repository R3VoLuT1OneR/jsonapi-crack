import { JsonDeserializer as JsonaJsonDeserialized } from "jsona";
import { TJsonaModel, TJsonApiData, TJsonaRelationships } from "jsona/lib/JsonaTypes";
import { isResource } from "../helpers";
import { Resource } from "../types";
import { collection, Collection, CollectionLinks, CollectionMeta } from "../collection";

export class JsonDeserializer extends JsonaJsonDeserialized {
  build(): TJsonaModel | Array<TJsonaModel> {
    const { data } = this.body;

    if (data) {
      if (Array.isArray(data)) {
        const { meta, links } = this.body;
        const resources = data
          .filter((item) => !!item)
          .map((item) => this.buildModelByData(item))
          .filter((item) => isResource(item)) as Resource[];

        return this.createCollection(resources, meta, links);
      }

      return this.buildModelByData(data);
    }
  }

  buildRelationsByData(data: TJsonApiData, model: TJsonaModel): TJsonaRelationships | null {
    const relationships = super.buildRelationsByData(data, model);

    // Convert array into collection.
    if (relationships) {
      Object.keys(relationships).forEach((key) => {
        const relationship = relationships[key];

        if (Array.isArray(relationship)) {
          relationships[key] = this.createCollection(relationship.filter((item) => isResource(item)));
        }
      });
    }

    return relationships;
  }

  createCollection(resources: Resource[], meta?: CollectionMeta, links?: CollectionLinks): Collection {
    return collection({
      resources,
      meta,
      links,
    });
  }
}
