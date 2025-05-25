import { Column } from '@ant-design/plots';
import { Card, Col, DatePicker, Row, Tabs } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker/generatePicker';
import type dayjs from 'dayjs';
import numeral from 'numeral';
import type { DataItem } from '../data.d';
import useStyles from '../style.style';
import { useRequest } from '@umijs/max';

import { getRoutesRanking } from '../service';
export type TimeType = 'today' | 'week' | 'month' | 'year';
const { RangePicker } = DatePicker;

// for (let i = 0; i < 7; i += 1) {
//   rankingListData.push({
//     title: `Store No. ${i} `,
//     total: 323234,
//   });
// }

const SalesCard = ({
  rangePickerValue,
  salesData,
  isActive,
  handleRangePickerChange,
  loading,
  selectDate,
}: {
  rangePickerValue: RangePickerProps<dayjs.Dayjs>['value'];
  isActive: (key: TimeType) => string;
  salesData: DataItem[];
  loading: boolean;
  handleRangePickerChange: RangePickerProps<dayjs.Dayjs>['onChange'];
  selectDate: (key: TimeType) => void;
}) => {
  const { styles } = useStyles();
  const rankingListData: {
    title: string;
    total: number;
  }[] = [];
  const { data: RankingRoutes, loading: RankingLoading } = useRequest(getRoutesRanking);
  // console.log('data: ', RankingRoutes);

  // const { data: salesData, loading: salesLoading } = useRequest(
  //   () =>
  //     getSalesFromTo({
  //       startDate: rangePickerValue[0].format('YYYY-MM-DD'),
  //       endDate: rangePickerValue[1].format('YYYY-MM-DD'),
  //       type: 'raw',
  //     }),
  //   {
  //     refreshDeps: [rangePickerValue],
  //   },
  // );
  // console.log('Sale Data', salesData);
  if (RankingRoutes && !RankingLoading) {
    RankingRoutes.slice(0, 7).forEach((route) => {
      rankingListData.push({
        title: `${route.departureStation} → ${route.arrivalStation}`,
        total: route.ticketCount,
      });
    });
  }
  // console.log('list of ranking', rankingListData);
  return (
    <Card
      loading={loading}
      bordered={false}
      bodyStyle={{
        padding: 0,
      }}
    >
      <div className={styles.salesCard}>
        <Tabs
          tabBarExtraContent={
            <div className={styles.salesExtraWrap}>
              <div className={styles.salesExtra}>
                <a className={isActive('today')} onClick={() => selectDate('today')}>
                  Today
                </a>
                <a className={isActive('week')} onClick={() => selectDate('week')}>
                  Week
                </a>
                <a className={isActive('month')} onClick={() => selectDate('month')}>
                  Month
                </a>
                <a className={isActive('year')} onClick={() => selectDate('year')}>
                  Year
                </a>
              </div>
              <RangePicker
                value={rangePickerValue}
                onChange={handleRangePickerChange}
                style={{
                  width: 256,
                }}
              />
            </div>
          }
          size="large"
          tabBarStyle={{
            marginBottom: 24,
          }}
          items={[
            {
              key: 'sales',
              label: 'Sales',
              children: (
                <Row>
                  <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Column
                        height={300}
                        data={salesData}
                        xField="date"
                        yField="totalSales"
                        paddingBottom={12}
                        axis={{
                          x: {
                            title: false,
                          },
                          y: {
                            title: false,
                            gridLineDash: null,
                            gridStroke: '#ccc',
                          },
                        }}
                        scale={{
                          x: { paddingInner: 0.4 },
                        }}
                        tooltip={{
                          name: 'Total Sales',
                          channel: 'y',
                        }}
                      />
                    </div>
                  </Col>
                  <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesRank}>
                      <h4 className={styles.rankingTitle}>Ranking Routes</h4>
                      <ul className={styles.rankingList}>
                        {rankingListData.map((item, i) => (
                          <li key={item.title}>
                            <span
                              className={`${styles.rankingItemNumber} ${
                                i < 3 ? styles.rankingItemNumberActive : ''
                              }`}
                            >
                              {i + 1}
                            </span>
                            <span className={styles.rankingItemTitle} title={item.title}>
                              {item.title}
                            </span>
                            {/* <span>{numeral(item.total).format('0,0')}</span> */}
                            <span>{item.total}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Col>
                </Row>
              ),
            },
            // {
            //   key: 'views',
            //   label: 'Views',
            //   children: (
            //     <Row>
            //       <Col xl={16} lg={12} md={12} sm={24} xs={24}>
            //         <div className={styles.salesBar}>
            //           <Column
            //             height={300}
            //             data={salesData}
            //             xField="x"
            //             yField="y"
            //             paddingBottom={12}
            //             axis={{
            //               x: {
            //                 title: false,
            //               },
            //               y: {
            //                 title: false,
            //               },
            //             }}
            //             scale={{
            //               x: { paddingInner: 0.4 },
            //             }}
            //             tooltip={{
            //               name: '访问量',
            //               channel: 'y',
            //             }}
            //           />
            //         </div>
            //       </Col>
            //       <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            //         <div className={styles.salesRank}>
            //           <h4 className={styles.rankingTitle}>门店访问量排名</h4>
            //           <ul className={styles.rankingList}>
            //             {rankingListData.map((item, i) => (
            //               <li key={item.title}>
            //                 <span
            //                   className={`${
            //                     i < 3 ? styles.rankingItemNumberActive : styles.rankingItemNumber
            //                   }`}
            //                 >
            //                   {i + 1}
            //                 </span>
            //                 <span className={styles.rankingItemTitle} title={item.title}>
            //                   {item.title}
            //                 </span>
            //                 <span>{numeral(item.total).format('0,0')}</span>
            //               </li>
            //             ))}
            //           </ul>
            //         </div>
            //       </Col>
            //     </Row>
            //   ),
            // },
          ]}
        />
      </div>
    </Card>
  );
};
export default SalesCard;
