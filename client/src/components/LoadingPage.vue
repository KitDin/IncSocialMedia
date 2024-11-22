<template>
    <div class="loading-component">
        <span class="loading-span" :class="{ 'is-white': isWhite }"></span>
    </div>
</template>

<script>
export default {
    props: {
        isWhite: {
            type: Boolean,
            default: false
        }
    }
};
</script>

<style>
.loading-component {
    padding: 15px 0;
    display: flex;
    justify-content: center;
}

.loading-component .loading-span {
    width: 22px;
    aspect-ratio: 1;
    display: grid;
    border-radius: 50%;
    background:
        linear-gradient(0deg, rgb(0 0 0/50%) 30%, #0000 0 70%, rgb(0 0 0/100%) 0) 50%/8% 100%,
        linear-gradient(90deg, rgb(0 0 0/25%) 30%, #0000 0 70%, rgb(0 0 0/75%) 0) 50%/100% 8%;
    background-repeat: no-repeat;
    animation: l23 1s infinite steps(12);
}

.loading-component .loading-span.is-white {
    background:
        linear-gradient(0deg, rgb(255 255 255/50%) 30%, #0000 0 70%, rgb(255 255 255/100%) 0) 50%/8% 100%,
        linear-gradient(90deg, rgb(255 255 255/25%) 30%, #0000 0 70%, rgb(255 255 255/75%) 0) 50%/100% 8% !important;
}

.loading-component .loading-span::before,
.loading-component .loading-span::after {
    content: "";
    grid-area: 1/1;
    border-radius: 50%;
    background: inherit;
    opacity: 0.915;
    transform: rotate(30deg);
}

.loading-component .loading-span::after {
    opacity: 0.83;
    transform: rotate(60deg);
}

@keyframes l23 {
    100% {
        transform: rotate(1turn);
    }
}
</style>
