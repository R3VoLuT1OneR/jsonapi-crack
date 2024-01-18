
export function useSidebar() {
  const sidebar = useState<boolean>('sidebar', () => true)

  const toggleSidebar = () => {
    sidebar.value = !sidebar.value
  }
  return { sidebar, toggleSidebar }
}
