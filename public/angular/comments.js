var app = angular.module('commentApp', []);

app.controller('CommentController', function ($scope, $http) {
  $scope.comments = [];
  $scope.newComment = {};

  // Fetch comments for this media
  $http.get('/api/comments/<%= media.id %>').then(
    function (response) {
      $scope.comments = response.data;
    },
    function (error) {
      console.error('Error fetching comments:', error);
    }
  );

  // Add a new comment (requires login)
  $scope.addComment = function () {
    $http({
      method: 'POST',
      url: '/api/comments',
      headers: { Authorization: localStorage.getItem('token') },
      data: $scope.newComment,
    }).then(
      function (response) {
        $scope.comments.push(response.data);
        $scope.newComment.text = ''; 
      },
      function (error) {
        if (error.status === 401) {
          alert('You must be logged in to comment.');
        } else {
          console.error('Error adding comment:', error);
        }
      }
    );
  };

  // User login
  $scope.login = function () {
    $http
      .post('/auth/login', {
        email: $scope.email,
        password: $scope.password,
      })
      .then(
        function (response) {
          localStorage.setItem('token', response.data.token); 
          alert('Login successful!');
        },
        function (error) {
          alert('Login failed. Please check your credentials.');
        }
      );
  };

  // User signup
  $scope.signup = function () {
    $http
      .post('/auth/signup', {
        email: $scope.email,
        password: $scope.password,
      })
      .then(
        function (response) {
          alert('Signup successful! Please log in.');
        },
        function (error) {
          alert('Signup failed. Email may already be in use.');
        }
      );
  };
});
