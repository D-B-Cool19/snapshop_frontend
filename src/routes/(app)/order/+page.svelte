<script lang="ts">

    import { goto } from "$app/navigation";
    import { authApi } from "$lib/api";
    import { onMount } from "svelte";

    onMount(async () => {
        try {
            await authApi();
        }
        catch (error: any) {
            console.error(error);
            await goto("/login");
        }
    });
</script>
