const app = angular.module('authApp', []);

app.controller('SignupController', function ($scope, $http, $window) {
  // Inisialisasi variabel
  $scope.user = {};
  $scope.errorMessage = '';
  $scope.successMessage = '';

  // Fungsi untuk Sign Up
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
          $window.location.href = '/auth/signin'; // Redirect ke halaman Sign In
        }, 2000);
      })
      .catch(error => {
        $scope.errorMessage = error.data.message || 'Error occurred during sign up.';
        $scope.successMessage = '';
      });
  };
});
