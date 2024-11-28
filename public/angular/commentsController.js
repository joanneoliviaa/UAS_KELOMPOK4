angular.module('commentsApp', [])
  .controller('commentsController', function($scope, $http) {
    const pathParts = window.location.pathname.split('/');
    const season = pathParts[2];
    const mediaId = pathParts[3];

    $scope.comments = [];
    $scope.newComment = '';
    $scope.userId = null;

    // Fetch existing comments
    $http.get(`/api/trends/${season}/${mediaId}/comments`)
      .then(function(response) {
        $scope.comments = response.data.comments;
      })
      .catch(function(error) {
        console.error('Error fetching comments:', error);
      });

    // Add a new comment
    $scope.addComment = function() {
      if ($scope.newComment.trim()) {
        $http.post(`/api/trends/${season}/${mediaId}/comments`, {
          content: $scope.newComment // Only send content
        })
        .then(function(response) {
          // If successful, add the new comment to the comments array
          $scope.comments.unshift(response.data.comment);
          $scope.newComment = ''; // Clear the input after posting
        })
        .catch(function(error) {
          console.error('Error posting comment:', error);
          alert('Failed to post the comment.');
        });
      } else {
        alert('Comment content cannot be empty.');
      }
    };
  });