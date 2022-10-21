<template>
	<view class="setting-content">
		<view class="content_item" @click="click(1)">
			<text class="content_item_text">添加课程</text>
			<image class="content_item_img" src="../../static/icon_sz_xyy.png"></image>
		</view>
		<view style="width: 100%;height: 1rpx; background-color: #eee;"></view>
		<view class="content_item" @click="click(2)">
			<text class="content_item_text">修改课节数</text>
			<image class="content_item_img" src="../../static/icon_sz_xyy.png"></image>
		</view>
		<view style="width: 100%;height: 1rpx; background-color: #eee;"></view>
		<view class="content_item" @click="click(3)">
			<text class="content_item_text">隐藏周六日</text>
			<image class="content_item_img" src="../../static/icon_sz_xyy.png"></image>
		</view>
		<view style="width: 100%;height: 1rpx; background-color: #eee;"></view>
		<view class="content_item" @click="click(4)">
			<text class="content_item_text">初始化课程表</text>
			<image class="content_item_img" src="../../static/icon_sz_xyy.png"></image>
		</view>
		<view v-if="false" style="width: 100%;height: 1rpx; background-color: #eee;"></view>
		<view v-if="false" class="content_item" @click="click(5)">
			<text class="content_item_text">联系我们</text>
			<image class="content_item_img" src="../../static/icon_sz_xyy.png"></image>
		</view>
		<view style="width: 100%;height: 1rpx; background-color: #eee;"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			click(index) {
				let url = '';
				switch (index) {
					case 1:
						url = '/pages/add_data/add_data';
						break
					case 2:
						url = '/pages/modify/modifyIndex';
						break
					case 3:
						url = '/pages/modify/hideWeekend';
						break
					case 4:
						uni.showModal({
							title: '确定删除所有课程数据吗？',
							success: (type) => {
								if (type.confirm) {
									try {
										uni.clearStorageSync();
										uni.showToast({
											title: '删除成功',
											icon: 'success'
										})
									} catch (e) {
										uni.showToast({
											title: '删除失败',
											icon: 'success'
										})
									}
								}
							}
						})
						return
						break
				}

				uni.navigateTo({
					url
				})
			}
		},
		onShareAppMessage() {
			 return {
			      title: '邀你一起使用课程表之星',
			      path: '/pages/index/index'
			    }
		},
		onShareTimeline() {
			return {
			     title: '邀你一起使用课程表之星',
			     path: '/pages/index/index'
			   }
		}
	}
</script>

<style lang="scss">
	.setting-content {
		background-color: #fff;
		display: flex;
		flex-direction: column;

		.content_item {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			padding-left: 35rpx;
			padding-right: 35rpx;
			height: 100rpx;
			align-items: center;

			.content_item_text {
				font-size: 28rpx;
				color: $uni-text-color;
			}

			.content_item_img {
				width: 8px;
				height: 14px;

			}
		}
	}
</style>
