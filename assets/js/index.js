$(function () {
    getUserInfo()
    var layer = layui.layer
    $('.btnLogout').on('click', function () {
        layer.confirm('确认退出登录?', { icon: 3, title: '提示' }, function (index) {
            //1.清空本地存储中的token
            localStorage.removeItem('token')
            // 2.重新跳转到登录页面
            location.href = '../../login.html'
            // 关闭弹出层
            layer.close(index);
        });
    })
})

// 封装获取用户的基本信息函数
function getUserInfo() {
    $.ajax({
        method: 'get',
        url: 'my/userinfo',
        // headers就是请求头配置的对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败!')
            }
            // 调用renderAvatar渲染用户头像
            renderAvatar(res.data)
        },
        // 无论成功还是失败,最终都会调用complete回调函数
        complete: function (res) {
            // 在complete回调函数中,可以使用res.responseJSON拿到服务器响应回来的数据
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败!') {
                // 1.强制清空token
                localStorage.removeItem('token')
                // 2.强制跳转到登录页面
                location.href = '../../login.html'
            }
        }
    })
}
// 封装渲染用户的头像函数
function renderAvatar(user) {
    // 1.获取用户名
    var name = user.nickname || user.username
    // 2.设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 3.渲染用户头像
    if (user.user_pic !== null) {
        //    3.1 已设置头像用户
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 3.2文字头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}