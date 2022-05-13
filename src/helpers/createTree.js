function createTree(data) {
  let comments = JSON.parse(JSON.stringify(data));
  let map = {};
  let parents = [];

  for (let i = 0; i < comments.length; i++) {
    map[comments[i]._id] = i;
    comments[i].children = [];
  }

  for (let i = 0; i < comments.length; i++) {
    let node = comments[i];

    if (
      !(node.followedCommentID === null || node.followedCommentID === undefined)
    ) {
      if (comments[map[node.followedCommentID]]) {
        comments[map[node.followedCommentID]].children.push(node);
      }
    } else {
      parents.push(node);
    }
  }
  return parents;
}

export { createTree };
