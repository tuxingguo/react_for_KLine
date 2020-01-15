import React from 'react';
import { message, PageHeader, Button, notification, Icon } from 'antd';

// 下面是按需加载
import 'echarts/lib/chart/lines';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
import ReactEcharts from 'echarts-for-react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import CreateForm from './components/CreateForm';
import OverModal from './components/OverModal';
import OrderModal from './components/OrderModal';
import StopLossModal from './components/StopLossModal';

@connect(({ kLine, user }) => ({
    kLine,
    currentUser: user.currentUser,
}))


export default class Lines extends React.Component {
    constructor(props) {
        super(props);
        const { location: { state } } = this.props;
        const transCode = state.TRANSCODE;
        const transType = state.TRANSETYPE
        const { HYCS } = state;
        const { ZXDBJ } = state;
        const { BZJB } = state;
        const { CYCLE } = state;
        this.state = {
            ...super.state,
            tempNum: 0,
            transCode, // 合约品种
            transType, // 品种名称
            transUnit: (transCode === 'T' || transCode === 'TF') ? HYCS / 100 : HYCS, // 合约乘数
            transMargin: BZJB, // 保证金比例
            minPriceChange: ZXDBJ, // 最小变动价
            isOpen: false,
            orderVisible: false,
            lossVisible: false,
            childrenDrawer1: false,
            childrenDrawer2: false,
            stopLoss: ZXDBJ * 10,
            stopProfit: ZXDBJ * 20,
            priceDifference: ZXDBJ * 10,
            stopLossIsOpen1: false,
            stopLossIsOpen2: false,
            rateLevel: 0,
            overVisible: false,
        };
    }

    // 组件将要加载
    componentWillMount() {
        const { dispatch } = this.props;
        const { currentUser = {} } = this.props;
        dispatch({
            type: 'kLine/getUserInfo',
            payload: {
                userId: currentUser.userId,
            },
        });
        dispatch({
            type: 'kLine/getOriginTickData',
            payload: {
                transCode: this.state.transCode,
            },
        });
        this.props.kLine.trainId = '80000902220200115142930' // 初始化训练Id
    }

    // 组件即将销毁
    componentWillUnmount() {
        this.clearTheComponent();
    }

    clearTheComponent = () => {
        this.props.kLine.tickData = [];
        this.props.kLine.isOver = false;
        this.props.kLine.count = 0;
        this.props.kLine.nextTick = [];
        this.props.kLine.lastTick = [];
        this.props.kLine.positionData = [];
        this.props.kLine.handNum = 1;
        this.props.kLine.direction = '1';
        this.props.kLine.openOrClose = '1';
        this.props.kLine.advisePrice = 0;
        this.props.kLine.profitClose = 0;
        this.props.kLine.profit = 0;
        this.props.kLine.orderPrice = 0;
        this.props.kLine.tempProfitClose = 0;
        this.props.kLine.bond = 0;
        this.props.kLine.fields = [];
        this.props.kLine.strategyIsOpen = false;
        this.props.kLine.currentInterest = 1000000;
        this.props.kLine.tempCurrentInterest = 1000000;
        this.props.kLine.availableFund = 1000000;
    }

    handRestart = () => {
        this.clearTheComponent();
        const { dispatch } = this.props;
        dispatch({
            type: 'kLine/getNextTick',
            payload: {
                orderCount: this.props.kLine.count,
                tradingDay: this.props.kLine.tradingDay,
                mainContract: this.props.kLine.mainContract,
                start: this.props.kLine.start,
                end: this.props.kLine.end,
            },
        });
    }

    getOption = () => {
        // 数据意义：开盘(open)，收盘(close)，最低(lowest)，最高(highest) 成交量(volume)
        function splitData(rawData) {
            const categoryData = [];
            const values = [];
            const volumes = [];
            for (let i = 0; i < rawData.length; i += 1) {
                const arr = [rawData[i][0], rawData[i][1], rawData[i][2],
                rawData[i][3], rawData[i][4], rawData[i][5]];
                values.push(arr);
                const a = arr.splice(0, 1)[0];
                const b = `${moment(a).format('YYYY/MM/DD')} ${rawData[i][6]}`;
                categoryData.push(b);
                volumes.push(arr[4]);
            }
            return {
                categoryData,
                values,
                volumes,
            };
        }

        const {
            kLine: { tickData },
        } = this.props;

        const data = splitData(tickData);

        // MA计算公式
        function calculateMA(dayCount, values) {
            const result = [];
            for (let i = 0; i < values.length; i += 1) {
                if (i < dayCount) {
                    result.push('-');
                    continue;
                }
                let sum = 0;
                for (let j = 0; j < dayCount; j += 1) {
                    sum += values[i - j][1];
                }
                result.push((sum / dayCount).toFixed(3));
            }
            return result;
        }

        const option = {
            title: {
                text: '',
                left: 0,
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    animation: false,
                    type: 'cross',
                    lineStyle: {
                        color: '#376df4',
                        width: 2,
                        opacity: 1,
                    },
                },
            },
            legend: {
                data: ['分钟K', 'MA5', 'MA10', 'MA20', 'MA30'],
            },
            grid: [{
                left: '5%',
                right: '1%',
                height: '60%',
            }, {
                left: '5%',
                right: '1%',
                top: '75%',
                height: '16%',
            }, {
                left: '5%',
                right: '1%',
                top: '87%',
                height: '8%',
            }],
            xAxis: [{
                type: 'category',
                data: data.categoryData,
                scale: true,
                boundaryGap: false,
                axisLine: {
                    onZero: false,
                },
                splitLine: {
                    show: false,
                },
                splitNumber: 20,
                axisTick: { show: true },
                axisLabel: { show: true },
            }, {
                type: 'category',
                gridIndex: 1,
                axisLine: { show: false },
                axisTick: { show: false },
                data: data.categoryData,
                axisLabel: {
                    show: false,
                },
            }, {
                type: 'category',
                gridIndex: 2,
                axisLine: { show: false },
                axisTick: { show: false },
                // data: data.categoryData,
                axisLabel: {
                    show: false,
                },
            }],
            yAxis: [{
                scale: true,
                splitLine: { show: false },
                splitArea: {
                    show: false,
                },
            }, {
                gridIndex: 1,
                splitNumber: 3,
                axisLine: {
                    onZero: false,
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                splitLine: {
                    show: false,
                },
                axisLabel: {
                    show: false,
                },
            }, {
                gridIndex: 2,
                splitNumber: 4,
                axisLine: {
                    onZero: false,
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                splitLine: {
                    show: false,
                },
                axisLabel: {
                    show: false,
                },
            }],
            dataZoom: [{
                type: 'inside',
                xAxisIndex: [0, 0],
                start: 30,
                end: 100,
            }, {
                show: true,
                xAxisIndex: [0, 1],
                type: 'slider',
                top: '95%',
                height: '4%',
                start: 30,
                end: 100,
            }, {
                show: false,
                xAxisIndex: [0, 2],
                type: 'slider',
                start: 30,
                end: 100,
            }],
            series: [{
                name: '分钟K',
                type: 'candlestick',
                data: data.values,
                itemStyle: {
                    normal: {
                        color: '#ef232a',
                        color0: '#14b143',
                        borderColor: '#ef232a',
                        borderColor0: '#14b143',
                    },
                },
            }, {
                name: 'Volume',
                type: 'bar',
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: data.volumes,
                itemStyle: {
                    normal: {
                        color(params) {
                            let colorList;
                            if (data.values[params.dataIndex][1] >=
                                data.values[params.dataIndex][0]) {
                                colorList = '#ef232a';
                            } else {
                                colorList = '#14b143';
                            }
                            return colorList;
                        },
                    },
                },
            }, {
                name: 'MA5',
                type: 'line',
                data: calculateMA(5, data.values),
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    normal: {
                        width: 1,
                    },
                },
            }, {
                name: 'MA10',
                type: 'line',
                data: calculateMA(10, data.values),
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    normal: {
                        width: 1,
                    },
                },
            }, {
                name: 'MA20',
                type: 'line',
                data: calculateMA(20, data.values),
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    normal: {
                        width: 1,
                    },
                },
            }, {
                name: 'MA30',
                type: 'line',
                data: calculateMA(30, data.values),
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    normal: {
                        width: 1,
                    },
                },
            }],
        }
        return option
    }

    handleOrder = fields => {
        this.props.kLine.advisePrice = fields.price; // 修复点击下单价格复位的情况
        this.setState({
            tempNum: fields.num, // 重新渲染
        });

        if (fields.price * fields.num * this.state.transUnit * this.state.transMargin >
            this.props.kLine.availableFund) {
            message.error('资金不足');
            return;
        }

        if (this.props.kLine.positionData.length === 0 && fields.openOrClose === '2') {
            message.error('当前没有仓位，请先开仓');
            return;
        }
        this.props.kLine.handNum = fields.num;
        this.props.kLine.direction = fields.direction;
        this.props.kLine.openOrClose = fields.openOrClose;
        this.props.kLine.orderPrice = fields.price;

        this.props.kLine.fields = fields;
        this.setState({
            orderVisible: true, // 重新渲染
        });
    }

    confirmOrder = () => {
        this.setState({ // 触发渲染
            orderVisible: false,
        });
        this.orderProcess(this.props.kLine.fields);
    }

    cancelOrder = () => {
        this.setState({ // 触发渲染
            orderVisible: false,
        });
    }

    // 开始下单
    orderProcess = fields => {
        const tempNextTick = this.props.kLine.nextTick;

        if (fields.openOrClose === '1') { // 开仓
            let profit = 0;
            if (fields.direction === '1') { // 买
                profit = Number(((tempNextTick[2] - fields.price) * fields.num *
                    this.state.transUnit).toFixed(2)); // 浮动盈亏(最新价-开仓价)*手数*合约乘数
            } else { // 卖
                profit = Number(((fields.price - tempNextTick[2]) * fields.num *
                    this.state.transUnit).toFixed(2)); // 浮动盈亏(开仓价-最新价)*手数*合约乘数
            }
            const bond = Number((fields.price * fields.num * this.state.transUnit *
                this.state.transMargin).toFixed(2)); // 保证金

            this.recordPositionData(this.props.kLine.mainContract, fields.num,
                fields.direction, fields.price, profit, bond); // 合约号、买卖方向、开仓成本、浮动盈亏、保证金
        } else { // 平仓
            const a = this.closePositionData(fields.direction, fields.num, fields.price);
            if (!a) { return; }
        }

        const { dispatch } = this.props;
        this.props.kLine.count = this.props.kLine.count + 1; // 下单数加1

        // 加载下一条K线
        dispatch({
            type: 'kLine/getNextTick',
            payload: {
                orderCount: this.props.kLine.count,
                mainContract: this.props.kLine.mainContract,
                tradingDay: this.props.kLine.tradingDay,
                start: this.props.kLine.start,
                end: this.props.kLine.end,
            },
            callback: res => {
                if (this.props.kLine.strategyIsOpen === true) {
                    this.calculatStrategy();
                }
                if (this.state.stopLossIsOpen1 === true) { // 表示开启了"限价止损/止盈"
                    this.calculateStopLoss1();
                }
                if (this.state.stopLossIsOpen2 === true) { // 表示开启了"跟踪止损"
                    this.calculateStopLoss2();
                }
                if (res.isOver === true) {
                    const rateLevel = this.calculateRate();
                    this.trainRecord();
                    this.setState({
                        rateLevel,
                        overVisible: true,
                    });
                }
            },
        });

        // 下单成功，这里开始计算该客户的盈亏情况
        let tempBond = 0;
        this.props.kLine.profit = 0;
        this.props.kLine.bond = 0;
        this.props.kLine.positionData.map(item => {
            tempBond += item.BOND; // 保证金
            this.props.kLine.bond += item.BOND;
            this.props.kLine.profit += item.PROFITINPOSIOTION; //  浮动盈亏
        });

        this.props.kLine.tempCurrentInterest = this.props.kLine.currentInterest +
            this.props.kLine.profit + this.props.kLine.profitClose;

        const availableFund = this.props.kLine.availableFundFix - tempBond
            + this.props.kLine.profitClose;

        this.props.kLine.availableFund = availableFund;
        const { currentUser = {} } = this.props;
        dispatch({
            type: 'kLine/saveOrder',
            payload: {
                userId: currentUser.userId,
                trainId: this.props.kLine.trainId,
                action: 'order', // 1 代表下单，2 代表观望
                instrumentId: this.props.kLine.mainContract,
                direction: fields.direction === '1' ? 'buy' : 'sell',
                openOrClose: fields.openOrClose === '1' ? 'open' : 'close',
                handNum: fields.num,
                bond: tempBond, // 保证金
                profitInPosition: this.props.kLine.profit, // 浮动盈亏
                profitInClosePosition: this.props.kLine.profitClose, // 平仓盈亏
                currentInterest: this.props.kLine.tempCurrentInterest, // 当前权益
                availableFund, // 可用资金
            },
        });
        console.log('profitClose=', this.props.kLine.profitClose);
    }

    // 观望
    handleWatchOn = () => {
        this.props.kLine.count = this.props.kLine.count + 1; // count数加1
        const { currentUser = {} } = this.props;
        // 加载下一条K线
        const { dispatch } = this.props;
        dispatch({
            type: 'kLine/getNextTick',
            payload: {
                orderCount: this.props.kLine.count,
                tradingDay: this.props.kLine.tradingDay,
                mainContract: this.props.kLine.mainContract,
                start: this.props.kLine.start,
                end: this.props.kLine.end,
            },
            callback: res => {
                if (this.props.kLine.strategyIsOpen === true) {
                    this.calculatStrategy();
                }
                if (this.state.stopLossIsOpen1 === true) { // 表示开启了"限价止损/止盈"
                    this.calculateStopLoss1();
                }
                if (this.state.stopLossIsOpen2 === true) { // 表示开启了"跟踪止损"
                    this.calculateStopLoss2();
                }
                if (res.isOver === true) {
                    const rateLevel = this.calculateRate();
                    this.trainRecord();
                    this.setState({
                        rateLevel,
                        overVisible: true,
                    });
                }
            },
        });
        const contrastPrice = this.props.kLine.nextTick[2];
        let tempProfit = 0;
        // 需要计算持仓盈亏，遍历持仓数据
        this.props.kLine.profit = 0;
        this.props.kLine.positionData.map(item => {
            // 判断方向
            if (item.DIRECTION === '1') {
                tempProfit = Number(((contrastPrice - item.OPENCOST) *
                    item.NUM * this.state.transUnit).toFixed(2));
            } else {
                tempProfit = Number(((item.OPENCOST - contrastPrice) *
                    item.NUM * this.state.transUnit).toFixed(2));
            }
            item.PROFITINPOSIOTION = tempProfit;
            this.props.kLine.profit += tempProfit;
        });

        // 观望，由于持仓盈亏在改变，所以需要实时更新当前权益
        this.props.kLine.tempCurrentInterest = this.props.kLine.currentInterest +
            this.props.kLine.profit + this.props.kLine.profitClose;
        dispatch({
            type: 'kLine/saveOrder',
            payload: {
                userId: currentUser.userId,
                trainId: this.props.kLine.trainId,
                action: 'watch',
                instrumentId: this.props.kLine.mainContract,
                profitInPosition: this.props.kLine.profit, // 浮动盈亏
                profitInClosePosition: this.props.kLine.profitClose, // 平仓盈亏
                currentInterest: this.props.kLine.tempCurrentInterest, // 当前权益
            },
        });
        console.log('profitClose=', this.props.kLine.profitClose);
    }

    // 持仓函数
    recordPositionData = (mainContract, num, direction, openCost, profitInPosition, bond) => {
        let flag = false;
        this.props.kLine.positionData.map(item => { // 判断之前的持仓方向
            if (item.DIRECTION === direction) {
                flag = true;
                // 多仓位计算
                item.OPENCOST = Number(((item.OPENCOST * item.NUM + openCost * num) /
                    (item.NUM + num)).toFixed(1)); // 计算平均开仓价
                item.NUM += num;
                if (direction === '1') {
                    item.PROFITINPOSIOTION = Number(((this.props.kLine.nextTick[2] - item.OPENCOST)
                        * item.NUM * this.state.transUnit).toFixed(2));
                } else {
                    item.PROFITINPOSIOTION = Number(((item.OPENCOST - this.props.kLine.nextTick[2])
                        * item.NUM * this.state.transUnit).toFixed(2));
                }
                item.BOND = Number((item.OPENCOST * item.NUM * this.state.transUnit *
                    this.state.transMargin).toFixed(2));
            }
        });
        const len = this.props.kLine.positionData.length;
        if (flag === false || len === 0) {
            this.props.kLine.positionData.push({
                keyId: len + 1,
                INSTRUMENTID: mainContract,
                NUM: num,
                DIRECTION: direction,
                OPENCOST: openCost,
                PROFITINPOSIOTION: profitInPosition,
                BOND: bond,
                highPrice: 0.00,
                lowPrice: 0.00,
                isStrike: false,
                isStart: false,
            });
        }
    }

    // 平仓函数
    closePositionData = (direction, num, cloPrice) => {
        // 由于是平仓，则取方向的相反位
        const direction2 = direction === '1' ? '2' : '1';
        let flag = false;
        let isAllClose = false;
        let closeIndex = 0;
        let profitClose = 0; // 平仓盈亏
        let lower = false;
        const nextTickPrice = this.props.kLine.nextTick[2];
        this.props.kLine.positionData.map((item, index) => {
            if (direction2 === item.DIRECTION) { // 找到了对应的将要平掉的持仓
                if (num > item.NUM) {
                    lower = true;
                    return;
                }
                flag = true;
                if (direction2 === '1') { // 表示卖平，则用 平仓价 - 开仓价
                    profitClose = Number(((cloPrice - item.OPENCOST) * num *
                        this.state.transUnit).toFixed(2));
                    item.NUM -= num;
                    if (item.NUM === 0) {
                        isAllClose = true;
                        closeIndex = index;
                    }
                    item.PROFITINPOSIOTION = Number(((nextTickPrice - item.OPENCOST) *
                        item.NUM * this.state.transUnit).toFixed(2));
                } else { // 买平,则用 开仓价 - 平仓价
                    profitClose = Number(((item.OPENCOST - cloPrice) * num *
                        this.state.transUnit).toFixed(2));
                    item.NUM -= num;
                    if (item.NUM === 0) {
                        isAllClose = true;
                        closeIndex = index;
                    }
                    item.PROFITINPOSIOTION = Number(((item.OPENCOST - nextTickPrice) *
                        item.NUM * this.state.transUnit).toFixed(2));
                }
                this.props.kLine.tempProfitClose = profitClose; // 记录一次平仓所产生的平仓盈亏
                this.props.kLine.profitClose += profitClose; // 平仓盈亏

                const passBond = Number((item.OPENCOST * num * this.state.transUnit *
                    this.state.transMargin).toFixed(2));
                // 减去平掉的保证金
                item.BOND -= passBond;
            }
        });
        if (lower === true) {
            message.error('仓位不足');
            return false;
        }
        if (flag === false) {
            message.error('该方向暂无持仓，无法进行平仓操作');
            return false;
        }
        if (isAllClose === true) {
            this.props.kLine.positionData.splice(closeIndex, 1); // 删除全平的持仓
            this.props.kLine.positionData.map((item, index) => { // 重置下标
                item.keyId = index + 1;
            });
        }
        return true;
    }

    getDefaultVlaue = record => {
        this.props.kLine.handNum = record.NUM;
        this.props.kLine.direction = record.DIRECTION === '1' ? '2' : '1';
        this.props.kLine.openOrClose = '2';
        this.setState({ // 重新渲染
            tempNum: 0,
        });
    }

    back = () => {
        router.push('/categoryList');
    }

    confirmOver = () => {
        this.setState({
            overVisible: false,
        });
    }

    openCollapse = key => {
        this.setState({
            isOpen: key.length !== 0,
        });
    }

    setStrategyTrue = () => {
        this.setState({ // 触发渲染
            tempNum: 0,
        });
        this.props.kLine.strategyIsOpen = true;
        message.success('策略已经运行');
    }

    setStrategyFasle = () => {
        this.setState({ // 触发渲染
            tempNum: 0,
        });
        this.props.kLine.strategyIsOpen = false;
        message.success('策略已经关闭');
    }

    calculatStrategy = () => {
        const { option } = this.props.kLine;
        const len = option.series[2].data.length; // 获取数据的长度
        const lastDataMA5 = Number(option.series[2].data[len - 1]);
        const lastDataMA30 = Number(option.series[5].data[len - 1]); // 最后一根MA

        const lastSecDataMA5 = Number(option.series[2].data[len - 2]);
        const lastSecDataMA30 = Number(option.series[5].data[len - 2]); // 倒数第二根MA

        let duotouFlag = false;
        let kongtouFlag = false;

        if (lastSecDataMA30 < lastSecDataMA5 && lastDataMA30 >= lastDataMA5) { // 死叉，均线下穿 平多仓 开空仓
            this.props.kLine.positionData.map(item => { // 检查仓位情况，是否存在多头持仓
                if (item.DIRECTION === '1') {
                    duotouFlag = true; // 存在
                }
            });
            if (duotouFlag === true) {
                this.openNotification('短期均线由上向下穿越长期均线，宜开空仓；检测到目前持有多头仓位，宜平多仓。')
            } else {
                this.openNotification('短期均线由上向下穿越长期均线，宜开空仓。')
            }
        }
        if (lastSecDataMA5 < lastSecDataMA30 && lastDataMA5 >= lastDataMA30) { // 金叉，均线上传 平空仓 开多仓
            this.props.kLine.positionData.map(item => { // 检查仓位情况，是否存在空头持仓
                if (item.DIRECTION === '2') {
                    kongtouFlag = true; // 存在
                }
            });
            if (kongtouFlag === true) {
                this.openNotification('短期均线由下向上穿越长期均线，宜开多仓；检测到目前持有空头仓位，宜平空仓。')
            } else {
                this.openNotification('短期均线由下向上穿越长期均线，宜开多仓。')
            }
        }
    }

    openNotification = msg => {
        const key = `open${Date.now()}`;
        const btn = (
            <Button type="primary" size="small" onClick={() => notification.close(key)}>
                知道了
          </Button>
        );
        notification.open({
            message: '策略提示',
            description:
                msg,
            icon: <Icon type="smile" style={{ color: '#108ee9' }} />,
            btn,
            key,
            duration: 0,
        });
    };

    openSetStopLoss = () => {
        this.setState({
            lossVisible: true,
        });
    }

    mainDrawerClose = () => {
        this.setState({
            lossVisible: false,
        });
    }

    openChildrenDrawer1 = () => {
        this.setState({
            childrenDrawer1: true,
        });
    }

    closeStopLoss1 = () => {
        this.setState({
            stopLossIsOpen1: false,
            childrenDrawer1: false,
        });
        message.success('限价止损/止盈已关闭！');
    }

    childrenDrawerClose1 = () => {
        this.setState({
            childrenDrawer1: false,
        });
    }

    openChildrenDrawer2 = () => {
        this.setState({
            childrenDrawer2: true,
        });
    }

    childrenDrawerClose2 = () => {
        this.setState({
            childrenDrawer2: false,
        });
    }

    closeStopLoss2 = () => {
        this.setState({
            childrenDrawer2: false,
            stopLossIsOpen2: false,
        });
        message.success('跟踪止损已关闭！');
    }

    setStartLoss1 = fieldsValue => {
        const { stopLoss } = fieldsValue;
        const { stopProfit } = fieldsValue;
        this.setState({
            stopLoss,
            stopProfit,
            stopLossIsOpen1: true,
            childrenDrawer1: false, // 关闭遮罩
            stopLossIsOpen2: false,
        });
        message.success('限价止损/止盈已开启！');
    }

    setStartLoss2 = fieldsValue => {
        const { priceDifference } = fieldsValue;
        this.setState({
            priceDifference,
            stopLossIsOpen2: true,
            childrenDrawer2: false, // 关闭遮罩
            stopLossIsOpen1: false,
        });
        message.success('跟踪止损已开启！');
    }

    calculateStopLoss1 = () => {
        const lastPrice = this.props.kLine.advisePrice; // 获得当前最新价
        const { stopLoss, stopProfit } = this.state; // 获得止盈止损价差
        this.props.kLine.positionData.map(item => {
            if (item.DIRECTION === '1') {
                if (lastPrice <= item.OPENCOST - stopLoss) { // 最新价低于买开仓价10个最小变动价位，多头止损
                    this.openNotification2(item.keyId, '最新价低于买开仓价减去止损价差，建议多头止损。');
                } else if (lastPrice >= item.OPENCOST + stopProfit) { // 最新价高于买开仓价20个最小变动价位，多头止赢
                    this.openNotification2(item.keyId, '最新价高于买开仓价加上止盈价差，建议多头止盈。');
                }
            } else if (item.DIRECTION === '2') { // 表示空头
                if (lastPrice >= item.OPENCOST + stopLoss) { // 高于卖开仓价10个最小变动价位，空头止损
                    this.openNotification2(item.keyId, '最新价高于卖开仓价加上止损价差，建议空头止损。');
                } else if (lastPrice <= item.OPENCOST - stopProfit) { // 低于卖开仓价20个最小变动价位，空头止赢
                    this.openNotification2(item.keyId, '最新价低于卖开仓价减去止盈价差，建议空头止盈。');
                }
            }
        });
    }

    openNotification2 = (posIndex, msg) => {
        const key = `open${Date.now()}`;
        const btn = (
            <Button type="primary" size="small" onClick={() => notification.close(key)}>知道了</Button>
        );
        notification.open({
            message: '止损/止盈提示',
            description:
                `持仓序号：${posIndex}，${msg}`,
            icon: <Icon type="smile" style={{ color: '#108ee9' }} />,
            btn,
            key,
            duration: 0,
        });
    };

    calculateStopLoss2 = () => {
        const lastPrice = this.props.kLine.advisePrice; // 获得当前最新价
        const { priceDifference } = this.state; // 获得初始价差
        this.props.kLine.positionData.map(item => { // 遍历当前仓位
            if (item.DIRECTION === '1') {
                if (lastPrice <= item.OPENCOST - priceDifference) { // 一直亏损，直接出场
                    this.openNotification2(item.keyId, '最新价低于买开仓价减去止损价差，建议多头止损。');
                }
                if (item.highPrice === 0 || lastPrice >= item.highPrice) {
                    item.highPrice = lastPrice;
                }
                if (item.OPENCOST + 2 * priceDifference <= item.highPrice &&
                    item.isStrike === false) {
                    item.isStrike = true; // 开始触发
                    this.openNotification2(item.keyId, '买开仓后的最高价减去买开仓价格大于2倍价差，开始触发跟踪止损。');
                }
                if (item.highPrice - lastPrice >= priceDifference && item.isStrike === true) {
                    item.isStart = true; // 回撤大于价差，启动跟踪止损
                    this.openNotification2(item.keyId, '最新价小于最高价减价差，启动跟踪止损，建议多头止盈。');
                }
            } else if (item.DIRECTION === '2') {
                if (lastPrice >= item.OPENCOST + priceDifference) { // 一直亏损，直接出场
                    this.openNotification2(item.keyId, '最新价高于卖开仓价加上止损价差，建议空头止损。');
                }
                if (item.lowPrice === 0 || lastPrice <= item.lowPrice) {
                    item.lowPrice = lastPrice;
                }
                if (item.OPENCOST - item.lowPrice >= 2 * priceDifference &&
                    item.isStrike === false) {
                    item.isStrike = true; // 开始触发
                    this.openNotification2(item.keyId, '卖开仓价格与卖开仓后的最低价的差值大于2倍价差，开始触发跟踪止损。');
                }
                if (lastPrice >= item.lowPrice + priceDifference && item.isStrike === true) {
                    item.isStart = true; // 回撤大于价差，启动跟踪止损
                    this.openNotification2(item.keyId, '最新价大于最高价加价差，启动跟踪止损，建议空头止盈。');
                }
            }
        });
    }

    calculateRate = () => {
        const { profit, profitClose } = this.props.kLine;
        const { transUnit, minPriceChange } = this.state;
        const profitAndLOss = profitClose + profit; // 得到单次测试的总盈亏
        const step = profitAndLOss / (transUnit * minPriceChange);
        let rateLevel = 0;
        if (profitAndLOss < 0) {
            rateLevel = 1;
        } else if (step <= 5) {
            rateLevel = 2;
        } else if (step <= 10) {
            rateLevel = 3;
        } else if (step <= 20) {
            rateLevel = 4;
        } else {
            rateLevel = 5;
        }
        return rateLevel;
    }

    trainRecord = () => {
        const { dispatch } = this.props;
        const { currentUser = {} } = this.props;
        dispatch({
            type: 'kLine/trainRecord',
            payload: {
                trainId: this.props.kLine.trainId,
                userId: currentUser.userId,
                transCode: this.state.transCode,
                bond: this.props.kLine.bond,
                profitInPosition: this.props.kLine.profit,
                profitInClosePosition: this.props.kLine.profitClose,
                currentInterest: this.props.kLine.tempCurrentInterest,
                availableFund: this.props.kLine.availableFund,
                rateOfRetracement: 0,
                rateOfReturn: 0,
                trainOverTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            },
        });
    }

    render() {
        const option = this.getOption();
        this.props.kLine.option = option;

        this.props.kLine.dataMA5 = option.series[2].data;
        this.props.kLine.dataMA30 = option.series[5].data;

        const parentMethods = {
            handleOrder: this.handleOrder,
            handleWatchOn: this.handleWatchOn,
            handRestart: this.handRestart,
            getDefaultVlaue: this.getDefaultVlaue,
            openCollapse: this.openCollapse,
            setStrategyTrue: this.setStrategyTrue,
            setStrategyFasle: this.setStrategyFasle,
            openSetStopLoss: this.openSetStopLoss,
        };

        const parentMethods2 = {
            confirmOrder: this.confirmOrder,
            cancelOrder: this.cancelOrder,
        }

        const parentMethods3 = {
            confirmOver: this.confirmOver,
        }

        const parentMethods4 = {
            mainDrawerClose: this.mainDrawerClose,
            openChildrenDrawer1: this.openChildrenDrawer1,
            childrenDrawerClose1: this.childrenDrawerClose1,
            openChildrenDrawer2: this.openChildrenDrawer2,
            childrenDrawerClose2: this.childrenDrawerClose2,
            setStartLoss1: this.setStartLoss1,
            setStartLoss2: this.setStartLoss2,
            closeStopLoss1: this.closeStopLoss1,
            closeStopLoss2: this.closeStopLoss2,
        }

        const {
            kLine: { positionData, direction, profitClose, profit, tempCurrentInterest,
                strategyIsOpen, count, advisePrice, handNum, isOver, openOrClose, orderPrice,
                mainContract, tickData, availableFund, bond },
        } = this.props;

        const { isOpen, minPriceChange, orderVisible, lossVisible, childrenDrawer1,
            childrenDrawer2, transCode, transType, stopLoss, stopProfit, overVisible,
            priceDifference, stopLossIsOpen1, stopLossIsOpen2, rateLevel } = this.state;

        console.log('重新渲染了');

        return (
            <div>
                <PageHeader title={`K线图   ${mainContract === null ? '' : mainContract}`} onBack={() => this.back()} style={{
                    border: '1px solid rgb(235, 237, 240)',
                }}>
                    <ReactEcharts
                        showLoading={tickData.length === 0}
                        option={option}
                        theme="Imooc"
                        style={{ height: isOpen === false ? '530px' : '300px' }}
                        />
                </PageHeader>
                <CreateForm
                    {...parentMethods}
                    advisePrice={advisePrice}
                    handNum={handNum}
                    isOver={isOver}
                    count={count} // 操作次数
                    positionData={positionData} // 持仓数据
                    direction={direction} // 买卖
                    openOrClose={openOrClose} // 开平
                    profitClose={profitClose} // 平仓权益
                    profit={profit} // 持仓权益
                    currentInterest={tempCurrentInterest} // 当前权益
                    bond={bond}
                    availableFund={availableFund}
                    minPriceChange={minPriceChange}
                    strategyIsOpen={strategyIsOpen}

                />
                <div>
                    <OrderModal
                        {...parentMethods2}
                        instrumentId={mainContract}
                        direction={direction}
                        openOrClose={openOrClose}
                        handNum={handNum}
                        orderprice={orderPrice}
                        modalVisible={orderVisible} />
                </div>
                <div>
                    <OverModal
                        {...parentMethods3}
                        modalVisible={overVisible}
                        rateLevel={rateLevel} />
                </div>
                <div>
                    <StopLossModal
                        {...parentMethods4}
                        modalVisible={lossVisible} childmodalVisible1={childrenDrawer1}
                        childmodalVisible2={childrenDrawer2} transCode={transCode}
                        transType={transType} stopLoss={stopLoss} stopProfit={stopProfit}
                        priceDifference={priceDifference} stopLossIsOpen1={stopLossIsOpen1}
                        minPriceChange={minPriceChange} stopLossIsOpen2={stopLossIsOpen2} />
                </div>
            </div>
        )
    }
}
