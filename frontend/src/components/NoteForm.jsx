import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Space, Select } from 'antd';

const { TextArea } = Input;

const NoteForm = ({ initialValues = {}, onSubmit, onCancel, loading = false }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [initialValues, form]);

  const handleFinish = (values) => {
    onSubmit(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={initialValues}
    >
      <Form.Item
        name="title"
        label="Title"
        rules={[{ required: true, message: 'Please enter a title' }]}
      >
        <Input placeholder="Enter note title" />
      </Form.Item>
      <Form.Item
        name="content"
        label="Content"
        rules={[{ required: true, message: 'Please enter content' }]}
      >
        <TextArea rows={6} placeholder="Enter note content" />
      </Form.Item>
      <Form.Item
        name="priority"
        label="Priority"
        initialValue="LOW"
      >
        <Select>
          <Select.Option value="HIGH">HIGH</Select.Option>
          <Select.Option value="MEDIUM">MEDIUM</Select.Option>
          <Select.Option value="LOW">LOW</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            {initialValues.id ? 'Update Note' : 'Create Note'}
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default NoteForm;
