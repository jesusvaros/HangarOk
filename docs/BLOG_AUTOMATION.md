# 🤖 Automatización del Blog - Guía Completa

## 📋 Scripts Disponibles

### 🚀 **Script Principal (RECOMENDADO)**
```bash
npm run daily:blog
```
**¿Qué hace?** Script unificado que procesa **todas las fuentes** automáticamente:
- ✅ Scraping de múltiples fuentes de noticias
- ✅ Generación automática de posts
- ✅ Actualización del índice
- ✅ Descarga de imágenes únicas
- ✅ Evita duplicados
- ✅ Resumen completo

### 📝 **Scripts Individuales (para casos específicos)**

#### `npm run generate:blog -- <URL>`
Genera un post desde una URL específica:
```bash
npm run generate:blog -- https://ejemplo.com/noticia --tone=practico --keywords="alquiler" --date=2025-01-10
```

#### `npm run scrape:news`
Solo scraping de El Cronista (legacy):
```bash
npm run scrape:news
```

#### `npm run update:posts`
Solo regenera el índice de posts:
```bash
npm run update:posts
```

#### `npm run download:images`
Solo descarga imágenes faltantes:
```bash
npm run download:images
```

---

## 🌐 Fuentes de Noticias Configuradas

### **Activas:**
1. **El Cronista - Vivienda** 📰
   - URL: `https://www.cronista.com/tema/vivienda-es/`
   - Keywords: alquiler, vivienda, inmueble, piso, casa, etc.

2. **La Sexta - Vivienda** 📺
   - URL: `https://www.lasexta.com/buscador-site/index.html?q=vivienda`
   - Keywords: vivienda, alquiler, piso, casa, inmobiliario

### **Cómo añadir nuevas fuentes:**
Edita `scripts/daily-blog-automation.mjs` en la sección `NEWS_SOURCES`:

```javascript
{
  name: 'Nombre de la Fuente',
  url: 'https://ejemplo.com/noticias',
  type: 'tipo_personalizado', // Requiere implementar extractor
  keywords: ['palabra1', 'palabra2', 'palabra3']
}
```

---

## ⏰ Automatización Diaria

### **GitHub Actions (Automático)**
- ⏰ **Horario:** Todos los días a las 9:00 AM UTC (10:00 AM CET)
- 🔄 **Comando:** `npm run daily:blog`
- 📝 **Commit automático:** Si hay nuevos posts
- 🚀 **Deploy automático:** Los posts aparecen en el blog

### **Cron Job Local (Opcional)**
```bash
# Configurar cron job local
./scripts/setup-cron.sh

# Ver cron jobs activos
crontab -l

# Logs del cron job
tail -f logs/scraper.log
```

---

## 📊 Sistema Anti-Duplicados

### **URLs Procesadas**
- 📁 Archivo: `data/processed-urls.json`
- 🔍 Rastrea todas las URLs ya procesadas
- ✅ Evita generar posts duplicados
- 🔄 Persiste entre ejecuciones

### **Imágenes Únicas**
- 🎨 **60+ imágenes** organizadas por temas
- 🚫 **Nunca repite** la misma imagen
- 🎯 **Selección inteligente** según contenido del post
- 🔄 **Reset automático** cuando se agotan

---

## 🛠️ Personalización

### **Cambiar Tono de Posts**
Edita en `daily-blog-automation.mjs`:
```javascript
'--tone=informativo', // Cambiar a: practico, historia
```

### **Modificar Keywords**
Edita en `daily-blog-automation.mjs`:
```javascript
'--keywords=vivienda, alquiler, inmobiliario', // Añadir más keywords
```

### **Ajustar Delays**
```javascript
await new Promise(resolve => setTimeout(resolve, 2000)); // 2 segundos entre requests
```

---

## 📈 Monitoreo y Logs

### **Logs en Consola**
```
🚀 Iniciando automatización diaria del blog...
📅 Fecha: 7/1/2025
🔍 Procesando: El Cronista - Vivienda
📰 URLs encontradas: 15, relevantes: 8
🆕 URLs nuevas: 3
📝 Generando post para: https://...
✅ Post generado exitosamente
📊 RESUMEN DIARIO:
   🌐 Fuentes procesadas: 2
   📰 Artículos nuevos encontrados: 3
   ✅ Posts generados exitosamente: 3
```

### **Archivos de Estado**
- `data/processed-urls.json` - URLs procesadas
- `logs/scraper.log` - Logs del cron job (si usas local)

---

## 🚨 Solución de Problemas

### **Error: OPENAI_API_KEY no definido**
```bash
# Verificar que existe en .env
cat .env | grep OPENAI_API_KEY

# O exportar temporalmente
export OPENAI_API_KEY="tu-api-key"
npm run daily:blog
```

### **Error: No se encuentran nuevas URLs**
- ✅ Verificar que las fuentes están accesibles
- ✅ Revisar que los extractors funcionan
- ✅ Comprobar keywords de filtrado

### **Posts no aparecen en el blog**
- ✅ Verificar que `posts.ts` se regeneró
- ✅ Reiniciar el servidor de desarrollo
- ✅ Comprobar que las imágenes se descargaron

---

## 🎯 Mejores Prácticas

1. **Usa `npm run daily:blog`** para todo el flujo completo
2. **Añade nuevas fuentes** editando `NEWS_SOURCES`
3. **Monitorea los logs** para detectar problemas
4. **Revisa posts generados** antes de publicar
5. **Mantén el API key seguro** en `.env`

---

## 🔮 Roadmap Futuro

- [ ] Integración con más fuentes (El País, ABC, etc.)
- [ ] Filtros de calidad automáticos
- [ ] Categorización automática de posts
- [ ] Métricas de engagement
- [ ] Notificaciones por email/Slack
