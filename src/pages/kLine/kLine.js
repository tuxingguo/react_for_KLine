import React from 'react';
import { message, PageHeader, Spin } from 'antd';

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

@connect(({ kLine, user }) => ({
    kLine,
    currentUser: user.currentUser,
}))


export default class Lines extends React.Component {
    constructor(props) {
        super(props);
        const { location: { state } } = this.props;
        const transCode = state.TRANSCODE;
        const { HYCS } = state;
        const { ZXDBJ } = state;
        const { BZJB } = state;
        this.state = {
            ...super.state,
            tempNum: 0,
            transCode, // 合约品种
            transUnit: HYCS, // 合约乘数
            transMargin: BZJB, // 保证金比例
            minPriceChange: ZXDBJ, // 最小变动价
            isOpen: false,
            orderVisible: false,
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
        this.props.kLine.overVisible = false;
        this.props.kLine.orderPrice = 0;
        this.props.kLine.tempProfitClose = 0;
        this.props.kLine.fields = [];
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

    // 模态框点击下单确认
    confirmOrder = () => {
        this.setState({ // 触发渲染
            orderVisible: false,
        });
        this.orderProcess(this.props.kLine.fields);
    }

    // 模态框点击取消
    cancelOrder = () => {
        this.setState({ // 触发渲染
            orderVisible: false,
        });
    }

    // 开始下单
    orderProcess = fields => {
        const tempNextTick = this.props.kLine.nextTick;
        // fields.price = fields.price > tempNextTick[4] ? tempNextTick[4]
        // : fields.price; // 考虑下如何实现

        // 将处理逻辑放在了前端，更加方便
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
        });

        // 下单成功，这里开始计算该客户的盈亏情况
        let tempBond = 0;
        this.props.kLine.profit = 0;
        this.props.kLine.positionData.map(item => {
            tempBond += item.BOND; // 保证金
            this.props.kLine.profit += item.PROFITINPOSIOTION; //  浮动盈亏
        });

        this.props.kLine.tempCurrentInterest = this.props.kLine.currentInterest +
            this.props.kLine.profit + this.props.kLine.profitClose;

        const availableFund = this.props.kLine.availableFund - tempBond
            + this.props.kLine.profitClose;

        const { currentUser = {} } = this.props;
        dispatch({
            type: 'kLine/calculateProfit',
            payload: {
                userId: currentUser.userId,
                profitInPosition: this.props.kLine.profit, // 浮动盈亏
                profitInClosePosition: this.props.kLine.tempProfitClose, // 平仓盈亏
                bond: tempBond, // 保证金
                currentInterest: this.props.kLine.tempCurrentInterest,
                availableFund,
            },
        });
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
            type: 'kLine/calculateProfit',
            payload: {
                userId: currentUser.userId,
                profitInPosition: this.props.kLine.profit, // 浮动盈亏
                currentInterest: this.props.kLine.tempCurrentInterest, // 当前权益
            },
        });
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
        this.props.kLine.overVisible = false;
        this.setState({ // 触发渲染
            tempNum: 0,
        });
    }

    openCollapse = key => {
        this.setState({
            isOpen: key.length !== 0,
        });
    }

    render() {
        const parentMethods = {
            handleOrder: this.handleOrder,
            handleWatchOn: this.handleWatchOn,
            handRestart: this.handRestart,
            getDefaultVlaue: this.getDefaultVlaue,
            openCollapse: this.openCollapse,
        };

        const parentMethods2 = {
            confirmOrder: this.confirmOrder,
            cancelOrder: this.cancelOrder,
        }

        const parentMethods3 = {
            confirmOver: this.confirmOver,
        }

        const {
            kLine: { positionData, direction, profitClose, profit, overVisible, tempCurrentInterest,
                count, advisePrice, handNum, isOver, openOrClose, orderPrice, mainContract, tickData },
        } = this.props;

        const { isOpen, minPriceChange, orderVisible } = this.state;

        console.log('重新渲染了');

        return (
            <div>
                <PageHeader title={`K线图   ${mainContract === null ? '' : mainContract}`} onBack={() => this.back()} style={{
                    border: '1px solid rgb(235, 237, 240)',
                }}>
                    <ReactEcharts
                        showLoading={tickData.length === 0 ? true : false}
                        option={this.getOption()}
                        theme="Imooc"
                        style={{ height: isOpen === false ? '540px' : '300px' }} />
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
                    currentInterest={tempCurrentInterest}
                    minPriceChange={minPriceChange}

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
                        modalVisible={overVisible} />
                </div>
            </div>
        )
    }
}
