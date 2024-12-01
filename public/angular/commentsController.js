angular.module('commentsApp', [])
  .controller('commentsController', function($scope, $http) {
    const pathParts = window.location.pathname.split('/');
    const season = pathParts[2];
    const mediaId = pathParts[3];

    $scope.comments = [];
    $scope.newComment = '';
    $scope.userId = null; // Ambil userId dari session di server jika memungkinkan

    // Fetch existing comments
    $http.get(`/api/trends/${season}/${mediaId}/comments`)
      .then(function(response) {
        $scope.comments = response.data.comments;
        $scope.userId = response.data.userId; // Ambil userId dari server
      })
      .catch(function(error) {
        console.error('Error fetching comments:', error);
      });

    // Add a new comment
    $scope.addComment = function() {
      if ($scope.newComment.trim()) {
        $http.post(`/api/trends/${season}/${mediaId}/comments`, {
          content: $scope.newComment
        })
        .then(function(response) {
          $scope.comments.unshift(response.data.comment);
          $scope.newComment = '';
        })
        .catch(function(error) {
          console.error('Error posting comment:', error);
          alert('Sign in first to comment');
        });
      } else {
        alert('Comment content cannot be empty.');
      }
    };

    // Update a comment
    $scope.updateComment = function(comment) {
      if (comment.editContent.trim()) {
        $http.put(`/api/trends/${season}/${mediaId}/comments/${comment.id}`, {
          content: comment.editContent
        })
        .then(function(response) {
          comment.content = comment.editContent;
          comment.isEditing = false;
        })
        .catch(function(error) {
          console.error('Error updating comment:', error);
        });
      } else {
        alert('Comment content cannot be empty.');
      }
    };

    // Delete a comment
    $scope.deleteComment = function(commentId) {
      if (confirm('Are you sure you want to delete this comment?')) {
        $http.delete(`/api/trends/${season}/${mediaId}/comments/${commentId}`)
        .then(function(response) {
          $scope.comments = $scope.comments.filter(comment => comment.id !== commentId);
        })
        .catch(function(error) {
          console.error('Error deleting comment:', error);
        });
      }
    };

    // Check if the current user is the owner of the comment
    $scope.isOwner = function(comment) {
      return comment.user_id === $scope.userId; // Hanya tampilkan opsi jika user adalah pemilik
    };
  });