'use strict';

app.controller('ResourcesCtrl', function ($scope, $location, Resources) {
  $scope.resources = Resources.query();
});

app.controller('LoginCtrl', function ($scope, $rootScope, $location, Auth) {
  $scope.user = {
    username: '',
    password: ''
  };
  $scope.loginUser = function () {
    // Do basic authentication
    Auth.login($scope.user);
    $rootScope.currentUser = $scope.user.username;
    $location.path('resources');
  };
  $scope.logoutUser = function () {
    Auth.logout();
    $location.path('login');
  }
});
