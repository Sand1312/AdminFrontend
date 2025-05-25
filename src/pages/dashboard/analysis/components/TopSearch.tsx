import { InfoCircleOutlined } from '@ant-design/icons';
import { Area } from '@ant-design/plots';
import { Card, Col, Row, Table, Tooltip } from 'antd';
import numeral from 'numeral';
import React from 'react';
import type { DataItem } from '../data.d';
import useStyles from '../style.style';
import NumberInfo from './NumberInfo';
import Trend from './Trend';

const TopSearch = ({
  loading,
  // visitData2,
  searchData,
  dropdownGroup,
}: {
  loading: boolean;
  // visitData2: DataItem[];
  dropdownGroup: React.ReactNode;
  searchData: DataItem[];
}) => {
  const { styles } = useStyles();
  // const columns = [
  //   {
  //     title: 'Index',
  //     dataIndex: 'index',
  //     key: 'index',
  //   },
  //   {
  //     title: 'Keyword',
  //     dataIndex: 'keyword',
  //     key: 'keyword',
  //     render: (text: React.ReactNode) => <a href="/">{text}</a>,
  //   },
  //   {
  //     title: 'Count',
  //     dataIndex: 'count',
  //     key: 'count',
  //     sorter: (
  //       a: {
  //         count: number;
  //       },
  //       b: {
  //         count: number;
  //       },
  //     ) => a.count - b.count,
  //   },
  //   {
  //     title: 'Range',
  //     dataIndex: 'range',
  //     key: 'range',
  //     sorter: (
  //       a: {
  //         range: number;
  //       },
  //       b: {
  //         range: number;
  //       },
  //     ) => a.range - b.range,
  //     render: (
  //       text: React.ReactNode,
  //       record: {
  //         status: number;
  //       },
  //     ) => (
  //       <Trend flag={record.status === 1 ? 'down' : 'up'}>
  //         <span
  //           style={{
  //             marginRight: 4,
  //           }}
  //         >
  //           {text}%
  //         </span>
  //       </Trend>
  //     ),
  //   },
  // ];
  const columns = [
    {
      title: 'ID',
      dataIndex: 'customerId',
      key: 'customerId',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      // render: (text: React.ReactNode) => <a href="/">{text}</a>,
    },
    {
      title: 'Name',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'SDT',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Tickets',
      dataIndex: 'ticketCount',
      key: 'ticketCount',
      align: 'center',
      sorter: (
        a: {
          count: number;
        },
        b: {
          count: number;
        },
      ) => a.count - b.count,
      //   render: (
      //     text: React.ReactNode,
      //     record: {
      //       status: number;
      //     },
      //   ) => (
      //     <Trend flag={record.status === 1 ? 'down' : 'up'}>
      //       <span
      //         style={{
      //           marginRight: 4,
      //         }}
      //       >
      //         {text}%
      //       </span>
      //     </Trend>
      //   ),
    },
  ];
  return (
    <Card
      loading={loading}
      bordered={false}
      title="Users Rank"
      extra={dropdownGroup}
      style={{
        height: '100%',
      }}
    >
      <Row gutter={68}>
        {/* <Col
          sm={12}
          xs={24}
          style={{
            marginBottom: 24,
          }}
        > */}
        {/* <NumberInfo
            subTitle={
              <span>
                 搜索用户数 
                Users
                <Tooltip title="Indicator Description">
                  <InfoCircleOutlined
                    style={{
                      marginLeft: 8,
                    }}
                  />
                </Tooltip>
              </span>
            }
            gap={8}
            total={numeral(12321).format('0,0')}
            status="up"
            subTotal={17.1}
          /> */}
        {/* <Area
            xField="x"
            yField="y"
            shapeField="smooth"
            height={45}
            axis={false}
            padding={-12}
            style={{ fill: 'linear-gradient(-90deg, white 0%, #6294FA 100%)', fillOpacity: 0.4 }}
            data={visitData2}
          /> */}
        {/* </Col> */}
        {/* <Col
          sm={12}
          xs={24}
          style={{
            marginBottom: 24,
          }}
        > */}
        {/* <NumberInfo
            subTitle={
              <span>
                人均搜索次数
                Searches per User
                <Tooltip title="Indicator Description">
                  <InfoCircleOutlined
                    style={{
                      marginLeft: 8,
                    }}
                  />
                </Tooltip>
              </span>
            }
            total={2.7}
            status="down"
            subTotal={26.2}
            gap={8}
          /> */}
        {/* <Area
            xField="x"
            yField="y"
            shapeField="smooth"
            height={45}
            padding={-12}
            style={{ fill: 'linear-gradient(-90deg, white 0%, #6294FA 100%)', fillOpacity: 0.4 }}
            data={visitData2}
            axis={false}
          /> */}
        {/* </Col> */}
      </Row>
      <Table<any>
        rowKey={(record) => record.index}
        size="small"
        columns={columns}
        dataSource={searchData}
        pagination={{
          style: {
            marginBottom: 0,
          },
          pageSize: 5,
        }}
      />
    </Card>
  );
};
export default TopSearch;
