#!/bin/bash
DOCUMENT_NAME=$1
mkdir -p ContenidoProyChe/traducciones/$DOCUMENT_NAME
touch ContenidoProyChe/traducciones/$DOCUMENT_NAME/$DOCUMENT_NAME-en.md
touch ContenidoProyChe/traducciones/$DOCUMENT_NAME/$DOCUMENT_NAME-pt.md
touch ContenidoProyChe/traducciones/$DOCUMENT_NAME/$DOCUMENT_NAME-fr.md
touch ContenidoProyChe/traducciones/$DOCUMENT_NAME/$DOCUMENT_NAME-de.md
touch ContenidoProyChe/traducciones/$DOCUMENT_NAME/$DOCUMENT_NAME-it.md
echo "Estructura creada para $DOCUMENT_NAME"
