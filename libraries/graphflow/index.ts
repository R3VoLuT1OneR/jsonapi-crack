import type {Elements, Node, XYPosition} from "@vue-flow/core";
import type {Relationships, Resource} from "~/libraries/jsona";
import {Collection, isCollection, resourceAttributesKeys} from "~/libraries/jsona";

const config = {
  padding: 10,
  resource: {
    width: 224,
    height: 64,

    rightPadding: 64,

    relationships: {
      width: 400,
      height: 200,
    },
    links: {
      width: 224,
      height: 64,
    },
    meta: {
      width: 400,
      height: 200,
    },
  },
}

const firstPosition: XYPosition = { x: config.padding, y: config.padding };

export function buildElementsFromResource(resource: Resource): Elements {
  const elements: Elements = []

  const resourceNode = buildResourceNode(resource);
  elements.push(resourceNode);

  if (resourceAttributesKeys(resource).length > 0) {
    const resourceAttributesNode = buildResourceAttributesNode(resourceNode);

    elements.push({
      id: `edge-${resourceAttributesNode.id}`,
      source: resourceNode.id,
      target: resourceAttributesNode.id,
      label: 'attributes',
    })

    elements.push(resourceAttributesNode);
  }

  if ((resource.relationshipNames || []).length > 0) {
    const resourceRelationshipsNode = buildResourceRelationshipsNode(resourceNode);

    elements.push({
      id: `edge-${resourceRelationshipsNode.id}`,
      source: resourceNode.id,
      target: resourceRelationshipsNode.id,
      label: 'relationships',
    })

    elements.push(resourceRelationshipsNode);

    (resource.relationshipNames || []).forEach((relationshipName) => {
      const relationship: Resource|Collection|null = resource[relationshipName];

      if (isCollection(relationship)) {
        const nodeRelationship = buildRelationshipNode(
          resourceNode,
          relationshipName,
          relationship
        );

        elements.push({
          id: `edge-${nodeRelationship.id}`,
          source: resourceRelationshipsNode.id,
          target: nodeRelationship.id,
          label: relationshipName,
        })

        elements.push(nodeRelationship);

        (relationship as Collection).forEach((relResource) => {
          const relResElements = buildElementsFromResource(relResource, {})
          const relResNode = relResElements
            .find((element) => element.type === 'resource');

          if (relResNode) {
            elements.push({
              id: `edge-${relResNode.id}`,
              source: nodeRelationship.id,
              target: relResNode.id,
              label: 'resource',
            })
          }

          relResElements.forEach((relResourceNode) => {
            elements.push(relResourceNode);
          });
        });
      } else if (relationship) {
        const relResElements = buildElementsFromResource(relationship as Resource, {})
        const relResNode = relResElements
          .find((element) => element.type === 'resource');

        if (relResNode) {
          elements.push({
            id: `edge-${relResNode.id}`,
            source: resourceRelationshipsNode.id,
            target: relResNode.id,
            label: relationshipName,
          })
        }

        relResElements.forEach((relResourceNode) => {
          elements.push(relResourceNode);
        });

      } else {
        const nodeRelationship = buildRelationshipNode(
          resourceNode,
          relationshipName,
          relationship
        );

        elements.push({
          id: `edge-${nodeRelationship.id}`,
          source: resourceRelationshipsNode.id,
          target: nodeRelationship.id,
          label: relationshipName,
        })

        elements.push(nodeRelationship);
      }
    })
  }

  if (resource.links) {
    const resourceLinksNode = buildResourceLinksNode(resourceNode, resource.links);

    elements.push({
      id: `edge-${resourceLinksNode.id}`,
      source: resourceNode.id,
      target: resourceLinksNode.id,
      label: 'links',
    })

    elements.push(resourceLinksNode);
  }

  if (resource.meta) {
    const resourceMetaNode = buildResourceMetaNode(resourceNode);

    elements.push({
      id: `edge-${resourceMetaNode.id}`,
      source: resourceNode.id,
      target: resourceMetaNode.id,
      label: 'meta',
    })

    elements.push(resourceMetaNode);
  }

  return elements;
}

export function buildElementsFromCollection(collection: Collection): Elements {
  const elements: Elements = []

  collection.forEach((resource) => {
    const resourceElements = buildElementsFromResource(resource);

    resourceElements.forEach((element) => {
      elements.push(element);
    })
  })

  return elements;
}

// const graphElements = ref<Elements>([])
//
// watch(jsona, (resource: Resource|Collection) => {
//   const elements: Elements = []
//
//   if (resource) {
//     (Array.isArray(resource) ? resource : [resource]).forEach((resource) => {
//       appendResource(elements, resource)
//     })
//   }
//
//   graphElements.value = elements;
// }, {
//   immediate: true
// })

type NodeResource<TResource extends Resource> = Node<TResource, {}, 'resource'>;
type NodeResourceAttributes<TResource extends Resource> = Node<TResource, {}, 'resource-attributes'>;
type NodeResourceRelationships<TResource extends Resource> = Node<TResource, {}, 'resource-relationships'>;
type NodeResourceLinks = Node<Record<string, unknown>, {}, 'resource-links'>;
type NodeResourceMeta = Node<Record<string, unknown>, {}, 'resource-meta'>;

type NodeRelationship<TResource extends Resource|Collection|null> = Node<TResource, {}, 'relationship'>;

function buildResourceNode<
  TResource extends Resource,
>(resource: TResource): NodeResource<TResource> {
  const id = `node-${resource._type}-${resource.id}`;

  return {
    id,
    type: 'resource',
    position: {
      x: 0,
      y: 0
    },
    data: resource,
  }
}

function buildResourceAttributesNode<
  TResource extends Resource,
  TNodeResource extends NodeResource<TResource>,
>(resourceNode: TNodeResource): NodeResourceAttributes<TResource> {
  const id = `${resourceNode.id}-attributes`;

  return {
    id,
    type: 'resource-attributes',
    position: {
      ...resourceNode.position
    },
    parentNode: resourceNode.id,
    data: resourceNode.data
  }
}

function buildResourceLinksNode<
  TNodeResource extends NodeResource<Resource>,
>(resourceNode: TNodeResource, links: Record<string, unknown>): NodeResourceLinks {
  const id = `${resourceNode.id}-links`;

  return {
    id,
    type: 'resource-links',
    position: { ...resourceNode.position },
    parentNode: resourceNode.id,
    data: links
  }
}

function buildResourceMetaNode<
  TNodeResource extends NodeResource<Resource>,
>(resourceNode: TNodeResource): NodeResourceMeta {
  const id = `${resourceNode.id}-meta`;

  return {
    id,
    type: 'resource-meta',
    position: {
      ...resourceNode.position
    },
    parentNode: resourceNode.id,
    data: resourceNode.data?.meta
  }
}

function buildResourceRelationshipsNode<
  TResource extends Resource,
  TNodeResource extends NodeResource<TResource>,
>(resourceNode: TNodeResource): NodeResourceRelationships<TResource> {
  const id = `${resourceNode.id}-relationships`;

  return {
    id,
    type: 'resource-relationships',
    position: {
      ...resourceNode.position
    },
    parentNode: resourceNode.id,
    data: resourceNode.data
  }
}

function buildRelationshipNode<
  TResource extends Resource,
  TNodeResource extends NodeResource<TResource>,
  TRelationship extends Resource|Collection|null = Resource |Collection|null,
>(resourceNode: TNodeResource, relationshipName: string, relationship: TRelationship): NodeRelationship<TRelationship> {
  const id = `${resourceNode.id}-${relationshipName}`;

  return {
    id,
    type: 'relationship',
    position: {
      ...resourceNode.position
    },
    parentNode: resourceNode.id,
    data: relationship
  }
}

// const appendResource = (elements: Elements, resource: Resource) => {
//   const resourceId = `node-${type}-${id}`;
//
//   const data = {
//     ...resource
//   }
//
//   delete data.links;
//
//   elements.push({
//     id: resourceId,
//     type: 'resource',
//     position: { x: 250, y: 5 },
//     data,
//   })
//
//   appendLinks(elements, links, resourceId)
// }
//
// const appendLinks = (elements: Elements, links: any, source: string) => {
//   if (!links) {
//     return;
//   }
//
//   const id = `node-${source}-links`;
//
//   elements.push({
//     id,
//     type: 'links',
//     position: { x: 250, y: 5 },
//     data: {
//       links
//     }
//   })
//
//   elements.push({
//     id: `edge-${source}-links`,
//     source,
//     target: id
//   })
// }

//
// const elements = ref<Elements>([
//   // nodes
//
//   // an input node, specified by using `type: 'input'`
//   { id: '1', type: 'input', label: 'Node 1', position: { x: 250, y: 5 } },
//
//   // default node, you can omit `type: 'default'` as it's the fallback type
//   { id: '2', label: 'Node 2', position: { x: 100, y: 100 }, },
//
//   // An output node, specified by using `type: 'output'`
//   { id: '3', type: 'output', label: 'Node 3', position: { x: 400, y: 200 } },
//
//   // A custom node, specified by using a custom type name
//   // we choose `type: 'special'` for this example
//   {
//     id: '4',
//     type: 'special',
//     label: 'Node 4',
//     position: { x: 400, y: 200 },
//
//     // pass custom data to the node
//     data: {
//       // you can pass any data you want to the node
//       hello: 'world',
//     },
//   },
//
//   // edges
//
//   // simple default bezier edge
//   // consists of an id, source-id and target-id
//   { id: 'e1-3', source: '1', target: '3' },
//
//   // an animated edge, specified by using `animated: true`
//   { id: 'e1-2', source: '1', target: '2', animated: true },
//
//   // a custom edge, specified by using a custom type name
//   // we choose `type: 'special'` for this example
//   {
//     id: 'e1-4',
//     type: 'special',
//     source: '1',
//     target: '4',
//
//     // pass custom data to the edge
//     data: {
//       // You can pass any data you want to the edge
//       hello: 'world',
//     }
//   },
// ])
