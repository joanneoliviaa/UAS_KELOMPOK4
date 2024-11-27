const app = angular.module('app', []);

console.log('AngularJS App initialized');

app.controller('SignupController', function ($scope, $http, $window) {
  $scope.user = {};
  $scope.errorMessage = '';
  $scope.successMessage = '';

  $scope.signup = function () {
    var data = {
      full_name: $scope.user.full_name,
      dob: $scope.user.dob,
      email: $scope.user.email,
      password: $scope.user.password,
      confirmPassword: $scope.user.confirmPassword,
    };

    $http.post('/auth/signup', data)
      .then(response => {
        $scope.successMessage = 'Sign Up successful! Redirecting to Sign In page.';
        $scope.errorMessage = '';
        setTimeout(() => {
          $window.location.href = '/auth/signin';
        }, 2000);
      })
      .catch(error => {
        $scope.errorMessage = error.data.message || 'Error occurred during sign up.';
        $scope.successMessage = '';
      });
  };
});

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


  