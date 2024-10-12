<script>
    import { Toaster } from "$lib/components/ui/sonner";
    import autoAnimate from "@formkit/auto-animate";
    import "../app.css";
</script>

<Toaster />
<div class="w-full h-full bg-background" use:autoAnimate>
    <slot></slot>
</div>
