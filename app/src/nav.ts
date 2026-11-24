export type Route =
  | { name: 'tabs' }
  | { name: 'save' }
  | { name: 'compare' }
  | { name: 'manual' }
  | { name: 'privacy' }
  | { name: 'update'; auto?: boolean };
