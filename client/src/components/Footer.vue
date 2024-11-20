<template>
    <div class="rule-content">
        <ul>
            <li>About</li>
            <li>Blog</li>
            <li>Jobs</li>
            <li>Helps</li>
            <li>API</li>
            <li>Privacy</li>
            <li>Terms</li>
            <li>Locations</li>
            <li>InC</li>
            <li>InC Verified</li>
            <li>InC LITE</li>
            <li>InC Rule</li>
        </ul>
        <ul>
            <li>© 2023 inC from Me</li>
        </ul>
    </div>
</template>

<script>
export default {

}
</script>

<style scoped>
ul {
    list-style: none;
    font-size: 13px;
    color: silver;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    z-index: 0;
    cursor: pointer;
    transition: all 1s ease-in-out;
}

ul>li {
    margin: 8px;
}

li:hover {
    font-weight: 600;
    background-color: transparent;
    text-decoration-line: underline;
}
</style>
