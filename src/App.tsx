import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProtocolListPage } from './components/ProtocolListPage';
import { ProtocolTablePage } from './components/ProtocolTablePage';
import { ProtocolModal } from './components/ProtocolModal';
import { Protocol } from './types';
import * as api from './services/api';

function App() {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProtocol, setEditingProtocol] = useState<Protocol | null>(null);
  const [showTable, setShowTable] = useState(false);
  const [regions, setRegions] = useState<string[]>([]);
  const [executors, setExecutors] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const loadedProtocols = await api.getAllProtocols();
      setProtocols(loadedProtocols);
      const loadedRegions = await api.getAllRegions();
      setRegions(loadedRegions);
      const loadedExecutors = await api.getAllExecutors();
      setExecutors(loadedExecutors);
    };
    fetchData();
  }, []);

  const addProtocol = async (protocol: Protocol) => {
    const newProtocol = await api.addProtocol(protocol);
    setProtocols([...protocols, newProtocol]);
  };

  const updateProtocol = async (updatedProtocol: Protocol) => {
    const updated = await api.updateProtocol(updatedProtocol);
    setProtocols(protocols.map(p => p.id === updated.id ? updated : p));
  };

  const deleteProtocol = async (id: number) => {
    await api.deleteProtocol(id);
    setProtocols(protocols.filter(p => p.id !== id));
  };

  const openModal = (protocol: Protocol | null = null) => {
    setEditingProtocol(protocol);
    setShowModal(true);
  };

  const closeModal = () => {
    setEditingProtocol(null);
    setShowModal(false);
  };

  const openTable = (protocol: Protocol) => {
    setEditingProtocol(protocol);
    setShowTable(true);
  };

  const closeTable = () => {
    setEditingProtocol(null);
    setShowTable(false);
  };

  const updateRegions = async (newRegions: string[]) => {
    const oldRegions = new Set(regions);
    const newRegionsSet = new Set(newRegions);

    for (const region of newRegionsSet) {
      if (!oldRegions.has(region)) {
        await api.addRegion(region);
      }
    }

    for (const region of oldRegions) {
      if (!newRegionsSet.has(region)) {
        await api.deleteRegion(region);
      }
    }

    setRegions(newRegions);
  };

  const updateExecutors = async (newExecutors: string[]) => {
    const oldExecutors = new Set(executors);
    const newExecutorsSet = new Set(newExecutors);

    for (const executor of newExecutorsSet) {
      if (!oldExecutors.has(executor)) {
        await api.addExecutor(executor);
      }
    }

    for (const executor of oldExecutors) {
      if (!newExecutorsSet.has(executor)) {
        await api.deleteExecutor(executor);
      }
    }

    setExecutors(newExecutors);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex">
        {!showTable ? (
          <ProtocolListPage
            protocols={protocols}
            onCreateProtocol={() => openModal()}
            onEditProtocol={openTable}
            onDeleteProtocol={deleteProtocol}
            regions={regions}
            setRegions={updateRegions}
            executors={executors}
            setExecutors={updateExecutors}
          />
        ) : (
          <ProtocolTablePage
            protocol={editingProtocol!}
            onClose={closeTable}
            onSave={updateProtocol}
            regions={regions}
            executors={executors}
          />
        )}
      </main>
      {showModal && (
        <ProtocolModal
          protocol={editingProtocol}
          onSave={(protocol) => {
            if (editingProtocol) {
              updateProtocol(protocol);
            } else {
              addProtocol(protocol);
            }
            closeModal();
          }}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default App;