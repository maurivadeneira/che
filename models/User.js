const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // ===== INFORMACIÓN BÁSICA =====
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'author', 'admin'],
    default: 'user'
  },

  // ===== INFORMACIÓN PERSONAL =====
  phone: {
    countryCode: {
      type: String,
      default: '+57' // Colombia por defecto
    },
    number: {
      type: String,
      required: false
    },
    verified: {
      type: Boolean,
      default: false
    }
  },
  
  // ===== CUENTAS MÚLTIPLES DE PAGO =====
  paymentAccounts: {
    // PayPal (preferido)
    paypal: [{
      email: {
        type: String,
        trim: true
      },
      alias: {
        type: String, // "Personal", "Empresa", etc.
        default: 'Principal'
      },
      isDefault: {
        type: Boolean,
        default: false
      },
      verified: {
        type: Boolean,
        default: false
      },
      addedDate: {
        type: Date,
        default: Date.now
      }
    }],

    // Nequi
    nequi: [{
      phone: {
        type: String,
        trim: true
      },
      alias: String,
      isDefault: {
        type: Boolean,
        default: false
      },
      verified: {
        type: Boolean,
        default: false
      }
    }],

    // Cuentas Bancarias
    bankAccounts: [{
      bankName: {
        type: String,
        required: true
      },
      accountType: {
        type: String,
        enum: ['savings', 'checking', 'business'],
        required: true
      },
      accountNumber: {
        type: String,
        required: true
      },
      holderName: {
        type: String,
        required: true
      },
      currency: {
        type: String,
        default: 'USD'
      },
      country: {
        type: String,
        default: 'CO'
      },
      alias: String,
      isDefault: {
        type: Boolean,
        default: false
      },
      verified: {
        type: Boolean,
        default: false
      }
    }],

    // Criptomonedas
    crypto: [{
      currency: {
        type: String,
        enum: ['BTC', 'ETH', 'USDT', 'USDC', 'other']
      },
      address: String,
      network: String, // 'Bitcoin', 'Ethereum', 'BSC', etc.
      alias: String,
      isDefault: Boolean,
      verified: Boolean
    }],

    // Otras alternativas futuras
    others: [{
      type: String, // 'Zelle', 'Wise', 'Western Union', etc.
      accountInfo: mongoose.Schema.Types.Mixed,
      alias: String,
      isDefault: Boolean,
      verified: Boolean
    }]
  },

  // ===== OBRAS DIGITALES (SOLO AUTORES) =====
  digitalWorks: {
    // Libros y Artículos
    books: [{
      title: String,
      description: String,
      category: {
        type: String,
        enum: ['book', 'article', 'ebook', 'magazine']
      },
      format: {
        type: String,
        enum: ['PDF', 'EPUB', 'MOBI', 'DOC']
      },
      fileUrl: String,
      fileSize: Number, // en bytes
      pages: Number,
      language: String,
      isbn: String,
      publishDate: Date,
      uploadDate: {
        type: Date,
        default: Date.now
      },
      active: {
        type: Boolean,
        default: true
      }
    }],

    // Videos y Conferencias
    videos: [{
      title: String,
      description: String,
      category: {
        type: String,
        enum: ['conference', 'tutorial', 'webinar', 'documentary', 'presentation']
      },
      format: {
        type: String,
        enum: ['MP4', 'AVI', 'MOV', 'streaming_link']
      },
      fileUrl: String,
      thumbnailUrl: String,
      duration: Number, // en segundos
      quality: String, // '720p', '1080p', '4K'
      fileSize: Number,
      uploadDate: Date,
      active: Boolean
    }],

    // Obras de Arte
    artworks: [{
      title: String,
      description: String,
      category: {
        type: String,
        enum: ['digital_painting', 'illustration', 'design', 'photography', '3d_model']
      },
      format: {
        type: String,
        enum: ['JPG', 'PNG', 'SVG', 'PSD', 'AI', 'BLEND', 'STL']
      },
      fileUrl: String,
      previewUrl: String,
      resolution: String, // '1920x1080', '4K', etc.
      fileSize: Number,
      license: String, // 'Commercial', 'Personal', 'Royalty-free'
      uploadDate: Date,
      active: Boolean
    }],

    // Composiciones Musicales
    music: [{
      title: String,
      artist: String,
      album: String,
      description: String,
      category: {
        type: String,
        enum: ['song', 'instrumental', 'soundtrack', 'jingle', 'sound_effect']
      },
      audioFile: {
        url: String,
        format: String, // 'MP3', 'WAV', 'FLAC'
        quality: String, // '128kbps', '320kbps', 'lossless'
        duration: Number
      },
      sheetMusic: {
        url: String,
        format: String // 'PDF', 'MusicXML', 'MIDI'
      },
      genre: String,
      bpm: Number,
      key: String, // 'C Major', 'A Minor', etc.
      license: String,
      uploadDate: Date,
      active: Boolean
    }],

    // Cursos y Formación
    courses: [{
      title: String,
      description: String,
      category: {
        type: String,
        enum: ['programming', 'design', 'business', 'marketing', 'languages', 'music', 'art', 'other']
      },
      level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert']
      },
      modules: [{
        title: String,
        description: String,
        order: Number,
        videos: [String], // URLs
        documents: [String], // URLs
        exercises: [String], // URLs
        duration: Number // minutos
      }],
      totalDuration: Number, // minutos totales
      certificateIncluded: Boolean,
      language: String,
      requirements: [String],
      learningObjectives: [String],
      uploadDate: Date,
      lastUpdated: Date,
      active: Boolean
    }],

    // Paquetes/Bundles
    bundles: [{
      title: String,
      description: String,
      type: {
        type: String,
        enum: ['course_bundle', 'book_collection', 'multimedia_pack', 'complete_library']
      },
      includedItems: {
        books: [mongoose.Schema.Types.ObjectId],
        videos: [mongoose.Schema.Types.ObjectId],
        courses: [mongoose.Schema.Types.ObjectId],
        music: [mongoose.Schema.Types.ObjectId],
        artworks: [mongoose.Schema.Types.ObjectId]
      },
      discountPercentage: Number, // 10%, 20%, etc.
      totalValue: Number,
      bundlePrice: Number,
      active: Boolean,
      createdDate: Date
    }],

    // Software y Herramientas
    software: [{
      title: String,
      description: String,
      category: {
        type: String,
        enum: ['desktop_app', 'web_tool', 'plugin', 'template', 'script']
      },
      platform: [String], // ['Windows', 'Mac', 'Linux', 'Web']
      fileUrl: String,
      version: String,
      requirements: [String],
      documentation: String,
      sourceCode: String, // Si se incluye
      license: String,
      uploadDate: Date,
      active: Boolean
    }],

    // Convenios Empresariales
    partnerships: [{
      companyName: String,
      serviceDescription: String,
      accessType: {
        type: String,
        enum: ['platform_access', 'course_voucher', 'service_credit', 'discount_code']
      },
      accessDetails: mongoose.Schema.Types.Mixed,
      validityPeriod: Number, // días
      termsAndConditions: String,
      contactInfo: String,
      active: Boolean,
      createdDate: Date
    }]
  },

  // ===== SISTEMA KIT2 =====
  kit2: {
    // Información de red
    level: {
      type: Number,
      default: null
    },
    
    invitedBy: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
      },
      userName: String,
      invitationDate: Date
    },

    directInvites: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      userName: String,
      invitationDate: Date,
      status: {
        type: String,
        enum: ['pending', 'registered', 'active', 'completed'],
        default: 'pending'
      }
    }],

    // Historial de compras de Kit2 (PERMANENTE)
    purchaseHistory: [{
      // Compra individual
      purchaseId: {
        type: String,
        unique: true
      },
      fromAuthor: {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        userName: String
      },
      purchaseDate: {
        type: Date,
        default: Date.now
      },
      
      // Contenido recibido (PERMANENTE - acumulativo)
      contentReceived: {
        books: [mongoose.Schema.Types.ObjectId],
        videos: [mongoose.Schema.Types.ObjectId],
        courses: [mongoose.Schema.Types.ObjectId],
        music: [mongoose.Schema.Types.ObjectId],
        artworks: [mongoose.Schema.Types.ObjectId],
        software: [mongoose.Schema.Types.ObjectId],
        bundles: [mongoose.Schema.Types.ObjectId],
        partnerships: [mongoose.Schema.Types.ObjectId]
      },
      
      // Pagos asociados a esta compra
      payments: {
        toBenefactor: {
          amount: Number,
          status: String,
          receiptUrl: String,
          paidDate: Date,
          toAccount: String // Qué cuenta del benefactor
        },
        toCorporation: {
          amount: Number,
          status: String,
          paidDate: Date
        }
      }
    }],

    // Kit2 personalizados (pueden tener múltiples activos)
    personalizedKits: [{
      purchaseId: String, // Referencia a purchaseHistory[]
      validFrom: {
        type: Date,
        default: Date.now
      },
      validUntil: {
        type: Date,
        required: true
      },
      status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
      },
      canSell: {
        type: Boolean,
        default: true
      },
      pdfUrl: String,
      generatedDate: Date,
      emailSent: Boolean
    }],

    // Donaciones recibidas
    donationsReceived: [{
      fromUser: {
        userId: mongoose.Schema.Types.ObjectId,
        userName: String
      },
      amount: Number,
      receivedDate: Date,
      toAccount: String, // Qué cuenta del usuario recibió el pago
      relatedPurchase: String, // purchaseId relacionado
      status: String
    }],

    // Estadísticas del usuario
    stats: {
      totalPurchases: {
        type: Number,
        default: 0
      },
      totalInvited: {
        type: Number,
        default: 0
      },
      totalDonationsReceived: {
        type: Number,
        default: 0
      },
      totalValueGenerated: {
        type: Number,
        default: 0
      },
      activeKitsCount: {
        type: Number,
        default: 0
      },
      digitalWorksOwned: {
        type: Number,
        default: 0
      }
    }
  },

  // ===== SOLO PARA AUTORES =====
  authorData: {
    // Primer beneficiario (solo autores pueden elegir)
    firstBeneficiary: {
      userId: mongoose.Schema.Types.ObjectId,
      userName: String,
      assignedDate: Date
    },
    
    // Configuración de entrega automática
    autoDelivery: {
      enabled: {
        type: Boolean,
        default: true
      },
      includeAllWorks: {
        type: Boolean,
        default: true
      },
      customSelections: {
        books: [mongoose.Schema.Types.ObjectId],
        videos: [mongoose.Schema.Types.ObjectId],
        courses: [mongoose.Schema.Types.ObjectId],
        // etc.
      }
    },

    // Estadísticas de autor
    authorStats: {
      totalKit2Generated: Number,
      totalSales: Number,
      totalRevenue: Number,
      activeSubscribers: Number // Usuarios con kits activos
    }
  },

  // ===== SEGURIDAD =====
  security: {
    lastPasswordReset: Date,
    
    verificationCodes: {
      phone: {
        code: String,
        expiresAt: Date,
        attempts: Number
      },
      email: {
        code: String,
        expiresAt: Date,
        attempts: Number
      }
    },

    loginAttempts: {
      count: Number,
      lastAttempt: Date,
      blockedUntil: Date
    }
  },

  // ===== METADATOS =====
  profile: {
    completed: Boolean,
    completedSteps: [{
      step: String,
      completedAt: Date
    }]
  },

  // ===== TIMESTAMPS =====
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: Date
});

// ===== MIDDLEWARE =====
UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// ===== MÉTODOS =====
UserSchema.methods.hasActiveKit = function() {
  return this.kit2.personalizedKits.some(kit => 
    kit.status === 'active' && 
    kit.validUntil > new Date() &&
    kit.canSell === true
  );
};

UserSchema.methods.canPurchaseFrom = function(authorId) {
  // Puede comprar del mismo autor sin restricciones
  return true;
};

UserSchema.methods.getDefaultPaymentAccount = function(type = 'paypal') {
  const accounts = this.paymentAccounts[type];
  return accounts ? accounts.find(acc => acc.isDefault) || accounts[0] : null;
};

UserSchema.methods.getAllDigitalWorks = function() {
  // Retorna todas las obras para entrega automática
  const allWorks = {};
  Object.keys(this.digitalWorks.toObject()).forEach(category => {
    allWorks[category] = this.digitalWorks[category].filter(work => work.active);
  });
  return allWorks;
};

UserSchema.methods.needsNewKit = function() {
  const activeKits = this.kit2.personalizedKits.filter(kit => 
    kit.status === 'active' && kit.validUntil > new Date()
  );
  
  if (activeKits.length === 0) return true;
  
  // Avisa 30 días antes del vencimiento del último kit activo
  const nextExpiry = Math.min(...activeKits.map(kit => kit.validUntil));
  const daysUntilExpiry = (nextExpiry - new Date()) / (1000 * 60 * 60 * 24);
  return daysUntilExpiry <= 30;
};

UserSchema.methods.getDigitalLibrary = function() {
  // Retorna TODAS las obras adquiridas (permanentes)
  const library = {};
  this.kit2.purchaseHistory.forEach(purchase => {
    Object.keys(purchase.contentReceived.toObject()).forEach(category => {
      if (!library[category]) library[category] = [];
      library[category] = [...library[category], ...purchase.contentReceived[category]];
    });
  });
  return library;
};

module.exports = mongoose.model('User', UserSchema);