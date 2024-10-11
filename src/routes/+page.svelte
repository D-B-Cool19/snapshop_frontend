<script lang="ts">
    const username = "";
</script>

<header class="bg-gray-100 py-2">
    <div class="container mx-auto flex justify-between">
        <ul class="flex space-x-4 text-sm">
            {#if username}
                <li>Hello, {username}!</li>
            {:else}
                <li>Hello, guest!</li>
                <li><a href="/login" class="hover:text-blue-500">登录</a>|</li>
                <li><a href="/register" class="hover:text-blue-500">免费注册</a>|</li>
            {/if}
            <li><a href="/" class="hover:text-blue-500">首页</a>|</li>
            <li><a href="/cart" class="hover:text-blue-500"><i class="fas fa-shopping-cart"></i>购物车</a>|</li>
            <li><a href="/history" class="hover:text-blue-500">历史记录</a>|</li>
            <li><a href="/score" class="hover:text-blue-500">积分商城</a>|</li>
            <li><a href="/profile" class="hover:text-blue-500">我的账户</a>|</li>
            <li><a href="#" class="hover:text-blue-500">帮助中心</a>|</li>
        </ul>
    </div>
</header>

<div class="bg-white shadow-md py-4">
    <div class="container mx-auto flex items-center justify-between">
        <h1 class="text-lg font-bold">
            <a href="#">
                <enhanced:img src="$lib/assets/image/logo.png" alt="" class="w-36 h-20" />
            </a>
        </h1>
        <nav class="space-x-6">
            <ul class="flex space-x-6">
                <li><a href="#" class="hover:text-blue-500">生鲜</a></li>
                <li><a href="#" class="hover:text-blue-500">美食</a></li>
                <li><a href="#" class="hover:text-blue-500">餐厨</a></li>
                <li><a href="#" class="hover:text-blue-500">电器</a></li>
                <li><a href="#" class="hover:text-blue-500">居家</a></li>
                <li><a href="#" class="hover:text-blue-500">洗护</a></li>
                <li><a href="#" class="hover:text-blue-500">孕婴</a></li>
                <li><a href="#" class="hover:text-blue-500">服装</a></li>
            </ul>
        </nav>
        <div class="flex items-center space-x-4">
            <input type="search" placeholder="搜一搜" class="border border-gray-300 rounded-md px-3 py-2 outline-none" />
            <button type="submit" class="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600">
                <i class="fas fa-search"></i>
            </button>
        </div>
        <div class="relative">
            <span class="bg-red-500 text-white text-xs rounded-full px-2 py-1 absolute -top-2 -right-2">2</span>
        </div>
    </div>
</div>

<div class="container mx-auto my-8">
    <ul class="banner">
        <li><enhanced:img src="$lib/assets/image/r1.png" alt="图片1" class="w-full h-96 object-cover" /></li>
        <li><enhanced:img src="$lib/assets/image/r4.png" alt="图片4" class="w-full h-96 object-cover" /></li>
    </ul>
    <aside class="my-6">
        <ul class="grid grid-cols-3 gap-4">
            <li><a href="#" class="block p-4 bg-gray-100 hover:bg-gray-200 rounded-md">生鲜 <span class="text-xs">水果 蔬菜</span></a></li>
            <li><a href="#" class="block p-4 bg-gray-100 hover:bg-gray-200 rounded-md">美食 <span class="text-xs">面点 水果</span></a></li>
            <li><a href="#" class="block p-4 bg-gray-100 hover:bg-gray-200 rounded-md">餐厨 <span class="text-xs">数码产品</span></a></li>
            <li><a href="#" class="block p-4 bg-gray-100 hover:bg-gray-200 rounded-md">电器 <span class="text-xs">床品 四件套 被枕</span></a></li>
            <li><a href="#" class="block p-4 bg-gray-100 hover:bg-gray-200 rounded-md">居家 <span class="text-xs">奶粉 玩具 辅食</span></a></li>
            <li><a href="#" class="block p-4 bg-gray-100 hover:bg-gray-200 rounded-md">洗护 <span class="text-xs">洗发 洗护 美妆</span></a></li>
        </ul>
    </aside>
</div>

<div class="container mx-auto my-12">
    <div class="flex justify-between items-center">
        <h2 class="text-xl font-bold">新鲜好物 <span class="text-sm text-gray-500">新鲜出炉 品质靠谱</span></h2>
        <a href="/all_goods" class="text-blue-500 hover:text-blue-700">查看全部</a>
    </div>
    <ul class="grid grid-cols-4 gap-6 mt-6">
        <li class="border rounded-md overflow-hidden shadow-lg">
            <enhanced:img src="$lib/assets/image/1.jpg" alt="" class="w-full h-48 object-cover" />
            <div class="p-4">
                <h3 class="font-bold">NVIDIA RTX4090 24G</h3>
                <p class="text-lg text-red-500 mt-2"><span>￥</span> 16999</p>
            </div>
        </li>
        <li class="border rounded-md overflow-hidden shadow-lg">
            <enhanced:img src="$lib/assets/image/2.png" alt="" class="w-full h-48 object-cover" />
            <div class="p-4">
                <h3 class="font-bold">ROG幻16 air笔记本电脑</h3>
                <p class="text-lg text-red-500 mt-2"><span>￥</span> 13969</p>
            </div>
        </li>
        <li class="border rounded-md overflow-hidden shadow-lg">
            <enhanced:img src="$lib/assets/image/3.png" alt="" class="w-full h-48 object-cover" />
            <div class="p-4">
                <h3 class="font-bold">ROG HYPERION 创世神机箱</h3>
                <p class="text-lg text-red-500 mt-2"><span>￥</span> 3299</p>
            </div>
        </li>
        <li class="border rounded-md overflow-hidden shadow-lg">
            <enhanced:img src="$lib/assets/image/4.png" alt="" class="w-full h-48 object-cover" />
            <div class="p-4">
                <h3 class="font-bold">ROG GT-AX11000 Pro路由器</h3>
                <p class="text-lg text-red-500 mt-2"><span>￥</span> 3499</p>
            </div>
        </li>
    </ul>
</div>

<footer class="bg-gray-100 py-6">
    <div class="container mx-auto">
        <div class="flex justify-around text-sm">
            <a href="#" class="hover:text-blue-500">价格亲民</a>
            <a href="#" class="hover:text-blue-500">品质优异</a>
            <a href="#" class="hover:text-blue-500">售后保障</a>
        </div>
        <div class="text-center mt-6">
            <p class="text-gray-600">
                <a href="#" class="hover:text-blue-500">关于我们</a> |
                <a href="#" class="hover:text-blue-500">帮助中心</a> |
                <a href="#" class="hover:text-blue-500">售后服务</a> |
                <a href="#" class="hover:text-blue-500">商务合作</a> |
                <a href="#" class="hover:text-blue-500">搜索推荐</a> |
                <a href="#" class="hover:text-blue-500">友情链接</a>
            </p>
        </div>
    </div>
</footer>
