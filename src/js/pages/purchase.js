require.config({
    baseUrl: "http://sjs1.sinajs.cn/astro/xuyuanxing/js/",
    paths: {
        "purchaseStep":"pl/purchaseStep",
        "swal":'pl/sweetAlert',
        "divselect":"pl/divselect"
    }
});
require(['purchaseStep','divselect'],function (purchaseStep,divselect) {
   new divselect('search_type');   

  new purchaseStep($scope.data.id,$scope.data.data_status,$scope.data.count)
})

