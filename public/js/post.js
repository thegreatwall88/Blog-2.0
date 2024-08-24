document.addEventListener('DOMContentLoaded', () => {
  const addCommentForm = document.getElementById('add-comment-form');
  const postId = addCommentForm.dataset.postId;


  addCommentForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const comment = event.target.comment.value.trim();

    try {
      const response = await fetch(`/post/${postId}/comment`, {
        method: 'POST',
        body: JSON.stringify({
          content: comment,
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const { user, content } = await response.json();
        location.reload();
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
