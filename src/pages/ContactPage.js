import React, { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [submitStatus, setSubmitStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Aquí normalmente enviarías los datos a un backend
    // Por ahora solo simulamos una respuesta exitosa
    
    // Validación básica
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus({
        submitted: true,
        success: false,
        message: 'Por favor complete todos los campos obligatorios.'
      });
      return;
    }
    
    // Simulación de envío exitoso
    setSubmitStatus({
      submitted: true,
      success: true,
      message: 'Su mensaje ha sido enviado con éxito. Nos pondremos en contacto pronto.'
    });
    
    // Limpiar el formulario después de enviar
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="contact-page">
      <h2>Contacto</h2>
      <p>Nos encantaría saber de usted. Complete el formulario a continuación para enviarnos un mensaje.</p>
      
      {submitStatus.submitted && (
        <div className={`alert ${submitStatus.success ? 'alert-success' : 'alert-error'}`}>
          {submitStatus.message}
        </div>
      )}
      
      <div className="contact-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="subject">Asunto</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="message">Mensaje *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          
          <button type="submit" className="submit-btn">Enviar Mensaje</button>
        </form>
      </div>
      
      <div className="contact-info">
        <h3>Información de Contacto</h3>
        <p>También puede ponerse en contacto con nosotros utilizando la siguiente información:</p>
        <ul>
          <li><strong>Dirección:</strong> Av. Siempre Viva 123, Ciudad Ejemplo</li>
          <li><strong>Teléfono:</strong> +57 123 456 7890</li>
          <li><strong>Email:</strong> info@corporacionche.org</li>
        </ul>
      </div>
    </div>
  );
};

export default ContactPage;
