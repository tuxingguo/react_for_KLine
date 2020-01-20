// 导入饼图
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markPoint'
import ReactEcharts from 'echarts-for-react'

import React, { Component } from 'react';
import { Tabs, Alert, notification } from 'antd';
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
      callback: res => {
        const dataLen = res.trainOverTime.length;
        if (dataLen === 0) {
          this.openNotification();
        }
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
    dispatch({
      type: 'home/getCategoryHand',
      payload: {
        userId: currentUser.userId,
      },
    });
    dispatch({
      type: 'home/getRetracement',
      payload: {
        userId: currentUser.userId,
      },
    });
    dispatch({
      type: 'home/getAccountRisk',
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
      animation: true,
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
      graphic: [
        {
          type: 'group',
          left: 'center',
          top: 'center',
          z: 100,
          children: [
            {
              type: 'text',
              left: 'center',
              top: 'center',
              z: 100,
              style: {
                fontSize: 18,
                text: dataX.length === 0 ? '暂无数据' : '',
                font: 'bold 26px Microsoft YaHei',
              },
            },
          ],
        },
      ],
      series: [
        {
          name: '收益率',
          type: 'line',
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
      graphic: [
        {
          type: 'group',
          left: 'center',
          top: 'center',
          z: 100,
          children: [
            {
              type: 'text',
              left: 'center',
              top: 'center',
              z: 100,
              style: {
                fontSize: 18,
                text: datax.length === 0 ? '暂无数据' : '',
                font: 'bold 26px Microsoft YaHei',
              },
            },
          ],
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
        barWidth: 20,
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
      grid: {
        top: '17%',
        left: '3%',
        right: '5%',
        bottom: '16%',
        containLabel: true,
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
      graphic: [
        {
          type: 'group',
          left: 'center',
          top: 'center',
          z: 100,
          children: [
            {
              type: 'text',
              left: 'center',
              top: 'center',
              z: 100,
              style: {
                fontSize: 18,
                text: data.seriesData.length === 0 ? '暂无数据' : '',
                font: 'bold 26px Microsoft YaHei',
              },
            },
          ],
        },
      ],
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

  getOptionForHandNum = () => {
    function genData(dataList) {
      const cateData = [];
      const profitData = [];
      const handNumData = [];

      for (let i = 0; i < dataList.length; i += 1) {
        const category = dataList[i][0];
        const profit = dataList[i][1];
        const handNum = dataList[i][2];

        cateData.push(category);
        profitData.push(profit);
        handNumData.push(handNum);
      }
      return {
        cateData,
        profitData,
        handNumData,
      };
    }
    const { handDataList } = this.props.home;
    const data = genData(handDataList);

    const option = {
      title: {
        text: '品种累计盈亏统计',
        textStyle: {
          fontSize: 14,
        },
      },
      textStyle: {
        fontSize: 14,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999',
          },
        },
        formatter: '品种：{b0}<br/>{a0}：{c0} 元<br/>{a1}：{c1} 手',
        backgroundColor: '#FF9933',
      },
      toolbox: {
        feature: {
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true },
        },
      },
      legend: {
        data: ['累计盈利额', '累计手数'],
      },
      grid: {
        top: '20%',
        left: '3%',
        right: '5%',
        bottom: '16%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: data.cateData,
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '累计盈利额',
          axisLabel: {
            formatter: '{value} 元',
            interval: 'auto',
          },
          nameTextStyle: {
            fontSize: 12,
          },
        },
        {
          type: 'value',
          name: '累计手数',
          min: 0,
          axisLabel: {
            formatter: '{value} 手',
            interval: 'auto',
          },
          nameTextStyle: {
            fontSize: 12,
          },
          splitLine: {
            show: false,
          },
        },
      ],
      dataZoom: [
        {
          show: true,
          start: 0,
          end: 100,
          filterMode: 'weakFilter',
          textStyle: false,
        },
      ],
      graphic: [
        {
          type: 'group',
          left: 'center',
          top: 'center',
          z: 100,
          children: [
            {
              type: 'text',
              left: 'center',
              top: 'center',
              z: 100,
              style: {
                fontSize: 18,
                text: data.profitData.length === 0 ? '暂无数据' : '',
                font: 'bold 26px Microsoft YaHei',
              },
            },
          ],
        },
      ],
      series: [
        {
          name: '累计盈利额',
          type: 'bar',
          data: data.profitData,
          barWidth: 20,
          itemStyle: {
            normal: {
              color(params) {
                let colorList;
                if (params) {
                  if (data.profitData[params.dataIndex] >= 0) {
                    colorList = '#ef232a';
                  } else {
                    colorList = '#14b143';
                  }
                }
                return colorList;
              },
            },
          },
        },
        {
          name: '累计手数',
          type: 'line',
          yAxisIndex: 1,
          data: data.handNumData,
          itemStyle: {
            normal: {
              color: '#67a2aa', // 改变折线点的颜色
              lineStyle: {
                color: '#67a2aa', // 改变折线颜色
              },
            },
          },
        },
      ],

    }
    return option;
  }

  getOptionRetracement = () => {
    const dataX = this.props.home.trainOverTime;
    const dataY = this.props.home.rateOfRetracement;
    const option = {
      backgroundColor: '',
      title: {
        text: '单次训练资金回撤率',
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
        data: ['资金回撤率'],
      },
      grid: {
        top: '18%',
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
      graphic: [
        {
          type: 'group',
          left: 'center',
          top: 'center',
          z: 100,
          children: [
            {
              type: 'text',
              left: 'center',
              top: 'center',
              z: 100,
              style: {
                fontSize: 18,
                text: dataX.length === 0 ? '暂无数据' : '',
                font: 'bold 26px Microsoft YaHei',
              },
            },
          ],
        },
      ],
      series: [
        {
          name: '资金回撤率',
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

  getOptionRisk = () => {
    const dataX = this.props.home.trainOverTime;
    const dataY = this.props.home.rateOfRisk;
    const option = {
      backgroundColor: '',
      title: {
        text: '账户风险度',
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
        data: ['风险度'],
      },
      grid: {
        top: '16%',
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
      graphic: [
        {
          type: 'group',
          left: 'center',
          top: 'center',
          z: 100,
          children: [
            {
              type: 'text',
              left: 'center',
              top: 'center',
              z: 100,
              style: {
                fontSize: 18,
                text: dataX.length === 0 ? '暂无数据' : '',
                font: 'bold 26px Microsoft YaHei',
              },
            },
          ],
        },
      ],
      series: [
        {
          name: '风险度',
          type: 'line',
          data: dataY,
          itemStyle: {
            normal: {
              color: '#1890ff',
              lineStyle: {
                color: '#1890ff',
              },
            },
          },
        },
      ],
    }
    return option;
  }

  openNotification = () => {
    const args = {
      message: '提醒',
      description:
        '您当前还未进行下单训练，首页尚未生成您的量化数据。还等什么，赶快尝试一下吧！',
      style: {
        width: 600,
        marginLeft: 335 - 600,
      },
    };
    notification.open(args);
  };

  render() {
    const profitTip = () => ({ __html: '备注说明：\n1、单次训练盈亏：平仓盈亏+浮动盈亏，未包含手续费。\n2、如果单次盈亏>0，则盈利，其他情况均为亏损。即红线露出为盈利，其他情况亏损。' })
    const categoryTip = () => ({ __html: '备注说明：若当前某品种的盈亏为负，则在上图显示金额与占比均为0。' })
    const reTraceTip = () => ({ __html: '备注说明：\n1、指标解释：在单次训练期内，账户净值从最高峰回落到最低谷，账户净值下跌幅度相对最高峰的比值，反映了账户操作者在整个阶段的风险控制能力。\n2、指标公式：（最高点净值-最低点净值）/最高点净值 * 100%。' })

    return (
      <div>
        <Tabs defaultActiveKey="1" size="large">
          <TabPane tab="账户概况" key="1">
            <div style={{ width: '90%', margin: '0 auto', backgroundColor: '#e9ebee' }}>
              <ReactEcharts
                option={this.getOptionForReturn()}
                style={{ width: '90%', margin: '0 auto' }}
              />
            </div>
            <div style={{ width: '90%', margin: '0 auto', marginTop: '5%', backgroundColor: '#e9ebee' }}>
              <div>
                <ReactEcharts
                  option={this.getOptionForProfit()}
                  style={{ width: '90%', margin: '0 auto' }}
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
            </div>
          </TabPane>
          <TabPane tab="交易偏好" key="2">
            <div style={{ width: '90%', margin: '0 auto', backgroundColor: '#e9ebee' }}>
              <ReactEcharts
                option={this.getOptionforCategory()}
                style={{ width: '90%', margin: '0 auto' }}
              />
              <div>
                <Alert
                  type="info"
                  style={{ width: '70%', marginLeft: '10%', marginTop: '2%', whiteSpace: 'pre-wrap' }}
                  description={
                    <div style={{ fontSize: '13px', marginTop: '-8px' }} dangerouslySetInnerHTML={categoryTip()} />
                  }
                />
              </div>
            </div>
            <div style={{ width: '90%', margin: '0 auto', marginTop: '5%', backgroundColor: '#e9ebee' }}>
              <ReactEcharts
                option={this.getOptionForHandNum()}
                style={{ width: '90%', margin: '0 auto' }}
              />
            </div>
          </TabPane>
          <TabPane tab="风控能力" key="3">
            <div style={{ width: '90%', margin: '0 auto', backgroundColor: '#e9ebee' }}>
              <ReactEcharts
                option={this.getOptionRetracement()}
                style={{ width: '90%', margin: '0 auto' }}
              />
              <div>
                <Alert
                  type="info"
                  style={{ width: '90%', margin: '0 auto', marginTop: '2%', whiteSpace: 'pre-wrap' }}
                  description={
                    <div style={{ fontSize: '13px', marginTop: '-10px' }} dangerouslySetInnerHTML={reTraceTip()} />
                  }
                />
              </div>
            </div>
            <div style={{ width: '90%', margin: '0 auto', marginTop: '5%', backgroundColor: '#e9ebee' }}>
              <ReactEcharts
                option={this.getOptionRisk()}
                style={{ width: '90%', margin: '0 auto' }}
              />
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
