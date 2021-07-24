$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    // 定义一个查询的参数对象,请求数据的时候需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值,默认请求第一页的数据
        pagesize: 2, //每页显示几条数据,默认每页显示2条
        cate_id: '', //文章分类的id
        state: '' //文章的发布状态
    }
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    initTable()
    initCate()
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'get',
            url: 'my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败!')
                }
                // 使用模板引擎渲染页面数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }
    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'get',
            url: 'my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msy('获取分类数据失败!')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                console.log(htmlStr)
                $('[name = cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取表单中选项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新的筛选条件,重新渲染表格的数据
        initTable()
    })
    // 定义渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //分页容器的ID
            count: total, //总数据条数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 调用jump回调,1.点击页码 2.调用laypage.render()方法
            // 若first的值为true,证明是方式2触发的
            jump: function (obj, first) {
                console.log(first)
                console.log(obj.curr)
                // 把最新的页面值和条目数,赋值到q这个查询参数对象中
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if (!first) {
                    initTable()
                }
            }
        })
    }
    // 通过代理的形式,为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function () {
        // 获取到文章的id
        var id = $(this).attr('data-id')
        // 获取删除按钮的个数
        var len = $('btn-delete').length
        console.log(len)
        // 询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'get',
                url: 'my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败!')
                    }
                    layer.msg('删除文章成功!')
                    // 当数据删除完成后,需要判断当前这一页是否还有剩余数据
                    // 如果没有剩余的数据,让页码值-1之后,再调用initTable()
                    if (len === 1) {
                        // 如果len的值等于1,证明删除完毕之后,页面上就没有任何数据了
                        // 页码的最小值为1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index)
        })
    })
})