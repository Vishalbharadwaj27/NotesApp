import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Modal, message, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import AppLayout from '../layout/AppLayout';
import NoteCard from '../components/NoteCard';
import NoteForm from '../components/NoteForm';
import SearchBar from '../components/SearchBar';
import { getNotes, createNote, updateNote, deleteNote } from '../api/notesApi';

const DashboardPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      const data = await getNotes(params);
      setNotes(data);
    } catch (error) {
      message.error('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [search]);

  useEffect(() => {
    if (searchParams.get('create') === 'true') {
      setModalVisible(true);
      setEditingNote(null);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const handleSearch = (value) => {
    setSearch(value);
  };

  const handleCreate = () => {
    setEditingNote(null);
    setModalVisible(true);
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setModalVisible(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this note?',
      onOk: async () => {
        try {
          await deleteNote(id);
          message.success('Note deleted');
          fetchNotes();
        } catch (error) {
          message.error('Failed to delete note');
        }
      },
    });
  };

  const handleFormSubmit = async (values) => {
    setFormLoading(true);
    try {
      if (editingNote) {
        await updateNote(editingNote.id, values);
        message.success('Note updated');
      } else {
        await createNote(values);
        message.success('Note created');
      }
      setModalVisible(false);
      fetchNotes();
    } catch (error) {
      message.error('Failed to save note');
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setModalVisible(false);
  };

  return (
    <AppLayout>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <SearchBar onSearch={handleSearch} />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Create Note
        </Button>
      </div>
      {loading ? (
        <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />
      ) : (
        <Row gutter={16}>
          {notes.map((note) => (
            <Col key={note.id} xs={24} sm={12} md={8} lg={6}>
              <NoteCard note={note} onEdit={handleEdit} onDelete={handleDelete} />
            </Col>
          ))}
        </Row>
      )}
      <Modal
        title={editingNote ? 'Edit Note' : 'Create Note'}
        open={modalVisible}
        onCancel={handleFormCancel}
        footer={null}
        destroyOnClose
      >
        <NoteForm
          initialValues={editingNote || {}}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          loading={formLoading}
        />
      </Modal>
    </AppLayout>
  );
};

export default DashboardPage;
