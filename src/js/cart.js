var cartModule = angular.module("cartModule", ["ui.bootstrap", "ngSanitize"]);
//----------------------------------------------------------------------------------------------------------------------
cartModule.controller("viewCartController", [
  "$scope", "$log", "cartService", "salesService", function ($scope, $log, cartService, salesService) {
    $scope.getItems = function () {
      cartService.getItems().then(function (res) {
        $scope.items = res.data.items;
      });
    };

    $scope.getOrders = function () {
      cartService.getOrders().success(function (res) {
        $scope.orders = res.orders;
        $log.info(res);
      }).error(function(res) {
        $log.error(res);
      })
    };

    $scope.removeItem = function (id, index) {
      console.log($scope.items);
    };

    $scope.getItems();
    $scope.getOrders();

    $scope.checkout = function () {
      salesService.isLogged()
        .success(function (res) {
          cartService.checkout()
            .success(function (res) {
              $scope.items = null;
              $scope.orders = res.orders;
              $log.info(res);
            })
            .error(function (res) {
              $log.error(res);
            })
        })
        .error(function (res) {
          $log.error(res);
        })
    }
  }]);

cartModule.factory("cartService", ["$http", function ($http) {
  return {
    getItems: function () {
      return $http.get("/shop/cart");
    },
    checkout: function () {
      return $http.get("/shop/cart/checkout");
    },
    getOrders: function () {
      return $http.get("/shop/cart/orders");
    }
  }
}]);