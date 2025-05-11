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

  const applyFilters = (trainName: string, routeName: string) => {
    const filtered = trainSchedules.filter((s) => {
      const matchTrain = trainName ? s.train.trainName === trainName : true;
      const matchRoute = routeName ? s.train.route.routeName === routeName : true;
      return matchTrain && matchRoute;
    });
    setFilteredTrainSchedules(filtered);
  };

  const handleTrainNameFilterChange = (value: string) => {
    setSelectedTrainName(value);
    applyFilters(value, selectedRouteName);
  };

  const handleRouteNameFilterChange = (value: string) => {
    setSelectedRouteName(value);
    applyFilters(selectedTrainName, value);
  };

  const handleCreate = () => {
    setEditingSchedule(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: TrainSchedule) => {
    setEditingSchedule(record);
    form.setFieldsValue({
      trainId: record.train.trainId,
      stationId: record.station.stationId,
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
      const scheduleData = {
        train: { trainId: values.trainId },
        station: { stationId: values.stationId },
        departureTime: values.departureTime.format('HH:mm:ss'),
        arrivalTime: values.arrivalTime.format('HH:mm:ss'),
        day: values.day,
        distance: values.distance,
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

  const columns: ColumnType<TrainSchedule>[] = [
    { title: 'Mã lịch tàu', dataIndex: 'trainScheduleId', key: 'trainScheduleId' },
    { title: 'Tên ga', dataIndex: ['station', 'stationName'], key: 'stationName' },
    {
      title: 'Tên tàu',
      dataIndex: ['train', 'trainName'],
      key: 'trainName',
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
      onFilter: () => true, // bỏ qua vì lọc thủ công
    },
    {
      title: 'Tuyến',
      dataIndex: ['train', 'route', 'routeName'],
      key: 'routeName',
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
    { title: 'Giờ đi', dataIndex: 'departureTime', key: 'departureTime' },
    { title: 'Giờ đến', dataIndex: 'arrivalTime', key: 'arrivalTime' },
    { title: 'Khoảng cách', dataIndex: 'distance', key: 'distance' },
    { title: 'Ngày', dataIndex: 'day', key: 'day' },
    {
      title: 'Hành động',
      key: 'actions',
      render: (text: any, record: TrainSchedule) => (
        <div style={{ display: 'flex', gap: '8px' }}>
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
      <h1 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Quản lý lịch tàu chạy</h1>

      <div style={{ marginBottom: 16, textAlign: 'right' }}>
        <Button type="primary" onClick={handleCreate} disabled={loading}>
          Thêm lịch tàu
        </Button>
      </div>

      {(selectedTrainName || selectedRouteName) && (
        <div style={{ marginBottom: 16 }}>
          <strong>Lọc theo:</strong>
          {selectedTrainName && <span style={{ marginLeft: 8 }}>Tên tàu: {selectedTrainName}</span>}
          {selectedRouteName && <span style={{ marginLeft: 8 }}>Tuyến: {selectedRouteName}</span>}
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
          <Form.Item name="trainId" label="Tàu" rules={[{ required: true, message: 'Chọn tàu' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="stationId" label="Ga" rules={[{ required: true, message: 'Chọn ga' }]}>
            <Input />
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
