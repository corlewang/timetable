<template>
	<view class="modify_index_content">
		<view class="item_content">
			<text>早自习</text>
			<switch color="#F8C981" :checked="checked" @change="change"></switch>
		</view>
		<view style="width: 100%;height: 1rpx; background-color: #eee;"></view>
		<view class="item_content">
			<text>一天课节数</text>
			<view class="item_content_child" @click="modify_class">
				<text>{{allnumber}}</text>
				<image src="../../static/icon_sz_xyy.png"></image>
			</view>
		</view>

		<button @click="confrimData" class="btn_style2">保存</button>

		<view v-if="visible" class="pick_content">
			<view class="pick_title">
				<text @click="pickCancel" class="pick_cancel">取消</text>
				<text class="pick_title">节数选择</text>
				<text @click="pickOk" class="pick_ok">确定</text>
			</view>

			<view class="pick_text_content">
				<text class="pick_title">上午</text>
				<text class="pick_title">下午</text>
				<text class="pick_title">晚上</text>
			</view>

			<picker-view @change="bindChange" :value="defultValue" class="picker-view">
				<picker-view-column>
					<view class="item" v-for="(item,index) in AMList" :key="index">
						{{item}}
					</view>
				</picker-view-column>
				<picker-view-column>
					<view class="item" v-for="(item,index) in PMList" :key="index">
						{{item}}
					</view>
				</picker-view-column>
				<picker-view-column>
					<view class="item" v-for="(item,index) in NGList" :key="index">
						{{item}}
					</view>
				</picker-view-column>
			</picker-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				checked: false,
				visible: false,
				AMList: [],
				PMList: [],
				NGList: [],

				//早自习是否显示
				morningIndex: 1,
				//选中的上午课节数下标
				AMIndex: 3,
				//选中的下午课节数下标
				PMIndex: 3,
				//选中的晚上课节数下标
				NGIndex: 2,
				defultValue: [],
				allnumber: 0

			}
		},
		methods: {
			change(check) {
				if (check.detail.value) {
					this.morningIndex = 1
				} else {
					this.morningIndex = 0
				}

				this.allnumber = (this.morningIndex + this.AMIndex + 1 + this.PMIndex + 1 + this.NGIndex + 1)
			},
			modify_class() {
				this.visible = true;
			},
			//初始化数据
			initPickerData() {
				this.AMList = [
					'1节', '2节', '3节', '4节', '5节', '6节'
				];
				this.PMList = [
					'1节', '2节', '3节', '4节', '5节', '6节'
				];
				this.NGList = [
					'1节', '2节', '3节', '4节', '5节', '6节'
				];

				// 读取缓存在本地的数据
				const moiningValue = uni.getStorageSync(this.$ProjectConfig.MORIndex);
				const amValue = uni.getStorageSync(this.$ProjectConfig.AMIndex);
				const pmValue = uni.getStorageSync(this.$ProjectConfig.PMIndex);
				const ngValue = uni.getStorageSync(this.$ProjectConfig.NGIndex);

				if (moiningValue || moiningValue === 0) {
					this.morningIndex = moiningValue;
				}
				if (amValue||amValue===0) {
					this.AMIndex = amValue;
				}
				if (pmValue||pmValue===0) {
					this.PMIndex = pmValue;
				}
				if (ngValue||ngValue===0) {
					this.NGIndex = ngValue;
				}

				if (this.morningIndex == 1) {
					this.checked = true
				} else {
					this.checked = false
				}

				this.defultValue = [this.AMIndex, this.PMIndex, this.NGIndex]
				this.allnumber = (this.morningIndex + this.AMIndex + 1 + this.PMIndex + 1 + this.NGIndex + 1)
			},
			getIndex(value) {
				switch (value) {
					case '一节':
						return 0;
					case '二节':
						return 1;
					case '三节':
						return 2;
					case '四节':
						return 3;
					case '五节':
						return 4;
					case '六节':
						return 5;
				}
			},
			//监听pickview 滑动时选中的下标
			bindChange: function(e) {
				const val = e.detail.value
				console.log(val)
				this.AMIndex = parseInt(val[0]);
				this.PMIndex = parseInt(val[1]);
				this.NGIndex = parseInt(val[2]);

			},
			pickCancel() {
				this.visible = false
			},
			confrimData() {
				// if (this.checked) {
				// 	this.morningIndex = 1;
				// } else {
				// 	this.morningIndex = 0;
				// }

				// console.log(this.morningIndex)

				uni.showLoading({
					title: '保存中'
				})

				uni.setStorageSync(this.$ProjectConfig.MORIndex, this.morningIndex);
				uni.setStorageSync(this.$ProjectConfig.AMIndex, this.AMIndex);
				uni.setStorageSync(this.$ProjectConfig.PMIndex, this.PMIndex);
				uni.setStorageSync(this.$ProjectConfig.NGIndex, this.NGIndex);

				setTimeout(() => {
					uni.hideLoading()
					uni.navigateBack()
				}, 200)
			},
			pickOk() {
				this.visible = false
				this.defultValue = [this.AMIndex, this.PMIndex, this.NGIndex]
				this.allnumber = (this.morningIndex + this.AMIndex + 1 + this.PMIndex + 1 + this.NGIndex + 1)
			}
		},
		onLoad() {
			this.initPickerData();
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
	.modify_index_content {
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

		.pick_content {
			width: 750rpx;
			height: 520rpx;
			position: fixed;
			bottom: 0;
			background: #f5f5f5;
			border-radius: 12rpx;
			line-height: 70rpx;
			/*  #ifdef  H5  */
			margin-bottom: 100rpx;
			/*  #endif  */

			.pick_text_content {
				display: flex;
				background-color: #fff;
				flex-direction: row;
				justify-content: space-around;
			}

			.pick_title {
				display: flex;
				line-height: 70rpx;
				flex-direction: row;
				justify-content: space-between;

				.pick_cancel {
					padding-left: 35rpx;
					font-size: 28rpx;
					color: $uni-text-color;
				}

				.pick_ok {
					padding-right: 35rpx;
					font-size: 28rpx;
					color: #F8C981;
				}
			}

			.picker-view {
				border-radius: 12rpx;
				width: 100%;
				height: 450rpx;

				.item {
					font-size: 28rpx;
					align-items: center;
					justify-content: center;
					text-align: center;
				}
			}
		}

		.pick_title {
			font-size: 28rpx;
			color: $uni-text-color;
		}
	}
</style>
