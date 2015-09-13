var shopModule = angular.module("shopModule", ["ngSanitize"]);

shopModule.controller("viewShopController", [
  "$scope", "$log", "shopService",
  function ($scope, $log, shopService) {
    $scope.cart = {};
    $scope.cart.number = 0;

    shopService.getNumber().then(function(res) {
      $scope.cart.number = res.data.number;
    });

    shopService.getProducts()
      .success(function (data) {
        $scope.products = data.products;
        $log.info(data);
      })
      .error(function (data) {
        $log.error(data)
      });

    $scope.puts = function(id) {
      shopService.putProduct(id).then(function(res) {
        $scope.cart.number++;
      });
    };
  }]);

shopModule.factory("shopService", ["$http", function ($http) {
  return {
    getProducts: function() {
      return $http.get('/shop/products');
    },
    putProduct: function(id) {
      return $http.post('/shop/cart/puts', {id: id})
    },
    getNumber: function() {
      return $http.get('/shop/cart/number');
    }
  }
}]);