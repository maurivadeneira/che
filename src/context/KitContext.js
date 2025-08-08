import React, { createContext, useState, useContext } from 'react';

const KitContext = createContext();

export function KitProvider({ children }) {
  const [kitData, setKitData] = useState({
    owner: {
      name: '',
      email: '',
      paymentInfo: {
        accountName: '',
        accountNumber: '',
        bank: '',
        paypalEmail: ''
      },
      setupDate: '',
      isOwner: false
    },
    beneficiary: {
      name: '',
      email: '',
      referrer: '',
      activationDate: '',
      isBeneficiary: false,
      paymentInfo: {
        accountName: '',
        accountNumber: '',
        bank: '',
        paypalEmail: ''
      }
    },
    kitInfo: {
      creationDate: '',
      status: 'draft',
      activationCode: '',
      invitationLinks: []
    }
  });

  const updateOwner = (ownerData) => {
    setKitData(prevData => ({
      ...prevData,
      owner: {
        ...prevData.owner,
        ...ownerData
      }
    }));
  };

  const updateBeneficiary = (beneficiaryData) => {
    setKitData(prevData => ({
      ...prevData,
      beneficiary: {
        ...prevData.beneficiary,
        ...beneficiaryData
      }
    }));
  };

  const updateKitInfo = (kitInfo) => {
    setKitData(prevData => ({
      ...prevData,
      kitInfo: {
        ...prevData.kitInfo,
        ...kitInfo
      }
    }));
  };

  // Función para reiniciar los datos del contexto (útil para cerrar sesión o cambiar de usuario)
  const resetKitData = () => {
    setKitData({
      owner: {
        name: '',
        email: '',
        paymentInfo: {
          accountName: '',
          accountNumber: '',
          bank: '',
          paypalEmail: ''
        },
        setupDate: '',
        isOwner: false
      },
      beneficiary: {
        name: '',
        email: '',
        referrer: '',
        activationDate: '',
        isBeneficiary: false,
        paymentInfo: {
          accountName: '',
          accountNumber: '',
          bank: '',
          paypalEmail: ''
        }
      },
      kitInfo: {
        creationDate: '',
        status: 'draft',
        activationCode: '',
        invitationLinks: []
      }
    });
  };

  // Función para guardar los datos en el servidor
  const saveKit = async () => {
    try {
      const response = await fetch('/api/admin/kits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(kitData),
      });

      if (!response.ok) {
        throw new Error('Error al guardar los datos del kit');
      }

      const savedData = await response.json();
      return savedData;
    } catch (error) {
      console.error('Error al guardar el kit:', error);
      throw error;
    }
  };

  return (
    <KitContext.Provider value={{ 
      kitData, 
      updateOwner, 
      updateBeneficiary, 
      updateKitInfo,
      resetKitData,
      saveKit
    }}>
      {children}
    </KitContext.Provider>
  );
}

export function useKit() {
  return useContext(KitContext);
}