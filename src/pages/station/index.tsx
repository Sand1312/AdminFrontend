import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Modal, Form, message, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { fetchStations, deleteStation, createStation, updateStation } from '@/services/my-api/stationApi';
import type { Station } from '@/pages/station/data.d';
import { FilterDropdownProps } from 'antd/es/table/interface';
import { ColumnType } from 'antd/es/table';
import { TablePaginationConfig } from 'antd/es/table';

const StationManager: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [filteredStations, setFilteredStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStation, setEditingStation] = useState<Station | null>(null);
  const [form] = Form.useForm();
  const [stationNameFilter, setStationNameFilter] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [pagination, setPagination] = useState<{ current: number; pageSize: number }>({
    current: 1,
    pageSize: 10,
  });

  useEffect(() => {
    loadData();
  }, [pagination.current]);

  const loadData = () => {
    setLoading(true);
    fetchStations()
      .then((response) => {
        setStations(response);
        setFilteredStations(response);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Có lỗi xảy ra');
        setLoading(false);
      });
  };

  const applyFilters = (stationName: string, location?: string) => {
    const filtered = stations.filter(
      (s) =>
        s.stationName.toLowerCase().includes(stationName.toLowerCase()) &&
        (!location || s.location.toLowerCase().includes(location.toLowerCase()))
    );
    setFilteredStations(filtered);
  };

  const handleCreate = () => {
    setEditingStation(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: Station) => {
    setEditingStation(record);
    form.setFieldsValue({
      stationName: record.stationName,
      location: record.location,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (record: Station) => {
    deleteStation(record.stationId!)
      .then(() => {
        message.success('Xóa ga thành công!');
        loadData();
      })
      .catch((err) => {
        message.error(err.message || 'Xóa thất bại!');
      });
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const trimmedName = values.stationName.trim().toLowerCase();
        const trimmedLocation = values.location.trim().toLowerCase();

        const isDuplicate = stations.some(
          (s) =>
            s.stationName.trim().toLowerCase() === trimmedName &&
            s.location.trim().toLowerCase() === trimmedLocation &&
            s.stationId !== editingStation?.stationId
        );

        if (isDuplicate) {
          Modal.error({
            title: editingStation ? 'Không thể cập nhật ga' : 'Không thể thêm ga',
            content: `Ga "${values.stationName}" tại vị trí "${values.location}" đã tồn tại trong hệ thống.`,
            okText: 'Đóng',
          });
          return;
        }

        const stationData: Station = {
          stationId: editingStation?.stationId || undefined,
          stationName: values.stationName,
          location: values.location,
        };

        const apiCall = editingStation
          ? updateStation(editingStation.stationId!, stationData)
          : createStation(stationData);

        apiCall
          .then(() => {
            message.success(editingStation ? 'Cập nhật thành công!' : 'Tạo ga thành công!');
            setIsModalVisible(false);
            loadData();
          })
          .catch((err) => {
            message.error(err.message || 'Thao tác thất bại!');
          });
      })
      .catch(() => {
        message.error('Vui lòng kiểm tra lại thông tin!');
      });
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination({
      current: pagination.current || 1,  // default to 1 if current is undefined
      pageSize: pagination.pageSize || 10, // default to 10 if pageSize is undefined
    });
  };

  const columns: ColumnType<Station>[] = [
    { title: 'Mã ga', dataIndex: 'stationId', key: 'stationId', align: 'center' },
    {
      title: 'Tên ga',
      dataIndex: 'stationName',
      key: 'stationName',
      align: 'center',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }: FilterDropdownProps) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Tìm tên ga"
            value={stationNameFilter}  // Giữ giá trị của bộ lọc
            onChange={(e) => {
              const value = e.target.value;
              setStationNameFilter(value);  // Cập nhật state khi người dùng nhập
              setSelectedKeys(value ? [value] : []);  // Cập nhật selectedKeys để lọc
              applyFilters(value, locationFilter);  // Áp dụng bộ lọc sau mỗi lần thay đổi
            }}
            allowClear
          />
        </div>
      ),
      filterIcon: () => <SearchOutlined style={{ fontSize: 20, color: '#1890ff' }} />,
      onFilter: () => true,
    },
    {
      title: 'Vị trí',
      dataIndex: 'location',
      key: 'location',
      align: 'center',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }: FilterDropdownProps) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Tìm vị trí"
            value={locationFilter}  // Giữ giá trị của bộ lọc
            onChange={(e) => {
              const value = e.target.value;
              setLocationFilter(value);  // Cập nhật state khi người dùng nhập
              setSelectedKeys(value ? [value] : []);  // Cập nhật selectedKeys để lọc
              applyFilters(stationNameFilter, value);  // Áp dụng bộ lọc sau mỗi lần thay đổi
            }}
            allowClear
          />
        </div>
      ),
      filterIcon: () => <SearchOutlined style={{ fontSize: 20, color: '#1890ff' }} />,
      onFilter: () => true,
    },
    {
      title: 'Hành động',
      key: 'actions',
      align: 'center',
      render: (_text: any, record: Station) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
          <Button type="primary" size="small" onClick={() => handleEdit(record)} style={{ backgroundColor: '#52c41a' }}>
            Sửa
          </Button>
          {/* <Button danger size="small" onClick={() => handleDelete(record)}>
            Xóa
          </Button> */}
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' }}>Quản lý ga</h1>

      <div style={{ marginBottom: 16, textAlign: 'right' }}>
        <Button type="primary" onClick={handleCreate} disabled={loading}>
          Thêm ga
        </Button>
      </div>

      {loading ? (
        <Spin tip="Đang tải dữ liệu..." />
      ) : error ? (
        <div style={{ color: 'red' }}>Có lỗi xảy ra: {error}</div>
      ) : (
        <Table
          rowKey="stationId"
          columns={columns}
          dataSource={filteredStations}
          bordered
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: stations.length,
          }}
          onChange={handleTableChange}  // Đảm bảo handleTableChange nhận đúng kiểu của pagination
        />
      )}

      <Modal
        title={editingStation ? 'Sửa ga' : 'Tạo mới ga'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={loading}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="stationName" label="Tên ga" rules={[{ required: true, message: 'Nhập tên ga' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="location" label="Vị trí" rules={[{ required: true, message: 'Nhập vị trí' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StationManager;
