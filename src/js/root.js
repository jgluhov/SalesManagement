var salesManagement = angular.module("salesManagement", [
  "productsModule",
  "helperModule",
  "categoriesModule",
  "shopModule",
  "cartModule",
  "ngAnimate"
]);

salesManagement.controller("salesManagementController",
  ["$scope", "$modal", "salesService", "cartService",
    function ($scope, $modal, salesService, cartService) {
      $scope.username = null;
      $scope.popover = {
        privacy: {template: "privacy"},
        terms: {template: "terms"}
      };

      $scope.login = function () {
        var modalInstance = $modal.open({
          animation: true,
          templateUrl: "/auth/login",
          controller: "salesAuthController"
        });
        modalInstance.result.then(function (user) {
          $scope.username = user.name;
          $scope.admin = user.admin;
        });
      };

      $scope.signup = function () {
        var modalInstance = $modal.open({
          animation: true,
          templateUrl: "/auth/signup",
          controller: "salesAuthController"
        });
        modalInstance.result.then(function (user) {
          $scope.username = user.name;
          $scope.admin = user.admin;
        });
      };

      salesService.isLogged().then(function (res) {
        $scope.username = res.data.user.local.name;
        $scope.admin = res.data.user.local.admin;
      });

      $scope.logout = function () {
        salesService.logout().then(function (res) {
          $scope.username = null;
          $scope.admin = false;
        })
      };

    }]);

salesManagement.controller("salesAuthController",
  ["$scope", "$modalInstance", "$log", "salesService",
    function ($scope, $modalInstance, $log, salesService) {


      $scope.login = function () {
        if (form.$invalid) {
          $scope.submitted = true;
          return;
        }
        salesService.login($scope.user)
          .success(function (res) {
            $scope.submitted = false;
            $modalInstance.close(res.user);
            $log.info(res);
          })
          .error(function (res, status) {
            if (status == 403) {
              $scope.message = res.message;
            }
            $log.error(res);
          })
          .finally(function () {
            $timeout(function () {
              $scope.message = null;
            }, 3000);
          })
      };

      $scope.signup = function (form) {
        if (form.$invalid) {
          $scope.submitted = true;
          return;
        }

        salesService.signup($scope.user)
          .success(function (res) {
            console.log(res);
            $scope.submitted = false;
            $modalInstance.close(res.user);
            $log.info(res);
          })
          .error(function (res, status) {
            if (status == 403) {
              $scope.message = res.message;
            }
            $log.error(res);
          })
          .finally(function () {
            $timeout(function () {
              $scope.message = null;
            }, 3000);
          })
      };
      $scope.cancel = function () {
        $modalInstance.dismiss();
      };

    }]);

salesManagement.factory("salesService", ["$http", function ($http) {
  return {
    login: function (user) {
      return $http.post("/auth/login", user);
    },
    logout: function () {
      return $http.get("/auth/logout");
    },
    signup: function (user) {
      return $http.post("/auth/signup", user);
    },
    isLogged: function () {
      return $http.get("/auth/isLogged");
    }
  }
}]);

salesManagement.run(["$templateCache", function ($templateCache) {
  $templateCache.put("privacy",
    "<div class='panel panel-default'>" +
    "<div class='panel-heading'>Privacy Policy</div>" +
    "<div class='panel-body'>" +
    '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
    'Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. ' +
    'Proin sodales pulvinar tempor. ' +
    'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. ' +
    'Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget odio.</p>' +
    "</div>" +
    "</div>");
  $templateCache.put("terms",
    "<div class='panel panel-default'>" +
    "<div class='panel-heading'>Terms of Use</div>" +
    "<div class='panel-body'>" +
    "<p>" +
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.Aenean euismod bibendum laoreet. " +
    "Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. " +
    "Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, " +
    "nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget odio." +
    "</p>" +
    "</div>" +
    "</div>");
}]);
