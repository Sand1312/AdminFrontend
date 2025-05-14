import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Modal, Form, message, Spin, Select, TimePicker } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import { fetchTrainSchedules, deleteTrainSchedule, createTrainSchedule, updateTrainSchedule } from '@/services/my-api/trainscheduleApi';
import type { TrainSchedule } from '@/pages/trainschedule/data.d';
import { FilterDropdownProps } from 'antd/es/table/interface';
import { ColumnType } from 'antd/es/table';

const TrainScheduleManager: React.FC = () => {
  const [trainSchedules, setTrainSchedules] = useState<TrainSchedule[]>([]);
  const [filteredTrainSchedules, setFilteredTrainSchedules] = useState<TrainSchedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<TrainSchedule | null>(null);
  const [form] = Form.useForm();
  const [selectedTrainName, setSelectedTrainName] = useState('');
  const [selectedRouteName, setSelectedRouteName] = useState('');
  const [selectedStationName, setSelectedStationName] = useState('');
  const [selectedDay, setSelectedDay] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    fetchTrainSchedules()
      .then((response) => {
        setTrainSchedules(response);
        setFilteredTrainSchedules(response);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Có lỗi xảy ra');
        setLoading(false);
      });
  };

  const applyFilters = (trainName: string, routeName: string, stationName: string, day: string) => {
    const filtered = trainSchedules.filter((s) => {
      const matchTrain = trainName ? s.train.trainName === trainName : true;
      const matchRoute = routeName ? s.train.route.routeName === routeName : true;
      const matchStation = stationName ? s.station.stationName === stationName : true;
      const matchDay = day ? s.day === Number(day) : true;
      return matchTrain && matchRoute && matchStation && matchDay;
    });
    setFilteredTrainSchedules(filtered);
  };

  const handleTrainNameFilterChange = (value: string) => {
    setSelectedTrainName(value);
    applyFilters(value, selectedRouteName, selectedStationName, selectedDay);
  };

  const handleRouteNameFilterChange = (value: string) => {
    setSelectedRouteName(value);
    applyFilters(selectedTrainName, value, selectedStationName, selectedDay);
  };

  const handleStationNameFilterChange = (value: string) => {
    setSelectedStationName(value);
    applyFilters(selectedTrainName, selectedRouteName, value, selectedDay);
  };

  const handleDayFilterChange = (value: string) => {
    setSelectedDay(value);
    applyFilters(selectedTrainName, selectedRouteName, selectedStationName, value);
  };

  const handleCreate = () => {
    setEditingSchedule(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: TrainSchedule) => {
    setEditingSchedule(record);
    form.setFieldsValue({
      trainName: record.train.trainName, // Hiển thị tên tàu trong form
      stationName: record.station.stationName, // Hiển thị tên ga trong form
      departureTime: moment(record.departureTime, 'HH:mm:ss'),
      arrivalTime: moment(record.arrivalTime, 'HH:mm:ss'),
      day: record.day,
      distance: record.distance,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (record: TrainSchedule) => {
    deleteTrainSchedule(record.trainScheduleId)
      .then(() => {
        message.success('Xóa lịch tàu thành công!');
        loadData();
      })
      .catch((err) => {
        message.error(err.message || 'Xóa thất bại!');
      });
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const selectedTrain = trainSchedules.find(s => s.train.trainName === values.trainName);
      const selectedStation = trainSchedules.find(s => s.station.stationName === values.stationName);

      if (!selectedTrain || !selectedStation) {
        message.error('Tàu hoặc ga không hợp lệ!');
        return;
      }

      const departure = values.departureTime;
      const arrival = values.arrivalTime;

      if (arrival.isBefore(departure)) {
        message.error('Giờ đến không thể trước giờ đi!');
        return;
      }

      const dayNumber = Number(values.day);
      if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 7) {
        message.error('Ngày phải nằm trong khoảng từ 1 đến 7 (đại diện cho các ngày trong tuần)');
        return;
      }

      const distanceValue = Number(values.distance);
      if (isNaN(distanceValue) || distanceValue <= 0) {
        message.error('Khoảng cách phải là số dương!');
        return;
      }

      const isDuplicate = trainSchedules.some(s =>
        s.train.trainId === selectedTrain.train.trainId &&
        s.station.stationId === selectedStation.station.stationId &&
        s.day === dayNumber &&
        s.trainScheduleId !== editingSchedule?.trainScheduleId // bỏ qua chính nó khi sửa
      );

      if (isDuplicate) {
        message.error('Lịch trình đã tồn tại cho tàu và ga này vào ngày đã chọn!');
        return;
      }

      const scheduleData = {
        train: { trainId: selectedTrain.train.trainId },
        station: { stationId: selectedStation.station.stationId },
        departureTime: departure.format('HH:mm:ss'),
        arrivalTime: arrival.format('HH:mm:ss'),
        day: dayNumber,
        distance: distanceValue,
      };

      const apiCall = editingSchedule
        ? updateTrainSchedule(editingSchedule.trainScheduleId, scheduleData)
        : createTrainSchedule(scheduleData);

      apiCall
        .then(() => {
          message.success(editingSchedule ? 'Cập nhật thành công!' : 'Tạo lịch tàu thành công!');
          setIsModalVisible(false);
          loadData();
        })
        .catch((err) => {
          message.error(err.message || 'Thao tác thất bại!');
        });

    }).catch(() => {
      message.error('Vui lòng kiểm tra lại thông tin!');
    });
  };


  const trainNames = [...new Set(trainSchedules.map((s) => s.train.trainName))];
  const routeNames = [...new Set(trainSchedules.map((s) => s.train.route.routeName))];
  const stationNames = [...new Set(trainSchedules.map((s) => s.station.stationName))];
  const dayList = [...new Set(trainSchedules.map((s) => s.day))];

  const columns: ColumnType<TrainSchedule>[] = [
    { title: 'Mã lịch tàu', dataIndex: 'trainScheduleId', key: 'trainScheduleId', align: 'center' },
    {
      title: 'Tên ga',
      dataIndex: ['station', 'stationName'],
      key: 'stationName',
      align: 'center',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }: FilterDropdownProps) => (
        <div style={{ padding: 8 }}>
          <Select
            style={{ width: 200 }}
            placeholder="Chọn ga"
            value={selectedKeys[0] ? String(selectedKeys[0]) : ''}
            onChange={(value: string) => {
              setSelectedKeys(value ? [value] : []);
              handleStationNameFilterChange(value);
              confirm();
            }}
            allowClear
          >
            <Select.Option value="">Tất cả</Select.Option>
            {stationNames.map((name) => (
              <Select.Option key={name} value={name}>
                {name}
              </Select.Option>
            ))}
          </Select>
        </div>
      ),
      filterIcon: () => <SearchOutlined style={{ fontSize: 20, color: '#1890ff' }} />,
      onFilter: () => true,
    },
    {
      title: 'Tên tàu',
      dataIndex: ['train', 'trainName'],
      key: 'trainName',
      align: 'center',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }: FilterDropdownProps) => (
        <div style={{ padding: 8 }}>
          <Select
            style={{ width: 200 }}
            placeholder="Chọn tên tàu"
            value={selectedKeys[0] ? String(selectedKeys[0]) : ''}
            onChange={(value: string) => {
              setSelectedKeys(value ? [value] : []);
              handleTrainNameFilterChange(value);
              confirm();
            }}
            allowClear
          >
            <Select.Option value="">Tất cả</Select.Option>
            {trainNames.map((name) => (
              <Select.Option key={name} value={name}>
                {name}
              </Select.Option>
            ))}
          </Select>
        </div>
      ),
      filterIcon: () => <SearchOutlined style={{ fontSize: 20, color: '#1890ff' }} />,
      onFilter: () => true,
    },
    {
      title: 'Tuyến',
      dataIndex: ['train', 'route', 'routeName'],
      key: 'routeName',
      align: 'center',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }: FilterDropdownProps) => (
        <div style={{ padding: 8 }}>
          <Select
            style={{ width: 200 }}
            placeholder="Chọn tuyến"
            value={selectedKeys[0] ? String(selectedKeys[0]) : ''}
            onChange={(value: string) => {
              setSelectedKeys(value ? [value] : []);
              handleRouteNameFilterChange(value);
              confirm();
            }}
            allowClear
          >
            <Select.Option value="">Tất cả</Select.Option>
            {routeNames.map((name) => (
              <Select.Option key={name} value={name}>
                {name}
              </Select.Option>
            ))}
          </Select>
        </div>
      ),
      filterIcon: () => <SearchOutlined style={{ fontSize: 20, color: '#1890ff' }} />,
      onFilter: () => true,
    },
    {
      title: 'Ngày',
      dataIndex: 'day',
      key: 'day',
      align: 'center',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }: FilterDropdownProps) => (
        <div style={{ padding: 8 }}>
          <Select
            style={{ width: 200 }}
            placeholder="Chọn ngày"
            value={selectedKeys[0] ? String(selectedKeys[0]) : ''}
            onChange={(value: string) => {
              setSelectedKeys(value ? [value] : []);
              handleDayFilterChange(value);
              confirm();
            }}
            allowClear
          >
            <Select.Option value="">Tất cả</Select.Option>
            {dayList.map((day) => (
              <Select.Option key={day} value={day}>
                {day}
              </Select.Option>
            ))}
          </Select>
        </div>
      ),
      filterIcon: () => <SearchOutlined style={{ fontSize: 20, color: '#1890ff' }} />,
      onFilter: () => true,
    },
    { title: 'Giờ đi', dataIndex: 'departureTime', key: 'departureTime', align: 'center' },
    { title: 'Giờ đến', dataIndex: 'arrivalTime', key: 'arrivalTime', align: 'center' },
    { title: 'Khoảng cách', dataIndex: 'distance', key: 'distance', align: 'center' },
    {
      title: 'Hành động',
      key: 'actions',
      align: 'center',
      render: (text: any, record: TrainSchedule) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
          <Button type="primary" onClick={() => handleEdit(record)} style={{ backgroundColor: '#52c41a' }}>
            Sửa
          </Button>
          <Button danger onClick={() => handleDelete(record)}>
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' }}>Quản lý lịch tàu chạy</h1>

      <div style={{ marginBottom: 16, textAlign: 'right' }}>
        <Button type="primary" onClick={handleCreate} disabled={loading}>
          Thêm lịch tàu
        </Button>
        <Button
          style={{ marginLeft: 8 }}
          onClick={() => {
            setSelectedTrainName('');
            setSelectedRouteName('');
            setSelectedStationName('');
            setSelectedDay('');
            setFilteredTrainSchedules(trainSchedules);
          }}
        >
          Xóa bộ lọc
        </Button>
      </div>

      {(selectedTrainName || selectedRouteName || selectedStationName || selectedDay) && (
        <div style={{ marginBottom: 16 }}>
          <strong>Lọc theo:</strong>
          {selectedTrainName && <span style={{ marginLeft: 8 }}>Tên tàu: {selectedTrainName}</span>}
          {selectedRouteName && <span style={{ marginLeft: 8 }}>Tuyến: {selectedRouteName}</span>}
          {selectedStationName && <span style={{ marginLeft: 8 }}>Ga: {selectedStationName}</span>}
          {selectedDay && <span style={{ marginLeft: 8 }}>Ngày: {selectedDay}</span>}
        </div>
      )}

      {loading ? (
        <Spin tip="Đang tải dữ liệu..." />
      ) : error ? (
        <div style={{ color: 'red' }}>Có lỗi xảy ra: {error}</div>
      ) : (
        <Table
          rowKey="trainScheduleId"
          columns={columns}
          dataSource={filteredTrainSchedules}
          bordered
        />
      )}

      <Modal
        title={editingSchedule ? 'Sửa lịch tàu' : 'Tạo lịch tàu'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={loading}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="trainName" label="Tên tàu" rules={[{ required: true, message: 'Chọn tàu' }]}>
            <Select>
              {trainNames.map((name) => (
                <Select.Option key={name} value={name}>
                  {name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="stationName" label="Tên ga" rules={[{ required: true, message: 'Chọn ga' }]}>
            <Select>
              {stationNames.map((name) => (
                <Select.Option key={name} value={name}>
                  {name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="departureTime" label="Giờ đi" rules={[{ required: true }]}>
            <TimePicker format="HH:mm:ss" />
          </Form.Item>
          <Form.Item name="arrivalTime" label="Giờ đến" rules={[{ required: true }]}>
            <TimePicker format="HH:mm:ss" />
          </Form.Item>
          <Form.Item name="day" label="Ngày" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="distance" label="Khoảng cách (km)" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TrainScheduleManager;
