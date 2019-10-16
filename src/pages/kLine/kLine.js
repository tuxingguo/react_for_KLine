import React from 'react';
import { Card, Button, Table, Form, Select, Modal, message } from 'antd';

// 下面是按需加载
import echarts from 'echarts/lib/echarts'
// 导入折线图
import 'echarts/lib/chart/lines';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
import ReactEcharts from 'echarts-for-react';
import { connect } from 'dva';

@connect(({ kLine }) => ({
    kLine,
  }))

export default class Lines extends React.Component {
    componentWillMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'kLine/refresh',
        });
    }

    getOption = () => {
        // 数据意义：开盘(open)，收盘(close)，最低(lowest)，最高(highest) 成交量(volume)

        function splitData(rawData) {
            const categoryData = [];
            const values = [];
            const volumes = [];
            for (let i = 0; i < rawData.length; i += 1) {
                const arr = [rawData[i][0], rawData[i][1], rawData[i][2], rawData[i][3], rawData[i][4], rawData[i][5]];
                values.push(arr);
                categoryData.push(arr.splice(0, 1)[0]);
                volumes.push(arr[4]);
            }
            return {
                categoryData,
                values,
                volumes,
            };
        }

        const {
            kLine: { rawData },
          } = this.props;
        const data = splitData(rawData);

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
                top: '73%',
                height: '16%',
            }, {
                left: '5%',
                right: '1%',
                top: '83%',
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
                data: data.categoryData,
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
                top: '93%',
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

    handleFresh() {
        const { dispatch } = this.props;
        dispatch({
          type: 'kLine/refresh2',
        });
        message.success('刷新成功');
      }

    render() {
        return (
            <div>
                <Card title="K线图">
                    <ReactEcharts
                        option={this.getOption()}
                        theme="Imooc"
                        style={{ height: '550px' }} />
                </Card>
                <span>
                    <Button type="primary" onClick={ () => this.handleFresh()} >刷新</Button>
                </span>
            </div>
        )
    }
}
