import React, { useState } from 'react';
import { Badge, Popover, List, Button, Modal, Typography, Space, notification } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import * as notesApi from '../api/notesApi';

const { Text } = Typography;

const NotificationPanel = ({ notes, onUpdateNote, onDeleteNote }) => {
    const [visible, setVisible] = useState(false);
    const [pinnedReminders, setPinnedReminders] = useState(() => {
        const saved = localStorage.getItem('pinnedReminders');
        return saved ? JSON.parse(saved) : [];
    });

    const currentTime = new Date();

    const reminders = notes.filter(note => {
        if (note.completed) return false;
        const createdAt = new Date(note.created_at);
        const diffHours = (currentTime - createdAt) / (1000 * 60 * 60);
        return diffHours >= 24 || pinnedReminders.includes(note.id);
    });

    // Sort: pinned first
    const sortedReminders = [...reminders].sort((a, b) => {
        const aPinned = pinnedReminders.includes(a.id);
        const bPinned = pinnedReminders.includes(b.id);
        if (aPinned && !bPinned) return -1;
        if (!aPinned && bPinned) return 1;
        return 0;
    });

    const handleYes = (note) => {
        Modal.confirm({
            title: 'Complete Task',
            content: 'You marked this task as completed. Do you want to delete the note?',
            okText: 'Delete Note',
            cancelText: 'Keep Note',
            onOk: async () => {
                try {
                    await notesApi.deleteNote(note.id);
                    onDeleteNote(note.id);
                    removeFromPinned(note.id);
                } catch (error) {
                    console.error('Failed to delete note', error);
                }
            },
            onCancel: async () => {
                try {
                    await notesApi.updateNote(note.id, { ...note, completed: true });
                    onUpdateNote({ ...note, completed: true });
                    removeFromPinned(note.id);
                } catch (error) {
                    console.error('Failed to update note', error);
                }
            },
        });
    };

    const handleNotYet = (noteId) => {
        if (!pinnedReminders.includes(noteId)) {
            const newPinned = [...pinnedReminders, noteId];
            setPinnedReminders(newPinned);
            localStorage.setItem('pinnedReminders', JSON.stringify(newPinned));
            notification.info({
                message: 'Reminder Pinned',
                description: 'This note will stay at the top of your reminders.',
                placement: 'topRight',
            });
        }
    };

    const removeFromPinned = (noteId) => {
        const newPinned = pinnedReminders.filter(id => id !== noteId);
        setPinnedReminders(newPinned);
        localStorage.setItem('pinnedReminders', JSON.stringify(newPinned));
    };

    const notificationContent = (
        <List
            size="small"
            dataSource={sortedReminders}
            style={{ width: 300, maxHeight: 400, overflowY: 'auto' }}
            renderItem={item => (
                <List.Item>
                    <div style={{ width: '100%' }}>
                        <div style={{ marginBottom: 8 }}>
                            <Text strong>{item.title}</Text>
                            <br />
                            <Text type="secondary">"You created this note yesterday. Have you completed it?"</Text>
                        </div>
                        <Space>
                            <Button size="small" type="primary" onClick={() => handleYes(item)}>YES</Button>
                            <Button size="small" onClick={() => handleNotYet(item.id)}>NOT YET</Button>
                        </Space>
                    </div>
                </List.Item>
            )}
            locale={{ emptyText: 'No pending reminders' }}
        />
    );

    return (
        <Popover
            content={notificationContent}
            title="Reminders"
            trigger="click"
            visible={visible}
            onVisibleChange={setVisible}
            placement="bottomRight"
        >
            <Badge count={sortedReminders.length} offset={[-2, 10]}>
                <Button
                    type="text"
                    icon={<BellOutlined style={{ fontSize: 20 }} />}
                    style={{ height: 40, width: 40 }}
                />
            </Badge>
        </Popover>
    );
};

export default NotificationPanel;
