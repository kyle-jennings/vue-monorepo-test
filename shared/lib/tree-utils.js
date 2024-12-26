export const flattenTree = (
  searchField,
  ignoreThis,
  stepChildrenField,
  childrenField,
) => (coll, curr) => {
  const childrenFieldName = childrenField || 'children';

  if (!ignoreThis || !ignoreThis(curr)) {
    const clone = structuredClone(curr);
    const obj = {
      ...clone,
      id: curr.id,
      value: searchField ? searchField(curr) : curr.name,
    };

    delete obj[childrenFieldName];
    delete obj[stepChildrenField];

    if (curr.parent_id) {
      obj.parent_id = curr.parent_id;
    }

    coll.push(obj);
  }

  if (curr[childrenFieldName] && Array.isArray(curr[childrenFieldName]) && curr[childrenFieldName].length > 0) {
    curr[childrenFieldName].reduce(flattenTree(searchField, ignoreThis, stepChildrenField), coll);
  }

  if (curr[stepChildrenField] && Array.isArray(curr[stepChildrenField]) && curr[stepChildrenField].length > 0) {
    curr[stepChildrenField].reduce(flattenTree(searchField, ignoreThis, stepChildrenField), coll);
  }

  return coll;
};

/**
 * Returns the path of a given node in a flattened tree, starting from the root
 * node and ending at the node itself.
 *
 * @param {Number} id
 * @param {Array} flattenedNodes
 * @returns {Array} Array of the lineage of the node with the given id
 */
export const getNodePath = (id, flattenedNodes) => {

  const node = flattenedNodes.find((n) => n.id === id);

  if (!node) {
    return [];
  }

  const nodePath = [{
    id: node.id,
    value: node.value,
  }];

  let parent = flattenedNodes.find((n) => n.id === node.parent_id);
  while (parent) {
    nodePath.unshift({ id: parent.id, value: parent.value });
    // eslint-disable-next-line no-loop-func
    parent = flattenedNodes.find((n) => n.id === parent.parent_id);
  }

  return nodePath;
}

export const coursesFieldNameFallbacks = (field) => {
  return field.display_name
};

export default {
  flattenTree,
  getNodePath,
  coursesFieldNameFallbacks,
}
