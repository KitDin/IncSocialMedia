<template>
  <div>
    <transition name="fade">
      <router-view />
    </transition>
  </div>
</template>

<script>

export default {
  name: 'App'
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap');

#nprogress .bar {
  background-image: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.8));
  height: 5px;
  z-index: 99999999999999999999999999999999999999999999999999999999999;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease-in-out;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

*:focus {
  outline: none;
}

body {
  width: 100%;
  /* background: #fafafa; */
  position: relative;
  font-family: 'roboto', sans-serif;
}
</style>
