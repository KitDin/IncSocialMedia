<template>
    <div class="hashtag-frame">
        <LoadingPage style="margin: auto auto;" v-show="isLoading" />
        <div class="hashtag-info" v-for="(hashTag, index) in hashTags" :key="index"
            @click="$emit('getHasgTag', hashTag)" v-show="!isLoading">
            <p class="name">{{ hashTag ? hashTag.hashtag_name : '' }}</p>
            <p class="count-post">{{ hashTag && hashTag.post_count ? hashTag.post_count.toLocaleString('en-US') : '' }}
                posts</p>
        </div>
        <div class="for-you" v-show="!isLoading && hashTagsRecommend.length > 0">Hashtag for you</div>
        <div class="hashtag-info" v-for="(hashTag, index) in hashTagsRecommend" :key="hashTag.hashtag_id"
            @click="$emit('getHasgTag', hashTag)" v-show="!isLoading && hashTagsRecommend.length > 0">
            <p class="name">{{ hashTag ? hashTag.hashtag_name : '' }}</p>
            <p class="count-post">{{ hashTag && hashTag.post_count && hashTag.post_count.toLocaleString('en-US') ?
                hashTag.post_count.toLocaleString('en-US') : '' }}
                posts</p>
        </div>
    </div>
</template>
<script>
import LoadingPage from './LoadingPage.vue';
export default {
    props: {
        hashTags: [],
        isLoading: Boolean, hashTagsRecommend: []
    }, components: {
        LoadingPage
    }
}
</script>

<style>
.hashtag-frame {
    display: flex;
    flex-direction: column;
    height: 200px;
    overflow-y: scroll;

}

.hashtag-frame .hashtag-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 8px 24px;
    cursor: pointer;
    border-bottom: .5px solid rgba(192, 192, 192, 0.429);
    /* line-height: 1.2; */
}

.hashtag-frame .hashtag-info:hover {
    background-color: rgba(214, 214, 214, 0.3);
}

.hashtag-frame .hashtag-info p {
    margin: 0;
    font-size: 14px;
}

.hashtag-frame .hashtag-info .name {
    font-size: 14px;
    font-weight: 600;
}

.hashtag-frame .hashtag-info .count-post {
    color: silver;
}

.hashtag-frame .for-you {
    margin: 0;
    font-size: 14px;
    text-align: left;
    font-weight: 800;
    margin-top: 12px;
    margin-left: 12px;
}
</style>