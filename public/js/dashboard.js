function openNewPostModal() {
    document.getElementById('new-post-modal').style.display = 'block';
  }
  
  function closeNewPostModal() {
    document.getElementById('new-post-modal').style.display = 'none';
  }
let currentPostId = '';
function openEditModal(postId, postTitle, postContent) {
  document.getElementById('edit-post-form').action = `/api/posts/${postId}`;
  currentPostId = postId;
  document.getElementById('edit-post-title').value = postTitle;
  document.getElementById('edit-post-content').value = postContent;
  document.getElementById('edit-post-modal').style.display = 'block';
}

function closeEditModal() {
  document.getElementById('edit-post-modal').style.display = 'none';
}

async function deletePost() {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await fetch(`/api/posts/${currentPostId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          window.location.reload();
        } else {
          const error = await response.json();
          alert(`Error: ${error.message}`);
        }
      } catch (err) {
        alert(`An unexpected error occurred: ${err.message}`);
      }
    }
  }

window.onclick = function(event) {
  if (event.target === document.getElementById('edit-post-modal')) {
    closeEditModal();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const editPostForm = document.getElementById('edit-post-form');
  if (editPostForm) {
    editPostForm.addEventListener('submit', async function(event) {
      event.preventDefault();
      
      const formData = new FormData(editPostForm);
      const data = {
        title: formData.get('title'),
        content: formData.get('content')
      };
      
      try {
        const response = await fetch(editPostForm.action, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        
        if (response.ok) {
          window.location.reload();
        } else {
          const error = await response.json();
          alert(`Error: ${error.message}`);
        }
      } catch (err) {
        alert(`An unexpected error occurred: ${err.message}`);
      }
    });
  }
});

async function addPost(event) {
    event.preventDefault();
  
    const form = event.target;
    const formData = new FormData(form);
    const data = {
      title: formData.get('title'),
      content: formData.get('content')
    };
  
    try {
      const response = await fetch('/api/posts/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
  
      if (response.ok) {
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (err) {
      alert(`An unexpected error occurred: ${err.message}`);
    }
  }
  