// 导入饼图
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markPoint'
import ReactEcharts from 'echarts-for-react'

import React, { Component } from 'react';
import { Tabs, Alert } from 'antd';
import { connect } from 'dva';

const { TabPane } = Tabs;

@connect(({ user, home }) => ({
  currentUser: user.currentUser,
  home,
}))

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillMount() {
    const { currentUser = {} } = this.props;
    const { dispatch } = this.props;
    dispatch({
      type: 'home/getUserInfo',
      payload: {
        userId: currentUser.userId,
      },
    });
    dispatch({
      type: 'home/getRateOfReturn',
      payload: {
        userId: currentUser.userId,
      },
    });
    dispatch({
      type: 'home/getProfitByUserId',
      payload: {
        userId: currentUser.userId,
      },
    });
    dispatch({
      type: 'home/getCategoryProfit',
      payload: {
        userId: currentUser.userId,
      },
    });
  }

  getOptionForReturn = () => {
    const dataX = this.props.home.trainOverTime;
    const dataY = this.props.home.rateOfReturn;

    const option = {
      backgroundColor: '',
      title: {
        text: '单次训练收益率',
        subtext: '收益率=（期末权益-期初权益）/期初权益 * 100%',
        textStyle: {
          fontSize: 14,
        },
      },
      tooltip: {
        trigger: 'axis',
        formatter: '{b0}<br/>{a0}: {c0}%',
        backgroundColor: '#FF9933',
      },
      legend: {
        data: ['收益率'],
      },
      grid: {
        top: '20%',
        left: '3%',
        right: '5%',
        bottom: '18%',
        containLabel: true,
      },
      xAxis: [{
        type: 'category',
        boundaryGap: false,
        axisTick: { show: false },
        data: dataX,
        axisLabel: {
          show: true,
          interval: 'auto',
          formatter(data) {
            return data.substr(11, 8);
          },
        },
      }],
      yAxis:
      {
        type: 'value',
        axisLabel: {
          show: true,
          interval: 'auto',
          formatter: '{value} %',
        },
        show: true,
      },
      dataZoom: [
        {
          show: true,
          realtime: true,
          start: 0,
          end: 100,
          filterMode: 'weakFilter',
          textStyle: false,
        },
        {
          type: 'inside',
          realtime: true,
          start: 0,
          end: 100,
          filterMode: 'weakFilter',
          textStyle: false,
        },

      ],
      series: [
        {
          name: '收益率',
          type: 'line',
          stack: '总量',
          data: dataY,
          itemStyle: {
            normal: {
              color: '#1890ff', // 改变折线点的颜色
              lineStyle: {
                color: '#1890ff', // 改变折线颜色
              },
            },
          },
        },
      ],
    }
    return option;
  }

  getOptionForProfit = () => {
    const datax = this.props.home.trainOverTime;
    const datay = this.props.home.allProfit;
    const option = {
      backgroundColor: '',
      grid: {
        top: '14%',
        left: '3%',
        right: '5%',
        bottom: '18%',
        containLabel: true,
      },
      title: {
        text: '单次训练盈亏',
        textStyle: {
          fontSize: 14,
        },
      },
      legend: {
        show: true,
        data: ['盈亏值'],
      },
      tooltip: {
        trigger: 'axis',
        formatter: '{b0}<br/>{a0}: {c0} 元',
        backgroundColor: '#FF9933',
      },
      xAxis: {
        type: 'category',
        data: datax,
        axisLabel: {
          show: true,
          interval: 'auto',
          formatter(data) {
            return data.substr(11, 8);
          },
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value} 元',
        },
      },
      dataZoom: [
        {
          show: true,
          start: 0,
          end: 100,
          filterMode: 'weakFilter',
          textStyle: false,
        },
      ],
      series: [{
        name: '盈亏值',
        data: datay,
        type: 'bar',
        itemStyle: {
          normal: {
            color(params) {
              let colorList;
              if (params) {
                if (datay[params.dataIndex] >= 0) {
                  colorList = '#ef232a';
                } else {
                  colorList = '#14b143';
                }
              }
              return colorList;
            },
          },
        },
        barWidth: 30,
      }],
    }
    return option;
  }

  getOptionforCategory = () => {
    function genData(dataList) {
      const legendData = [];
      const seriesData = [];
      const selected = {};

      for (let i = 0; i < dataList.length; i += 1) {
        const cateName = dataList[i][0];
        const allprofit = dataList[i][1];

        legendData.push(cateName);
        seriesData.push({
          name: cateName,
          value: allprofit <= 0 ? 0 : allprofit,
        });

        selected[cateName] = i < 6;
      }

      return {
        legendData,
        seriesData,
        selected,
      };
    }

    const { cateDataList } = this.props.home;
    const data = genData(cateDataList);

    const option = {
      title: {
        text: '品种成交偏好对比图',
        left: 'left',
        subtext: '显示单个品种盈亏占比',
        textStyle: {
          fontSize: 14,
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} 元 ({d}%)',
        backgroundColor: '#FF9933',
      },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        right: 10,
        top: 20,
        bottom: 20,
        data: data.legendData,

        selected: data.selected,
      },
      series: [
        {
          type: 'pie',
          radius: '55%',
          center: ['40%', '50%'],
          data: data.seriesData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    }
    return option;
  }

  render() {
    const datax = this.props.home.trainOverTime;
    const profitTip = () => ({ __html: '备注说明：\n1、单次训练盈亏：平仓盈亏+浮动盈亏，未包含手续费。\n2、如果单次盈亏>0，则盈利，其他情况均为亏损。即红线露出为盈利，其他情况亏损。' })
    const categoryTip = () => ({ __html: '备注说明：若当前某品种的盈亏为负，则在上图显示金额与占比均为0。' })

    return (
      <div>
        <Tabs defaultActiveKey="1" size="large">
          <TabPane tab="账户概况" key="1">
            <div style={{ width: '80%', margin: '0 auto' }}>
              <ReactEcharts
                showLoading={datax.length === 0}
                option={this.getOptionForReturn()}
              />
            </div>
            <div style={{ width: '80%', margin: '0 auto', marginTop: '5%' }}>
              <ReactEcharts
                showLoading={datax.length === 0}
                option={this.getOptionForProfit()}
              />
              <div>
                <Alert
                  type="info"
                  style={{ width: '90%', margin: '0 auto', marginTop: '2%', whiteSpace: 'pre-wrap' }}
                  description={
                    <div style={{ fontSize: '13px', marginTop: '-10px' }} dangerouslySetInnerHTML={profitTip()} />
                  }
                />
              </div>
            </div>
          </TabPane>
          <TabPane tab="交易偏好" key="2">
            <div style={{ width: '80%', margin: '0 auto', height: '400px' }}>
              <ReactEcharts
                showLoading={datax.length === 0}
                option={this.getOptionforCategory()}
                style={{ height: '100%' }}
              />
            </div>
            <div>
              <Alert
                type="info"
                style={{ width: '70%', marginLeft: '10%', marginTop: '-4%', whiteSpace: 'pre-wrap' }}
                description={
                  <div style={{ fontSize: '13px', marginTop: '-8px' }} dangerouslySetInnerHTML={categoryTip()} />
                }
              />
            </div>
          </TabPane>
          <TabPane tab="风控能力" key="3">
            Content of Tab Pane 3
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
