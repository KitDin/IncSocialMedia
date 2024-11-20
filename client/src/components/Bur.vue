<template>
    <div class="bur-template" @click="$emit('closeBur')"></div>
</template>

<style>
.bur-template {
    width: 100%;
    height: 100%;
    position: fixed;
    background-color: rgba(0, 0, 0, 0.402);
    top: 0;
    left: 0;
    z-index: 1000;
    cursor: pointer;
}
</style>