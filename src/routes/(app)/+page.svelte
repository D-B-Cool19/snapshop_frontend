<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import * as Carousel from "$lib/components/ui/carousel";
    import { Input } from "$lib/components/ui/input";
    import Autoplay from "embla-carousel-autoplay";
    import { Search } from "lucide-svelte";
</script>

<div class="bg-background shadow-md py-2">
    <div class="px-4 flex items-center">
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
        <div class="flex items-center gap-2 ml-auto">
            <Input type="search" placeholder="Search..." />
            <Button type="submit" size="icon" class="flex-shrink-0 relative">
                <Search class="size-5"></Search>
                <span class="bg-red-500 text-white text-xs rounded-full px-1 absolute -top-1.5 -right-1.5">2</span>
            </Button>
        </div>
    </div>
</div>

<div class="p-4 grid grid-cols-[1fr_3fr]">
    <aside class="h-full flex items-center flex-col justify-center bg-black/60 text-background">
        <div class="p-4 w-full px-12 hover:bg-black/70 transition-all">生鲜 <span class="text-xs">水果 蔬菜</span></div>
        <div class="p-4 w-full px-12 hover:bg-black/70 transition-all">美食 <span class="text-xs">面点 水果</span></div>
        <div class="p-4 w-full px-12 hover:bg-black/70 transition-all">餐厨 <span class="text-xs">数码产品</span></div>
        <div class="p-4 w-full px-12 hover:bg-black/70 transition-all">电器 <span class="text-xs">床品 四件套 被枕</span></div>
        <div class="p-4 w-full px-12 hover:bg-black/70 transition-all">居家 <span class="text-xs">奶粉 玩具 辅食</span></div>
        <div class="p-4 w-full px-12 hover:bg-black/70 transition-all">洗护 <span class="text-xs">洗发 洗护 美妆</span></div>
    </aside>
    <Carousel.Root
        class="relative flex-1 h-full"
        plugins={[
            Autoplay({
                delay: 5000,
            }),
        ]}>
        <Carousel.Content>
            <Carousel.Item class="h-full">
                <enhanced:img src="$lib/assets/image/r1.png" alt="图片1" class="h-full" />
            </Carousel.Item>
            <Carousel.Item class="h-full">
                <enhanced:img src="$lib/assets/image/r4.png" alt="图片4" class="h-full" />
            </Carousel.Item>
        </Carousel.Content>
        <Carousel.Previous class="left-5" />
        <Carousel.Next class="right-5" />
    </Carousel.Root>
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
