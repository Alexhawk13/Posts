import store from '../store';

async function getAuthorsOfPosts(posts) {
  return await Promise.all(getUsers(posts));
}

async function getPostsComments(posts) {
  return await Promise.all(getComments(posts));
}

function getUsers(posts) {
  return posts.map(async (post) => {
    if (!post.postedBy) {
      return null;
    }
    return await store.dispatch('fetchAuthor', post.postedBy);
  });
}

function getComments(posts) {
  return posts.map(async (post) => {
    return await store.dispatch('fetchComments', post._id);
  });
}

function mergeComments(posts, comments) {
  return posts.map((post, index) => ({
    ...post,
    ...{
      comments: comments[index],
    },
  }));
}

function mergeData(posts, users) {
  return posts.map((post, index) => ({
    ...post,
    ...{
      author: users[index],
    },
  }));
}

export { getAuthorsOfPosts, mergeData, getPostsComments, mergeComments };
