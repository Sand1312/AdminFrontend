import { InfoCircleOutlined } from '@ant-design/icons';
import { Col, Progress, Row, Tooltip } from 'antd';
import dayjs from 'dayjs';
import numeral from 'numeral';
import type { DataItem } from '../data.d';
import useStyles from '../style.style';
import Dong from '../utils/Dong';
import { ChartCard, Field } from './Charts';
import { useRequest } from '@umijs/max';
import Trend from './Trend';
import { useEffect } from 'react';
import { getTotalRevenue, getSalesFromTo } from '../service';
const topColResponsiveProps = {
  xs: 48,
  sm: 24,
  md: 24,
  lg: 24,
  xl: 12,
  style: {
    marginBottom: 24,
  },
};
const getTimeProgress = () => {
  const now = dayjs();

  const secondsToday = now.diff(now.startOf('day'), 'second');
  const percentDay = (secondsToday / 86400) * 100;

  const dayOfWeek = now.day();
  const percentWeek = ((dayOfWeek * 86400 + secondsToday) / (7 * 86400)) * 100;

  const daysInMonth = now.daysInMonth();
  const dayOfMonth = now.date() - 1;
  const percentMonth = ((dayOfMonth * 86400 + secondsToday) / (daysInMonth * 86400)) * 100;

  return [
    { label: 'Day', value: percentDay },
    { label: 'Week', value: percentWeek },
    { label: 'Month', value: percentMonth },
  ];
};

const IntroduceRow = () => {
  const { data: totalRevenue, loading } = useRequest(getTotalRevenue);
  const now = dayjs().format('YYYY-MM-DD');
  const { data: dailySales } = useRequest(() =>
    getSalesFromTo({ startDate: now, endDate: now, type: 'daily' }),
  );
  const totalAmounts: number[] = (dailySales || []).map((item) => item.totalAmount);
  // console.log('total revenue', data);
  // useEffect(() => {
  //   getTotalRevenue().then((res) => {
  //     console.log('Raw response:', res);
  //   });
  // }, []);
  const { styles } = useStyles();
  const timeData = getTimeProgress();
  return (
    <Row gutter={24}>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          title="Total Sales"
          action={
            <Tooltip title="Metric Description">
              <InfoCircleOutlined />
            </Tooltip>
          }
          loading={loading}
          total={() => <Dong>{totalRevenue ?? 0}</Dong>}
          // footer={<Field label="Daily Sales" value={`${numeral(12423).format('0,0')} đ`} />}
          footer={
            <Field label="Daily Sales" value={`${numeral({ totalAmounts }).format('0,0')} đ`} />
          }
          contentHeight={46}
        >
          <Trend
            flag="up"
            style={{
              marginRight: 16,
            }}
          >
            WoW change
            <span className={styles.trendText}>12%</span>
          </Trend>
          <Trend flag="down">
            DoD Change
            <span className={styles.trendText}>11%</span>
          </Trend>
        </ChartCard>
      </Col>

      {/* <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loading}
          title="Traffic"
          action={
            <Tooltip title="Metric Explanation">
              <InfoCircleOutlined />
            </Tooltip>
          }
          total={numeral(8846).format('0,0')}
          footer={<Field label="daily traffic" value={numeral(1234).format('0,0')} />}
          contentHeight={46}
        >
          <Area
            xField="x"
            yField="y"
            shapeField="smooth"
            height={46}
            axis={false}
            style={{
              fill: 'linear-gradient(-90deg, white 0%, #975FE4 100%)',
              fillOpacity: 0.6,
              width: '100%',
            }}
            padding={-20}
            data={visitData}
          />
        </ChartCard>
      </Col> */}
      {/* <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loading}
          title="Number of transactions"
          action={
            <Tooltip title="Metric Explanation">
              <InfoCircleOutlined />
            </Tooltip>
          }
          total={numeral(6560).format('0,0')}
          footer={<Field label="Conversion rate" value="60%" />}
          contentHeight={46}
        >
          <Column
            xField="x"
            yField="y"
            padding={-20}
            axis={false}
            height={46}
            data={visitData}
            scale={{ x: { paddingInner: 0.4 } }}
          />
        </ChartCard>
      </Col> */}
      <Col {...topColResponsiveProps}>
        <ChartCard
          loading={loading}
          bordered={false}
          title="⏱"
          // action={
          //   <Tooltip title="Metric Explanation">
          //     <InfoCircleOutlined />
          //   </Tooltip>
          // }
          total=""
          footer={<Field label="Real Time" value="We bare bear" />}
          // footer={
          //   <div
          //     style={{
          //       whiteSpace: 'nowrap',
          //       overflow: 'hidden',
          //     }}
          //   ></div>
          // }
          contentHeight={timeData.length * 30}
        >
          <>
            {timeData.map((item) => (
              <Row key={item.label} align="middle" style={{ marginBottom: 8 }}>
                <Col flex="auto">
                  <Progress
                    percent={parseFloat(item.value.toFixed(2))}
                    strokeColor={{ from: '#108ee9', to: '#87d068' }}
                    status="active"
                    showInfo={false}
                  />
                </Col>
                <Col flex="none" style={{ marginLeft: 12, minWidth: 80 }}>
                  {`${item.label} ${item.value.toFixed(0)}%`}
                </Col>
              </Row>
            ))}
          </>
          {/* <Bar
            xField="value"
            yField="label"
            // shapeField="smooth"
            height={120}
            maxBarWidth={24}
            axis={false}
            data={data}
          /> */}
        </ChartCard>
      </Col>
    </Row>
  );
};
export default IntroduceRow;
