#!/usr/bin/env python3
import re
from deep_translator import GoogleTranslator

def traducir_srt(archivo_entrada, archivo_salida, idioma_destino):
    """Traduce un archivo SRT manteniendo timestamps y estructura"""
    
    with open(archivo_entrada, 'r', encoding='utf-8') as f:
        contenido = f.read()
    
    # Separar en bloques (cada bloque tiene: número, timestamp, texto)
    bloques = contenido.strip().split('\n\n')
    
    traductor = GoogleTranslator(source='es', target=idioma_destino)
    bloques_traducidos = []
    
    for i, bloque in enumerate(bloques, 1):
        lineas = bloque.split('\n')
        
        if len(lineas) >= 3:
            numero = lineas[0]
            timestamp = lineas[1]
            texto = '\n'.join(lineas[2:])
            
            # Traducir solo si no es [Música]
            if texto.strip() not in ['[Música]', '[Music]']:
                try:
                    texto_traducido = traductor.translate(texto)
                except:
                    texto_traducido = texto  # Si falla, mantener original
            else:
                # Traducir [Música] según idioma
                if idioma_destino == 'fr':
                    texto_traducido = '[Musique]'
                elif idioma_destino == 'de':
                    texto_traducido = '[Musik]'
                elif idioma_destino == 'it':
                    texto_traducido = '[Musica]'
            
            bloque_nuevo = f"{numero}\n{timestamp}\n{texto_traducido}"
            bloques_traducidos.append(bloque_nuevo)
        
        # Mostrar progreso cada 100 bloques
        if i % 100 == 0:
            print(f"Procesados {i}/{len(bloques)} bloques...")
    
    # Escribir archivo de salida
    with open(archivo_salida, 'w', encoding='utf-8') as f:
        f.write('\n\n'.join(bloques_traducidos))
    
    print(f"✓ Traducción completada: {archivo_salida}")

# Traducir a los 3 idiomas
print("Iniciando traducciones...\n")

print("1/3 Traduciendo a francés...")
traducir_srt('HEREJIA_ECONOMICA_ES.srt', 'HEREJIA_ECONOMICA_FR.srt', 'fr')

print("\n2/3 Traduciendo a alemán...")
traducir_srt('HEREJIA_ECONOMICA_ES.srt', 'HEREJIA_ECONOMICA_DE.srt', 'de')

print("\n3/3 Traduciendo a italiano...")
traducir_srt('HEREJIA_ECONOMICA_ES.srt', 'HEREJIA_ECONOMICA_IT.srt', 'it')

print("\n¡Todas las traducciones completadas!")
