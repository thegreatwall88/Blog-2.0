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
async function getUserId() {
  try {
    const response = await fetch('/user-id');

    if (response.ok) {
      const data = await response.json();
      console.log(`User ID: ${data.user_id}`);
      return data.user_id;
    } else {
      console.log('User not logged in.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user ID:', error);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const userId = await getUserId(); 
    const deleteButtons = document.querySelectorAll('.delete-comment-btn');

    deleteButtons.forEach((deleteButton) => {
      deleteButton.addEventListener('click', async (event) => {
        const commentElement = event.target.closest('.comment');
        const commentId = commentElement.dataset.commentId;
        const commentUserId = commentElement.dataset.commentUserId;
        if (String(userId) === String(commentUserId)) {
          try {
            const response = await fetch(`/comment/${commentId}`, {
              method: 'DELETE',
            });

            if (response.ok) {
              commentElement.remove(); // Remove the comment from the DOM
              alert('Comment deleted successfully.');
            } else if (response.status === 403) {
              alert('You are not authorized to delete this comment.');
            } else if (response.status === 404) {
              alert('Comment not found.');
            } else {
              alert('Failed to delete the comment.');
            }
          } catch (err) {
            console.error('Error deleting comment:', err);
            alert('Error deleting comment.');
          }
        } else {
          alert("You can only delete your own comments.");
        }
      });
    });
});
