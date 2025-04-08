import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CheMediumLogo from '../../components/CheMediumLogo.js';

// Datos ficticios para información de contacto según el fondo
const getInfoContacto = (fondoId) => {
  // Información base
  const contactoBase = {
    telefono: "(+57) 601 123 4567",
    email: "contacto@chemundolibre.org",
    direccion: "Calle Principal #123, Bogotá, Colombia",
    horario: "Lunes a Viernes: 9:00 AM - 5:00 PM",
    redesSociales: [
      { nombre: "Facebook", url: "#" },
      { nombre: "Twitter", url: "#" },
      { nombre: "Instagram", url: "#" },
      { nombre: "LinkedIn", url: "#" }
    ]
  };
  
  // Personalizar según el fondo
  switch(parseInt(fondoId)) {
    case 1: // Inversión Empresarial
      return {
        ...contactoBase,
        email: "inversion@chemundolibre.org",
        subtitulo: "Estamos interesados en conocer tu proyecto empresarial"
      };
    case 2: // Editorial y Medios
      return {
        ...contactoBase,
        email: "editorial@chemundolibre.org",
        subtitulo: "Comparte tus ideas para nuestras publicaciones y medios"
      };
    case 3: // Sanación Emocional
      return {
        ...contactoBase,
        email: "sanacion@chemundolibre.org",
        subtitulo: "Solicita información sobre nuestras terapias y programas"
      };
    // Puedes añadir más casos según sea necesario
    default:
      return {
        ...contactoBase,
        email: `fondo${fondoId}@chemundolibre.org`,
        subtitulo: "Estamos aquí para atender tus consultas"
      };
  }
};

/**
 * Página de contacto de un fondo específico
 */
const FondoContacto = () => {
  const { id } = useParams();
  const [contactoInfo, setContactoInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Estado para el formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  });
  
  // Estado para validación del formulario
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  useEffect(() => {
    // Simulamos carga de datos
    setLoading(true);
    
    // Obtenemos información de contacto para este fondo
    setTimeout(() => {
      setContactoInfo(getInfoContacto(id));
      setLoading(false);
    }, 500);
  }, [id]);

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpiar error cuando el usuario escribe
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };
  
  // Validar el formulario
  const validateForm = () => {
    const errors = {};
    
    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es requerido';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'El correo electrónico no es válido';
    }
    
    if (!formData.asunto.trim()) {
      errors.asunto = 'El asunto es requerido';
    }
    
    if (!formData.mensaje.trim()) {
      errors.mensaje = 'El mensaje es requerido';
    }
    
    return errors;
  };
  
  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar formulario
    const errors = validateForm();
    
    if (Object.keys(errors).length === 0) {
      // Simulamos envío exitoso
      setFormSubmitted(true);
      
      // Reiniciar formulario
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        asunto: '',
        mensaje: ''
      });
    } else {
      setFormErrors(errors);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>Cargando información de contacto...</p>
      </div>
    );
  }

  return (
    <div className="fondo-contacto fade-in">
      <div style={{ marginBottom: '30px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1 style={{ 
            fontSize: '32px',
            fontWeight: 'bold',
            color: 'var(--secondary-color)',
            marginBottom: '15px'
          }}>
            Contacto
          </h1>
          <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <CheMediumLogo style={{ height: '80px', width: '160px' }} />
          </div>
        </div>
        
        {/* Banner azul con "Imagen en desarrollo" */}
        <div style={{ 
          backgroundColor: '#e6f0ff',
          padding: '30px',
          textAlign: 'center',
          borderRadius: '8px',
          marginBottom: '30px'
        }}>
          <h2 style={{ 
            fontSize: '28px',
            color: '#888',
            fontWeight: 'normal'
          }}>
            Imagen en desarrollo
          </h2>
        </div>
        
        <div style={{ 
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: 'var(--box-shadow)',
          padding: '25px',
          marginBottom: '30px'
        }}>
          <p style={{ lineHeight: '1.6' }}>
            {contactoInfo.subtitulo || "Ponte en contacto con nosotros para obtener más información sobre nuestros proyectos y actividades."}
          </p>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        {/* Columna del formulario */}
        <div>
          <div style={{ 
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: 'var(--box-shadow)',
            padding: '25px'
          }}>
            <h2 style={{ 
              fontSize: '20px',
              fontWeight: 'bold',
              color: 'var(--secondary-color)',
              marginBottom: '20px'
            }}>
              Envíanos un mensaje
            </h2>
            
            {formSubmitted ? (
              <div style={{ 
                backgroundColor: '#d4edda', 
                color: '#155724', 
                padding: '15px', 
                borderRadius: '4px',
                marginBottom: '20px'
              }}>
                <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>¡Mensaje enviado!</p>
                <p>Gracias por contactarnos. Nos pondremos en contacto contigo pronto.</p>
                <button 
                  onClick={() => setFormSubmitted(false)}
                  style={{
                    backgroundColor: '#155724',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px 16px',
                    marginTop: '10px',
                    cursor: 'pointer'
                  }}
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                  <label 
                    htmlFor="nombre" 
                    style={{ 
                      display: 'block', 
                      marginBottom: '5px', 
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}
                  >
                    Nombre *
                  </label>
                  <input 
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '4px',
                      border: formErrors.nombre ? '1px solid #dc3545' : '1px solid #ced4da'
                    }}
                  />
                  {formErrors.nombre && (
                    <p style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>
                      {formErrors.nombre}
                    </p>
                  )}
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <label 
                    htmlFor="email" 
                    style={{ 
                      display: 'block', 
                      marginBottom: '5px', 
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}
                  >
                    Correo electrónico *
                  </label>
                  <input 
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '4px',
                      border: formErrors.email ? '1px solid #dc3545' : '1px solid #ced4da'
                    }}
                  />
                  {formErrors.email && (
                    <p style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>
                      {formErrors.email}
                    </p>
                  )}
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <label 
                    htmlFor="telefono" 
                    style={{ 
                      display: 'block', 
                      marginBottom: '5px', 
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}
                  >
                    Teléfono (opcional)
                  </label>
                  <input 
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '4px',
                      border: '1px solid #ced4da'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <label 
                    htmlFor="asunto" 
                    style={{ 
                      display: 'block', 
                      marginBottom: '5px', 
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}
                  >
                    Asunto *
                  </label>
                  <input 
                    type="text"
                    id="asunto"
                    name="asunto"
                    value={formData.asunto}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '4px',
                      border: formErrors.asunto ? '1px solid #dc3545' : '1px solid #ced4da'
                    }}
                  />
                  {formErrors.asunto && (
                    <p style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>
                      {formErrors.asunto}
                    </p>
                  )}
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label 
                    htmlFor="mensaje" 
                    style={{ 
                      display: 'block', 
                      marginBottom: '5px', 
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}
                  >
                    Mensaje *
                  </label>
                  <textarea 
                    id="mensaje"
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleInputChange}
                    rows={5}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '4px',
                      border: formErrors.mensaje ? '1px solid #dc3545' : '1px solid #ced4da',
                      resize: 'vertical'
                    }}
                  ></textarea>
                  {formErrors.mensaje && (
                    <p style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>
                      {formErrors.mensaje}
                    </p>
                  )}
                </div>
                
                <button 
                  type="submit"
                  style={{
                    backgroundColor: 'var(--secondary-color)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '12px 24px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  Enviar mensaje
                </button>
              </form>
            )}
          </div>
        </div>
        
        {/* Columna de información de contacto */}
        <div>
          <div style={{ 
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: 'var(--box-shadow)',
            padding: '25px',
            marginBottom: '30px'
          }}>
            <h2 style={{ 
              fontSize: '20px',
              fontWeight: 'bold',
              color: 'var(--secondary-color)',
              marginBottom: '20px'
            }}>
              Información de contacto
            </h2>
            
            <div style={{ marginBottom: '15px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <span style={{ 
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: '#e6f0ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '10px'
                }}>
                  📞
                </span>
                <span style={{ fontWeight: 'bold' }}>Teléfono:</span>
              </div>
              <p style={{ marginLeft: '40px' }}>{contactoInfo.telefono}</p>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <span style={{ 
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: '#e6f0ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '10px'
                }}>
                  ✉️
                </span>
                <span style={{ fontWeight: 'bold' }}>Correo electrónico:</span>
              </div>
              <p style={{ marginLeft: '40px' }}>{contactoInfo.email}</p>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <span style={{ 
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: '#e6f0ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '10px'
                }}>
                  📍
                </span>
                <span style={{ fontWeight: 'bold' }}>Dirección:</span>
              </div>
              <p style={{ marginLeft: '40px' }}>{contactoInfo.direccion}</p>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <span style={{ 
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: '#e6f0ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '10px'
                }}>
                  🕒
                </span>
                <span style={{ fontWeight: 'bold' }}>Horario de atención:</span>
              </div>
              <p style={{ marginLeft: '40px' }}>{contactoInfo.horario}</p>
            </div>
          </div>
          
          {/* Redes sociales */}
          <div style={{ 
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: 'var(--box-shadow)',
            padding: '25px'
          }}>
            <h2 style={{ 
              fontSize: '20px',
              fontWeight: 'bold',
              color: 'var(--secondary-color)',
              marginBottom: '20px'
            }}>
              Síguenos en redes sociales
            </h2>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              {contactoInfo.redesSociales.map((red, index) => (
                <a 
                  key={index} 
                  href={red.url}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textDecoration: 'none',
                    color: 'var(--text-color)'
                  }}
                >
                  <span style={{ 
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: '#e6f0ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '8px',
                    fontSize: '24px'
                  }}>
                    {red.nombre === 'Facebook' && '📘'}
                    {red.nombre === 'Twitter' && '📗'}
                    {red.nombre === 'Instagram' && '📷'}
                    {red.nombre === 'LinkedIn' && '📋'}
                  </span>
                  <span style={{ fontSize: '14px' }}>{red.nombre}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FondoContacto;
