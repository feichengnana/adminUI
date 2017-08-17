$(function(){
	$("#mask_date").inputmask("y/m/d", {
        autoUnmask: true
    });
    $("#mask_date1").inputmask("y/m/d", {
        "placeholder": "yyyy/mm/dd"
    });
    $("#mask_mobile").inputmask("mask", {
        "mask": "(0)999-9999-9999"
    });
    $("#mask_phone").inputmask("mask", {
        "mask": "(999) 999-99999"
    });
    $("#mask_number").inputmask({
        "mask": "9",
        "repeat": 10,
        "greedy": false
    });
    $("#mask_currency").inputmask('￥ 999.999.999,99', {
        numericInput: true
    });
    $('#input_ipv4').ipAddress();
    $('#input_ipv6').ipAddress({
        v: 6
    });
})
