app.controller('SigninController', function ($scope, $http) {
    $scope.signin = function () {
      const data = { email: $scope.email, password: $scope.password };
      $http.post('/auth/signin', data)
        .then(response => {
          localStorage.setItem('token', response.data.token);
          alert('Login successful');
          // Redirect ke halaman lain setelah login berhasil
        })
        .catch(error => {
          alert(error.data.message || 'Error occurred');
        });
    };
  });
  