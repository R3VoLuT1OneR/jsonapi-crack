import dagre from 'dagre'
import { Position, useVueFlow } from '@vue-flow/core'

export function useLayout() {
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))

  const { getEdges, getNodesInitialized, fitView } = useVueFlow()

  const onLayout = () => {
    dagreGraph.setGraph({
      rankdir: 'LR',
    })

    getNodesInitialized.value.forEach((node) => {
      dagreGraph.setNode(node.id, { width: node.dimensions.width, height: node.dimensions.height })
    })

    getEdges.value.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target)
    })

    dagre.layout(dagreGraph)

    getNodesInitialized.value.forEach((node) => {
      const nodeWithPosition = dagreGraph.node(node.id)

      // const hasPredecessors = dagreGraph.predecessors(node.id)?.length
      // node.data = { ...node.data, hasPredecessors }

      // node.targetPosition = isHorizontal ? Position.Left : Position.Top
      // node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom
      node.position = { x: nodeWithPosition.x, y: nodeWithPosition.y }
      // node.style = {
      //   opacity: 1,
      // }
    })

    // fitView()
  }

  watch([getNodesInitialized, getEdges, () => getNodesInitialized.value.length, () => getEdges.value.length], () => {
    onLayout()
  })
}
