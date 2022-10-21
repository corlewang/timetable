<template>
	<view class="content">
		<view class="top_content">
			<view class="title_content" :style="{'padding-top': (systemInfo.statusBarHeight+11) + 'px'}" @click="clickModify">
				<text class="title_content_text">定制课程表</text>
				<image class="title_content_img" src="../../static/icon_sz_xyy.png"></image>
			</view>

			<view class="week_content" style="padding-top: 40rpx;">
				<view class="week_conent-left">
					<image class="logo" src="../../static/icon_main_left.png"></image>
					<text class="week_content_text1">日期</text>
					<text class="week_content_text2">课节</text>
				</view>
				<view class="week_item" v-for="(items,index) in weekList" :key='index'>
					<text :class="items.isShowDot?'textSelect':'textNor'">{{items.title}}</text>
					<text :class="items.isShowDot?'textSelect':'textNor'">{{items.date}}</text>
					<view class='week_dot'>
						<view v-if="items.isShowDot" class="week_dot_item"></view>
					</view>
				</view>
			</view>
		</view>

		<view  class="content">
			<view class="content">
				<view class="content_all">
					<!-- 早自习 上午 下午  晚上-->
					<view class="item_content" v-for="(items,index) in mainList" :key='index'>
						<text v-if="items.type!==0" class="table_text">{{items.title}}</text>
						<view class="table_content" v-for="(tableItem,tableIndex) in mainList[index].tableList"
							:key='tableIndex'>
							<view class="table_first" @click="modifyTime(index,tableIndex)">
								<text class="index_text">
									{{tableItem.index}}
								</text>
								<text class="index_time">
									{{tableItem.startTime+'\n'+tableItem.endTime}}
								</text>
							</view>
							<!-- //早自习 7天课程内容 -->
							<view class="table_item"
								v-for="(dataItem,dataIndex) in mainList[index].tableList[tableIndex].dataList"
								:key='dataIndex'>
								<view class="add_data" v-if="dataItem.dataTitle==''"
									@click="AddData(dataItem.week,dataItem.startDay)">
									<text class="table_data_text">
									</text>
								</view>

								<view v-else class="table_data_view" @click="priview(dataItem)">
									<image mode="scaleToFill" :src="getBackgrand(dataItem.type)"></image>
									<view class="data-content">
										<text>{{dataItem.dataTitle}}</text>
										<text>{{dataItem.dataName}}</text>
										<text>{{dataItem.dataAddress}}</text>
									</view>
								</view>
							</view>

						</view>
					</view>
				</view>
				<datetime style="z-index: 999;" :type="1" :visibility="startVisib" :hour="startHour" :min="startMin" @cancel="startCancel"
					@ok="startOk" @change="startChange" :defultValue='defultValue'></datetime>
				<datetime  style="z-index: 999;" :type="2" :visibility="endVisib" :hour="endHour" :min="endMin" @cancel="endCancel" @ok="endOk"
					@change="endChange" :defultValue='defultValue'></datetime>
			</view>
		</view>

		<view class="priview" v-if="isPriview" @click="isPriview=false">
			<view class="priview-content">
				<text v-if="priviewItem.dataTitle">课程名称：{{priviewItem.dataTitle}}</text>
				<text v-if="priviewItem.dataName">任课老师：{{priviewItem.dataName}}</text>
				<text v-if="priviewItem.dataAddress">上课教室：{{priviewItem.dataAddress}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import datetime from '../../components/dateTimeChoose.vue'

	export default {
		components: {
			datetime
		},
		data() {
			return {
				// 周数据
				weekList: [],
				week: [
					'周日', '周一', '周二', '周三', '周四', '周五', '周六'
				],

				//总的数据表
				mainList: [],
				allDataList: [],
				systemInfo: '',
				timeList: [], //记录每一组课程的时间
				currentSelectIndex: 0, //当前选中的下标
				currentSelectChildIndex: 0, //当前选中的子下标
				startVisib: false,
				endVisib: false,
				startHour: [],
				startMin: [],
				startHourIndex: 0,
				startMinIndex: 0,
				endHour: [],
				endMin: [],
				endHourIndex: 0,
				endMinIndex: 0,
				defultValue: [],
				priviewItem: '',
				isPriview: false, //预览课程
			    systeminfo:''
			}
		},
		onLoad() {
			this.systemInfo=uni.getSystemInfoSync()
			// console.log(this.systemInfo)
			
			for (let i = 0; i < 24; i++) {
				if (i < 10) {
					this.startHour[i] = '0' + i
				} else {
					this.startHour[i] = i
				}
			}

			for (let i = 0; i < 60; i++) {
				if (i < 10) {
					this.startMin[i] = '0' + i
				} else {
					this.startMin[i] = i
				}
			}

			this.getSystemInfo()
		},
		onShow() {
			// 读取缓存在本地的数据
			const value = uni.getStorageSync(this.$ProjectConfig.allData);
			if (value !== '') {
				this.allDataList = JSON.parse(value);
				this.mainList = []; //清空数据重新加载
				this.getMorningData();
			} else {
				this.mainList = []; //清空数据重新加载
				this.allDataList = [];
				this.getMorningData();
			}

			this.getWeekData()
			//调用顺序先初始化 getMorningData和getWeekData 最后再检查存储的时间点
			this.initTime()
		},
		methods: {
			priview(dataItem) { //预览课程
				this.priviewItem = dataItem
				this.isPriview = true
			},
			////////////////////////////////////////////////开始时间
			startCancel() {
				// console.log('startCancel')
				this.startVisib = false
			},
			startOk(e) {
				// console.log('startOk')
				this.startVisib = false
				for (let i = 0; i < 24 - this.startHourIndex; i++) {
					if ((i + this.startHourIndex) < 10) {
						this.endHour[i] = '0' + (i + this.startHourIndex)
					} else {
						this.endHour[i] = (i + this.startHourIndex)
					}
				}

				for (let i = 0; i < 60; i++) {
					if (i < 10) {
						this.endMin[i] = '0' + i
					} else {
						this.endMin[i] = i
					}
				}

				//初始化默认值
				let min;
				//如果第一个选中的时间和开始时间一致就让结束时间的分往后偏移10分钟
				if (this.startHourIndex === this.endHour[0] && this.endMin[0] === this.startMinIndex) {
					min = this.endMin[10]
				} else {
					min = this.endMin[0]
				}

				this.defultValue = [0, min];

				setTimeout(() => {
					this.endVisib = true
				}, 300)
			},
			startChange(e) {
				const val = e.detail.value
				this.startHourIndex = parseInt(val[0]);
				this.startMinIndex = parseInt(val[1]);
			},
			////////////////////////////////////////////////结束时间
			endCancel() {
				this.endVisib = false
				// console.log('endCancel')
			},
			endOk() {
				uni.showLoading()

				this.endVisib = false
				// console.log('endOk')

				this.mainList[this.currentSelectIndex].tableList[this.currentSelectChildIndex].startTime = this.startHour[
					this.startHourIndex] + ":" + this.startMin[this.startMinIndex]
				this.mainList[this.currentSelectIndex].tableList[this.currentSelectChildIndex].endTime = this.endHour[this
					.endHourIndex] + ":" + this.endMin[this.endMinIndex]

				var timeBean = {
					index: this.currentSelectIndex,
					indexChild: this.currentSelectChildIndex,
					startTime: this.startHour[this.startHourIndex] + ":" + this.startMin[this.startMinIndex],
					endTime: this.endHour[this.endHourIndex] + ":" + this.endMin[this.endMinIndex]
				}

				new Promise((resolve) => {
					this.timeList.some((item, i) => {
						if (timeBean.index == item.index && timeBean.indexChild == item.indexChild) {
							resolve(i);
						}
					})
					resolve(-1);
				}).then((resolve) => {
					if (resolve !== -1) {
						this.timeList[resolve] = timeBean
					} else {
						this.timeList.push(timeBean)
					}
					// console.log(this.timeList)
					let timeListStr = JSON.stringify(this.timeList);
					uni.setStorage({
						key: this.$ProjectConfig.timeList,
						data: timeListStr,
						complete() {
							uni.hideLoading()
						}
					})
				})
			},
			endChange(e) {
				const val = e.detail.value
				this.endHourIndex = parseInt(val[0]);
				this.endMinIndex = parseInt(val[1]);
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
			initTime() {
				var value = uni.getStorageSync(this.$ProjectConfig.timeList);
				if (value) {
					this.timeList = JSON.parse(value);
				}

				// console.log(this.timeList)
				if (this.timeList && this.timeList.length !== 0) {
					this.timeList.some((item, i) => {
						this.mainList[item.index].tableList[item.indexChild].startTime = item.startTime;
						this.mainList[item.index].tableList[item.indexChild].endTime = item.endTime;
					})
				}
			},
			modifyTime(index, tableIndex) {
				// console.log(this.mainList[index].tableList[tableIndex].index)
				// console.log(this.mainList[index].tableList[tableIndex].startTime)
				// console.log(this.mainList[index].tableList[tableIndex].endTime)
				// var timeBean = {
				// 	index: this.mainList[index].tableList[tableIndex].index,
				// 	startTime: this.mainList[index].tableList[tableIndex].startTime,
				// 	endtime: this.mainList[index].tableList[tableIndex].endTime
				// }
				//初始化默认值
				let hour, min;
				hour = this.mainList[index].tableList[tableIndex].startTime.split(':')[0]
				min = this.mainList[index].tableList[tableIndex].startTime.split(':')[1]
				this.defultValue = [hour, min];
				this.startVisib = true

				this.currentSelectIndex = index
				this.currentSelectChildIndex = tableIndex
			},
			clickModify() {
				uni.navigateTo({
					url: '../setting/setting'
				})
			},
			getSystemInfo() {
				var _this = this;
				uni.getSystemInfo({
					success: function(res) {
						_this.systemInfo = res
					}
				})
			},
			getWeekData() {
				//判断是否显示周六日
				var showSat = uni.getStorageSync(this.$ProjectConfig.showSat)
				var showSun = uni.getStorageSync(this.$ProjectConfig.showSun)

				var new_Date = new Date()
				var timesStamp = new_Date.getTime();
				var currenDay = new_Date.getDay(); //getday 是一周当中的第几天
				this.weekList = []
				for (var i = 0; i < 7; i++) {
					var curDate = new Date(timesStamp + 24 * 60 * 60 * 1000 * (i - (currenDay + 7) % 7));
					var month = curDate.getMonth() + 1;
					var day = curDate.getDate();
					if (parseInt(month) < 10) {
						month = '0' + month;
					}
					if (parseInt(day) < 10) {
						day = '0' + day;
					}
					var weekBean = {
						title: this.week[i],
						date: month + '/' + day,
						isShowDot: false
					}
					if (parseInt(currenDay) === i) {
						weekBean.isShowDot = true
					}
					this.weekList.push(weekBean)
				}

				if (showSat) {
					this.weekList.splice(6, 1)
				}

				if (showSun) {
					this.weekList.splice(0, 1)
				}
			},

			getBackgrand(type) {
				switch (type) {
					case 0:
						return '../../static/hometable/bg_main_img1.png';
					case 1:
						return '../../static/hometable/bg_main_img2.png';
					case 2:
						return '../../static/hometable/bg_main_img3.png';
					case 3:
						return '../../static/hometable/bg_main_img4.png';
					case 4:
						return '../../static/hometable/bg_main_img5.png';
					case 5:
						return '../../static/hometable/bg_main_img6.png';
					case 6:
						return '../../static/hometable/bg_main_img7.png';
					case 7:
						return '../../static/hometable/bg_main_img8.png';
					case 8:
						return '../../static/hometable/bg_main_img9.png';
					case 9:
						return '../../static/hometable/bg_main_img10.png';
					case 10:
						return '../../static/hometable/bg_main_img11.png';
					case 11:
						return '../../static/hometable/bg_main_img12.png';
					case 12:
						return '../../static/hometable/bg_main_img13.png';
				}
			},

			//点击指定位置添加课程
			AddData(week, startDay) {
				uni.navigateTo({
					url: '../add_data/add_data?week=' + week + '&startDay=' + startDay
				})
			},

			// type==0  早自习   
			//choose ==1 返回字符串   2 返回时间戳
			getMorTime(timestempEnd, choose) {
				// let Time = new Date(num);
				// let timestemp = Time.getTime();
				// let timestempEnd = Time.getTime(); //3600000=一小时    2700000 45分钟
				let date = new Date(timestempEnd);
				let h = date.getHours();
				h = h < 10 ? ('0' + h) : h; //小时补0
				let m = date.getMinutes();
				m = m < 10 ? ('0' + m) : m; //分钟补0

				if (choose == 1) {
					return h + ":" + m;
				} else {
					return timestempEnd;
				}
			},

			getMorningData() {
				//判断是否显示周六日
				var showSat = uni.getStorageSync(this.$ProjectConfig.showSat)
				var showSun = uni.getStorageSync(this.$ProjectConfig.showSun)

				// this.mainData
				//早自习1节课
				var morningIndex = 1;
				//上午4节课
				var AMIndex = 4;
				// 下午4节课
				var PMIndex = 4;
				// 晚上三节课
				var nightIndex = 3;

				// 读取缓存在本地的数据
				const moiningValue = uni.getStorageSync(this.$ProjectConfig.MORIndex);
				const amValue = uni.getStorageSync(this.$ProjectConfig.AMIndex);
				const pmValue = uni.getStorageSync(this.$ProjectConfig.PMIndex);
				const ngValue = uni.getStorageSync(this.$ProjectConfig.NGIndex);

				if (moiningValue || moiningValue === 0) {
					morningIndex = moiningValue;
				}
				if (amValue || amValue === 0) {
					AMIndex = amValue + 1;
				}
				if (pmValue || pmValue === 0) {
					PMIndex = pmValue + 1;
				}
				if (ngValue || ngValue === 0) {
					nightIndex = ngValue + 1;
				}

				let timeDate = "2021-08-02 06:00:00";
				let timeAMDate = "2021-08-02 08:00:00";
				let timePMDate = "2021-08-02 14:00:00";
				let timeNIGDate = "2021-08-02 19:00:00";

				//////////////////////////////////////////////////早自习数据
				var mainBean = {
					title: '早自习',
					type: 0,
					tableList: []
				}

				for (let i = 0; i < morningIndex; i++) {
					var tableBean = {
						index: i + 1, //课节
						startTime: '06:00',
						endTime: '07:00',
						dataList: []
					}
					for (let j = 0; j < 7; j++) {
						var dataBean = {
							dataTitle: '',
							dataName: '',
							dataAddress: '',
							type: 0, //背景色
							week: j,
							startDay: 0
						}
						tableBean.dataList.push(dataBean);
					}

					//从数据列表循环取出数据
					if (this.allDataList.length !== 0) {
						for (let k = 0; k < this.allDataList.length; k++) {
							for (let t = 0; t < this.allDataList[k].timeList.length; t++) {
								//比对出i 循环里面的数据  此处i循环代表早自习的课节数
								if (parseInt(this.allDataList[k].timeList[t].startDay) === i) {
									switch (parseInt(this.allDataList[k].timeList[t].week)) {
										case 0:
											var dataBean = {
												dataTitle: this.allDataList[k].title,
												dataName: this.allDataList[k].name,
												dataAddress: this.allDataList[k].address,
												type: this.allDataList[k].type, //背景色
												week: 0,
												startDay: 0
											}
											tableBean.dataList[0] = dataBean
											break;
										case 1:
											var dataBean = {
												dataTitle: this.allDataList[k].title,
												dataName: this.allDataList[k].name,
												dataAddress: this.allDataList[k].address,
												type: this.allDataList[k].type, //背景色
												week: 1,
												startDay: 0
											}
											tableBean.dataList[1] = dataBean
											break;
										case 2:
											var dataBean = {
												dataTitle: this.allDataList[k].title,
												dataName: this.allDataList[k].name,
												dataAddress: this.allDataList[k].address,
												type: this.allDataList[k].type, //背景色
												week: 2,
												startDay: 0
											}
											tableBean.dataList[2] = dataBean
											break;
										case 3:
											var dataBean = {
												dataTitle: this.allDataList[k].title,
												dataName: this.allDataList[k].name,
												dataAddress: this.allDataList[k].address,
												type: this.allDataList[k].type, //背景色
												week: 3,
												startDay: 0
											}
											tableBean.dataList[3] = dataBean
											break;
										case 4:
											var dataBean = {
												dataTitle: this.allDataList[k].title,
												dataName: this.allDataList[k].name,
												dataAddress: this.allDataList[k].address,
												type: this.allDataList[k].type, //背景色
												week: 4,
												startDay: 0
											}
											tableBean.dataList[4] = dataBean
											break;
										case 5:
											var dataBean = {
												dataTitle: this.allDataList[k].title,
												dataName: this.allDataList[k].name,
												dataAddress: this.allDataList[k].address,
												type: this.allDataList[k].type, //背景色
												week: 5,
												startDay: 0
											}
											tableBean.dataList[5] = dataBean
											break;
										case 6:
											var dataBean = {
												dataTitle: this.allDataList[k].title,
												dataName: this.allDataList[k].name,
												dataAddress: this.allDataList[k].address,
												type: this.allDataList[k].type, //背景色
												week: 6,
												startDay: 0
											}
											tableBean.dataList[6] = dataBean
											break;
									}
								}
							}
						}
					}
					mainBean.tableList.push(tableBean);

					if (showSat) {
						mainBean.tableList[i].dataList.splice(6, 1)
					}

					if (showSun) {
						mainBean.tableList[i].dataList.splice(0, 1)
					}
				}

				if (morningIndex != 0) {
					this.mainList.push(mainBean);
				}

				//////////////////////////////////////////////////上午数据
				var mainBean = {
					title: '上午',
					type: 1,
					tableList: []
				}
				let Time = new Date(timeAMDate);
				let timeAMStarttemp;
				let timeAMEndtemp;

				for (let i = 0; i < AMIndex; i++) {
					var tableBean = {
						index: i + morningIndex + 1, //课节
						startTime: '',
						endTime: '',
						dataList: []
					}

					if (i == 0) {
						tableBean.startTime = '08:00';
						tableBean.endTime = this.getMorTime(Time.getTime() + 2700000, 1);
					} else {
						timeAMStarttemp = this.getMorTime(Time.getTime() + (2700000 + 600000) * i, 2);
						timeAMEndtemp = this.getMorTime(timeAMStarttemp + 2700000, 2);
						tableBean.startTime = this.getMorTime(timeAMStarttemp, 1);
						tableBean.endTime = this.getMorTime(timeAMEndtemp, 1);
					}
					for (let j = 0; j < 7; j++) {
						var dataBean = {
							dataTitle: '',
							dataName: '',
							dataAddress: '',
							type: 12, //背景色
							week: j,
							startDay: i + morningIndex
						}
						tableBean.dataList.push(dataBean);
					}
					//从数据列表循环取出数据
					if (this.allDataList.length !== 0) {
						for (let k = 0; k < this.allDataList.length; k++) {
							for (let t = 0; t < this.allDataList[k].timeList.length; t++) {
								//比对出i 循环里面的数据  此处i循环代表早自习的课节数
								if (parseInt(this.allDataList[k].timeList[t].startDay) === (i + morningIndex)) {
									switch (parseInt(this.allDataList[k].timeList[t].week)) {
										case 0:
											var dataBean = {
												dataTitle: this.allDataList[k].title,
												dataName: this.allDataList[k].name,
												dataAddress: this.allDataList[k].address,
												type: this.allDataList[k].type, //背景色
												week: 0,
												startDay: morningIndex + i
											}
											tableBean.dataList[0] = dataBean
											break;
										case 1:
											var dataBean = {
												dataTitle: this.allDataList[k].title,
												dataName: this.allDataList[k].name,
												dataAddress: this.allDataList[k].address,
												type: this.allDataList[k].type, //背景色
												week: 1,
												startDay: morningIndex + i
											}
											tableBean.dataList[1] = dataBean
											break;
										case 2:
											var dataBean = {
												dataTitle: this.allDataList[k].title,
												dataName: this.allDataList[k].name,
												dataAddress: this.allDataList[k].address,
												type: this.allDataList[k].type, //背景色
												week: 2,
												startDay: morningIndex + i
											}
											tableBean.dataList[2] = dataBean
											break;
										case 3:
											var dataBean = {
												dataTitle: this.allDataList[k].title,
												dataName: this.allDataList[k].name,
												dataAddress: this.allDataList[k].address,
												type: this.allDataList[k].type, //背景色
												week: 3,
												startDay: morningIndex + i
											}
											tableBean.dataList[3] = dataBean
											break;
										case 4:
											var dataBean = {
												dataTitle: this.allDataList[k].title,
												dataName: this.allDataList[k].name,
												dataAddress: this.allDataList[k].address,
												type: this.allDataList[k].type, //背景色
												week: 4,
												startDay: morningIndex + i
											}
											tableBean.dataList[4] = dataBean
											break;
										case 5:
											var dataBean = {
												dataTitle: this.allDataList[k].title,
												dataName: this.allDataList[k].name,
												dataAddress: this.allDataList[k].address,
												type: this.allDataList[k].type, //背景色
												week: 5,
												startDay: morningIndex + i
											}
											tableBean.dataList[5] = dataBean
											break;
										case 6:
											var dataBean = {
												dataTitle: this.allDataList[k].title,
												dataName: this.allDataList[k].name,
												dataAddress: this.allDataList[k].address,
												type: this.allDataList[k].type, //背景色
												week: 6,
												startDay: morningIndex + i
											}
											tableBean.dataList[6] = dataBean
											break;
									}
								}
							}
						}
					}
					mainBean.tableList.push(tableBean);

					if (showSat) {
						mainBean.tableList[i].dataList.splice(6, 1)
					}

					if (showSun) {
						mainBean.tableList[i].dataList.splice(0, 1)
					}
				}
				this.mainList.push(mainBean);

				//////////////////////////////////////////////////下午数据
				var mainBean = {
					title: '下午',
					type: 2,
					tableList: []
				}
				let PMTime = new Date(timePMDate);
				let timePMStarttemp;
				let timePMEndtemp;

				for (let i = 0; i < PMIndex; i++) {
					var tableBean = {
						index: i + morningIndex + AMIndex + 1, //课节
						startTime: '',
						endTime: '',
						dataList: []
					}

					if (i == 0) {
						tableBean.startTime = '14:00';
						tableBean.endTime = this.getMorTime(PMTime.getTime() + 2700000, 1);
					} else {
						timePMStarttemp = this.getMorTime(PMTime.getTime() + (2700000 + 600000) * i, 2);
						timePMEndtemp = this.getMorTime(timePMStarttemp + 2700000, 2);
						tableBean.startTime = this.getMorTime(timePMStarttemp, 1);
						tableBean.endTime = this.getMorTime(timePMEndtemp, 1);
					}

					for (let j = 0; j < 7; j++) {
						var dataBean = {
							dataTitle: '',
							dataName: '',
							dataAddress: '',
							type: 11, //背景色
							week: j,
							startDay: i + morningIndex + AMIndex
						}
						tableBean.dataList.push(dataBean);
					}

					//从数据列表循环取出数据
					if (this.allDataList.length !== 0) {
						for (let k = 0; k < this.allDataList.length; k++) {
							for (let t = 0; t < this.allDataList[k].timeList.length; t++) {
								//比对出i 循环里面的数据  此处i循环代表早自习的课节数
								if (parseInt(this.allDataList[k].timeList[t].startDay) === (i + morningIndex + AMIndex)) {
									switch (parseInt(this.allDataList[k].timeList[t].week)) {
										case 0:
											var dataBean = {
												dataTitle: this.allDataList[k].title,
												dataName: this.allDataList[k].name,
												dataAddress: this.allDataList[k].address,
												type: this.allDataList[k].type, //背景色
												week: 0,
												startDay: morningIndex + AMIndex + i
											}
											tableBean.dataList[0] = dataBean
											break;
										case 1:
											var dataBean = {
												dataTitle: this.allDataList[k].title,
												dataName: this.allDataList[k].name,
												dataAddress: this.allDataList[k].address,
												type: this.allDataList[k].type, //背景色
												week: 1,
												startDay: morningIndex + AMIndex + i
											}
											tableBean.dataList[1] = dataBean
											break;
										case 2:
											var dataBean = {
												dataTitle: this.allDataList[k].title,
												dataName: this.allDataList[k].name,
												dataAddress: this.allDataList[k].address,
												type: this.allDataList[k].type, //背景色
												week: 2,
												startDay: morningIndex + AMIndex + i
											}
											tableBean.dataList[2] = dataBean
											break;
										case 3:
											var dataBean = {
												dataTitle: this.allDataList[k].title,
												dataName: this.allDataList[k].name,
												dataAddress: this.allDataList[k].address,
												type: this.allDataList[k].type, //背景色
												week: 3,
												startDay: morningIndex + AMIndex + i
											}
											tableBean.dataList[3] = dataBean
											break;
										case 4:
											var dataBean = {
												dataTitle: this.allDataList[k].title,
												dataName: this.allDataList[k].name,
												dataAddress: this.allDataList[k].address,
												type: this.allDataList[k].type, //背景色
												week: 4,
												startDay: morningIndex + AMIndex + i
											}
											tableBean.dataList[4] = dataBean
											break;
										case 5:
											var dataBean = {
												dataTitle: this.allDataList[k].title,
												dataName: this.allDataList[k].name,
												dataAddress: this.allDataList[k].address,
												type: this.allDataList[k].type, //背景色
												week: 5,
												startDay: morningIndex + AMIndex + i
											}
											tableBean.dataList[5] = dataBean
											break;
										case 6:
											var dataBean = {
												dataTitle: this.allDataList[k].title,
												dataName: this.allDataList[k].name,
												dataAddress: this.allDataList[k].address,
												type: this.allDataList[k].type, //背景色
												week: 6,
												startDay: morningIndex + AMIndex + i
											}
											tableBean.dataList[6] = dataBean
											break;
									}
								}
							}
						}
					}

					mainBean.tableList.push(tableBean);

					if (showSat) {
						mainBean.tableList[i].dataList.splice(6, 1)
					}

					if (showSun) {
						mainBean.tableList[i].dataList.splice(0, 1)
					}
				}
				this.mainList.push(mainBean);

				//////////////////////////////////////////////////晚自习数据
				var mainBean = {
					title: '晚自习',
					type: 3,
					tableList: []
				}
				let NIGTime = new Date(timeNIGDate);
				let timeNIGStarttemp;
				let timeNIGEndtemp;

				for (let i = 0; i < nightIndex; i++) {
					var tableBean = {
						index: i + morningIndex + AMIndex + PMIndex + 1, //课节
						time: '',
						dataList: []
					}
					if (i == 0) {
						tableBean.startTime = '19:00';
						tableBean.endTime = this.getMorTime(NIGTime.getTime() + 2700000, 1);
					} else {
						timeNIGStarttemp = this.getMorTime(NIGTime.getTime() + (2700000 + 600000) * i, 2);
						timeNIGEndtemp = this.getMorTime(timeNIGStarttemp + 2700000, 2);
						tableBean.startTime = this.getMorTime(timeNIGStarttemp, 1);
						tableBean.endTime = this.getMorTime(timeNIGEndtemp, 1);
					}

					for (let j = 0; j < 7; j++) {
						var dataBean = {
							dataTitle: '',
							dataName: '',
							dataAddress: '',
							type: 10, //背景色
							week: j,
							startDay: i + morningIndex + AMIndex + PMIndex
						}
						tableBean.dataList.push(dataBean);
					}

					//从数据列表循环取出数据
					if (this.allDataList.length !== 0) {
						for (let k = 0; k < this.allDataList.length; k++) {
							for (let t = 0; t < this.allDataList[k].timeList.length; t++) {
								//比对出i 循环里面的数据  此处i循环代表早自习的课节数
								if (parseInt(this.allDataList[k].timeList[t].startDay) === (i + morningIndex + AMIndex +
										PMIndex)) {
									switch (parseInt(this.allDataList[k].timeList[t].week)) {
										case 0:
											var dataBean = {
												dataTitle: this.allDataList[k].title,
												dataName: this.allDataList[k].name,
												dataAddress: this.allDataList[k].address,
												type: this.allDataList[k].type, //背景色
												week: 0,
												startDay: morningIndex + AMIndex + PMIndex + i
											}
											tableBean.dataList[0] = dataBean
											break;
										case 1:
											var dataBean = {
												dataTitle: this.allDataList[k].title,
												dataName: this.allDataList[k].name,
												dataAddress: this.allDataList[k].address,
												type: this.allDataList[k].type, //背景色
												week: 1,
												startDay: morningIndex + AMIndex + PMIndex + i
											}
											tableBean.dataList[1] = dataBean
											break;
										case 2:
											var dataBean = {
												dataTitle: this.allDataList[k].title,
												dataName: this.allDataList[k].name,
												dataAddress: this.allDataList[k].address,
												type: this.allDataList[k].type, //背景色
												week: 2,
												startDay: morningIndex + AMIndex + PMIndex + i
											}
											tableBean.dataList[2] = dataBean
											break;
										case 3:
											var dataBean = {
												dataTitle: this.allDataList[k].title,
												dataName: this.allDataList[k].name,
												dataAddress: this.allDataList[k].address,
												type: this.allDataList[k].type, //背景色
												week: 3,
												startDay: morningIndex + AMIndex + PMIndex + i
											}
											tableBean.dataList[3] = dataBean
											break;
										case 4:
											var dataBean = {
												dataTitle: this.allDataList[k].title,
												dataName: this.allDataList[k].name,
												dataAddress: this.allDataList[k].address,
												type: this.allDataList[k].type, //背景色
												week: 4,
												startDay: morningIndex + AMIndex + PMIndex + i
											}
											tableBean.dataList[4] = dataBean
											break;
										case 5:
											var dataBean = {
												dataTitle: this.allDataList[k].title,
												dataName: this.allDataList[k].name,
												dataAddress: this.allDataList[k].address,
												type: this.allDataList[k].type, //背景色
												week: 5,
												startDay: morningIndex + AMIndex + PMIndex + i
											}
											tableBean.dataList[5] = dataBean
											break;
										case 6:
											var dataBean = {
												dataTitle: this.allDataList[k].title,
												dataName: this.allDataList[k].name,
												dataAddress: this.allDataList[k].address,
												type: this.allDataList[k].type, //背景色
												week: 6,
												startDay: morningIndex + AMIndex + PMIndex + i
											}
											tableBean.dataList[6] = dataBean
											break;
									}
								}
							}
						}
					}

					mainBean.tableList.push(tableBean);

					if (showSat) {
						mainBean.tableList[i].dataList.splice(6, 1)
					}

					if (showSun) {
						mainBean.tableList[i].dataList.splice(0, 1)
					}
				}
				this.mainList.push(mainBean);

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
	.content {
		width: 100%;
		display: flex;
		background: #F8C981;
		flex-direction: column;

		.top_content {
			background-color: #F8C981;
			display: flex;
			flex-direction: column;
			//置于屏幕顶部，不受滑动影响
			position: sticky;
			/* #ifdef H5 */
			top: 44px;
			/* #endif */
			/* #ifndef H5 */
			top: 0;
			/* #endif */
			z-index: 999;
			flex: 1;

			.title_content {
				align-items: center;
				display: flex;
				flex-direction: row;

				.title_content_text {
					margin-left: 20rpx;
					color: $uni-text-color;
					// font-size: 14px;
				}

				.title_content_img {
					margin-left: 5rpx;
					width: 13rpx;
					height: 23rpx;
				}
			}

			.week_content {
				background: #F8C981;
				padding-top: 1rpx;
				margin-bottom: 1rpx;
				width: 100%;
				height: 93rpx;
				display: flex;
				flex-direction: row;

				.week_conent-left {
					display: flex;
					flex-direction: column;
					background: #F9EACD;
					height: 93rpx;
					width: 12.5%;

					.logo {
						position: absolute;
						height: 93rpx;
						width: 12.5%;
					}

					.week_content_text1 {
						align-self: flex-end;
						margin-top: 15rpx;
						margin-right: 5rpx;
						color: $uni-text-color;
						font-size: 21rpx;
					}

					.week_content_text2 {
						margin-top: 12rpx;
						margin-left: 5rpx;
						color: $uni-text-color;
						font-size: 21rpx;
					}
				}

				.week_item {
					background: #F9EACD;
					margin-left: 1rpx;
					padding-top: 2rpx;
					height: 89;
					flex: 1;
					display: flex;
					flex-direction: column;
					text-align: center;

					//week字体未选中时显示的样式
					.textNor {
						padding-top: 3rpx;
						color: $uni-text-color;
						font-size: 24rpx;
					}

					//week字体选中时显示的样式
					.textSelect {
						padding-top: 3rpx;
						color: #F8C981;
						font-size: 24rpx;
					}

					.week_dot {
						padding-top: 5rpx;
						justify-self: center;
						width: auto;

						.week_dot_item {
							margin: auto;
							justify-content: start;
							width: 8rpx;
							width: 8rpx;
							border-radius: 8rpx;
							height: 8rpx;
							background: #F8C981;
						}
					}
				}
			}
		}

		.content_all {
			width: 100%;
			height: auto;
			background: #F8C981;
			display: flex;
			flex-direction: column;

			.item_content {
				width: 100%;
				height: auto;
				display: flex;
				flex-direction: column;

				.table_text {
					font-size: 28rpx;
					color: $uni-text-color;
					margin-bottom: 1rpx;
					background: #f4f4f4;
					text-align: center;
					width: 100%;
					height: 58rpx;
					line-height: 58rpx;
				}

				.table_content {
					width: 100%;
					margin-bottom: 1rpx;
					height: 140rpx;
					display: flex;
					flex-direction: row;

					.table_first {
						display: flex;
						flex-direction: column;
						background: #F8C981;
						justify-content: center;
						height: 100%;
						width: 12.5%;

						.index_text {
							margin-left: auto;
							margin-right: auto;
							font-size: 30rpx;
							//文字加粗
							font-weight: bold;
							color: $uni-text-color;
						}

						.index_time {
							margin-top: 10rpx;
							margin-left: auto;
							margin-right: auto;
							font-size: 24rpx;
							color: $uni-text-color;
						}
					}

					.table_item {
						display: flex;
						flex-direction: column;
						margin-left: 1rpx;
						flex: 1;
						height: 100%;
						justify-content: center;
						text-align: center;
						background: #fff;

						.add_data {
							width: 100%;
							height: 100%;
							text-align: center;
							justify-content: center;
							display: flex;
							flex-direction: column;

							.table_data_text {
								margin: auto;
							}
						}

						.table_data_view {
							width: 100%;
							height: 100%;
							display: flex;
							align-items: center;
							flex-direction: column;
							justify-content: center;

							image {
								display: block;
								margin: auto;
								width: 95%;
								height: 96%;
							}

							.data-content {
								display: flex;
								margin: auto;
								flex-direction: column;
								position: absolute;


								text:nth-child(1) {
									z-index: 100;
									margin-top: 2rpx;
									margin-bottom: 2rpx;
									width: 93rpx;
									font-size: 8.5px;
									color: $uni-text-color;
									overflow: hidden;
									-webkit-line-clamp: 2;
									text-overflow: ellipsis;
									display: -webkit-box;
									-webkit-box-orient: vertical;
								}

								text:nth-child(2) {
									z-index: 100;
									margin-top: 2rpx;
									margin-bottom: 2rpx;
									width: 93rpx;
									font-size: 8.5px;
									color: $uni-text-color;
									overflow: hidden;
									-webkit-line-clamp: 1;
									text-overflow: ellipsis;
									display: -webkit-box;
									-webkit-box-orient: vertical;
								}

								text:nth-child(3) {
									z-index: 100;
									margin-top: 2rpx;
									margin-bottom: 2rpx;
									width: 93rpx;
									font-size: 8.5px;
									color: $uni-text-color;
									overflow: hidden;
									-webkit-line-clamp: 1;
									text-overflow: ellipsis;
									display: -webkit-box;
									-webkit-box-orient: vertical;
								}
							}
						}
					}
				}

			}

		}

		.priview {
			position: fixed;
			z-index: 9999;
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			background-color: rgba($color: #000000, $alpha: 0.2);

			.priview-content {
				background-color: #FFFFFF;
				border-radius: 15rpx;
				padding-left: 20rpx;
				padding-right: 20rpx;
				padding-top: 30rpx;
				padding-bottom: 30rpx;
				width: 44%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				text {
					margin-top: 10rpx;
					margin-bottom: 10rpx;
					font-size: 14px;
					color: #333333;
				}
			}
		}
	}
</style>
