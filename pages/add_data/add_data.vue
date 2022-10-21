<template>
	<view class="content_bg">
		<view class="title">
			<text>课程名称：</text>
			<view>
				<input :value="addData.title" @input="inputTitle" maxlength="12" placeholder="必填" />
				<text style="color: #ff0000;">*</text>
			</view>
		</view>

		<view class="line"></view>

		<view class="title">
			<text>任课老师：</text>
			<view>
				<input :value="addData.name" @input="inputName" maxlength="10" placeholder="非必填" />
			</view>
		</view>
		<view class="line"></view>

		<view class="color_content">
			<text>课程颜色：</text>
			<view class="color_item">
				<view class="click_color" @click="clickColor(0)">
					<image src="../../static/colortable/bg_img1.png"></image>
					<icon v-if="addData.type===0" type="success_no_circle"></icon>
				</view>
				<view class="click_color" @click="clickColor(1)">
					<image src="../../static/colortable/bg_img2.png"></image>
					<icon v-if="addData.type===1" type="success_no_circle"></icon>
				</view>
				<view class="click_color" @click="clickColor(2)">
					<image src="../../static/colortable/bg_img3.png"></image>
					<icon v-if="addData.type===2" type="success_no_circle"></icon>
				</view>
				<view class="click_color" @click="clickColor(3)">
					<image src="../../static/colortable/bg_img4.png"></image>
					<icon v-if="addData.type===3" type="success_no_circle"></icon>
				</view>
				<view class="click_color" @click="clickColor(4)">
					<image src="../../static/colortable/bg_img5.png"></image>
					<icon v-if="addData.type===4" type="success_no_circle"></icon>
				</view>
				<view class="click_color" @click="clickColor(5)">
					<image src="../../static/colortable/bg_img6.png"></image>
					<icon v-if="addData.type===5" type="success_no_circle"></icon>
				</view>
				<view class="click_color" @click="clickColor(6)">
					<image src="../../static/colortable/bg_img7.png"></image>
					<icon v-if="addData.type===6" type="success_no_circle"></icon>
				</view>
				<view class="click_color" @click="clickColor(7)">
					<image src="../../static/colortable/bg_img8.png"></image>
					<icon v-if="addData.type===7" type="success_no_circle"></icon>
				</view>
				<view class="click_color" @click="clickColor(8)">
					<image src="../../static/colortable/bg_img9.png"></image>
					<icon v-if="addData.type===8" type="success_no_circle"></icon>
				</view>
				<view class="click_color" @click="clickColor(9)">
					<image src="../../static/colortable/bg_img10.png"></image>
					<icon v-if="addData.type===9" type="success_no_circle"></icon>
				</view>
				<view class="click_color" @click="clickColor(10)">
					<image src="../../static/colortable/bg_img11.png"></image>
					<icon v-if="addData.type===10" type="success_no_circle"></icon>
				</view>
				<view class="click_color" @click="clickColor(11)">
					<image src="../../static/colortable/bg_img12.png"></image>
					<icon v-if="addData.type===11" type="success_no_circle"></icon>
				</view>
			</view>
		</view>

		<view class="line"></view>
		<view class="title">
			<text>上课教室：</text>
			<view>
				<input :value="addData.address" @input="inputAddress" maxlength="12" placeholder="非必填" />
			</view>
		</view>

		<view style="display: flex; flex-direction: column; width: 100%;">
			<view v-for="(items,index) in addData.timeList" :key='index'>
				<view class="line"></view>
				<view class="time_content">
					<text>上课时间：</text>
					<view class="time_choose" @click="chooseTime(index)">
						<text v-if="items.time==''">请选择上课时间</text>
						<text v-else>{{items.time}}</text>
					</view>
				</view>
			</view>
		</view>
		<button @click="addTime" class="btn_style">添加更多时间</button>
		<button @click="confrimData" class="btn_style2">保存</button>

		<view v-if="visible" class="pick_content">
			<view class="pick_title">
				<text @click="pickCancel" class="pick_cancel">取消</text>
				<text class="pick_title">选择上课时间</text>
				<text @click="pickOk" class="pick_ok">确定</text>
			</view>
			<picker-view @change="bindChange" :value="defultValue" class="picker-view">
				<picker-view-column>
					<view class="item" v-for="(item,index) in pickWeek" :key="index">
						{{item}}
					</view>
				</picker-view-column>
				<picker-view-column>
					<view class="item" v-for="(item,index) in pickStartDay" :key="index">
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
				currentIndex: 0, //当前要调整的时间段的下标
				visible: false,
				addData: {
					title: '',
					name: '',
					type: 0, //当前选中的颜色下标  默认选中第0个
					address: '',
					timeList: []
				},

				pickWeek: [],
				pickStartDay: [],

				//选中的周下标
				selectWeek: 0,
				//选中的课节下标
				selectStartDay: 0,
				allDataList: [], //存储的数据
				defultValue: [] //默认选择的课节
			}
		},
		methods: {
			//input输入的内容
			inputTitle(e) {
				this.addData.title = e.detail.value
			},
			inputName(e) {
				this.addData.name = e.detail.value
			},
			inputAddress(e) {
				this.addData.address = e.detail.value
			},
			//选中颜色
			clickColor(index) {
				this.addData.type = index
			},
			//监听pickview 滑动时选中的下标
			bindChange: function(e) {
				const val = e.detail.value
				this.selectWeek = parseInt(val[0] === undefined ? 0 : val[0]);
				this.selectStartDay = parseInt(val[1] === undefined ? 0 : val[1]);

				this.defultValue = [val[0] === undefined ? 0 : val[0], val[1] === undefined ? 0 : val[1]]
			},
			pickCancel() {
				this.visible = false
			},
			pickOk() {
				this.visible = false
				var timeBean = {
					id: (new Date()).getTime(),
					week: this.selectWeek,
					startDay: this.selectStartDay,
					time: this.pickWeek[this.selectWeek] + (this.pickStartDay[this.selectStartDay]) + '课',
				}

				this.addData.timeList[this.currentIndex] = timeBean
			},
			//初始化数据
			initPickerData() {
				this.pickWeek = [
					'周日', '周一', '周二', '周三', '周四', '周五', '周六'
				];

				//早自习1节课
				var morningIndex = 1;
				//上午4节课
				var AMIndex = 4;
				// 下午4节课
				var PMIndex = 4;
				// 晚上三节课
				var nightIndex = 3;

				for (let i = 0; i < morningIndex + AMIndex + PMIndex + nightIndex; i++) {
					var startDay = '第' + (i + 1) + '节';
					this.pickStartDay.push(startDay)
				}
			},

			chooseTime(index) {
				this.currentIndex = index;
				this.visible = true
				
				var timeBean =this.addData.timeList[index]
				this.defultValue = [timeBean.week === undefined ? 0 : timeBean.week,
					timeBean.startDay === undefined ? 0 : timeBean.startDay
				]
			},

			addDefultTime(week, startDay) {
				// this.addData.week = week;
				// this.addData.startDay = startDay;

				// parseInt() 将字符串转换成int
				var timeBean = {
					id: (new Date()).getTime(),
					week: week,
					startDay: startDay,
					time: this.pickWeek[week] + '第' + (parseInt(startDay) + 1) + '节课'
				}
				this.addData.timeList.push(timeBean);
			},

			//添加更多时间
			addTime() {
				var timeBean = {
					id: (new Date()).getTime(),
					week: 0,
					startDay: 0,
					time: ''
				}
				this.addData.timeList.push(timeBean);
			},
			//添加数据
			confrimData() {
				if (this.addData.title === '') {
					uni.showToast({
						title: '请填写课程名称',
						icon: 'none'
					})
					return false;
				}

				for (let i = 0; i < this.addData.timeList.length; i++) {
					if (this.addData.timeList[i].week === -1) {
						uni.showToast({
							title: '请选择上课时间',
							icon: 'none'
						})
						return false
					}
				}

				this.allDataList.push(this.addData);
				let addDataStr = JSON.stringify(this.allDataList);
				// console.log(addDataStr)
				// //取出来的时候要decode一下
				// console.log('转换后的==' + JSON.parse(addDataStr))
				// // 存到本地缓存里面去 	
				uni.setStorage({
					key: this.$ProjectConfig.allData,
					data: addDataStr,
					success: function() {
						uni.navigateBack();
					},
					fail() {
						uni.showToast({
							title: '存储失败'
						})
					}
				});
			}
		},
		onLoad(options) {
			this.initPickerData();
			if (options.week && options.startDay) {
				this.addDefultTime(options.week, options.startDay);
			} else {
				this.addDefultTime(1, 0);
			}

			// 读取缓存在本地的数据
			const value = uni.getStorageSync(this.$ProjectConfig.allData);
			if (value !== '') {
				// console.log('读取成功1===' + JSON.parse(value));
				this.allDataList = [...this.allDataList, ...JSON.parse(value)];
				// console.log('读取成功2===' + this.allDataList)
			} else {
				this.allDataList = [];
			}

			// uni.getStorage({
			// 	key: this.$ProjectConfig.allData,
			// 	success: (res) => {
			// 		this.allDataList = [...this.allDataList, ...decodeURIComponent(res.data)];
			// 		console.log('读取成功===' + this.allDataList)
			// 	},
			// 	fail() {
			// 		this.allDataList = [];
			// 		console.log('读取失败===' + this.allDataList)
			// 	}
			// });
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
	.content_bg {
		width: 750rpx;
		display: flex;
		flex-direction: column;
		background: #fff;

		.title {
			width: 100%;
			margin-top: 30rpx;
			margin-bottom: 30rpx;
			display: flex;
			flex-direction: row;
			justify-content: space-around;

			text {
				width: 30%;
				margin-left: 30rpx;
				text-align: start;
				color: $uni-text-color;
				font-size: 28rpx;
			}

			view {
				width: 70%;
				display: flex;
				margin-right: 30rpx;
				flex-direction: row;
				justify-content: flex-end;

				input {
					text-align: right;
					width: 97%;
					font-size: 28rpx;
					color: $uni-text-color;
				}

				text {
					margin-left: 0rpx;
					width: 2%;
				}
			}
		}

		.color_content {
			width: 100%;
			display: flex;
			margin-top: 20rpx;
			margin-bottom: 20rpx;
			flex-direction: column;

			text {
				width: 30%;
				margin-left: 30rpx;
				text-align: start;
				color: $uni-text-color;
				font-size: 28rpx;
			}

			.color_item {
				margin-left: 40rpx;
				margin-right: 40rpx;
				width: auto;
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: space-between;

				.click_color {
					margin-top: 25rpx;
					margin-left: 15rpx;
					margin-right: 15rpx;
					width: 70rpx;
					height: 70rpx;
					justify-content: center;
					text-align: center;
					justify-items: center;
					display: flex;
					flex-direction: column; //主轴方向
					align-items: center; //主轴垂直方向居中


					image {
						width: 70rpx;
						height: 70rpx;
						position: absolute;
					}

					icon {
						z-index: 100;
					}
				}
			}
		}

		.btn_style {
			margin-top: 100rpx;
			background: #F8C981;
			width: 60%;
			height: 80rpx;
			line-height: 80rpx;
			font-size: 28rpx;
			color: #fff;
			border-radius: 45rpx;
		}

		.btn_style2 {
			margin-top: 40rpx;
			background: #F8C981;
			width: 60%;
			height: 80rpx;
			line-height: 80rpx;
			font-size: 28rpx;
			color: #fff;
			border-radius: 45rpx;
		}

		.time_content {
			width: 100%;
			display: flex;
			margin-top: 20rpx;
			margin-bottom: 20rpx;
			flex-direction: row;

			text {
				width: 30%;
				margin-left: 30rpx;
				text-align: start;
				color: $uni-text-color;
				font-size: 28rpx;
			}

			.time_choose {
				width: 70%;
				text-align: right;
				justify-content: right;

				text {
					margin-right: 30rpx;
				}
			}
		}

		.pick_content {
			width: 750rpx;
			height: 400rpx;
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
	}

	.line {
		background: #f5f5f5;
		height: 0.5px;
		width: 750rpx;


	}
</style>
