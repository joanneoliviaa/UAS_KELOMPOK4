// public/angular/app.js
const app = angular.module('authApp', []);

app.controller('SignupController', function ($scope, $http) {
  $scope.signup = function () {
    const data = { email: $scope.email, password: $scope.password };
    $http.post('/auth/signup', data)
      .then(response => {
        alert('Signup successful! Redirecting to Sign In page.');
        window.location.href = '/signin'; // Redirect ke halaman Sign In
      })
      .catch(error => {
        alert(error.data.message || 'Error occurred during signup.');
      });
  };
});

app.controller('SigninController', function ($scope, $http) {
  $scope.signin = function () {
    const data = { email: $scope.email, password: $scope.password };
    $http.post('/auth/signin', data)
      .then(response => {
        localStorage.setItem('token', response.data.token);
        alert('Login successful!');
        // Redirect to another page or dashboard
      })
      .catch(error => {
        alert(error.data.message || 'Error occurred during signin.');
      });
  };
});
