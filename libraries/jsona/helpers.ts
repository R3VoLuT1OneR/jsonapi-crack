import isEqual from "lodash.isequal";
import isEqualWith from "lodash.isequalwith";

import { Collection } from "./collection";
import {Attributes, AttributesKeys, AttributesNamesTuple, Relationships, RelationshipsKeys, Resource} from "./types";
import { ResourcePropertiesMapper } from "./jsona/ResourcePropertiesMapper";

const propertyMapper = new ResourcePropertiesMapper();

export function verifyResource(resource: unknown, type?: string) {
  if (isCollection(resource, type)) {
    return verifyCollection(resource, type);
  }

  if (!isResource(resource, type)) {
    throw new Error(`Object is not proper resource${type ? ` expected type "${type}"` : ""}`);
  }
}

export function verifyCollection(collection: unknown, type?: string) {
  if (!isCollection(collection, type)) {
    throw new Error(`Object is not proper collection${type ? ` expected type "${type}"` : ""}`);
  }
}

export function isResource(resource: unknown, type?: string): boolean {
  return (
    resource !== null &&
    typeof resource === "object" &&
    "_type" in resource &&
    (typeof type === "undefined" || resource._type === type)
  );
}

export function isCollection(collection: unknown, type?: string): boolean {
  return collection instanceof Collection && (typeof type === "undefined" || collection.type === type);
}

export function isAttribute<
  TResource extends Resource = Resource,
  TAttributes extends Attributes<TResource> = Attributes<TResource>
>(resource: TResource, attr: keyof TAttributes | unknown): boolean {
  verifyResource(resource);

  const notAttributes: string[] = [
    "_type", "id", "meta", "links", "relationshipNames",
    ...(resource.relationshipNames || [])
  ];

  return !notAttributes.includes(attr as string);
}

export function resourceAttributesKeys<
  TResource extends Resource = Resource,
>(resource: TResource): AttributesNamesTuple<TResource> {
  verifyResource(resource);

  return Object.keys(resource)
    .filter((attr) => isAttribute(resource, attr)) as AttributesNamesTuple<TResource>;
}

export interface CompareOptions<TResource extends Resource> {
  attributes?: AttributesKeys<TResource>[];
  relationships?: RelationshipsKeys<TResource>[];
}

export interface CompareResult {
  equal: boolean;
  differences: CompareResultDifference[];
}

export interface CompareResultDifference {
  path: string;
  expected: unknown;
  actual: unknown;
}

export function compare<TResource extends Resource = Resource>(
  expected: TResource,
  resource: TResource,
  opts?: CompareOptions<TResource>
): CompareResult {
  const differences: CompareResultDifference[] = [];

  const expectedAttributes = propertyMapper.getAttributes(expected) || ({} as Attributes<TResource>);
  const expectedRelationships = propertyMapper.getRelationships(expected) || ({} as Relationships<TResource>);

  const resourceAttributes = propertyMapper.getAttributes(resource) as Attributes<TResource>;
  const resourceRelationships = propertyMapper.getRelationships(resource) as Relationships<TResource>;

  const compareAttributesNames = opts?.attributes || Object.keys(expectedAttributes);
  const compareRelationshipsNames = opts?.relationships || Object.keys(expectedRelationships);

  // Compare attributes
  compareAttributesNames.forEach((attr) => {
    if (!isEqual(expectedAttributes[attr], resourceAttributes[attr])) {
      differences.push({
        path: `attributes/${attr}`,
        expected: expectedAttributes[attr],
        actual: resourceAttributes[attr],
      });
    }
  });

  const relationshipsCustomizer = (objValue: Resource, othValue: Resource) => {
    if (isResource(objValue) && isResource(othValue)) {
      return objValue.id === othValue.id && objValue._type === othValue._type;
    }
  };

  compareRelationshipsNames.forEach((rel) => {
    if (!isEqualWith(expectedRelationships[rel], resourceRelationships[rel], relationshipsCustomizer)) {
      differences.push({
        path: `relationships/${rel}`,
        expected: expectedRelationships[rel],
        actual: resourceRelationships[rel],
      });
    }
  });

  return {
    equal: differences.length === 0,
    differences,
  };
}
