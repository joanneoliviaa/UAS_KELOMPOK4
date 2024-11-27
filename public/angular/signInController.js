app.controller('SigninController', function ($scope, $http) {
  $scope.signin = function () {
      const data = { email: $scope.email, password: $scope.password };
      
      $http.post('/auth/signin', data)
          .then(response => {
              localStorage.setItem('token', response.data.token);
              alert('Login successful');
              // Redirect after successful login
              window.location.href = '/';
          })
          .catch(error => {
              // Set error message to display in the template
              $scope.errorMessage = error.data.message || 'An error occurred during login';
          });
  };
});
