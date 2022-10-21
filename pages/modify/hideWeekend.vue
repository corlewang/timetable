<template>
	<view class="hide_content">
		<view class="item_content">
			<text>周六</text>
			<switch color="#F8C981" :checked="satChecked" @change="satChange"></switch>
		</view>
		<view style="width: 100%;height: 1rpx; background-color: #eee;"></view>
		<view class="item_content">
			<text>周日</text>
			<switch color="#F8C981" :checked="sunChecked" @change="sunChange"></switch>
		</view>

		<button @click="confrimData" class="btn_style2">保存</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				satChecked: false,
				sunChecked: false
			}
		},
		methods: {
			satChange(check) {
				if (check.detail.value) {
					this.satChecked = true
				} else {
					this.satChecked = false
				}
			},
			sunChange(check) {
				if (check.detail.value) {
					this.sunChecked = true
				} else {
					this.sunChecked = false
				}
			},
			initData() {
				const satCheck = uni.getStorageSync(this.$ProjectConfig.showSat);
				const sunCheck = uni.getStorageSync(this.$ProjectConfig.showSun);

				if (satCheck) {
					this.satChecked = satCheck
				}

				if (sunCheck) {
					this.sunChecked = sunCheck
				}

			},
			confrimData() {
				uni.showLoading({
					title: '保存中'
				})

				uni.setStorage({
					key: this.$ProjectConfig.showSat,
					data: this.satChecked,
				})

				uni.setStorage({
					key: this.$ProjectConfig.showSun,
					data: this.sunChecked
				})

				setTimeout(() => {
					uni.hideLoading()
					uni.navigateBack()
				}, 200)
			}
		},
		onLoad() {
			this.initData()
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
	.hide_content {
		background-color: #fff;
		display: flex;
		flex-direction: column;

		.item_content {
			height: 100rpx;
			padding-left: 30rpx;
			padding-right: 30rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;

			text {
				color: $uni-text-color;
				font-size: 28rpx;
			}

			.item_content_child {
				margin-right: 20rpx;
				display: flex;
				flex-direction: row;
				align-items: center;

				text {
					color: $uni-text-color;
					font-size: 28rpx;
				}

				image {
					margin-left: 10rpx;
					width: 7px;
					height: 14px;
				}
			}
		}

		.btn_style2 {
			margin-top: 80rpx;
			background: #F8C981;
			width: 60%;
			height: 80rpx;
			line-height: 80rpx;
			font-size: 28rpx;
			color: #fff;
			border-radius: 45rpx;
		}

	}
</style>
