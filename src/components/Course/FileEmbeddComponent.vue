<template>
    <transition name="v">
        <div class="fixed top-0 left-0 right-0 bottom-0 backdrop-blur backdrop-brightness-75 z-50 flex align-middle justify-center"
            v-if="showEmbed">
            <div class="w-1/2" v-click-outside="showEmbedFunc">
                <embed :src="embedSrc" type="" allowfullscreen class="w-full h-full" frameborder="0" />
            </div>
        </div>
    </transition>
</template>

<script >

import { mapState } from 'vuex';
import { useStore } from 'vuex';



export default {
    setup() {

        const store = useStore();
        const showEmbedFunc = () => {
            store.commit('SHOW_EMBED')
        }
        return {
            store,
            showEmbedFunc
        }
    },
    computed: {
        ...mapState(["showEmbed"]),
        ...mapState(['embedSrc'])
    },
};
</script>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>