import subprocess
import os
from pathlib import Path
from deep_translator import GoogleTranslator
import time

IDIOMAS = {
    'en': 'English',
    'pt': 'Portuguese',
    'fr': 'French', 
    'de': 'German',
    'it': 'Italian'
}

def convertir_docx_a_markdown(docx_path, md_path):
    """Convierte DOCX a Markdown usando pandoc"""
    print(f"Convirtiendo DOCX a Markdown...")
    try:
        subprocess.run([
            'pandoc',
            docx_path,
            '-o', md_path,
            '-t', 'markdown',
            '--wrap=none'
        ], check=True)
        print(f"Markdown creado: {md_path}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error en conversión: {e}")
        return False

def traducir_por_chunks(texto, idioma_destino, max_chars=4500):
    """Traduce texto en chunks"""
    translator = GoogleTranslator(source='es', target=idioma_destino)
    
    parrafos = texto.split('\n\n')
    resultado = []
    chunk_actual = []
    chars_actuales = 0
    
    for i, parrafo in enumerate(parrafos):
        if chars_actuales + len(parrafo) > max_chars and chunk_actual:
            texto_chunk = '\n\n'.join(chunk_actual)
            try:
                traducido = translator.translate(texto_chunk)
                resultado.append(traducido)
                print(f"Chunk {len(resultado)} traducido")
                time.sleep(0.5)
            except Exception as e:
                print(f"Error: {e}")
                resultado.append(texto_chunk)
            
            chunk_actual = [parrafo]
            chars_actuales = len(parrafo)
        else:
            chunk_actual.append(parrafo)
            chars_actuales += len(parrafo)
    
    if chunk_actual:
        texto_chunk = '\n\n'.join(chunk_actual)
        try:
            traducido = translator.translate(texto_chunk)
            resultado.append(traducido)
            print(f"Chunk final traducido")
        except Exception as e:
            print(f"Error: {e}")
            resultado.append(texto_chunk)
    
    return '\n\n'.join(resultado)

def convertir_markdown_a_pdf(md_path, pdf_path):
    """Convierte Markdown a PDF usando pandoc"""
    print(f"Generando PDF...")
    try:
        subprocess.run([
            'pandoc',
            md_path,
            '-o', pdf_path,
            '--pdf-engine=xelatex',
            '-V', 'geometry:margin=2.5cm',
            '-V', 'mainfont=DejaVu Sans'
        ], check=True)
        print(f"PDF creado: {pdf_path}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error generando PDF: {e}")
        return False

def main():
    print("=" * 70)
    print("TRADUCCION AUTOMATICA COMPLETA - LIBRO 2")
    print("=" * 70)
    
    base_dir = Path('.')
    docx_input = base_dir / '1759505574269_LIBRO SEGUNDO.HEREJIA.ECONOMICA.(PROTOCOLOS^^.) (1).docx'
    md_español = base_dir / 'temp_libro2_es.md'
    output_dir = Path('public/documentos/libros')
    
    if not docx_input.exists():
        print(f"No se encuentra: {docx_input}")
        return
    
    if not convertir_docx_a_markdown(docx_input, md_español):
        return
    
    with open(md_español, 'r', encoding='utf-8') as f:
        contenido_es = f.read()
    
    print(f"\nTamaño del documento: {len(contenido_es):,} caracteres")
    
    for codigo, nombre in IDIOMAS.items():
        print(f"\n{'='*70}")
        print(f"Procesando: {nombre} ({codigo})")
        print('='*70)
        
        try:
            print("Traduciendo...")
            texto_traducido = traducir_por_chunks(contenido_es, codigo)
            
            md_traducido = base_dir / f'temp_libro2_{codigo}.md'
            with open(md_traducido, 'w', encoding='utf-8') as f:
                f.write(texto_traducido)
            print(f"Markdown guardado")
            
            pdf_output = output_dir / codigo / 'LIBRO_SEGUNDO.pdf'
            pdf_output.parent.mkdir(parents=True, exist_ok=True)
            
            if convertir_markdown_a_pdf(md_traducido, pdf_output):
                print(f"PDF guardado en: {pdf_output}")
            
            md_traducido.unlink()
            
        except Exception as e:
            print(f"Error en {nombre}: {e}")
            continue
    
    md_español.unlink()
    
    print("\n" + "=" * 70)
    print("PROCESO COMPLETADO")
    print("=" * 70)

if __name__ == "__main__":
    main()
