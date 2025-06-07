import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Spin, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { fetchTrips, fetchTripById, cancelTripById } from '@/services/my-api/tripApi';
import type { Trip } from '@/pages/trip/trip-detail/data.d';

const TripManager: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [carriageSeatsVisible, setCarriageSeatsVisible] = useState(false);
  const [selectedCarriageSeats, setSelectedCarriageSeats] = useState<any[]>([]);
  const [selectedCarriageName, setSelectedCarriageName] = useState<string>('');
  const [expandedSchedule, setExpandedSchedule] = useState(false);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = () => {
    setLoading(true);
    fetchTrips()
      .then((data) => {
        setTrips(data);
      })
      .catch((err) => {
        message.error(err.message || 'Lỗi khi tải danh sách chuyến đi');
      })
      .finally(() => setLoading(false));
  };

  const openDetailModal = (tripId: number) => {
    setDetailLoading(true);
    fetchTripById(tripId)
      .then((data) => {
        setSelectedTrip(data);
        setModalVisible(true);
      })
      .catch((err) => {
        message.error(err.message || 'Lỗi khi tải chi tiết chuyến đi');
      })
      .finally(() => setDetailLoading(false));
  };

  const openCarriageSeatsModal = (carriage: any) => {
    setSelectedCarriageSeats(carriage.seats || []);
    setSelectedCarriageName(carriage.compartment.compartmentName || '');
    setCarriageSeatsVisible(true);
  };

  const handleCancelTrip = (tripId: number) => {
    Modal.confirm({
      title: 'Xác nhận hủy chuyến đi',
      content: 'Bạn có chắc chắn muốn hủy chuyến đi này?',
      okText: 'Hủy chuyến',
      cancelText: 'Không',
      onOk: async () => {
        try {
          const res = await cancelTripById(tripId);
          message.success(res.message || 'Đã hủy chuyến thành công');
          setTrips((prev) =>
            prev.map((trip) =>
              trip.tripId === tripId ? { ...trip, tripStatus: 'Cancelled' } : trip,
            ),
          );
        } catch (err: any) {
          message.error(err.message || 'Hủy chuyến thất bại');
        }
      },
    });
  };

  const columns: ColumnsType<Trip> = [
    {
      title: 'Mã chuyến',
      dataIndex: 'tripId',
      key: 'tripId',
      align: 'center',
    },
    {
      title: 'Tên tàu',
      dataIndex: ['train', 'trainName'],
      key: 'trainName',
      align: 'center',
    },
    {
      title: 'Ngày đi',
      dataIndex: 'tripDate',
      key: 'tripDate',
      align: 'center',
    },
    {
      title: 'Giá vé cơ bản',
      dataIndex: 'basePrice',
      key: 'basePrice',
      align: 'center',
      render: (price: number) =>
        price.toLocaleString('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'tripStatus',
      key: 'tripStatus',
      align: 'center',
    },
    {
      title: 'Hành động',
      key: 'actions',
      align: 'center',
      render: (_: any, record: Trip) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          <div
            style={{
              border: '1px solid #d9d9d9',
              borderRadius: 6,
              padding: '6px 12px',
              backgroundColor: '#fafafa',
            }}
          >
            <Button type="link" onClick={() => openDetailModal(record.tripId)}>
              Xem chi tiết
            </Button>
          </div>
          <div
            style={{
              border: '1px solid #d9d9d9',
              borderRadius: 6,
              padding: '6px 12px',
              backgroundColor: '#fff1f0',
            }}
          >
            <Button
              type="link"
              danger
              onClick={() => handleCancelTrip(record.tripId)}
              disabled={record.tripStatus === 'Cancelled'}
            >
              Hủy
            </Button>
          </div>
        </div>
      ),
    },
  ];

  const RenderSchedule = ({ schedules }: { schedules: Trip['train']['trainSchedules'] }) => {
    const headCount = 2;
    const tailCount = 2;
    let displayData;

    if (expandedSchedule || schedules.length <= headCount + tailCount + 1) {
      displayData = schedules.map((schedule, index) => ({
        key: schedule.trainScheduleId,
        stt: index + 1,
        ga: schedule.station.stationName,
        arrivalTime: schedule.arrivalTime,
        departureTime: schedule.departureTime,
      }));
    } else {
      displayData = [
        ...schedules.slice(0, headCount).map((schedule, index) => ({
          key: schedule.trainScheduleId,
          stt: index + 1,
          ga: schedule.station.stationName,
          arrivalTime: schedule.arrivalTime,
          departureTime: schedule.departureTime,
        })),
        {
          key: 'ellipsis',
          stt: '...',
          ga: '...',
          arrivalTime: '...',
          departureTime: '...',
        },
        ...schedules.slice(-tailCount).map((schedule, index) => ({
          key: schedule.trainScheduleId,
          stt: schedules.length - tailCount + index + 1,
          ga: schedule.station.stationName,
          arrivalTime: schedule.arrivalTime,
          departureTime: schedule.departureTime,
        })),
      ];
    }

    return (
      <div>
        <Button
          type="link"
          onClick={() => setExpandedSchedule(!expandedSchedule)}
          style={{ marginBottom: 8, paddingLeft: 0 }}
        >
          {expandedSchedule ? 'Thu gọn lịch trình ▲' : 'Xem tất cả lịch trình ▼'}
        </Button>
        <Table
          size="small"
          pagination={false}
          bordered
          dataSource={displayData}
          columns={[
            {
              title: 'STT',
              dataIndex: 'stt',
              key: 'stt',
              width: 50,
              align: 'center',
            },
            {
              title: 'Ga',
              dataIndex: 'ga',
              key: 'ga',
              width: 200,
              align: 'left',
            },
            {
              title: 'Giờ đến',
              dataIndex: 'arrivalTime',
              key: 'arrivalTime',
              width: 100,
              align: 'center',
            },
            {
              title: 'Giờ đi',
              dataIndex: 'departureTime',
              key: 'departureTime',
              width: 100,
              align: 'center',
            },
          ]}
          rowClassName={(record) => (record.key === 'ellipsis' ? 'ellipsis-row' : '')}
        />
      </div>
    );
  };

  return (
    <div
      style={{
        padding: 24,
        backgroundColor: '#f5f7fa',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      <h1
        style={{
          fontSize: 32,
          fontWeight: '700',
          marginBottom: 24,
          textAlign: 'center',
          color: '#1890ff',
        }}
      >
        Quản lý chuyến đi
      </h1>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <Spin tip="Đang tải danh sách chuyến đi..." size="large" />
        </div>
      ) : trips.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: 18 }}>Không có chuyến đi nào.</p>
      ) : (
        <Table
          rowKey="tripId"
          columns={columns}
          dataSource={trips}
          bordered
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}
          style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
        />
      )}

      <Modal
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setSelectedTrip(null);
          setExpandedSchedule(false);
        }}
        footer={<Button onClick={() => setModalVisible(false)}>Đóng</Button>}
        width={900}
        destroyOnClose
        title={null}
      >
        <h2 style={{ textAlign: 'center', marginBottom: 24, fontWeight: '700', fontSize: 24 }}>
          Chi tiết chuyến đi
        </h2>
        {detailLoading || !selectedTrip ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
            <Spin tip="Đang tải chi tiết..." size="large" />
          </div>
        ) : (
          <>
            <h3>Thông tin tàu</h3>
            <div style={{ marginBottom: 20, paddingLeft: 16 }}>
              <p>
                <strong>Tên tàu:</strong> {selectedTrip.train.trainName}
              </p>
              <p>
                <strong>Tuyến:</strong> {selectedTrip.train.route.routeName}
              </p>
              <p>
                <strong>Ga khởi hành:</strong>{' '}
                {selectedTrip.train.trainSchedules[0]?.station.stationName}
              </p>
              <p>
                <strong>Ga kết thúc:</strong>{' '}
                {
                  selectedTrip.train.trainSchedules[selectedTrip.train.trainSchedules.length - 1]
                    ?.station.stationName
                }
              </p>
            </div>

            <h3>Danh sách toa</h3>
            <Table
              size="small"
              pagination={false}
              bordered
              style={{ marginBottom: 30 }}
              dataSource={
                selectedTrip.carriageLists?.map((carriage, idx) => ({
                  key: idx,
                  stt: idx + 1,
                  compartmentName: carriage.compartment.compartmentName,
                  seatCount: carriage.compartment.seatCount,
                  bookedCount: carriage.seats?.filter((s) => s.seatStatus === 'Booked').length || 0,
                  carriage,
                })) || []
              }
              columns={[
                {
                  title: 'STT',
                  dataIndex: 'stt',
                  key: 'stt',
                  align: 'center',
                  width: 60,
                },
                {
                  title: 'Tên toa',
                  dataIndex: 'compartmentName',
                  key: 'compartmentName',
                  align: 'center',
                },
                {
                  title: 'Số ghế',
                  dataIndex: 'seatCount',
                  key: 'seatCount',
                  align: 'center',
                },
                {
                  title: 'Số ghế được đặt',
                  dataIndex: 'bookedCount',
                  key: 'bookedCount',
                  align: 'center',
                },
                {
                  title: 'Hành động',
                  key: 'action',
                  align: 'center',
                  render: (_: any, record: any) => (
                    <Button
                      size="small"
                      type="link"
                      onClick={() => openCarriageSeatsModal(record.carriage)}
                    >
                      Xem chi tiết toa
                    </Button>
                  ),
                },
              ]}
            />

            <h3>Lịch trình</h3>
            <RenderSchedule schedules={selectedTrip.train.trainSchedules} />
          </>
        )}
      </Modal>

      <Modal
        title={`Chi tiết toa: ${selectedCarriageName}`}
        open={carriageSeatsVisible}
        onCancel={() => setCarriageSeatsVisible(false)}
        footer={<Button onClick={() => setCarriageSeatsVisible(false)}>Đóng</Button>}
        width={800}
        destroyOnClose
      >
        <Table
          size="small"
          rowKey="seatId"
          bordered
          pagination={false}
          dataSource={selectedCarriageSeats}
          columns={[
            {
              title: 'Số ghế',
              dataIndex: 'seatNumber',
              key: 'seatNumber',
              align: 'center',
            },
            {
              title: 'Tầng',
              dataIndex: 'floor',
              key: 'floor',
              align: 'center',
            },
            {
              title: 'Hệ số',
              dataIndex: 'seatFactor',
              key: 'seatFactor',
              align: 'center',
            },
            {
              title: 'Trạng thái',
              dataIndex: 'seatStatus',
              key: 'seatStatus',
              align: 'center',
              render: (status) => (status === 'Booked' ? 'Đã đặt' : 'Còn trống'),
            },
          ]}
        />
      </Modal>
    </div>
  );
};

export default TripManager;
