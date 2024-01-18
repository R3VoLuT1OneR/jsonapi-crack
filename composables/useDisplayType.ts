export enum Types {
  Tree = 'tree',
  TreeJsona = 'tree-jsona',
  GraphJsona = 'graph-jsona',
}

export const options = [
  {
    value: '/',
    label: 'Tree',
  },
  {
    value: '/tree-jsona',
    label: 'Tree Jsona',
  },
  {
    value: '/graph-jsona',
    label: 'Graph Jsona',
  }
]

export function useDisplayType() {
  const selectedType = useState<Types>('selectedType', () => Types.Tree)

  return {
    selectedType,
    Types,
    options
  };
}
