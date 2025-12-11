import React, { useState, useRef } from 'react'
import {Box, Card, Container, Heading, Text, TextInput, Button, Stack, Label, Grid, Flex, Spinner, TabList, Tab, TabPanel, TextArea} from '@sanity/ui'
import {useClient} from 'sanity'
import {nanoid} from 'nanoid'
import Papa from 'papaparse'

export default function ImportTool() {
  const [activeTab, setActiveTab] = useState('url') // 'url' or 'csv'
  
  // URL Import State
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [data, setData] = useState<any>(null)
  
  // CSV Import State
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvData, setCsvData] = useState<any[]>([])
  const [importProgress, setImportProgress] = useState<{current: number, total: number, log: string[]} | null>(null)
  
  // Common State
  const [error, setError] = useState('')
  const [successId, setSuccessId] = useState('')

  const client = useClient({apiVersion: '2023-05-03'})
  const fileInputRef = useRef<HTMLInputElement>(null)

  // -------------------------------------------------------------------------
  // COMMON FUNCTIONS
  // -------------------------------------------------------------------------

  const uploadImage = async (imageUrl: string) => {
    if (!imageUrl || !imageUrl.startsWith('http')) return null
    try {
      // Fetch l'image via le proxy si nécessaire, ou direct si CORS ok
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const asset = await client.assets.upload('image', blob)
      return {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: asset._id
        }
      }
    } catch (e) {
      console.error(`Échec upload image: ${imageUrl}`, e)
      return null
    }
  }

  // -------------------------------------------------------------------------
  // URL IMPORT LOGIC
  // -------------------------------------------------------------------------

  const handleAnalyzeUrl = async () => {
    if (!url) return
    setIsLoading(true)
    setError('')
    setData(null)
    setSuccessId('')

    try {
      const apiBase = 'https://duroche-immobilier.vercel.app';
      const apiUrl = `${apiBase}/api/scrape?url=${encodeURIComponent(url)}`;
      
      const response = await fetch(apiUrl)
      if (!response.ok) throw new Error('Erreur lors de l\'analyse (API)')
      
      const result = await response.json()
      if (result.error) throw new Error(result.error)
      
      setData(result)
    } catch (err: any) {
      setError(err.message || "Impossible d'analyser cette URL.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateFromUrl = async () => {
    if (!data) return
    setIsCreating(true)

    try {
      // Images handling
      let mainImage = null
      const additionalImages = []

      if (data.images && data.images.length > 0) {
        mainImage = await uploadImage(data.images[0])
        const otherImages = data.images.slice(1, 6)
        for (const imgUrl of otherImages) {
          const imgAsset = await uploadImage(imgUrl as string)
          if (imgAsset) additionalImages.push(imgAsset)
        }
      }

      const doc = {
        _type: 'property',
        type: data.type || 'Maison',
        price: data.price,
        location: data.location || 'Vaucluse',
        area: data.surface,
        rooms: data.rooms,
        bedrooms: data.bedrooms,
        description: data.description,
        reference: data.reference || nanoid(6).toUpperCase(),
        publicationDate: new Date().toISOString(),
        status: 'Disponible',
        isHidden: true, 
        image: mainImage,
        images: additionalImages,
        details: { condition: 'Bon état', heating: 'Électrique' }
      }

      const createdDoc = await client.create(doc)
      setSuccessId(createdDoc._id)
      setData(null)
      setUrl('')
    } catch (err: any) {
      setError(`Erreur création : ${err.message}`)
    } finally {
      setIsCreating(false)
    }
  }

  // -------------------------------------------------------------------------
  // CSV IMPORT LOGIC
  // -------------------------------------------------------------------------

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setCsvFile(file)
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setCsvData(results.data)
          setError('')
        },
        error: (err) => {
          setError(`Erreur lecture CSV: ${err.message}`)
        }
      })
    }
  }

  const handleImportCsv = async () => {
    if (csvData.length === 0) return
    
    setImportProgress({ current: 0, total: csvData.length, log: [] })
    setIsCreating(true)

    let successCount = 0
    let failCount = 0

    for (let i = 0; i < csvData.length; i++) {
      const row = csvData[i]
      const ref = row.reference || row.Reference || nanoid(6).toUpperCase()

      try {
        // 1. Parsing Images (séparées par | ou ,)
        const rawImages = row.images || row.Images || row.photos || ''
        const imageUrls = rawImages.split(/[|,]/).map((s: string) => s.trim()).filter((s: string) => s.length > 0)
        
        let mainImage = null
        const additionalImages = []

        // Upload limit: 5 images max to save time/bandwidth per item
        if (imageUrls.length > 0) {
            mainImage = await uploadImage(imageUrls[0])
            for (let j = 1; j < Math.min(imageUrls.length, 5); j++) {
                const asset = await uploadImage(imageUrls[j])
                if (asset) additionalImages.push(asset)
            }
        }

        // 2. Doc Creation
        const doc = {
            _type: 'property',
            reference: ref,
            type: row.type || row.Type || 'Maison',
            price: Number(row.price || row.prix || row.Prix || 0),
            location: row.location || row.ville || row.Ville || 'Vaucluse',
            area: Number(row.area || row.surface || row.Surface || 0),
            rooms: Number(row.rooms || row.pieces || row.Pieces || 0),
            bedrooms: Number(row.bedrooms || row.chambres || row.Chambres || 0),
            description: row.description || row.Description || '',
            publicationDate: new Date().toISOString(),
            status: 'Disponible',
            isHidden: true, // Safety first
            image: mainImage,
            images: additionalImages,
            details: {
                condition: row.etat || 'Bon état',
                yearBuilt: Number(row.annee || 0)
            },
            dpe: {
                class: row.dpe || 'D',
                value: Number(row.dpe_valeur || 0)
            }
        }

        await client.create(doc)
        successCount++
        setImportProgress(prev => prev ? ({
            ...prev, 
            current: i + 1,
            log: [`✅ ${ref} importé`, ...prev.log]
        }) : null)

      } catch (err: any) {
        failCount++
        console.error(err)
        setImportProgress(prev => prev ? ({
            ...prev, 
            current: i + 1,
            log: [`❌ Erreur ${ref}: ${err.message}`, ...prev.log]
        }) : null)
      }
    }

    setIsCreating(false)
    if (successCount > 0) {
        setSuccessId(`batch-${Date.now()}`) // Just trigger success UI
    }
  }

  // -------------------------------------------------------------------------
  // RENDER
  // -------------------------------------------------------------------------

  return (
    <Container width={2} padding={4}>
      <Card padding={4} radius={2} shadow={1} tone="transparent">
        <Stack space={4}>
          <Heading as="h2" size={3}>Outil d'Importation</Heading>
          
          <TabList space={2}>
            <Tab id="url-tab" aria-controls="url-panel" label="Via URL (Scraping)" selected={activeTab === 'url'} onClick={() => setActiveTab('url')} />
            <Tab id="csv-tab" aria-controls="csv-panel" label="Via CSV (Masse)" selected={activeTab === 'csv'} onClick={() => setActiveTab('csv')} />
          </TabList>

          <TabPanel id="url-panel" aria-labelledby="url-tab" hidden={activeTab !== 'url'}>
             <Card marginTop={4} padding={4} border radius={2}>
                <Stack space={4}>
                    <Text size={2} muted>Copiez l'URL d'une annonce partenaire pour importer les données.</Text>
                    <Grid columns={[1, 1, 12]} gap={2}>
                        <Box columnStart={[1, 1, 1]} columnEnd={[1, 1, 10]}>
                            <TextInput value={url} onChange={(e) => setUrl(e.currentTarget.value)} placeholder="https://www.groupementimmo.fr/..." />
                        </Box>
                        <Box columnStart={[1, 1, 10]} columnEnd={[1, 1, 13]}>
                            <Button text={isLoading ? "..." : "Analyser"} tone="primary" onClick={handleAnalyzeUrl} disabled={isLoading || !url} width="fill" />
                        </Box>
                    </Grid>
                    {data && !successId && (
                        <Card padding={3} tone="primary" border>
                            <Stack space={3}>
                                <Text weight="bold">Trouvé : {data.type} à {data.location} ({data.price}€)</Text>
                                <Button text={isCreating ? "Importation..." : "Confirmer l'import"} tone="positive" onClick={handleCreateFromUrl} disabled={isCreating} />
                            </Stack>
                        </Card>
                    )}
                </Stack>
             </Card>
          </TabPanel>

          <TabPanel id="csv-panel" aria-labelledby="csv-tab" hidden={activeTab !== 'csv'}>
            <Card marginTop={4} padding={4} border radius={2}>
                <Stack space={4}>
                    <Text size={2}>Importez un fichier CSV contenant une liste de biens. Les images doivent être des URLs (liens web).</Text>
                    
                    <Card padding={3} tone="caution" radius={2}>
                        <Stack space={2}>
                            <Text size={1} weight="bold">Format attendu des colonnes CSV :</Text>
                            <Text size={1} style={{fontFamily: 'monospace'}}>reference, type, prix, ville, surface, pieces, chambres, description, images</Text>
                            <Text size={1} muted>Les images doivent être des URLs séparées par des virgules ou des barres verticales "|".</Text>
                        </Stack>
                    </Card>

                    <input 
                        type="file" 
                        accept=".csv" 
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{display: 'block', width: '100%', padding: '10px', border: '1px dashed #ccc'}}
                    />

                    {csvData.length > 0 && !importProgress && (
                        <Flex justify="space-between" align="center">
                            <Text>{csvData.length} biens détectés</Text>
                            <Button text="Lancer l'importation" tone="positive" onClick={handleImportCsv} />
                        </Flex>
                    )}

                    {importProgress && (
                        <Stack space={3}>
                            <Text weight="bold">Traitement : {importProgress.current} / {importProgress.total}</Text>
                            {/* Simple Progress Bar */}
                            <div style={{width: '100%', height: '10px', background: '#eee', borderRadius: '5px'}}>
                                <div style={{
                                    width: `${(importProgress.current / importProgress.total) * 100}%`,
                                    height: '100%',
                                    background: '#22c55e',
                                    borderRadius: '5px',
                                    transition: 'width 0.3s ease'
                                }} />
                            </div>
                            <Card padding={2} border style={{maxHeight: '150px', overflowY: 'auto', background: '#f9fafb'}}>
                                <Stack space={2}>
                                    {importProgress.log.map((l, i) => <Text key={i} size={1}>{l}</Text>)}
                                </Stack>
                            </Card>
                        </Stack>
                    )}
                </Stack>
            </Card>
          </TabPanel>

          {error && (
            <Card padding={3} radius={2} shadow={1} tone="critical">
              <Text size={1}>{error}</Text>
            </Card>
          )}

          {successId && !isCreating && (
            <Card padding={4} radius={2} shadow={1} tone="positive">
              <Stack space={3}>
                <Heading size={1}>Importation terminée !</Heading>
                <Text>Les biens ont été créés en mode "Caché". Vérifiez-les avant publication.</Text>
                <Button as="a" href="/structure/property" text="Voir la liste des biens" tone="primary" />
                <Button text="Nouvel import" mode="ghost" onClick={() => { setSuccessId(''); setData(null); setCsvData([]); setImportProgress(null); if(fileInputRef.current) fileInputRef.current.value = ''; }} />
              </Stack>
            </Card>
          )}

        </Stack>
      </Card>
    </Container>
  )
}