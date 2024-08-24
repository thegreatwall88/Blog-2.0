document.addEventListener('DOMContentLoaded', () => {
  const commentsList = document.getElementById('comments-list');
  const addCommentForm = document.getElementById('add-comment-form');
  const postId = addCommentForm.dataset.postId;
  const userId = addCommentForm.dataset.userId;
  function addCommentToList(username, comment) {
    const newComment = document.createElement('li');
    newComment.innerHTML = `<strong>${username}</strong>: ${comment}`;
    commentsList.appendChild(newComment);
  }

  addCommentForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const comment = event.target.comment.value.trim();
    console.log(comment);
    try {
      const response = await fetch(`/post/${postId}/comment`, {
        method: 'POST',
        body: JSON.stringify({
          content: comment,
          userId: userId, 
          postId: postId  
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const { user, content } = await response.json();
        addCommentToList(user.name, content);
        addCommentForm.reset(); 
      } else {
        alert('Failed to post comment.');
      }
    } catch (err) {
      console.error('Failed to post comment.', err);
      alert('Failed to post comment.');
    }
  });

});
