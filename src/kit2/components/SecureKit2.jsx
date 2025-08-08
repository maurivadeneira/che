/**
 * COMPONENTE SEGURO DE KIT2
 * Corporación Herejía Económica
 * 
 * Reemplaza el sistema inseguro de descarga con interfaz protegida
 * Incluye generación, descarga segura y verificación
 */

import React, { useState, useEffect } from 'react';
import './SecureKit2.css';

const SecureKit2 = () => {
  // Estados principales
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Estados del Kit2
  const [kit2Data, setKit2Data] = useState(null);
  const [generatingKit2, setGeneratingKit2] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [verificationCode, setVerificationCode] = useState(null);
  
  // Estados de verificación
  const [verifyingCode, setVerifyingCode] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [verifyingInProgress, setVerifyingInProgress] = useState(false);

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    loadUserData();
  }, []);

  /**
   * Carga datos del usuario desde localStorage o API
   */
  const loadUserData = () => {
    try {
      const userData = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (userData && token) {
        setUser(JSON.parse(userData));
      } else {
        setError('Debe iniciar sesión para generar Kit2');
      }
    } catch (error) {
      console.error('Error cargando datos de usuario:', error);
      setError('Error cargando datos de usuario');
    }
  };

  /**
   * Genera un nuevo Kit2 seguro personalizado
   */
  const generateSecureKit2 = async () => {
    if (!user) {
      setError('Debe iniciar sesión para generar Kit2');
      return;
    }

    setGeneratingKit2(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:3001/kit2/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          corporationPurchase: 20,
          networkCommission: 7
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error generando Kit2');
      }

      if (data.success) {
        setKit2Data(data.kit2Info);
        setDownloadUrl(data.kit2Info.downloadUrl);
        setVerificationCode(data.kit2Info.verificationCode);
        setSuccess('¡Kit2 generado exitosamente! Su Kit2 personalizado está listo.');
        
        // Auto-descarga después de 2 segundos
        setTimeout(() => {
          initiateSecureDownload(data.kit2Info.downloadUrl);
        }, 2000);
      } else {
        throw new Error(data.message || 'Error generando Kit2');
      }

    } catch (error) {
      console.error('Error generando Kit2:', error);
      setError(`Error generando Kit2: ${error.message}`);
    } finally {
      setGeneratingKit2(false);
    }
  };

  /**
   * Inicia descarga segura usando token
   */
  const initiateSecureDownload = (secureUrl) => {
    try {
      // Crear enlace temporal para descarga
      const link = document.createElement('a');
      link.href = secureUrl;
      link.download = `Kit2_Heresia_Economica_${user.name.replace(/\s+/g, '_')}.pdf`;
      link.target = '_blank';
      
      // Agregar el enlace al DOM temporalmente
      document.body.appendChild(link);
      link.click();
      
      // Remover el enlace
      document.body.removeChild(link);
      
      setSuccess('Descarga iniciada. Si no se descarga automáticamente, use el botón de descarga manual.');
    } catch (error) {
      console.error('Error iniciando descarga:', error);
      setError('Error iniciando descarga automática. Use el botón de descarga manual.');
    }
  };

  /**
   * Verifica la autenticidad de un Kit2 usando código
   */
  const verifyKit2Authenticity = async () => {
    if (!verifyingCode || verifyingCode.length !== 12) {
      setError('Ingrese un código de verificación válido de 12 dígitos');
      return;
    }

    setVerifyingInProgress(true);
    setError(null);
    setVerificationResult(null);

    try {
      const response = await fetch(`http://localhost:3001/verify-kit2/${verifyingCode}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        setVerificationResult(data);
      } else {
        throw new Error(data.message || 'Error verificando Kit2');
      }

    } catch (error) {
      console.error('Error verificando Kit2:', error);
      setError(`Error verificando Kit2: ${error.message}`);
    } finally {
      setVerifyingInProgress(false);
    }
  };

  /**
   * Copia texto al portapapeles
   */
  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setSuccess(`${type} copiado al portapapeles`);
        setTimeout(() => setSuccess(null), 3000);
      })
      .catch(() => {
        setError(`Error copiando ${type}`);
      });
  };

  return (
    <div className="secure-kit2-container">
      <div className="kit2-header">
        <h1>🛡️ Kit2 Seguro de la Herejía Económica</h1>
        <p className="security-badge">SISTEMA DE SEGURIDAD CORPORATIVO</p>
      </div>

      {/* Alertas */}
      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          <span>{error}</span>
          <button className="alert-close" onClick={() => setError(null)}>×</button>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <span className="alert-icon">✅</span>
          <span>{success}</span>
          <button className="alert-close" onClick={() => setSuccess(null)}>×</button>
        </div>
      )}

      {/* Sección de generación */}
      <div className="kit2-section">
        <h2>Generar Kit2 Personalizado</h2>
        
        {user ? (
          <div className="user-info">
            <p><strong>Usuario:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Estado:</strong> ✅ Autenticado</p>
          </div>
        ) : (
          <div className="user-info error">
            <p>⚠️ Debe iniciar sesión para generar Kit2</p>
          </div>
        )}

        <div className="generation-controls">
          <button
            className="btn btn-primary btn-large"
            onClick={generateSecureKit2}
            disabled={!user || generatingKit2}
          >
            {generatingKit2 ? (
              <>
                <span className="spinner"></span>
                Generando Kit2 Seguro...
              </>
            ) : (
              <>
                🔒 Generar Mi Kit2 Seguro
              </>
            )}
          </button>
          
          <div className="security-features">
            <h4>🛡️ Características de Seguridad:</h4>
            <ul>
              <li>✅ Watermark personalizado único</li>
              <li>✅ Enlace de descarga con token temporal</li>
              <li>✅ Código de verificación de 12 dígitos</li>
              <li>✅ Firma digital corporativa</li>
              <li>✅ Protección anti-copia</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sección de descarga (cuando hay Kit2 generado) */}
      {kit2Data && (
        <div className="kit2-section download-section">
          <h2>🎯 Su Kit2 Está Listo</h2>
          
          <div className="kit2-info">
            <div className="info-card">
              <h3>Información de Descarga</h3>
              <div className="info-row">
                <span>Código de Verificación:</span>
                <span className="monospace">{verificationCode}</span>
                <button 
                  className="btn btn-small"
                  onClick={() => copyToClipboard(verificationCode, 'Código de verificación')}
                >
                  Copiar
                </button>
              </div>
              <div className="info-row">
                <span>Válido hasta:</span>
                <span>{new Date(kit2Data.expiresAt).toLocaleString('es-ES')}</span>
              </div>
              <div className="info-row">
                <span>Estado de Seguridad:</span>
                <span className="security-status">🔒 PROTEGIDO</span>
              </div>
            </div>

            <div className="download-controls">
              <button
                className="btn btn-success btn-large"
                onClick={() => initiateSecureDownload(downloadUrl)}
              >
                ⬇️ Descargar Kit2 Seguro
              </button>
              
              <button
                className="btn btn-secondary"
                onClick={() => copyToClipboard(kit2Data.verificationUrl, 'URL de verificación')}
              >
                🔗 Copiar Enlace de Verificación
              </button>
            </div>
          </div>

          <div className="security-warning">
            <h4>⚠️ Instrucciones de Seguridad:</h4>
            <ul>
              <li>Su Kit2 tiene watermarks únicos personalizados</li>
              <li>El enlace de descarga expira en 24 horas</li>
              <li>Comparta solo el código de verificación, no el enlace de descarga</li>
              <li>Reporte cualquier copia no autorizada a: seguridad@corpherejiaeconomica.com</li>
            </ul>
          </div>
        </div>
      )}

      {/* Sección de verificación pública */}
      <div className="kit2-section verification-section">
        <h2>🔍 Verificar Autenticidad de Kit2</h2>
        <p>Ingrese el código de verificación de cualquier Kit2 para verificar su autenticidad:</p>
        
        <div className="verification-controls">
          <div className="input-group">
            <input
              type="text"
              placeholder="Ingrese código de 12 dígitos"
              value={verifyingCode}
              onChange={(e) => setVerifyingCode(e.target.value.replace(/\D/g, '').substring(0, 12))}
              className="verification-input"
              maxLength="12"
            />
            <button
              className="btn btn-primary"
              onClick={verifyKit2Authenticity}
              disabled={verifyingInProgress || verifyingCode.length !== 12}
            >
              {verifyingInProgress ? 'Verificando...' : 'Verificar'}
            </button>
          </div>
        </div>

        {/* Resultado de verificación */}
        {verificationResult && (
          <div className={`verification-result ${verificationResult.authentic ? 'authentic' : 'not-authentic'}`}>
            <div className="result-header">
              <span className="result-icon">
                {verificationResult.authentic ? '✅' : '⚠️'}
              </span>
              <span className="result-text">{verificationResult.result}</span>
            </div>

            {verificationResult.authentic ? (
              <div className="authentic-info">
                <h4>✅ Kit2 Auténtico Verificado</h4>
                <p><strong>Vendedor Original:</strong> {verificationResult.originalInfo?.seller || 'N/A'}</p>
                <p><strong>Fecha de Generación:</strong> {verificationResult.originalInfo?.generatedDate ? new Date(verificationResult.originalInfo.generatedDate).toLocaleString('es-ES') : 'N/A'}</p>
                <p><strong>Verificado por:</strong> {verificationResult.verifiedBy}</p>
                <div className="safety-badge">
                  🛡️ SEGURO PARA USAR
                </div>
              </div>
            ) : (
              <div className="not-authentic-info">
                <h4>⚠️ Kit2 NO Auténtico</h4>
                <p><strong>Advertencia:</strong> {verificationResult.warning?.message}</p>
                <p><strong>Acción Recomendada:</strong> {verificationResult.instructions?.recommendation}</p>
                <div className="danger-badge">
                  🚫 NO USAR ESTE KIT2
                </div>
                <button 
                  className="btn btn-danger"
                  onClick={() => window.open(`mailto:seguridad@corpherejiaeconomica.com?subject=Reporte Kit2 Fraudulento - ${verifyingCode}`, '_blank')}
                >
                  📧 Reportar Fraude
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer corporativo */}
      <div className="kit2-footer">
        <p><strong>Corporación Herejía Económica</strong></p>
        <p>Sistema de Seguridad Kit2 v2.0 | corpherejiaeconomica.com</p>
        <p>Soporte: soporte@corpherejiaeconomica.com | Seguridad: seguridad@corpherejiaeconomica.com</p>
      </div>
    </div>
  );
};

export default SecureKit2;