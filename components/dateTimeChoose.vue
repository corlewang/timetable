<template>
	<view v-if="visibility" class="pick_content" >
		<view class="pick_title">
			<text @click="pickCancel" class="pick_cancel">取消</text>
			<text class="pick_title">{{type==1?'选择上课时间':'选择下课时间'}}</text>
			<text @click="pickOk" class="pick_ok">确定</text>
		</view>
		<picker-view @change="bindChange" class="picker-view" :value="defultValue">
			<picker-view-column>
				<view class="item" v-for="(item,index) in hour" :key="index">
					{{item}}
				</view>
			</picker-view-column>
			<picker-view-column>
				<view class="item" v-for="(item,index) in min" :key="index">
					{{item}}
				</view>
			</picker-view-column>
		</picker-view>
	</view>
</template>


<script>
	export default {
		props: ['type', 'visibility', 'hour', 'min','defultValue'],
		data() {
			return {
			};
		},
		methods: {
			//监听pickview 滑动时选中的下标
			bindChange: function(e) {
				// const val = e.detail.value
				// this.selectWeek = parseInt(val[0]);
				// this.selectStartDay = parseInt(val[1]);
				this.$emit('change',e)
			},
			pickCancel() {
				this.$emit("cancel")
			},
			pickOk() {
				// 	this.visible = false
				// 	var timeBean = {
				// 		id: (new Date()).getTime(),
				// 		week: this.selectWeek,
				// 		startDay: this.selectStartDay,
				// 		time: this.pickWeek[this.selectWeek] + (this.pickStartDay[this.selectStartDay]) + '课'
				// 	}
				// 	this.addData.timeList[this.currentIndex] = timeBean
				this.$emit("ok")
			},
		}
	}
</script>

<style lang="scss">
	.pick_content {
		width: 750rpx;
		height: 500rpx;
		position: fixed;
		bottom: 0;
		background: #f5f5f5;
		border-radius: 12rpx;
		line-height: 70rpx;
		/*  #ifdef  H5  */
		margin-bottom: 100rpx;
		/*  #endif  */

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

			.pick_title {
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
</style>
