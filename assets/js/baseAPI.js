// 注意: 每次调用$.get()或$.post()或$.ajax()的时候, 会先调用ajaxPrefilter这个函数, 这这个函数中, 可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    console.log(options);
    options.url = 'http://api-breakingnews-web.itheima.net/' + options.url
    // 统一为有权限接口,设置headers请求头
    // 如果要检索的字符串值没有出现，则该方法返回 -1
    if (options.url.indexOf('/my/') !== -1) {
        console.log(localStorage.getItem('token'));
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    // 全局统一挂载complete函数
    options.complete = function (res) {
        // 在complete回调函数中,可以使用res.responseJSON拿到服务器响应回来的数据
        console.log(localStorage.getItem('token'));
        console.log(res);
        // if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //     // 1.强制清空token
        //     localStorage.removeItem('token')
        //     // 2.强制跳转到登录页面
        //     location.href = './login.html'
        // }
    }
})