var helperModule = angular.module("helperModule", ['ui.bootstrap']);

helperModule.factory("helperService",[function(){
  return {
    storage: {
      product_id: null
    }
  }
}]);
