angular.module('commentsApp', [])
  .controller('commentsController', function($scope, $http) {
    const pathParts = window.location.pathname.split('/');
    const season = pathParts[2];  // Ambil season dari URL
    const mediaId = pathParts[3]; // Ambil mediaId dari URL

    // Cek apakah user sudah login dan ambil userId dari session
    $http.get('/auth/check-login').then(function(response) {
      if (response.data.loggedIn) {
        // Jika login, simpan userId dan userName di scope
        $scope.isLoggedIn = true;
        $scope.userId = response.data.userId;  // Mendapatkan userId dari session
        $scope.userName = response.data.userName;  // Mendapatkan userName dari session
      } else {
        $scope.isLoggedIn = false;
      }
    });

    // Ambil komentar yang sudah ada
    $http.get(`/api/trends/${season}/${mediaId}/comments`)
      .then(function(response) {
        $scope.comments = response.data.comments;
      });

    // Fungsi untuk menambah komentar
    $scope.addComment = function() {
      if ($scope.newComment && $scope.isLoggedIn) {
        const userId = $scope.userId;  // Mengambil userId yang sudah disimpan
        
        // Kirim komentar ke server
        $http.post(`/trends/${season}/${mediaId}/comments`, {
          userId: userId,
          content: $scope.newComment
        }).then(function(response) {
          // Menambahkan komentar baru ke daftar komentar di frontend
          $scope.comments.unshift(response.data.comment);
          $scope.newComment = ''; // Reset textarea setelah komentar dikirim
        }, function(error) {
          console.error('Error adding comment:', error);
        });
      } else {
        alert('Please log in to post a comment.');
      }
    };
  });
