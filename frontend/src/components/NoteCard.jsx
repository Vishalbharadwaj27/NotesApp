import React from 'react';
import { Card, Button, Typography, Space, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;

const NoteCard = ({ note, onEdit, onDelete }) => {
  const preview = note.content.length > 100 ? note.content.substring(0, 100) + '...' : note.content;

  return (
    <Card
      title={note.title}
      style={{ marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
      actions={[
        <Button key="edit" type="text" icon={<EditOutlined />} onClick={() => onEdit(note)}>
          Edit
        </Button>,
        <Button key="delete" type="text" danger icon={<DeleteOutlined />} onClick={() => onDelete(note.id)}>
          Delete
        </Button>,
      ]}
    >
      <Text>{preview}</Text>
      <div style={{ marginTop: 8 }}>
        <Tag color={note.priority === 'HIGH' ? 'red' : note.priority === 'MEDIUM' ? 'orange' : 'blue'}>
          {note.priority || 'LOW'}
        </Tag>
        {note.completed && <Tag color="green">COMPLETED</Tag>}
      </div>
      <br />
      <Text type="secondary">Created: {new Date(note.created_at).toLocaleDateString()}</Text>
    </Card>
  );
};

export default NoteCard;
