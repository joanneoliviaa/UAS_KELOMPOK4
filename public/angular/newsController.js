const app = angular.module('newsApp', []);

app.controller('newsController', function($scope, $http, $location) {
    $scope.news = {};
  
    const articleId = $location.absUrl().split('/news/')[1];
    console.log('Article ID:', articleId); 
  
    $http.get(`/news/api/news/${articleId}`)
      .then(response => {
        $scope.news = response.data; 
      })
      .catch(error => {
        console.error('Error fetching article:', error);
      });
  });
  