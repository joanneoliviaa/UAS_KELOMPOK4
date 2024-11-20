angular.module('commentsApp', [])
  .controller('commentsController', function($scope, $http) {
    const pathParts = window.location.pathname.split('/');
    const season = pathParts[2];  
    const mediaId = pathParts[3]; 

    $http.get('/auth/check-login').then(function(response) {
      if (response.data.loggedIn) {
        $scope.isLoggedIn = true;
        $scope.userId = response.data.userId;  
        $scope.userName = response.data.userName;  
      } else {
        $scope.isLoggedIn = false;
      }
    });

    $http.get(`/api/trends/${season}/${mediaId}/comments`)
      .then(function(response) {
        $scope.comments = response.data.comments;
      });

    $scope.addComment = function() {
      if ($scope.newComment && $scope.isLoggedIn) {
        const userId = $scope.userId; 
        
        $http.post(`/trends/${season}/${mediaId}/comments`, {
          userId: userId,
          content: $scope.newComment
        }).then(function(response) {
          $scope.comments.unshift(response.data.comment);
          $scope.newComment = ''; 
        }, function(error) {
          console.error('Error adding comment:', error);
        });
      } else {
        alert('Please log in to post a comment.');
      }
    };
  });
