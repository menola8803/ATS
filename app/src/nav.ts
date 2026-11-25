export type Route =
  | { name: 'tabs' }
  | { name: 'save' }
  | { name: 'compare' }
  | { name: 'picker' }
  | { name: 'settings' }
  | { name: 'manual' }
  | { name: 'privacy' }
  | { name: 'uninstall' }
  | { name: 'update'; auto?: boolean };
